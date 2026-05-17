const Content = require("../models/Content");
const Story = require("../models/Story");
const Notification = require("../models/Notification");
const { broadcastToAdmins } = require("../utils/socket");

// Get all exams for the logged-in teacher
exports.getTeacherExams = async (req, res) => {
    try {
        const exams = await Content.find({
            teacher: req.user._id,
            type: "exam"
        })
        .populate("storyId", "title coverImage level language")
        .sort({ createdAt: -1 });

        return res.status(200).json(exams);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching exams", error: error.message });
    }
};

// Get all approved stories (for selection when creating a quiz)
exports.getApprovedStories = async (req, res) => {
    try {
        const stories = await Story.find({ status: "approved" })
            .select("title coverImage level language")
            .sort({ createdAt: -1 });
        return res.status(200).json(stories);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching approved stories", error: error.message });
    }
};

// Create a new exam
exports.createExam = async (req, res) => {
    try {
        const { title, storyId, level, xpReward, questions } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Exam title is required" });
        }

        // Determine language: inherit from story if provided, else fallback to Arabic
        let language = "Arabic";
        if (storyId) {
            const story = await Story.findById(storyId);
            if (story) {
                language = story.language;
            }
        }

        const newExam = new Content({
            title,
            teacher: req.user._id,
            type: "exam",
            language,
            status: "draft",
            storyId: storyId || null,
            level: level || "مبتدئ",
            xpReward: Number(xpReward) || 150,
            questions: questions || [],
            thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600"
        });

        await newExam.save();

        // Populate story details
        const populated = await Content.findById(newExam._id).populate("storyId", "title coverImage level language");

        return res.status(201).json({ message: "Exam draft created successfully", exam: populated });
    } catch (error) {
        return res.status(500).json({ message: "Error creating exam", error: error.message });
    }
};

// Update an existing exam
exports.updateExam = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, storyId, level, xpReward, questions, status } = req.body;

        const exam = await Content.findOne({ _id: id, teacher: req.user._id, type: "exam" });

        if (!exam) {
            return res.status(404).json({ message: "Exam not found or unauthorized" });
        }

        // Inherit language if story changes
        if (storyId && storyId !== String(exam.storyId)) {
            const story = await Story.findById(storyId);
            if (story) {
                exam.language = story.language;
            }
        }

        if (title !== undefined) exam.title = title;
        if (storyId !== undefined) exam.storyId = storyId || null;
        if (level !== undefined) exam.level = level;
        if (xpReward !== undefined) exam.xpReward = Number(xpReward);
        if (questions !== undefined) exam.questions = questions;
        if (status !== undefined) exam.status = status;

        await exam.save();

        const populated = await Content.findById(exam._id).populate("storyId", "title coverImage level language");

        return res.status(200).json({ message: "Exam updated successfully", exam: populated });
    } catch (error) {
        return res.status(500).json({ message: "Error updating exam", error: error.message });
    }
};

// Delete an exam
exports.deleteExam = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Content.findOneAndDelete({ _id: id, teacher: req.user._id, type: "exam" });

        if (!result) {
            return res.status(404).json({ message: "Exam not found or unauthorized" });
        }

        return res.status(200).json({ message: "Exam deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting exam", error: error.message });
    }
};

// Submit exam for admin review
exports.submitExamForReview = async (req, res) => {
    try {
        const { id } = req.params;
        const exam = await Content.findOne({ _id: id, teacher: req.user._id, type: "exam" });

        if (!exam) {
            return res.status(404).json({ message: "Exam not found or unauthorized" });
        }

        if (exam.questions.length === 0) {
            return res.status(400).json({ message: "Cannot submit empty exam. Please add questions first." });
        }

        exam.status = "pending";
        await exam.save();

        const populated = await Content.findById(exam._id).populate("storyId", "title coverImage level language");

        // Create notification for admins
        const notification = new Notification({
            recipient: null, // Broadcast to all admins
            sender: req.user._id,
            type: "exam_submitted",
            message: `قام الأستاذ ${req.user.username} بإضافة اختبار جديد: ${exam.title}`,
            data: { contentId: exam._id }
        });
        await notification.save();

        // Broadcast to admins via socket
        broadcastToAdmins({
            ...notification.toObject(),
            senderName: req.user.username,
            examTitle: exam.title
        });

        return res.status(200).json({ message: "Exam submitted for review successfully", exam: populated });
    } catch (error) {
        return res.status(500).json({ message: "Error submitting exam", error: error.message });
    }
};
