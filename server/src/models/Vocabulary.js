const mongoose = require("mongoose");

const vocabularySchema = new mongoose.Schema(
  {
    word: { type: String, required: true },
    translation: { type: String, required: true },
    language: { type: String, enum: ["French", "English", "Arabic", "Tamazight"], required: true },
    image: { type: String },
    audio: { type: String },
    type: { type: String, enum: ["word", "sentence"], default: "word" },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vocabulary", vocabularySchema);
