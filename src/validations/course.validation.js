const Joi = require('joi');

const createCourseValidation = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        category: Joi.string().required(),
        duration: Joi.object().keys({
            value: Joi.number().required(),
            unit: Joi.string().required(),
        }),
        fees: Joi.object().keys({
            price: Joi.number().required(),
            offerPrice: Joi.number().required(),
            currency: Joi.string().default('INR'),
        }),
        eligibility: Joi.string().required(),
        isFeatured: Joi.boolean().default(false),
        isPublished: Joi.boolean().default(false),
        isActive: Joi.boolean().default(true),
    })
}

const updateCourseValidation = {
    body: Joi.object().keys({
        title: Joi.string().optional(),
        description: Joi.string().optional(),
        category: Joi.string().optional(),
        duration: Joi.object().keys({
            value: Joi.number().optional(),
            unit: Joi.string().optional(),
        }),
        fees: Joi.object().keys({
            price: Joi.number().optional(),
            offerPrice: Joi.number().optional(),
            currency: Joi.string().default('INR'),
        }),
        eligibility: Joi.string().optional(),
        category: Joi.string().optional(),
        isFeatured: Joi.boolean().optional(),
        isPublished: Joi.boolean().optional(),
        isActive: Joi.boolean().optional(),
    }),
    params: Joi.object().keys({
        id: Joi.string().required(),
    })
}

const courseIdValidation = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    })
}

module.exports = {
    createCourseValidation,
    updateCourseValidation,
    courseIdValidation,
}