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
    personality: {
      name: { type: String, default: "حكيم القرية" },
      tone: { type: String, default: "ودود (Friendly)" },
      difficulty: { type: Number, default: 60 },
      systemPrompt: { type: String, default: "تحدث كأنك شخصية من القصة. ركز على استخدام الكلمات الصعبة التي حددتها أنا. ولا تعط الإجابة مباشرة." },
      xp: { type: Number, default: 50 }
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", storySchema);
