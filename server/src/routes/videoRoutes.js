const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const authMiddleware = require('../middlewares/authMiddleware');
const { uploadVideo } = require('../middlewares/uploadMiddleware');

router.post('/upload', authMiddleware, uploadVideo, videoController.createVideo);
router.get('/my-videos', authMiddleware, videoController.getTeacherVideos);

module.exports = router;
