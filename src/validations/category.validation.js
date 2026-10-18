const Joi = require('joi');

const createCategoryValidation = { 
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        isActive: Joi.boolean().default(true),
    })
}

const updateCategoryValidation = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        isActive: Joi.boolean().default(true),
    })
}

const categoryIdValidation = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    })
}

module.exports = {
    createCategoryValidation,
    updateCategoryValidation,
    categoryIdValidation,
}