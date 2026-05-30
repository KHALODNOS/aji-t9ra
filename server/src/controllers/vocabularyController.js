const Vocabulary = require("../models/Vocabulary");

exports.addWord = async (req, res) => {
  try {
    const { word, translation, language } = req.body;
    if (!word || !translation || !language) {
      return res.status(400).json({ message: "يرجى تعبئة جميع الحقول." });
    }
    const newWord = await Vocabulary.create({
      word,
      translation,
      language,
      teacherId: req.user._id,
    });
    res.status(201).json(newWord);
  } catch (error) {
    res.status(500).json({ message: "خطأ في إضافة الكلمة", error: error.message });
  }
};

exports.getTeacherWords = async (req, res) => {
  try {
    const words = await Vocabulary.find({ teacherId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(words);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب الكلمات", error: error.message });
  }
};

exports.getAllWords = async (req, res) => {
  try {
    // Optionally filter by language if provided in query
    const { language } = req.query;
    const filter = language && language !== "All" ? { language } : {};
    
    const words = await Vocabulary.find(filter).sort({ createdAt: -1 }).populate("teacherId", "name");
    res.status(200).json(words);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب الكلمات", error: error.message });
  }
};

exports.deleteWord = async (req, res) => {
  try {
    const word = await Vocabulary.findOneAndDelete({ _id: req.params.id, teacherId: req.user._id });
    if (!word) {
      return res.status(404).json({ message: "الكلمة غير موجودة أو غير مصرح لك بحذفها." });
    }
    res.status(200).json({ message: "تم حذف الكلمة بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "خطأ في حذف الكلمة", error: error.message });
  }
};
