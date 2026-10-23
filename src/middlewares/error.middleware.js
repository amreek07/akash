const ApiError = require('../utils/ApiError');

const errorHandler = (err, _req, res, _next) => {
    const error = err instanceof ApiError
        ? err
        : new ApiError(err.statusCode || 500, err.message || 'Internal server error');

    res.status(error.statusCode).json({
        success: false,
        statusCode: error.statusCode,
        message: error.message,
        errors: error.errors || [],
        data: null,
    });
};

module.exports = errorHandler;
