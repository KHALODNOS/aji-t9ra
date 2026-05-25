const Content = require('../models/Content');
const Notification = require('../models/Notification');
const { broadcastToAdmins, sendNotification } = require('../utils/socket');

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

exports.getApprovedVideos = async (req, res) => {
    try {
        const videos = await Content.find({ type: 'video', status: 'approved' })
            .populate('teacher', 'username fullName avatarUrl')
            .populate('comments.student', 'username fullName avatarUrl')
            .sort({ createdAt: -1 });
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: "Error fetching approved videos", error: error.message });
    }
};

exports.getVideoComments = async (req, res) => {
    try {
        const video = await Content.findOne({
            _id: req.params.id,
            type: 'video',
            status: 'approved'
        }).populate('comments.student', 'username fullName avatarUrl');

        if (!video) {
            return res.status(404).json({ message: "Approved video not found" });
        }

        res.status(200).json(video.comments || []);
    } catch (error) {
        res.status(500).json({ message: "Error fetching video comments", error: error.message });
    }
};

exports.addVideoComment = async (req, res) => {
    try {
        const { text } = req.body;
        const cleanText = typeof text === 'string' ? text.trim() : '';

        if (!cleanText) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const video = await Content.findOne({
            _id: req.params.id,
            type: 'video',
            status: 'approved'
        }).populate('teacher', 'username fullName');

        if (!video) {
            return res.status(404).json({ message: "Approved video not found" });
        }

        video.comments.push({
            student: req.user._id,
            text: cleanText,
            createdAt: new Date()
        });

        await video.save();

        const comment = video.comments[video.comments.length - 1];
        await comment.populate('student', 'username fullName avatarUrl');

        const studentName = req.user.fullName || req.user.username || "طالب";
        const notification = new Notification({
            recipient: video.teacher._id,
            sender: req.user._id,
            type: 'video_comment',
            message: `${studentName} علق على فيديوك: ${video.title}`,
            data: {
                contentId: video._id,
                commentId: comment._id
            }
        });
        await notification.save();

        sendNotification(video.teacher._id, notification);

        res.status(201).json({
            message: "Comment added successfully",
            comment
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding video comment", error: error.message });
    }
};
