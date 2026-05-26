const User = require("../models/User");
const Content = require("../models/Content");
const Story = require("../models/Story");
const SupportRequest = require("../models/SupportRequest");

// Get all pending teachers
exports.getPendingTeachers = async (req, res) => {
    try {
        const pendingTeachers = await User.find({
            Role: { $regex: /^teacher$/i },
            status: { $regex: /^pending$/i }
        }).select("-password");

        return res.status(200).json(pendingTeachers);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Approve teacher
exports.approveTeacher = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.status = "active";
        await user.save();

        return res.status(200).json({ message: "Teacher approved successfully", user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Reject/Remove teacher
exports.rejectTeacher = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(userId);

        return res.status(200).json({ message: "Teacher request rejected and removed" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get all users (for management page)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ Role: { $regex: /^(?!admin$).*$/i } }).select("-password");
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Toggle user status (active/blocked)
exports.toggleUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.status = user.status === "active" ? "blocked" : "active";
        await user.save();

        return res.status(200).json({ message: `User status updated to ${user.status}`, user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
    try {
        const [totalUsers, activeStudents, totalTeachers, pendingTeachers, pendingStories] = await Promise.all([
            User.countDocuments({ Role: { $regex: /^(?!admin$).*$/i } }),
            User.countDocuments({ Role: { $regex: /^student$/i }, status: { $regex: /^active$/i } }),
            User.countDocuments({ Role: { $regex: /^teacher$/i }, status: { $regex: /^active$/i } }),
            User.countDocuments({ Role: { $regex: /^teacher$/i }, status: { $regex: /^pending$/i } }),
            Story.countDocuments({ status: "pending" })
        ]);

        return res.status(200).json({
            totalUsers,
            activeStudents,
            totalTeachers,
            pendingTeachers,
            pendingStories
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getSupportRequests = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = {};
        if (status && status !== "all") filter.status = status;

        const requests = await SupportRequest.find(filter)
            .populate("teacher", "username fullName email PhoneNumber photoProfile avatarUrl")
            .sort({ createdAt: -1 });

        return res.status(200).json(requests);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.updateSupportRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["open", "in_progress", "resolved"].includes(status)) {
            return res.status(400).json({ message: "Invalid support request status" });
        }

        const request = await SupportRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate("teacher", "username fullName email PhoneNumber photoProfile avatarUrl");

        if (!request) return res.status(404).json({ message: "Support request not found" });

        return res.status(200).json(request);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const Notification = require("../models/Notification");
const { sendNotification, broadcastToAdmins } = require("../utils/socket");

// --- CONTENT REVIEW FUNCTIONS ---

// Get all pending content (including Stories)
exports.getPendingContent = async (req, res) => {
    try {
        const { type } = req.query; // optional filter by type
        
        let pendingStories = [];
        let pendingOtherContent = [];

        if (!type || type === 'stories') {
            pendingStories = await Story.find({ status: "pending" })
                .populate("teacher", "username email avatar")
                .sort({ createdAt: -1 });
        }

        if (!type || type !== 'stories') {
            const filter = { status: "pending" };
            if (type === 'videos') filter.type = 'video';
            else if (type === 'tests') filter.type = 'exam';
            else if (type) filter.type = type;

            pendingOtherContent = await Content.find(filter)
                .populate("teacher", "username email avatar")
                .sort({ createdAt: -1 });
        }

        // Mapping Story to match a common format
        const stories = pendingStories.map(s => ({
            ...s._doc,
            type: 'story',
            thumbnail: s.coverImage,
            teacherName: s.teacher?.username || 'أستاذ',
        }));

        const otherContent = pendingOtherContent.map(c => ({
            ...c._doc,
            teacherName: c.teacher?.username || 'أستاذ',
        }));

        return res.status(200).json(stories.concat(otherContent));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Approve content
exports.approveContent = async (req, res) => {
    try {
        const { contentId } = req.params;
        const { contentType } = req.query;

        let content;
        if (contentType === 'story') {
            content = await Story.findByIdAndUpdate(contentId, { status: "approved" }, { new: true });
        } else {
            content = await Content.findByIdAndUpdate(contentId, { status: "approved" }, { new: true });
        }

        if (!content) {
            return res.status(404).json({ message: "Content not found" });
        }

        // Determine correct notification details based on content type
        let notifType = "story_approved";
        let messageText = `تمت الموافقة على قصتك: ${content.title}`;

        if (contentType === "video" || content.type === "video") {
            notifType = "video_approved";
            messageText = `تمت الموافقة على الفيديو الخاص بك: ${content.title}`;
        } else if (contentType === "exam" || contentType === "test" || content.type === "exam") {
            notifType = "exam_approved";
            messageText = `تمت الموافقة على اختبارك الجديد: ${content.title}`;
        }

        // Create notification for the teacher
        const notification = new Notification({
            recipient: content.teacher,
            sender: req.user._id,
            type: notifType,
            message: messageText,
            data: { 
                storyId: contentType === 'story' ? content._id : undefined,
                contentId: contentType !== 'story' ? content._id : undefined
            }
        });
        await notification.save();

        // Send via socket
        sendNotification(content.teacher, {
            ...notification.toObject(),
            title: content.title
        });

        return res.status(200).json({ message: "Content approved successfully", content });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Reject/Remove content
exports.rejectContent = async (req, res) => {
    try {
        const { contentId } = req.params;
        const { contentType } = req.query;

        let content;
        if (contentType === 'story') {
            content = await Story.findById(contentId);
            if (content) {
                const notification = new Notification({
                    recipient: content.teacher,
                    sender: req.user._id,
                    type: 'story_rejected',
                    message: `تم رفض قصتك: ${content.title}`,
                    data: { storyId: content._id }
                });
                await notification.save();
                sendNotification(content.teacher, notification);
                await Story.findByIdAndDelete(contentId);
            }
        } else {
            content = await Content.findById(contentId);
            if (content) {
                // Determine rejection reason message
                let notifType = "story_rejected";
                let messageText = `تم رفض الفيديو الخاص بك: ${content.title}`;

                if (contentType === "video" || content.type === "video") {
                    notifType = "video_rejected";
                    messageText = `تم رفض الفيديو الخاص بك: ${content.title}`;
                } else if (contentType === "exam" || contentType === "test" || content.type === "exam") {
                    notifType = "exam_rejected";
                    messageText = `تم رفض اختبارك: ${content.title}`;
                }

                const notification = new Notification({
                    recipient: content.teacher,
                    sender: req.user._id,
                    type: notifType,
                    message: messageText,
                    data: { contentId: content._id }
                });
                await notification.save();
                sendNotification(content.teacher, notification);
                await Content.findByIdAndDelete(contentId);
            }
        }

        if (!content) {
            return res.status(404).json({ message: "Content not found" });
        }

        return res.status(200).json({ message: "Content rejected and removed" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Bulk approve content
exports.bulkApproveContent = async (req, res) => {
    try {
        const { contentIds, contentType } = req.body;
        if (contentType === 'story') {
            await Story.updateMany({ _id: { $in: contentIds } }, { status: "approved" });
        } else {
            await Content.updateMany({ _id: { $in: contentIds } }, { status: "approved" });
        }
        return res.status(200).json({ message: "Selected content approved" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Bulk reject content
exports.bulkRejectContent = async (req, res) => {
    try {
        const { contentIds, contentType } = req.body;
        if (contentType === 'story') {
            await Story.deleteMany({ _id: { $in: contentIds } });
        } else {
            await Content.deleteMany({ _id: { $in: contentIds } });
        }
        return res.status(200).json({ message: "Selected content rejected and removed" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
