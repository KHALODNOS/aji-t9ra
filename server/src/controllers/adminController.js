const User = require("../models/User");

// Get all pending teachers
exports.getPendingTeachers = async (req, res) => {
    try {
        const pendingTeachers = await User.find({ 
            Role: "teacher", 
            status: "pending" 
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

        // We can either block them or delete them. 
        // User said "remove it", so let's delete or set to blocked.
        // I'll go with delete for "remove" as requested.
        await User.findByIdAndDelete(userId);

        return res.status(200).json({ message: "Teacher request rejected and removed" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get all users (for management page)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ Role: { $ne: "admin" } }).select("-password");
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
