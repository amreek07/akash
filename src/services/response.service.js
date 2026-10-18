const { Response } = require('../model');
const ApiError = require('../utils/ApiError');
const { isValidObjectId } = require('mongoose');

const createResponse = async (responseData) => {
    const newResponse = await Response.create(responseData);
    return newResponse;
}

const getAllResponses = async (filter ={}, options ={}) => {
    const { limit = 10, page = 1 } = options;
    const skip = (page - 1) * limit;
    const query = filter.search ? { name: { $regex: filter.search, $options: 'i' } } : {};
    const responses = await Response.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Response.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const pagination = {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    }
    return { responses, pagination };
}

// const getResponseByResponseType = async (responseType) => {
//     const responses = await Response.find({ responseType}).populate('course').sort({ createdAt: -1 });
//     return responses;
// }

const getResponseById = async (id) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid response ID");
    }
    const response = await Response.findById(id);
    return response;
}

const deleteResponse = async (id) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid response ID");
    }
    const response = await Response.findByIdAndDelete(id);
    return response;
}

const updateResponse = async (id, responseData) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid response ID");
    }
    const response = await Response.findByIdAndUpdate(id, responseData, { new: true });
    return response;
}

module.exports = {
    createResponse,
    getAllResponses,
    getResponseById,
    deleteResponse,
    updateResponse,
}