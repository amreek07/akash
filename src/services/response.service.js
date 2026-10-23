const { Response, Course } = require('../model');
const ApiError = require('../utils/ApiError');
const { isValidObjectId } = require('mongoose');

const populateCourse = { path: 'course', select: 'title fees' };
const allowedTypes = ['enquiry', 'registration', 'general'];

const createResponse = async (responseData) => {
    const newResponse = await Response.create(responseData);
    return newResponse;
};

const getAllResponses = async (filter = {}, options = {}) => {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Number(options.limit) || 50);
    const skip = (page - 1) * limit;
    const query = {};

    if (filter.responseType && allowedTypes.includes(filter.responseType)) {
        query.responseType = filter.responseType;
    }

    if (filter.search) {
        const regex = { $regex: filter.search, $options: 'i' };
        const matchingCourses = await Course.find({ title: regex }).select('_id');
        query.$or = [
            { name: regex },
            { email: regex },
            { phone: regex },
            { course: { $in: matchingCourses.map((course) => course._id) } },
        ];
    }

    const responses = await Response.find(query)
        .populate(populateCourse)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
    const total = await Response.countDocuments(query);
    const totalPages = Math.ceil(total / limit) || 1;
    const countsRaw = await Response.aggregate([{ $group: { _id: '$responseType', total: { $sum: 1 } } }]);
    const counts = { registration: 0, enquiry: 0, general: 0 };
    countsRaw.forEach((row) => {
        if (row._id) counts[row._id] = row.total;
    });

    return {
        responses,
        pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
        counts,
    };
};

const getResponseById = async (id) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid response ID');
    }
    const response = await Response.findById(id).populate(populateCourse);
    if (!response) {
        throw new ApiError(404, 'Response not found');
    }
    return response;
};

const deleteResponse = async (id) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid response ID');
    }
    const response = await Response.findByIdAndDelete(id);
    if (!response) {
        throw new ApiError(404, 'Response not found');
    }
    return response;
};

const updateResponse = async (id, responseData) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid response ID');
    }
    const response = await Response.findByIdAndUpdate(id, responseData, { new: true }).populate(populateCourse);
    if (!response) {
        throw new ApiError(404, 'Response not found');
    }
    return response;
};

module.exports = {
    createResponse,
    getAllResponses,
    getResponseById,
    deleteResponse,
    updateResponse,
};
