const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const studentJourneyController = require("../controllers/studentJourneyController");

router.use(authMiddleware);
router.use(roleMiddleware("teacher"));

router.get("/leaderboard", studentJourneyController.getTeacherLeaderboard);

module.exports = router;
