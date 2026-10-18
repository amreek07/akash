const Joi = require('joi');

const createResponseValidation = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        message: Joi.string().optional(),
        course: Joi.string().optional(),
        referenceId: Joi.string().optional(),
        responseType: Joi.string().default('general'),
    })
}

const updateResponseValidation = {
    body: Joi.object().keys({
        name: Joi.string().optional(),
        email: Joi.string().email().optional(),
        phone: Joi.string().optional(),
        message: Joi.string().optional(),
        course: Joi.string().optional(),
        referenceId: Joi.string().optional(),
        responseType: Joi.string().default('general'),
    })
}

const responseIdValidation = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    })
}

module.exports = {
    createResponseValidation,
    updateResponseValidation,
    responseIdValidation,
}