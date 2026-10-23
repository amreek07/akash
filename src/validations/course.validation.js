const Joi = require('joi');

const createCourseValidation = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        category: Joi.string().required(),
        duration: Joi.object().keys({
            value: Joi.number().min(1).required(),
            unit: Joi.string().valid('days', 'months', 'years').required(),
        }).required(),
        fees: Joi.object().keys({
            price: Joi.number().min(0).required(),
            offerPrice: Joi.number().min(0).required(),
            currency: Joi.string().default('INR'),
        }).required(),
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
            value: Joi.number().min(1).optional(),
            unit: Joi.string().valid('days', 'months', 'years').optional(),
        }),
        fees: Joi.object().keys({
            price: Joi.number().min(0).optional(),
            offerPrice: Joi.number().min(0).optional(),
            currency: Joi.string().default('INR'),
        }),
        eligibility: Joi.string().optional(),
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