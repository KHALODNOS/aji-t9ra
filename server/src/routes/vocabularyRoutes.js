const express = require("express");
const router = express.Router();
const { addWord, getTeacherWords, getAllWords, deleteWord } = require("../controllers/vocabularyController");
const authMiddleware = require("../middlewares/authMiddleware");

const { vocabularyUpload } = require("../middlewares/uploadMiddleware");

router.post("/", authMiddleware, vocabularyUpload, addWord);
router.get("/teacher", authMiddleware, getTeacherWords);
router.get("/student", authMiddleware, getAllWords);
router.delete("/:id", authMiddleware, deleteWord);

module.exports = router;
