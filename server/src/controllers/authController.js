

const User = require("../models/User");
const generateOtp = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
// Helper to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "default_secret", {
        expiresIn: "30d",
    });
};

// Step 1: Registration
exports.registration = async (req, res) => {
    try {
        const { email, password, Role } = req.body;

        const findUser = await User.findOne({ email });
        if (findUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const otpCode = generateOtp();

        const newUser = new User({
            email,
            password,
            Role,
            EmailOtp: otpCode,
            registrationStep: 1
        });

        try {
            await sendEmail(email, otpCode);
            console.log("Email OTP:", otpCode);
        } catch (emailError) {
            console.log("Email error: ", emailError);
        }

        await newUser.save();
        return res.status(200).json({ message: "Step 1: Registered. Check email for OTP." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Step 2: Verify Email OTP
exports.verifyEmail = async (req, res) => {
    try {
        const { email, otpCode } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.EmailOtp !== otpCode) {
            return res.status(400).json({ message: "Invalid Email OTP" });
        }

        user.isEmailOtpVerified = true;
        user.EmailOtp = null;
        user.registrationStep = 2;
        await user.save();

        // Generate Token so subsequent steps can use it
        const token = generateToken(user._id);

        return res.status(200).json({
            message: "Step 2: Email verified successfully",
            token,
            user: {
                id: user._id,
                email: user.email,
                Role: user.Role,
                status: user.status
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Login Controller
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = generateToken(user._id);

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                Role: user.Role,
                onboardingCompleted: user.onboardingCompleted,
                status: user.status
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Step 3: Enter Phone & Send OTP
exports.sendPhoneOTP = async (req, res) => {
    try {
        const { PhoneNumber } = req.body;
        const user = req.user; // From Middleware

        const phoneOtpCode = generateOtp();
        user.PhoneNumber = PhoneNumber;
        user.PhoneOtp = phoneOtpCode;
        user.registrationStep = 3;

        console.log(`\n--- PHONE OTP FOR ${user.email} ---`);
        console.log(`OTP: ${phoneOtpCode}`);
        console.log(`--------------------------------\n`);

        await user.save();
        return res.status(200).json({ message: "Step 3: Phone OTP sent." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Step 4: Verify Phone OTP
exports.verifyPhoneOTP = async (req, res) => {
    try {
        const { phoneOtp } = req.body;
        const user = req.user; // From Middleware

        if (user.PhoneOtp !== phoneOtp) {
            return res.status(400).json({ message: "Invalid Phone OTP" });
        }

        user.isPhoneOtpVerified = true;
        user.PhoneOtp = null;
        user.registrationStep = 4;
        await user.save();

        return res.status(200).json({ message: "Step 4: Phone verified successfully." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// --- TEACHER ONBOARDING STEPS ---

exports.teacherStep1 = async (req, res) => {
    try {
        const user = req.user;

        if (req.files) {
            if (req.files.photoProfile) {
                user.photoProfile = req.files.photoProfile[0].path;
            }
            if (req.files.videoProfile) {
                user.videoProfile = req.files.videoProfile[0].path;
            }
        }

        user.registrationStep = 5;
        await user.save();

        return res.status(200).json({ message: "Teacher Step 1 completed", registrationStep: user.registrationStep });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.teacherStep2 = async (req, res) => {
    try {
        const { username, sexe, location } = req.body;
        const user = req.user;

        if (username) user.username = username;
        if (sexe) user.Sexe = sexe;
        if (location) user.location = location;

        user.registrationStep = 6;
        await user.save();

        return res.status(200).json({ message: "Teacher Step 2 completed", registrationStep: user.registrationStep });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.teacherStep3 = async (req, res) => {
    try {

        const { fluentLanguages } = req.body;
        const user = req.user;

        if (fluentLanguages) user.fluentLanguages = fluentLanguages;

        user.registrationStep = 7;
        await user.save();

        return res.status(200).json({ message: "Teacher Step 3 completed", registrationStep: user.registrationStep });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.teacherStep4 = async (req, res) => {
    try {
        const { education, experience } = req.body;
        const user = req.user;

        if (education) user.education = education;
        if (experience) user.experience = experience;

        user.registrationStep = 8;
        await user.save();

        return res.status(200).json({ message: "Teacher Step 4 completed", registrationStep: user.registrationStep });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.teacherStep5 = async (req, res) => {
    try {
        const { socialLinks } = req.body;
        const user = req.user;

        if (socialLinks) user.socialLinks = socialLinks;

        user.registrationStep = 9;
        await user.save();

        return res.status(200).json({ message: "Teacher Step 5 completed (Social Links)", registrationStep: user.registrationStep });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.teacherStep6 = async (req, res) => {
    try {
        const { acceptanceOfTermsAndConditions } = req.body;
        const user = req.user;

        if (acceptanceOfTermsAndConditions !== undefined) {
            user.acceptanceOfTermsAndConditions = acceptanceOfTermsAndConditions;
        }

        if (user.acceptanceOfTermsAndConditions) {
            user.onboardingCompleted = true;
            user.registrationStep = 10;
            user.status = "pending";
        }

        await user.save();

        return res.status(200).json({
            message: user.onboardingCompleted ? "Teacher Onboarding Completed" : "Terms must be accepted",
            onboardingCompleted: user.onboardingCompleted
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// --- STUDENT ONBOARDING STEPS ---

exports.studentStep1 = async (req, res) => {
    try {
        const { username, dateOfBirth, sexe } = req.body;
        const user = req.user;

        if (username) user.username = username;
        if (dateOfBirth) user.DateOfBirth = dateOfBirth;
        if (sexe) user.Sexe = sexe;

        user.registrationStep = 5;
        await user.save();

        return res.status(200).json({ message: "Student Step 1 completed", registrationStep: user.registrationStep });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.studentStep2 = async (req, res) => {
    try {
        const { subjectOfLearn, targetLanguage } = req.body;
        const user = req.user;

        if (subjectOfLearn) user.SubjectOfLearn = subjectOfLearn;
        if (targetLanguage) user.TargetLanguage = targetLanguage;

        user.registrationStep = 6;
        await user.save();

        return res.status(200).json({ message: "Student Step 2 completed", registrationStep: user.registrationStep });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.studentStep3 = async (req, res) => {
    try {
        const { level } = req.body;
        const user = req.user;

        if (level) user.Level = level;

        user.registrationStep = 7;
        await user.save();

        return res.status(200).json({ message: "Student Step 3 completed", registrationStep: user.registrationStep });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.studentStep4 = async (req, res) => {
    try {
        const { nickname } = req.body;
        const user = req.user;

        if (req.file) {
            user.avatar = req.file.path;
        }
        if (nickname) user.nickname = nickname;

        user.onboardingCompleted = true;
        user.registrationStep = 8;
        await user.save();

        return res.status(200).json({
            message: "Student Onboarding Completed",
            onboardingCompleted: user.onboardingCompleted
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};





