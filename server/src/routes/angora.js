const express = require("express");
const router = express.Router();
const voiceRomController = require("../controllers/voiceRomController");
const authMiddleware = require("../middlewares/authMiddleware");

// Public/Check Status Route
router.get("/status", (req, res) => {
    res.json({ message: "Agora Backend Service is Ready!" });
});

// Agora Token Generation
router.get("/token", authMiddleware, voiceRomController.generateToken);

// Voice Room REST APIs
// 1. Create a voice room (Private - Teacher only)
router.post("/", authMiddleware, voiceRomController.createVoiceRoom);

// 2. Get all active voice rooms (Private)
router.get("/", authMiddleware, voiceRomController.getAllActiveRooms);

// 3. Get single voice room detail (Private)
router.get("/:id", authMiddleware, voiceRomController.getVoiceRoom);

// 4. Join a voice room (Private)
router.post("/:id/join", authMiddleware, voiceRomController.joinVoiceRoom);

// 5. Leave a voice room (Private)
router.post("/:id/leave", authMiddleware, voiceRomController.leaveVoiceRoom);

// 6. End/Delete a voice room (Private - Host Teacher only)
router.delete("/:id", authMiddleware, voiceRomController.endVoiceRoom);

// 7. Kick a member from the voice room (Private - Host Teacher only)
router.post("/:id/kick", authMiddleware, voiceRomController.kickMember);

// 8. Mute a member in the voice room (Private - Host Teacher only)
router.post("/:id/mute", authMiddleware, voiceRomController.muteMember);

module.exports = router;