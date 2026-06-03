const multer = require('multer');
const { cloudinary } = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Storage for Images
const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Linguist/Stories/Covers',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ width: 800, height: 600, crop: 'limit' }]
    }
});

// Storage for Audio
const audioStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Linguist/Stories/Audio',
        resource_type: 'auto', // Important for non-image files
        allowed_formats: ['mp3', 'wav', 'ogg']
    }
});

// Storage for Videos
const videoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Linguist/Videos',
        resource_type: 'video',
        allowed_formats: ['mp4', 'mov', 'avi', 'mkv', 'webm']
    }
});

const uploadImage = multer({ storage: imageStorage });
const uploadAudio = multer({ storage: audioStorage });

// Multi-file upload for video and cover
const uploadVideo = multer({
    storage: new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => {
            if (file.fieldname === 'coverImage') {
                return {
                    folder: 'Linguist/Videos/Covers',
                    allowed_formats: ['jpg', 'png', 'jpeg'],
                };
            }
            if (file.fieldname === 'video') {
                return {
                    folder: 'Linguist/Videos',
                    resource_type: 'video',
                    allowed_formats: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
                };
            }
        },
    }),
}).fields([
    { name: 'video', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]);

// Multi-file upload for stories (Cover + Audio)
const storyUpload = multer({
    storage: new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => {
            if (file.fieldname === 'coverImage') {
                return {
                    folder: 'Linguist/Stories/Covers',
                    allowed_formats: ['jpg', 'png', 'jpeg'],
                };
            }
            if (file.fieldname === 'audioFile') {
                return {
                    folder: 'Linguist/Stories/Audio',
                    resource_type: 'auto', // Use auto for audio to support media playback correctly
                };
            }
        },
    }),
}).fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'audioFile', maxCount: 1 }
]);

// Multi-file upload for vocabulary (Image + Audio)
const vocabularyUpload = multer({
    storage: new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => {
            if (file.fieldname === 'image') {
                return {
                    folder: 'Linguist/Vocabulary/Images',
                    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
                };
            }
            if (file.fieldname === 'audio') {
                return {
                    folder: 'Linguist/Vocabulary/Audio',
                    resource_type: 'auto',
                    allowed_formats: ['mp3', 'wav', 'ogg']
                };
            }
        },
    }),
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
]);

module.exports = { uploadImage, uploadAudio, storyUpload, uploadVideo, vocabularyUpload };
