const User = require("../models/User");
const Notification = require("../models/Notification");
const { broadcastToAdmins } = require("../utils/socket");
const bcrypt = require("bcryptjs");

// Get currently logged-in user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء جلب بيانات الملف الشخصي", error: error.message });
    }
};

// Update user profile (personal & professional)
exports.updateUserProfile = async (req, res) => {
    try {
        const { username, PhoneNumber, location, photoProfile, fluentLanguages, education, experience } = req.body;
        
        const updateData = {};
        
        // Personal Info fields
        if (username !== undefined) updateData.username = username;
        if (PhoneNumber !== undefined) updateData.PhoneNumber = PhoneNumber;
        if (location !== undefined) updateData.location = location;
        if (photoProfile !== undefined) updateData.photoProfile = photoProfile;
        
        // Professional Info fields
        if (fluentLanguages !== undefined) updateData.fluentLanguages = fluentLanguages;
        if (education !== undefined) updateData.education = education;
        if (experience !== undefined) updateData.experience = experience;

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }

        res.status(200).json({
            message: "تم تحديث الملف الشخصي بنجاح",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء تحديث الملف الشخصي", error: error.message });
    }
};

// Change password safely
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "يرجى تقديم كلمة المرور القديمة والجديدة" });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }

        // Verify old password
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "كلمة المرور القديمة غير صحيحة" });
        }

        // Set and hash new password (hashing happens pre-save in UserSchema)
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح" });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء تغيير كلمة المرور", error: error.message });
    }
};

// Submit support contact request
exports.submitSupportRequest = async (req, res) => {
    try {
        const { subject, message, email, phone } = req.body;

        if (!subject || !message) {
            return res.status(400).json({ message: "يرجى تعبئة موضوع الرسالة ومحتواها" });
        }

        // Create an admin notification
        const notification = new Notification({
            recipient: null, // Broadcast to all admins
            sender: req.user._id,
            type: "system",
            message: `طلب دعم فني جديد من الأستاذ ${req.user.username || req.user.email}: ${subject}`,
            data: {
                contentId: req.user._id // reference user ID
            }
        });
        await notification.save();

        // Broadcast to admins via sockets
        broadcastToAdmins({
            ...notification.toObject(),
            senderName: req.user.username || req.user.email
        });

        res.status(200).json({
            message: "تم إرسال طلب الدعم بنجاح، سيتواصل معك الدعم الفني قريباً"
        });
    } catch (error) {
        res.status(500).json({ message: "حدث خطأ أثناء إرسال طلب الدعم", error: error.message });
    }
};
