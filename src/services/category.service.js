const { Category } = require('../model');
const ApiError = require('../utils/ApiError');
const { isValidObjectId } = require('mongoose');

const createCategory = async (categoryData) => {
    const existingCategory = await Category.findOne({ name: categoryData.name });
    if (existingCategory) {
        throw new ApiError(400, "Category already exists");
    }
    const newCategory = await Category.create(categoryData);
    if (!newCategory) {
        throw new ApiError(400, "Failed to create category");
    }
    return newCategory;
};

const getAllCategories = async (filter ={}, options ={}) => {
    const { limit = 10, page = 1 } = options;
    const skip = (page - 1) * limit;
    const query = filter.search ? { name: { $regex: filter.search, $options: 'i' } } : {};
    const categories = await Category.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Category.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const pagination = {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    };
    return { categories, pagination };
};

const getCategoryById = async (id) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid category ID");
    }
    const category = await Category.findById(id);
    return category;
};

const updateCategory = async (id, categoryData) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid category ID");
    }
    const existingCategory = await Category.findOne({ name: categoryData.name, _id: { $ne: id } });
    if (existingCategory) {
        throw new ApiError(400, "Category already exists");
    }
    const category = await Category.findByIdAndUpdate(id, categoryData, { new: true });
    return category;
};

const deleteCategory = async (id) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid category ID");
    }
    await Category.findByIdAndDelete(id);
};

const categoryStatusToggle = async (id) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid category ID");
    }
    const category = await Category.findById(id);
    category.isActive = !category.isActive;
    await category.save();
    return category;
}

const activeCategories = async () => {
    const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
    return categories;
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    categoryStatusToggle,
    activeCategories,
};