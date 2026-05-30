const express = require("express");
const router = express.Router();
const studentJourneyController = require("../controllers/studentJourneyController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.use(authMiddleware);
router.use(roleMiddleware("student"));

router.get("/", studentJourneyController.getJourney);
router.get("/achievements", studentJourneyController.getAchievements);
router.get("/leaderboard", studentJourneyController.getLeaderboard);
router.get("/stories", studentJourneyController.getStories);
router.get("/quizzes", studentJourneyController.getQuizzes);
router.post("/activity", studentJourneyController.recordActivity);
router.post("/stories/:storyId/tts", studentJourneyController.generateStorySpeech);
router.put("/stories/:storyId/progress", studentJourneyController.updateStoryProgress);
router.post("/quizzes/:examId/attempts", studentJourneyController.submitQuizAttempt);
router.post("/words/favorite", studentJourneyController.toggleFavoriteWord);

module.exports = router;
