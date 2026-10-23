const fs = require('fs');
const path = require('path');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { galleryService } = require('../services');
const { galleryDir } = require('../middlewares/upload.middleware');

function toGallery(item) {
    const data = typeof item.toObject === 'function' ? item.toObject() : item;
    return {
        id: String(data._id || data.id || ''),
        title: data.title || '',
        image: data.image || '',
    };
}

function removeGalleryFile(imagePath) {
    if (!imagePath || !imagePath.startsWith('/uploads/gallery/')) return;
    const filename = path.basename(imagePath);
    const fullPath = path.join(galleryDir, filename);
    fs.unlink(fullPath, () => {});
}

const createGallery = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, 'Gallery image is required');
    }
    const image = `/uploads/gallery/${req.file.filename}`;
    try {
        const item = await galleryService.createGallery({
            title: String(req.body.title || '').trim(),
            image,
        });
        res.status(201).json(new ApiResponse(201, { gallery: toGallery(item) }, 'Gallery image added successfully'));
    } catch (error) {
        removeGalleryFile(image);
        throw error;
    }
});

const getAllGallery = asyncHandler(async (req, res) => {
    const { search, page, limit } = req.query;
    const { gallery, pagination } = await galleryService.getAllGallery(
        { search },
        { page: Number(page) || 1, limit: Number(limit) || 50 },
    );
    res.status(200).json(
        new ApiResponse(200, { gallery: gallery.map(toGallery), pagination }, 'Gallery fetched successfully'),
    );
});

const getGalleryById = asyncHandler(async (req, res) => {
    const item = await galleryService.getGalleryById(req.params.id);
    res.status(200).json(new ApiResponse(200, { gallery: toGallery(item) }, 'Gallery image fetched successfully'));
});

const updateGallery = asyncHandler(async (req, res) => {
    const existing = await galleryService.getGalleryById(req.params.id);
    const payload = {
        title: String(req.body.title || '').trim(),
    };
    if (req.file) {
        payload.image = `/uploads/gallery/${req.file.filename}`;
    }
    try {
        const item = await galleryService.updateGallery(req.params.id, payload);
        if (payload.image && existing.image && existing.image !== payload.image) {
            removeGalleryFile(existing.image);
        }
        res.status(200).json(new ApiResponse(200, { gallery: toGallery(item) }, 'Gallery image updated successfully'));
    } catch (error) {
        if (payload.image) removeGalleryFile(payload.image);
        throw error;
    }
});

const deleteGallery = asyncHandler(async (req, res) => {
    const item = await galleryService.deleteGallery(req.params.id);
    removeGalleryFile(item.image);
    res.status(200).json(new ApiResponse(200, null, 'Gallery image deleted successfully'));
});

module.exports = {
    createGallery,
    getAllGallery,
    getGalleryById,
    updateGallery,
    deleteGallery,
};
