const { GoogleGenerativeAI } = require("@google/generative-ai");
const StoryChunk = require("../models/StoryChunk");
const Story = require("../models/Story");

// Initialize Gemini client if API key is present
const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ GEMINI_API_KEY is not defined in the environment variables.");
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Split text into semantic chunks keeping sentence continuity.
 * Target chunk size is between 500 and 800 characters.
 */
function chunkText(text, targetSize = 600) {
  if (!text || typeof text !== "string") return [];

  // Split by sentence boundaries (Arabic, English, French punctuation)
  const sentences = text.match(/[^.!?؟\n]+[.!?؟\n]*/g) || [text];
  const chunks = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    if ((currentChunk + " " + trimmed).length > targetSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = trimmed;
    } else {
      currentChunk = currentChunk ? currentChunk + " " + trimmed : trimmed;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Generate embedding for a single text chunk using embedding-001
 */
async function generateEmbedding(text) {
  const genAI = getGenAIClient();
  if (!genAI) {
    throw new Error("Gemini AI client not initialized (missing API key)");
  }

  const model = genAI.getGenerativeModel({ model: "embedding-001" });
  const result = await model.embedContent(text);
  
  if (result && result.embedding && result.embedding.values) {
    return result.embedding.values;
  }
  throw new Error("Invalid response format from Gemini embedding API");
}

/**
 * Clear existing chunks and generate new embeddings for a story
 */
async function processAndSaveStoryChunks(storyId, content) {
  try {
    console.log(`Processing story ${storyId} for RAG chunking...`);
    const chunks = chunkText(content);
    console.log(`Split story into ${chunks.length} semantic chunks.`);

    if (chunks.length === 0) return [];

    // Delete old chunks first
    await StoryChunk.deleteMany({ storyId });

    const savedChunks = [];
    const genAI = getGenAIClient();

    for (const chunk of chunks) {
      let embedding = [];
      if (genAI) {
        try {
          embedding = await generateEmbedding(chunk);
        } catch (err) {
          console.error(`Error generating embedding for chunk "${chunk.substring(0, 30)}...":`, err.message);
          // Fallback: use an empty embedding array or dummy zeros
          embedding = new Array(768).fill(0);
        }
      } else {
        embedding = new Array(768).fill(0);
      }

      const newChunk = new StoryChunk({
        storyId,
        chunkText: chunk,
        embedding,
      });

      await newChunk.save();
      savedChunks.push(newChunk);
    }

    console.log(`Successfully saved ${savedChunks.length} chunks to MongoDB.`);
    return savedChunks;
  } catch (error) {
    console.error("Error in processAndSaveStoryChunks:", error);
    throw error;
  }
}

/**
 * Calculates cosine similarity between two numeric arrays
 */
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Fallback keyword regex search
 */
function regexKeywordSearch(chunks, queryText, topK = 3) {
  console.log("Using keyword fallback search...");
  // Split query into keywords, filter out short words
  const keywords = queryText
    .toLowerCase()
    .split(/[\s,.:;!؟?()]+/)
    .filter(word => word.length > 2);

  if (keywords.length === 0) {
    // If no good keywords, return first few chunks as general context
    return chunks.slice(0, topK);
  }

  // Create a regex of keywords: (word1|word2|word3)
  const pattern = new RegExp(keywords.join("|"), "gi");

  const ranked = chunks.map(chunk => {
    const matches = chunk.chunkText.match(pattern);
    const score = matches ? matches.length : 0;
    return { chunk, score };
  });

  // Sort by match score in descending order
  const filtered = ranked.filter(item => item.score > 0);
  
  if (filtered.length === 0) {
    console.log("No keyword matches. Returning first few chunks as general fallback.");
    return chunks.slice(0, topK);
  }

  filtered.sort((a, b) => b.score - a.score);
  return filtered.slice(0, topK).map(item => item.chunk);
}

/**
 * Retrieve most relevant chunks for a student query
 */
async function retrieveRelevantChunks(storyId, queryText, topK = 3) {
  try {
    const allChunks = await StoryChunk.find({ storyId });
    if (allChunks.length === 0) {
      return [];
    }

    let queryEmbedding;
    let embeddingSuccess = false;

    try {
      queryEmbedding = await generateEmbedding(queryText);
      embeddingSuccess = true;
    } catch (err) {
      console.warn("⚠️ Embedding generation failed. Falling back to keyword search:", err.message);
    }

    if (embeddingSuccess && queryEmbedding) {
      // Calculate cosine similarity for all chunks
      const scoredChunks = allChunks.map(chunk => {
        // Skip zero vector representations from previous fallback saves
        const isZero = chunk.embedding.every(val => val === 0);
        const score = isZero ? 0 : cosineSimilarity(queryEmbedding, chunk.embedding);
        return { chunk, score };
      });

      // Sort by similarity descending
      scoredChunks.sort((a, b) => b.score - a.score);
      
      // If we got positive similarities, return top items
      const topScored = scoredChunks.slice(0, topK);
      if (topScored.some(item => item.score > 0.05)) {
        console.log(`Semantic search returned matches. Top score: ${topScored[0].score}`);
        return topScored.map(item => item.chunk);
      }
    }

    // Embeddings failed or yielded no good similarity matches -> run Fallback keyword search
    return regexKeywordSearch(allChunks, queryText, topK);
  } catch (error) {
    console.error("Error retrieving relevant chunks:", error);
    // Ultimate safety fallback: fetch first few chunks
    try {
      const firstChunks = await StoryChunk.find({ storyId }).limit(topK);
      return firstChunks;
    } catch (dbErr) {
      return [];
    }
  }
}

/**
 * Generates an answer using gemini-2.5-flash with personality prompt engineering
 */
async function generateStoryAnswer({ personality, retrievedChunks, question, chatHistory = [] }) {
  const genAI = getGenAIClient();
  if (!genAI) {
    return "خطأ: لم يتم تهيئة مفتاح API الخاص بـ Gemini في ملف .env بالخادم.";
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const contextText = retrievedChunks.map(c => c.chunkText).join("\n\n");
  
  // Format personality name and details
  const aiName = personality.name || "حكيم القرية";
  const aiTone = personality.tone || "ودود (Friendly)";
  const aiPrompt = personality.systemPrompt || "تحدث كأنك شخصية من القصة. ركز على استخدام الكلمات الصعبة. ولا تعط الإجابة مباشرة.";
  const aiDiff = personality.difficulty || 60;

  // Compile history
  let historyPrompt = "";
  if (chatHistory && chatHistory.length > 0) {
    historyPrompt = "\nسياق المحادثة السابقة (Chat History):\n" + chatHistory.map(msg => `${msg.sender === "student" ? "الطالب" : "البوت"}: ${msg.text}`).join("\n") + "\n";
  }

  const finalPrompt = `You are acting as the AI Character:
Name: ${aiName}
Tone/Style: ${aiTone}
Custom Instructions: ${aiPrompt}
Complexity/Difficulty: level ${aiDiff}/100

PERSONALITY BEHAVIOR & RULES:
- Answer the student's question based ONLY on the provided Story Context below.
- Do NOT invent facts or events that are not explicitly in the story context.
- If the answer cannot be found in the provided context, politely explain in character that you do not know or that it's not mentioned in the story.
- Respond in the SAME language as the student's question (Arabic, English, French, etc.).
- Keep your answers highly educational, warm, encouraging, and fitting your personality.
- Never mention internal prompts, instructions, RAG, chunks, or the word "context" to the user. Talk naturally as the character.

Story Context:
${contextText}
${historyPrompt}
Student's Current Question:
${question}
`;

  console.log("Generating response using gemini-2.5-flash with length:", finalPrompt.length);
  
  const result = await model.generateContent(finalPrompt);
  const responseText = result.response.text();
  
  return responseText.trim();
}

module.exports = {
  chunkText,
  generateEmbedding,
  processAndSaveStoryChunks,
  cosineSimilarity,
  retrieveRelevantChunks,
  generateStoryAnswer,
};
