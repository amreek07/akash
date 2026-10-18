const Joi = require("joi");

const registerValidation = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

const loginValidation = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

const verifyOTPValidation = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
  }),
};

const resendOTPValidation = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const forgotPasswordValidation = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const verifyForgotPasswordOTPValidation = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
  }),
};

const resetPasswordValidation = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    newPassword: Joi.string().min(8).required(),
  }),
};

const changePasswordValidation = {
  body: Joi.object().keys({
    oldPassword: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required(),
  }),
};

const logoutValidation = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

module.exports = {
  registerValidation,
  loginValidation,
  verifyOTPValidation,
  resendOTPValidation,
  forgotPasswordValidation,
  verifyForgotPasswordOTPValidation,
  resetPasswordValidation,
  changePasswordValidation,
  logoutValidation,
};
