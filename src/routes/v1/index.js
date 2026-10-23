const express = require('express');
const authRoutes = require('./auth.route');
const categoryRoutes = require('./category.route');
const courseRoutes = require('./course.route');
const responseRoutes = require('./response.route');
const footerRoutes = require('./footer.route');
const galleryRoutes = require('./gallery.route');
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/category', categoryRoutes);
router.use('/course', courseRoutes);
router.use('/response', responseRoutes);
router.use('/footer', footerRoutes);
router.use('/gallery', galleryRoutes);

module.exports = router;