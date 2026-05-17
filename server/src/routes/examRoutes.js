const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// All exam routes require authentication and teacher role
router.use(authMiddleware);
router.use(roleMiddleware("teacher"));

router.get("/", examController.getTeacherExams);
router.get("/stories", examController.getApprovedStories);
router.post("/", examController.createExam);
router.put("/:id", examController.updateExam);
router.delete("/:id", examController.deleteExam);
router.put("/:id/submit", examController.submitExamForReview);

module.exports = router;
