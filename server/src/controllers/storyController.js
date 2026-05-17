const Story = require('../models/Story');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { broadcastToAdmins } = require('../utils/socket');

exports.createStory = async (req, res) => {
    try {
        const { title, language, level, content, vocabulary } = req.body;
        
        const coverImage = req.files['coverImage'] ? req.files['coverImage'][0].path : null;
        const audioUrl = req.files['audioFile'] ? req.files['audioFile'][0].path : null;

        if (!coverImage) {
            return res.status(400).json({ message: "Cover image is required" });
        }

        let parsedVocabulary = vocabulary;
        if (typeof vocabulary === 'string') {
            try {
                parsedVocabulary = JSON.parse(vocabulary);
            } catch (e) {
                return res.status(400).json({ message: "Invalid vocabulary format" });
            }
        }

        const newStory = new Story({
            title,
            teacher: req.user._id,
            language,
            level,
            content,
            coverImage,
            audioUrl,
            vocabulary: parsedVocabulary,
            status: 'pending'
        });

        await newStory.save();

        // Create notification for admins
        const notification = new Notification({
            recipient: null, // Broadcast to all admins
            sender: req.user._id,
            type: 'story_submitted',
            message: `قام الأستاذ ${req.user.username} بإضافة قصة جديدة: ${title}`,
            data: { storyId: newStory._id }
        });
        
        await notification.save();
        
        // Broadcast via socket
        broadcastToAdmins({
            ...notification.toObject(),
            senderName: req.user.username,
            storyTitle: title
        });

        res.status(201).json({ message: "Story created successfully and pending review", story: newStory });
    } catch (error) {
        console.error("Error creating story:", error);
        res.status(500).json({ message: "Server error while creating story", error: error.message });
    }
};

exports.getTeacherStories = async (req, res) => {
    try {
        const stories = await Story.find({ teacher: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(stories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching stories", error: error.message });
    }
};

exports.getStoryById = async (req, res) => {
    try {
        const story = await Story.findById(req.params.id).populate('teacher', 'name email');
        if (!story) return res.status(404).json({ message: "Story not found" });
        res.status(200).json(story);
    } catch (error) {
        res.status(500).json({ message: "Error fetching story", error: error.message });
    }
};
