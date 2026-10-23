const mongoose = require('mongoose');

const quickLinkSchema = new mongoose.Schema(
    {
        label: { type: String, required: true, trim: true },
        href: { type: String, default: '', trim: true },
    },
    { _id: true },
);

const popularCourseSchema = new mongoose.Schema(
    {
        label: { type: String, required: true, trim: true },
        href: { type: String, default: '', trim: true },
    },
    { _id: true },
);

const footerSchema = new mongoose.Schema(
    {
        instituteName: {
            type: String,
            required: true,
            trim: true,
        },
        tagline: {
            type: String,
            required: true,
            trim: true,
        },
        quickLinks: {
            type: [quickLinkSchema],
            default: [],
        },
        popularCourses: {
            type: [popularCourseSchema],
            default: [],
        },
        address: {
            type: String,
            default: '',
            trim: true,
        },
        phone: {
            type: String,
            default: '',
            trim: true,
        },
        email: {
            type: String,
            default: '',
            trim: true,
        },
        facebook: {
            type: String,
            default: '',
            trim: true,
        },
        instagram: {
            type: String,
            default: '',
            trim: true,
        },
        youtube: {
            type: String,
            default: '',
            trim: true,
        },
        copyright: {
            type: String,
            default: '',
            trim: true,
        },
    },
    { timestamps: true },
);

const Footer = mongoose.model('Footer', footerSchema);

module.exports = Footer;
