const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ApiError = require('../utils/ApiError');

const avatarDir = path.join(__dirname, '../../public/uploads/avatars');
fs.mkdirSync(avatarDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, avatarDir),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype || !file.mimetype.startsWith('image/')) {
            return cb(new ApiError(400, 'Avatar must be an image file'));
        }
        cb(null, true);
    },
});

const uploadAvatar = (req, res, next) => {
    upload.single('avatar')(req, res, (err) => {
        if (!err) return next();
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return next(new ApiError(400, 'Avatar must be 2MB or smaller'));
            }
            return next(new ApiError(400, err.message));
        }
        next(err);
    });
};

module.exports = { uploadAvatar, avatarDir };
