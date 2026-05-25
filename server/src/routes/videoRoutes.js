const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const authMiddleware = require('../middlewares/authMiddleware');
const { uploadVideo } = require('../middlewares/uploadMiddleware');

// Public route for students (any authenticated user)
router.get('/approved', authMiddleware, videoController.getApprovedVideos);
router.get('/:id/comments', authMiddleware, videoController.getVideoComments);
router.post('/:id/comments', authMiddleware, videoController.addVideoComment);

router.post('/upload', authMiddleware, uploadVideo, videoController.createVideo);
router.get('/my-videos', authMiddleware, videoController.getTeacherVideos);

module.exports = router;
