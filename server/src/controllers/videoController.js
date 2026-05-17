const Content = require('../models/Content');
const Notification = require('../models/Notification');
const { broadcastToAdmins } = require('../utils/socket');

exports.createVideo = async (req, res) => {
    try {
        const { title, description, language } = req.body;
        const videoUrl = req.files && req.files.video ? req.files.video[0].path : null;
        const coverUrl = req.files && req.files.coverImage ? req.files.coverImage[0].path : null;

        if (!videoUrl) {
            return res.status(400).json({ message: "Video file is required" });
        }

        const newVideo = new Content({
            title,
            description,
            language,
            teacher: req.user._id,
            type: 'video',
            url: videoUrl,
            thumbnail: coverUrl || "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500",
            status: 'pending'
        });

        await newVideo.save();

        // Notify admins
        const notification = new Notification({
            recipient: null,
            sender: req.user._id,
            type: 'video_submitted',
            message: `قام الأستاذ ${req.user.username} بإضافة فيديو جديد: ${title}`,
            data: { contentId: newVideo._id }
        });
        await notification.save();

        broadcastToAdmins({
            ...notification.toObject(),
            senderName: req.user.username
        });

        res.status(201).json({ message: "Video uploaded successfully and pending review", video: newVideo });
    } catch (error) {
        res.status(500).json({ message: "Server error while uploading video", error: error.message });
    }
};

exports.getTeacherVideos = async (req, res) => {
    try {
        const videos = await Content.find({ teacher: req.user._id, type: 'video' }).sort({ createdAt: -1 });
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: "Error fetching videos", error: error.message });
    }
};
