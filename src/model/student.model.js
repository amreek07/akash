const mongoose = require('mongoose');

const semesterFeeSchema = new mongoose.Schema(
    {
        semester: {
            type: Number,
            required: true,
            min: 1,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        paidAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
        currency: {
            type: String,
            default: 'INR',
            trim: true,
        },
        dueDate: {
            type: Date,
        },
        paidDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['pending', 'partial', 'paid'],
            default: 'pending',
        },
    },
    { _id: true },
);

const studentSchema = new mongoose.Schema(
    {
        uuid: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            match: [/^\d{10}$/, 'Student id must be exactly 10 digits'],
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        fatherName: {
            type: String,
            required: true,
            trim: true,
        },
        dob: {
            type: Date,
            required: true,
        },
        contact: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        reference: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Partner',
            default: null,
        },
        enrollmentDate: {
            type: Date,
            required: true,
        },
        courseCompletionDate: {
            type: Date,
            required: true,
        },
        semesterFees: {
            type: [semesterFeeSchema],
            default: [],
        },
    },
    { timestamps: true },
);

studentSchema.path('courseCompletionDate').validate(function (value) {
    if (!value || !this.enrollmentDate) return true;
    return value >= this.enrollmentDate;
}, 'Course completion date must be on or after the enrollment date');

studentSchema.path('semesterFees').validate(function (fees) {
    if (!fees || fees.length === 0) return true;
    const semesters = fees.map((fee) => fee.semester);
    return new Set(semesters).size === semesters.length;
}, 'Each semester fee must use a unique semester number');

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
