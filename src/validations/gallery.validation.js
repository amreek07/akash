const Joi = require('joi');

const createGalleryValidation = {
    body: Joi.object().keys({
        title: Joi.string().trim().min(1).required(),
    }),
};

const updateGalleryValidation = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
    body: Joi.object().keys({
        title: Joi.string().trim().min(1).required(),
    }),
};

const galleryIdValidation = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
};

module.exports = {
    createGalleryValidation,
    updateGalleryValidation,
    galleryIdValidation,
};
