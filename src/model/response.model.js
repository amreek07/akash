const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: false,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
    referenceId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partner',
        required: false,
    },
    responseType: {
        type: String,
        enum: ['enquiry', 'registration', 'general'],
        default: 'general',
    },
    isResponded: {
        type: Boolean,
        default: false,
    },
    responseMessage: {
        type: String,
    }
},{ timestamps: true });

const Response = mongoose.model('Response', responseSchema);

module.exports = Response;