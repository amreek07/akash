const { Gallery } = require('../model');
const ApiError = require('../utils/ApiError');
const { isValidObjectId } = require('mongoose');

const createGallery = async (payload) => {
    const item = await Gallery.create(payload);
    if (!item) {
        throw new ApiError(400, 'Failed to create gallery image');
    }
    return item;
};

const getAllGallery = async (filter = {}, options = {}) => {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Number(options.limit) || 50);
    const skip = (page - 1) * limit;
    const query = filter.search ? { title: { $regex: filter.search, $options: 'i' } } : {};
    const items = await Gallery.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Gallery.countDocuments(query);
    const totalPages = Math.ceil(total / limit) || 1;
    return {
        gallery: items,
        pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    };
};

const getGalleryById = async (id) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid gallery ID');
    }
    const item = await Gallery.findById(id);
    if (!item) {
        throw new ApiError(404, 'Gallery image not found');
    }
    return item;
};

const updateGallery = async (id, payload) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid gallery ID');
    }
    const item = await Gallery.findByIdAndUpdate(id, payload, { new: true });
    if (!item) {
        throw new ApiError(404, 'Gallery image not found');
    }
    return item;
};

const deleteGallery = async (id) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid gallery ID');
    }
    const item = await Gallery.findByIdAndDelete(id);
    if (!item) {
        throw new ApiError(404, 'Gallery image not found');
    }
    return item;
};

module.exports = {
    createGallery,
    getAllGallery,
    getGalleryById,
    updateGallery,
    deleteGallery,
};
