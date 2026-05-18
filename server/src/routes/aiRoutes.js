const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// All AI routes require authentication
router.use(authMiddleware);

// Both Students and Teachers can chat with the story (RAG-based chat)
router.post("/chat", aiController.chatWithStory);

// Only Teachers can retrieve, update, or regenerate settings and chunks
router.get("/settings/:storyId", roleMiddleware("teacher"), aiController.getStoryAISettings);
router.put("/settings/:storyId", roleMiddleware("teacher"), aiController.updateStoryAISettings);
router.post("/rechunk/:storyId", roleMiddleware("teacher"), aiController.rechunkStory);

module.exports = router;
