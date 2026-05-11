const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({

    // shared fields
    username: {
        type: String,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    Role: {
        type: String,
        enum: ["admin", "teacher", "student"],
        default: "student",
    },

    PhoneNumber: {
        type: String,
        unique: true,
        sparse: true,
    },

    DateOfBirth: {
        type: Date,
    },

    Sexe: {
        type: String,
        enum: ["male", "female"],
    },

    EmailOtp: String,
    PhoneOtp: String,
    isPhoneOtpVerified: { type: Boolean, default: false },
    isEmailOtpVerified: { type: Boolean, default: false },

    registrationStep: {
        type: Number,
        default: 1
    },

    onboardingCompleted: {
        type: Boolean,
        default: false
    },

    // specific fields for Student
    SubjectOfLearn: [String],

    TargetLanguage: {
        type: String,
    },

    Level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
    },

    motherLanguage: {
        type: String,
    },

    avatar: {
        type: String,
        default: "avatar.png"
    },

    nickname: {
        type: String,
        unique: true,
        sparse: true,
    },

    // fields for teacher
    photoProfile: {
        type: String,
        default: "profile-teacher.png"
    },

    videoProfile: {
        type: String,
        default: "video-profile-teacher.mp4"
    },

    location: {
        type: String,
    },

    fluentLanguages: [
        {
            language: {
                type: String,
            },
            level: {
                type: String,
                enum: ["Beginner", "Intermediate", "Advanced", "native"],
            }
        }
    ],

    education: [
        {
            degree: {
                type: String,
            },
            institution: {
                type: String,
            },
            fieldOfStudy: {
                type: String,
            },
            startDate: {
                type: Date,
            },
            endDate: {
                type: Date,
            }
        }
    ],

    experience: [
        {
            jobTitle: {
                type: String,
            },
            company: {
                type: String,
            },
            startDate: {
                type: Date,
            },
            endDate: {
                type: Date,
            }
        }
    ],

    socialLinks: [
        {
            platform: {
                type: String,
            },
            url: {
                type: String,
            }
        }
    ],

    acceptanceOfTermsAndConditions: {
        type: Boolean,
        default: false
    },

    isProfileVerified: {
        type: Boolean,
        default: false
    },

});

// Hash password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);