const User = require("../models/User");
const Content = require("../models/Content");

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
        const [totalUsers, activeStudents, totalTeachers, pendingTeachers] = await Promise.all([
            User.countDocuments({ Role: { $regex: /^(?!admin$).*$/i } }),
            User.countDocuments({ Role: { $regex: /^student$/i }, status: { $regex: /^active$/i } }),
            User.countDocuments({ Role: { $regex: /^teacher$/i }, status: { $regex: /^active$/i } }),
            User.countDocuments({ Role: { $regex: /^teacher$/i }, status: { $regex: /^pending$/i } })
        ]);

        return res.status(200).json({
            totalUsers,
            activeStudents,
            totalTeachers,
            pendingTeachers
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// --- CONTENT REVIEW FUNCTIONS ---

// Get all pending content
exports.getPendingContent = async (req, res) => {
    try {
        const { type } = req.query; // optional filter by type
        const filter = { status: "pending" };
        if (type) filter.type = type;

        const pendingContent = await Content.find(filter)
            .populate("teacher", "username email")
            .sort({ createdAt: -1 });

        return res.status(200).json(pendingContent);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Approve content
exports.approveContent = async (req, res) => {
    try {
        const { contentId } = req.params;
        const content = await Content.findByIdAndUpdate(
            contentId,
            { status: "approved" },
            { new: true }
        );

        if (!content) {
            return res.status(404).json({ message: "Content not found" });
        }

        return res.status(200).json({ message: "Content approved successfully", content });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Reject/Remove content
exports.rejectContent = async (req, res) => {
    try {
        const { contentId } = req.params;
        const content = await Content.findByIdAndDelete(contentId);

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
        const { contentIds } = req.body;
        await Content.updateMany(
            { _id: { $in: contentIds } },
            { status: "approved" }
        );
        return res.status(200).json({ message: "Selected content approved" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Bulk reject content
exports.bulkRejectContent = async (req, res) => {
    try {
        const { contentIds } = req.body;
        await Content.deleteMany({ _id: { $in: contentIds } });
        return res.status(200).json({ message: "Selected content rejected and removed" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
