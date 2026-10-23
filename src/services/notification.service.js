const { Notification, User } = require('../model');
const ApiError = require('../utils/ApiError');
const { isValidObjectId } = require('mongoose');

function ownedQuery(userId, extra = {}) {
    return { user: userId, isDeleted: false, ...extra };
}

function copyForResponse(response) {
    const name = response.name || 'A student';
    const courseTitle =
        response.course && typeof response.course === 'object' ? response.course.title || '' : '';
    const type = ['registration', 'enquiry', 'general'].includes(response.responseType)
        ? response.responseType
        : 'general';

    if (type === 'registration') {
        return {
            title: 'New course registration',
            message: courseTitle ? `${name} registered for ${courseTitle}.` : `${name} submitted a course registration.`,
            type,
        };
    }
    if (type === 'enquiry') {
        return {
            title: 'Enquiry received',
            message: courseTitle ? `${name} asked about ${courseTitle}.` : `${name} submitted an enquiry.`,
            type,
        };
    }
    return {
        title: 'General message received',
        message: response.message ? `${name}: ${response.message}` : `${name} sent a general message.`,
        type: 'general',
    };
}

const createForResponse = async (response) => {
    const admins = await User.find({ role: 'admin' }).select('_id');
    if (!admins.length) return [];

    const copy = copyForResponse(response);
    const docs = admins.map((admin) => ({
        user: admin._id,
        title: copy.title,
        message: copy.message,
        type: copy.type,
        response: response._id,
    }));
    return Notification.insertMany(docs);
};

const getAllNotifications = async (userId, filter = {}, options = {}) => {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Number(options.limit) || 50);
    const skip = (page - 1) * limit;
    const query = ownedQuery(userId);

    if (filter.read === 'unread') query.isRead = false;
    if (filter.read === 'read') query.isRead = true;
    if (filter.search) {
        const regex = { $regex: filter.search, $options: 'i' };
        query.$or = [{ title: regex }, { message: regex }];
    }

    const notifications = await Notification.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Notification.countDocuments(query);
    const totalPages = Math.ceil(total / limit) || 1;
    const base = ownedQuery(userId);
    const [all, unread, read] = await Promise.all([
        Notification.countDocuments(base),
        Notification.countDocuments({ ...base, isRead: false }),
        Notification.countDocuments({ ...base, isRead: true }),
    ]);

    return {
        notifications,
        pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
        counts: { all, unread, read },
    };
};

const getNotificationById = async (userId, id) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid notification ID');
    }
    const notification = await Notification.findOne(ownedQuery(userId, { _id: id }));
    if (!notification) {
        throw new ApiError(404, 'Notification not found');
    }
    return notification;
};

const markAsRead = async (userId, id) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid notification ID');
    }
    const notification = await Notification.findOneAndUpdate(
        ownedQuery(userId, { _id: id }),
        { isRead: true },
        { new: true },
    );
    if (!notification) {
        throw new ApiError(404, 'Notification not found');
    }
    return notification;
};

const markAllAsRead = async (userId) => {
    const result = await Notification.updateMany(ownedQuery(userId, { isRead: false }), { isRead: true });
    return { updated: result.modifiedCount || 0 };
};

const deleteNotification = async (userId, id) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid notification ID');
    }
    const notification = await Notification.findOneAndUpdate(
        ownedQuery(userId, { _id: id }),
        { isDeleted: true, deletedAt: new Date() },
        { new: true },
    );
    if (!notification) {
        throw new ApiError(404, 'Notification not found');
    }
    return notification;
};

module.exports = {
    createForResponse,
    getAllNotifications,
    getNotificationById,
    markAsRead,
    markAllAsRead,
    deleteNotification,
};
