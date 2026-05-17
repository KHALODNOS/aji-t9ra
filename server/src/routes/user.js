const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// All routes require authentication
router.get("/profile", authMiddleware, userController.getUserProfile);
router.put("/profile", authMiddleware, userController.updateUserProfile);
router.put("/change-password", authMiddleware, userController.changePassword);
router.post("/support", authMiddleware, userController.submitSupportRequest);

module.exports = router;
