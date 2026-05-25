const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: true,
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    xpAwarded: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const xpEventSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      enum: ["story_complete", "quiz_pass", "ai_chat", "voice_salon"],
      required: true,
    },
    sourceId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    reason: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const studentProgressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    learningMinutes: {
      type: Number,
      default: 0,
    },
    totalXp: {
      type: Number,
      default: 0,
      min: 0,
    },
    aiMessagesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    generalChatMessagesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    xpEvents: [xpEventSchema],
    learnedWords: [
      {
        type: String,
        trim: true,
      },
    ],
    favoriteWords: [
      {
        type: String,
        trim: true,
      },
    ],
    completedStories: [
      {
        story: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Story",
          required: true,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
        xpAwarded: {
          type: Number,
          default: 0,
        },
      },
    ],
    storyProgress: [
      {
        story: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Story",
          required: true,
        },
        percent: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    quizAttempts: [quizAttemptSchema],
    watchedVideos: [
      {
        video: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Content",
          required: true,
        },
        watchedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    videoReactions: [
      {
        video: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Content",
          required: true,
        },
        reaction: {
          type: String,
          default: "like",
        },
        reactedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentProgress", studentProgressSchema);
