const Joi = require('joi');

const notificationIdValidation = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
};

module.exports = {
    notificationIdValidation,
};
