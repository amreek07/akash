const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth.middleware');
const admin = require('../../middlewares/admin.middleware');
const validate = require('../../middlewares/validate.middleware');
const { notificationValidation } = require('../../validations');
const notificationController = require('../../controllers/notification.controller');

router.use(auth, admin);

router.route('/').get(notificationController.getAllNotifications);

router.patch('/read-all', notificationController.markAllAsRead);

router.patch(
    '/:id/read',
    validate(notificationValidation.notificationIdValidation),
    notificationController.markAsRead,
);

router
    .route('/:id')
    .get(validate(notificationValidation.notificationIdValidation), notificationController.getNotificationById)
    .delete(validate(notificationValidation.notificationIdValidation), notificationController.deleteNotification);

module.exports = router;
