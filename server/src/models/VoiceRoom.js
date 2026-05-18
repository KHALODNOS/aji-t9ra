const mongoose = require("mongoose");

const voiceRoomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subjectOfLearn: {
      type: String,
      required: true,
      trim: true,
    },
    rules: {
      type: String,
      default: "",
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    language: {
      type: String,
      enum: ["Arabic", "French", "English", "Tifinagh"],
      required: true,
    },
    maxUsers: {
      type: Number,
      required: true,
      min: 1,
      default: 10,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        isMuted: {
          type: Boolean,
          default: false,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("VoiceRoom", voiceRoomSchema);
