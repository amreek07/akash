const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { categoryService } = require("../services");

const createCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(new ApiResponse(201, { category }, "Category created successfully"));
});

const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await categoryService.getAllCategories(req.query, req.options);
    res.status(200).json(new ApiResponse(200, { categories }, "Categories fetched successfully"));
});

const getCategoryById = asyncHandler(async (req, res) => {
    const category = await categoryService.getCategoryById(req.params.id);
    res.status(200).json(new ApiResponse(200, { category }, "Category fetched successfully"));
});

const updateCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, { category }, "Category updated successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
    await categoryService.deleteCategory(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "Category deleted successfully"));
});

const categoryStatusToggle = asyncHandler(async (req, res) => {
   const category = await categoryService.categoryStatusToggle(req.params.id);
    res.status(200).json(new ApiResponse(200, category, "Category status toggled successfully"));
});

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    categoryStatusToggle,
};