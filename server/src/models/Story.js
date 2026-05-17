const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    language: {
      type: String,
      enum: ["Arabic", "French", "English", "Tifinagh"],
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    audioUrl: {
      type: String,
      required: false,
    },
    vocabulary: [
      {
        word: { type: String, required: true },
        translation: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", storySchema);
