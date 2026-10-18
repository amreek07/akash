const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        value: {
            type: Number,
            required: true,
            min: 1,
        },
        unit: {
            type: String,
            enum: ['days', 'months', 'years'],
            default: 'months',
        },
    },
    fees: {
        price: {
            type: Number,
        },
        offerPrice: {
            type: Number,
        },
        currency: {
            type: String,
            default: 'INR',
        }
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    eligibility: {
        type: String,
        required: true,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isParentActive: {
        type: Boolean,
        default: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;