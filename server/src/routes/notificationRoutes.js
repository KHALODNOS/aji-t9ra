const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const authMiddleware = require("../middlewares/authMiddleware");

// Get all notifications for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const query = req.user.Role === 'admin' 
            ? { $or: [{ recipient: req.user._id }, { recipient: null }] }
            : { recipient: req.user._id };

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(20);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mark notification as read
router.put("/:id/read", authMiddleware, async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
