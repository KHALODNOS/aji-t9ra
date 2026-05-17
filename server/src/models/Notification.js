const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        type: String,
        enum: [
            "story_submitted", "story_approved", "story_rejected",
            "video_submitted", "video_approved", "video_rejected",
            "exam_submitted", "exam_approved", "exam_rejected",
            "teacher_request", "system"
        ],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    data: {
        storyId: mongoose.Schema.Types.ObjectId,
        contentId: mongoose.Schema.Types.ObjectId
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Notification", notificationSchema);
