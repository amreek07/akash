const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth.controller');
const validate = require('../../middlewares/validate.middleware');
const auth = require('../../middlewares/auth.middleware');
const { authValidation } = require('../../validations');


router.post('/register', validate(authValidation.registerValidation), authController.register);
router.post('/login', validate(authValidation.loginValidation), authController.login);
router.post('/logout', validate(authValidation.logoutValidation), authController.logout);
router.post('/forgot-password', validate(authValidation.forgotPasswordValidation), authController.forgotPassword);
router.post('/verify-forgot-password-otp', validate(authValidation.verifyForgotPasswordOTPValidation), authController.verifyForgotPasswordOTP);
router.post('/reset-password', validate(authValidation.resetPasswordValidation), authController.resetPassword);
router.post('/verify-otp', validate(authValidation.verifyOTPValidation), authController.verifyOTP);
router.post('/resend-otp', validate(authValidation.resendOTPValidation), authController.resendOTP);
router.post('/change-password', auth, validate(authValidation.changePasswordValidation), authController.changePassword);
router.get('/me', auth, authController.me);

module.exports = router;