const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const { uploadGalleryImage } = require('../../middlewares/upload.middleware');
const { galleryValidation } = require('../../validations');
const galleryController = require('../../controllers/gallery.controller');

router
    .route('/')
    .get(galleryController.getAllGallery)
    .post(auth, uploadGalleryImage, validate(galleryValidation.createGalleryValidation), galleryController.createGallery);

router
    .route('/:id')
    .get(galleryController.getGalleryById)
    .put(auth, uploadGalleryImage, validate(galleryValidation.updateGalleryValidation), galleryController.updateGallery)
    .delete(auth, validate(galleryValidation.galleryIdValidation), galleryController.deleteGallery);

module.exports = router;
