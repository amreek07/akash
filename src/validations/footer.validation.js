const Joi = require('joi');

const linkSchema = Joi.object().keys({
    id: Joi.string().optional(),
    _id: Joi.string().optional(),
    label: Joi.string().required(),
    href: Joi.string().allow('').optional(),
});

const courseLineSchema = Joi.object().keys({
    id: Joi.string().optional(),
    _id: Joi.string().optional(),
    label: Joi.string().required(),
    href: Joi.string().allow('').optional(),
});

const updateFooterValidation = {
    body: Joi.object().keys({
        instituteName: Joi.string().required(),
        tagline: Joi.string().required(),
        quickLinks: Joi.array().items(linkSchema).default([]),
        popularCourses: Joi.array().items(courseLineSchema).default([]),
        address: Joi.string().allow('').required(),
        phone: Joi.string().allow('').required(),
        email: Joi.string().email().required(),
        facebook: Joi.string().allow('').optional(),
        instagram: Joi.string().allow('').optional(),
        youtube: Joi.string().allow('').optional(),
        copyright: Joi.string().allow('').optional(),
    }),
};

module.exports = {
    updateFooterValidation,
};
