const jwt = require('jsonwebtoken');
const config = require('../config/config');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const auth = asyncHandler(async (req, _, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.accessToken;
    
    if(!token){
        throw new ApiError(401, 'Access denied, unauthorized request');
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        req.user = decoded;
        next();
        
    } catch (error) {
        throw new ApiError(401, error.message || 'Access denied, unauthorized request');
    }
});

module.exports = auth;