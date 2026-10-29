const Joi = require('joi');

const partnerBody = {
    name: Joi.string().trim().min(1).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().trim().min(7).max(20).required(),
    address: Joi.string().trim().min(1).required(),
    city: Joi.string().trim().min(1).required(),
    isActive: Joi.boolean().optional(),
    status: Joi.string().valid('active', 'inactive').optional(),
};

const createPartnerValidation = {
    body: Joi.object().keys(partnerBody),
};

const updatePartnerValidation = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
    body: Joi.object().keys(partnerBody),
};

const partnerIdValidation = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
};

module.exports = {
    createPartnerValidation,
    updatePartnerValidation,
    partnerIdValidation,
};
