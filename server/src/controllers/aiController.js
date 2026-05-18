const Story = require("../models/Story");
const StoryChunk = require("../models/StoryChunk");
const {
  processAndSaveStoryChunks,
  retrieveRelevantChunks,
  generateStoryAnswer,
} = require("../services/aiService");

// Get AI Settings for a specific story
exports.getStoryAISettings = async (req, res) => {
  try {
    const { storyId } = req.params;
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    
    // Check if user is the teacher of this story (teachers can only see their own, admins or students can see any active)
    const userRole = (req.user.Role || "").toLowerCase();
    if (userRole === "teacher" && story.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view settings for this story" });
    }

    res.status(200).json({
      storyId: story._id,
      title: story.title,
      personality: story.personality || {
        name: "حكيم القرية",
        tone: "ودود (Friendly)",
        difficulty: 60,
        systemPrompt: "تحدث كأنك شخصية من القصة. ركز على استخدام الكلمات الصعبة التي حددتها أنا. ولا تعط الإجابة مباشرة.",
        xp: 50,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching AI settings", error: error.message });
  }
};

// Update AI Settings for a specific story
exports.updateStoryAISettings = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { name, tone, difficulty, systemPrompt, xp } = req.body;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Ensure the requesting teacher is the owner of this story
    if (story.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update settings for this story" });
    }

    story.personality = {
      name: name || (story.personality && story.personality.name) || "حكيم القرية",
      tone: tone || (story.personality && story.personality.tone) || "ودود (Friendly)",
      difficulty: typeof difficulty !== "undefined" ? Number(difficulty) : ((story.personality && story.personality.difficulty) || 60),
      systemPrompt: systemPrompt || (story.personality && story.personality.systemPrompt) || "تحدث كأنك شخصية من القصة. ركز على استخدام الكلمات الصعبة التي حددتها أنا. ولا تعط الإجابة مباشرة.",
      xp: typeof xp !== "undefined" ? Number(xp) : ((story.personality && story.personality.xp) || 50),
    };

    await story.save();

    // Check if story chunks already exist, if not, generate them now!
    const chunkCount = await StoryChunk.countDocuments({ storyId });
    if (chunkCount === 0) {
      try {
        await processAndSaveStoryChunks(story._id, story.content);
      } catch (chunkErr) {
        console.error("Failed to automatically chunk story on settings save:", chunkErr);
      }
    }

    res.status(200).json({
      message: "AI settings saved successfully",
      personality: story.personality,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating AI settings", error: error.message });
  }
};

// Re-generate embeddings/chunks for a story
exports.rechunkStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    if (story.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to manage chunks for this story" });
    }

    await processAndSaveStoryChunks(story._id, story.content);

    res.status(200).json({ message: "Story successfully re-chunked and embeddings regenerated." });
  } catch (error) {
    res.status(500).json({ message: "Error re-chunking story", error: error.message });
  }
};

// RAG Interactive Chat
exports.chatWithStory = async (req, res) => {
  try {
    const { storyId, message, chatHistory } = req.body;
    if (!storyId || !message) {
      return res.status(400).json({ message: "storyId and message are required" });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Retrieve most relevant chunks using embeddings or regex fallback
    const relevantChunks = await retrieveRelevantChunks(story._id, message, 3);

    // If there are no chunks in database, check if we need to run chunking now!
    let chunksToUse = relevantChunks;
    if (relevantChunks.length === 0) {
      console.log(`No chunks found in DB for story ${storyId}. Attempting to run automatic chunking now...`);
      try {
        const generated = await processAndSaveStoryChunks(story._id, story.content);
        if (generated && generated.length > 0) {
          chunksToUse = generated.slice(0, 3);
        }
      } catch (chunkErr) {
        console.error("Chunking attempt failed in chat fallback:", chunkErr);
      }
    }

    // Double safe fallback if still no chunks
    if (chunksToUse.length === 0) {
      chunksToUse = [{
        chunkText: story.content.substring(0, 1500)
      }];
    }

    // Generate answer using gemini-2.5-flash with personality context
    const answer = await generateStoryAnswer({
      personality: story.personality || {
        name: "حكيم القرية",
        tone: "ودود (Friendly)",
        difficulty: 60,
        systemPrompt: "تحدث كأنك شخصية من القصة. ركز على استخدام الكلمات الصعبة التي حددتها أنا. ولا تعط الإجابة مباشرة.",
        xp: 50
      },
      retrievedChunks: chunksToUse,
      question: message,
      chatHistory: chatHistory || []
    });

    res.status(200).json({
      answer,
      retrievedChunks: chunksToUse.map(c => c.chunkText),
      xpAwarded: (story.personality && story.personality.xp) || 50
    });
  } catch (error) {
    console.error("Error in chatWithStory:", error);
    res.status(500).json({ message: "Error generating chatbot answer", error: error.message });
  }
};
