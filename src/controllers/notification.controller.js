const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { notificationService } = require('../services');

function toNotification(item) {
    const data = typeof item.toObject === 'function' ? item.toObject() : item;
    return {
        id: String(data._id || data.id || ''),
        title: data.title || '',
        message: data.message || '',
        type: data.type || 'general',
        read: Boolean(data.isRead),
        responseId: data.response ? String(data.response) : '',
        createdAt: data.createdAt || null,
    };
}

const getAllNotifications = asyncHandler(async (req, res) => {
    const { search, page, limit, read } = req.query;
    const { notifications, pagination, counts } = await notificationService.getAllNotifications(
        req.user.id,
        { search, read },
        { page: Number(page) || 1, limit: Number(limit) || 50 },
    );
    res.status(200).json(
        new ApiResponse(
            200,
            { notifications: notifications.map(toNotification), pagination, counts },
            'Notifications fetched successfully',
        ),
    );
});

const getNotificationById = asyncHandler(async (req, res) => {
    const notification = await notificationService.getNotificationById(req.user.id, req.params.id);
    res.status(200).json(
        new ApiResponse(200, { notification: toNotification(notification) }, 'Notification fetched successfully'),
    );
});

const markAsRead = asyncHandler(async (req, res) => {
    const notification = await notificationService.markAsRead(req.user.id, req.params.id);
    res.status(200).json(
        new ApiResponse(200, { notification: toNotification(notification) }, 'Notification marked as read'),
    );
});

const markAllAsRead = asyncHandler(async (req, res) => {
    const result = await notificationService.markAllAsRead(req.user.id);
    res.status(200).json(new ApiResponse(200, result, 'All notifications marked as read'));
});

const deleteNotification = asyncHandler(async (req, res) => {
    await notificationService.deleteNotification(req.user.id, req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Notification deleted successfully'));
});

module.exports = {
    getAllNotifications,
    getNotificationById,
    markAsRead,
    markAllAsRead,
    deleteNotification,
};
