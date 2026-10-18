const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { responseService } = require("../services");

const createResponse = asyncHandler(async (req, res) => {
    const response = await responseService.createResponse(req.body);
    res.status(200).json(new ApiResponse(200, response, "Response created successfully"));
});

const getAllResponses = asyncHandler(async (req, res) => {
    const { responses, pagination } = await responseService.getAllResponses(req.query, req.options);
    res.status(200).json(new ApiResponse(200, { responses, pagination }, "Responses fetched successfully"));
});

const getResponseById = asyncHandler(async (req, res) => {
    const response = await responseService.getResponseById(req.params.id);
    res.status(200).json(new ApiResponse(200, response, "Response fetched successfully"));
});

const deleteResponse = asyncHandler(async (req, res) => {
    await responseService.deleteResponse(req.params.id);
    res.status(200).json(new ApiResponse(200, {}, "Response deleted successfully"));
});

const updateResponse = asyncHandler(async (req, res) => {
    const response = await responseService.updateResponse(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, response, "Response updated successfully"));
});

module.exports = {
    createResponse,
    getAllResponses,
    getResponseById,
    deleteResponse,
    updateResponse,
}