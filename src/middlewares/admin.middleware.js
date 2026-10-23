const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { User } = require('../model');

const admin = asyncHandler(async (req, _, next) => {
    if (!req.user?.id) {
        throw new ApiError(401, 'Access denied, unauthorized request');
    }

    const user = await User.findById(req.user.id).select('role');
    if (!user) {
        throw new ApiError(401, 'Access denied, unauthorized request');
    }
    if (user.role !== 'admin') {
        throw new ApiError(403, 'Access denied, admin only');
    }

    next();
});

module.exports = admin;
