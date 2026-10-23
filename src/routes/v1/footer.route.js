const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const { footerValidation } = require('../../validations');
const footerController = require('../../controllers/footer.controller');

router
    .route('/')
    .get(footerController.getFooter)
    .put(auth, validate(footerValidation.updateFooterValidation), footerController.updateFooter);

module.exports = router;
