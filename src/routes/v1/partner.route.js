const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const { partnerValidation } = require('../../validations');
const partnerController = require('../../controllers/partner.controller');

router
    .route('/')
    .get(auth, partnerController.getAllPartners)
    .post(auth, validate(partnerValidation.createPartnerValidation), partnerController.createPartner);

router
    .route('/:id')
    .get(auth, validate(partnerValidation.partnerIdValidation), partnerController.getPartnerById)
    .put(auth, validate(partnerValidation.updatePartnerValidation), partnerController.updatePartner)
    .delete(auth, validate(partnerValidation.partnerIdValidation), partnerController.deletePartner);

module.exports = router;
