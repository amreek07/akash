const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ApiError = require('../utils/ApiError');

const avatarDir = path.join(__dirname, '../../public/uploads/avatars');
const galleryDir = path.join(__dirname, '../../public/uploads/gallery');
fs.mkdirSync(avatarDir, { recursive: true });
fs.mkdirSync(galleryDir, { recursive: true });

function createImageUpload({ directory, field, maxBytes, label }) {
    const storage = multer.diskStorage({
        destination: (_req, _file, cb) => cb(null, directory),
        filename: (_req, file, cb) => {
            const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
            cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
        },
    });

    const upload = multer({
        storage,
        limits: { fileSize: maxBytes },
        fileFilter: (_req, file, cb) => {
            if (!file.mimetype || !file.mimetype.startsWith('image/')) {
                return cb(new ApiError(400, `${label} must be an image file`));
            }
            cb(null, true);
        },
    });

    return (req, res, next) => {
        upload.single(field)(req, res, (err) => {
            if (!err) return next();
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return next(new ApiError(400, `${label} must be ${Math.round(maxBytes / (1024 * 1024))}MB or smaller`));
                }
                return next(new ApiError(400, err.message));
            }
            next(err);
        });
    };
}

const uploadAvatar = createImageUpload({
    directory: avatarDir,
    field: 'avatar',
    maxBytes: 2 * 1024 * 1024,
    label: 'Avatar',
});

const uploadGalleryImage = createImageUpload({
    directory: galleryDir,
    field: 'image',
    maxBytes: 5 * 1024 * 1024,
    label: 'Gallery image',
});

module.exports = { uploadAvatar, uploadGalleryImage, avatarDir, galleryDir };
