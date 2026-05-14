const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { storage } = require("../config/cloudinary");
const multer = require("multer");
const upload = multer({ storage: storage })

const teacherFields = upload.fields([
    { name: "photoProfile", maxCount: 1 },
    { name: "videoProfile", maxCount: 1 }
])
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
router.post("/teacher/step1", authMiddleware, roleMiddleware("teacher"), teacherFields, authController.teacherStep1);
router.post("/teacher/step2", authMiddleware, roleMiddleware("teacher"), authController.teacherStep2);
router.post("/teacher/step3", authMiddleware, roleMiddleware("teacher"), authController.teacherStep3);
router.post("/teacher/step4", authMiddleware, roleMiddleware("teacher"), authController.teacherStep4);
router.post("/teacher/step5", authMiddleware, roleMiddleware("teacher"), authController.teacherStep5);
router.post("/teacher/step6", authMiddleware, roleMiddleware("teacher"), authController.teacherStep6);

// --- Student Onboarding Steps ---
router.post("/student/step1", authMiddleware, roleMiddleware("student , teacher"), authController.studentStep1);
router.post("/student/step2", authMiddleware, roleMiddleware("student , teacher"), authController.studentStep2);
router.post("/student/step3", authMiddleware, roleMiddleware("student , teacher"), authController.studentStep3);
router.post("/student/step4", authMiddleware, roleMiddleware("student , teacher"), upload.single("avatar"), authController.studentStep4);

module.exports = router;

