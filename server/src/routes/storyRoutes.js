const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { storyUpload } = require('../middlewares/uploadMiddleware');

// All story routes require authentication
router.use(authMiddleware);

// Public route for students (any authenticated user)
router.get('/approved', storyController.getApprovedStories);

// Teacher-only routes
router.post('/', roleMiddleware('teacher'), storyUpload, storyController.createStory);
router.get('/my-stories', roleMiddleware('teacher'), storyController.getTeacherStories);
router.get('/:id', storyController.getStoryById);

module.exports = router;
