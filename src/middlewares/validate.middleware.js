const ApiError = require('../utils/ApiError');

const validate = (schema) => {
    return (req, _, next) => {
        const target = ['body', 'query', 'params'].find((key)=> schema[key] !== undefined);

        const { error } = schema[target].validate(req[target]);

        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            return next(new ApiError(400, errorMessage));
        }
        next();
    }
}

module.exports = validate;