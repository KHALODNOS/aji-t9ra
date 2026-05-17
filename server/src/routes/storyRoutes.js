const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { storyUpload } = require('../middlewares/uploadMiddleware');

// All story routes require authentication and teacher role
router.use(authMiddleware);
router.use(roleMiddleware('teacher'));

router.post('/', storyUpload, storyController.createStory);
router.get('/my-stories', storyController.getTeacherStories);
router.get('/:id', storyController.getStoryById);

module.exports = router;
