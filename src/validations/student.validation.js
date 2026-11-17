const Joi = require('joi');

const semesterFeeSchema = Joi.object().keys({
    semester: Joi.number().integer().min(1).required(),
    amount: Joi.number().min(0).required(),
    paidAmount: Joi.number().min(0).optional(),
    currency: Joi.string().trim().optional(),
    dueDate: Joi.date().optional().allow(null),
    paidDate: Joi.date().optional().allow(null),
    status: Joi.string().valid('pending', 'partial', 'paid').optional(),
});

const studentBody = {
    uuid: Joi.string().trim().pattern(/^\d{10}$/).required().messages({
        'string.pattern.base': 'Student id must be exactly 10 digits',
    }),
    name: Joi.string().trim().min(1).required(),
    fatherName: Joi.string().trim().min(1).required(),
    dob: Joi.date().max('now').required().messages({
        'date.max': 'Date of birth cannot be in the future',
    }),
    contact: Joi.string().trim().min(7).max(20).required(),
    email: Joi.string().trim().email().required(),
    course: Joi.string().trim().required(),
    reference: Joi.string().trim().allow(null, '').optional(),
    enrollmentDate: Joi.date().required(),
    courseCompletionDate: Joi.date().min(Joi.ref('enrollmentDate')).required().messages({
        'date.min': 'Course completion date must be on or after the enrollment date',
    }),
    semesterFees: Joi.array().items(semesterFeeSchema).unique('semester').optional().messages({
        'array.unique': 'Each semester fee must use a unique semester number',
    }),
};

const createStudentValidation = {
    body: Joi.object().keys(studentBody),
};

const updateStudentValidation = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
    body: Joi.object().keys(studentBody),
};

const studentIdValidation = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
};

module.exports = {
    createStudentValidation,
    updateStudentValidation,
    studentIdValidation,
};
