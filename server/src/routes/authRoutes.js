const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

// Public Routes
router.post("/register", authController.registration);
router.post("/login", authController.login);
router.post("/verify-email", authController.verifyEmail);

// Protected Onboarding Routes (Require JWT Token)
// Step 3: Send Phone OTP
router.post("/send-phone-otp", authMiddleware, authController.sendPhoneOTP);

// Step 4: Verify Phone OTP
router.post("/verify-phone-otp", authMiddleware, authController.verifyPhoneOTP);

// --- Teacher Onboarding Steps ---
router.post("/teacher/step1", authMiddleware, authController.teacherStep1);
router.post("/teacher/step2", authMiddleware, authController.teacherStep2);
router.post("/teacher/step3", authMiddleware, authController.teacherStep3);
router.post("/teacher/step4", authMiddleware, authController.teacherStep4);
router.post("/teacher/step5", authMiddleware, authController.teacherStep5);
router.post("/teacher/step6", authMiddleware, authController.teacherStep6);

// --- Student Onboarding Steps ---
router.post("/student/step1", authMiddleware, authController.studentStep1);
router.post("/student/step2", authMiddleware, authController.studentStep2);
router.post("/student/step3", authMiddleware, authController.studentStep3);
router.post("/student/step4", authMiddleware, authController.studentStep4);

module.exports = router;

