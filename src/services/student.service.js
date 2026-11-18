const { Student, Course, Partner } = require('../model');
const ApiError = require('../utils/ApiError');
const { isValidObjectId } = require('mongoose');

const populateStudent = [
    { path: 'course', select: 'title duration fees isActive' },
    { path: 'reference', select: 'partnerId name email phone city status' },
];

function feeStatus(amount, paidAmount) {
    if (paidAmount <= 0) return 'pending';
    if (paidAmount >= amount) return 'paid';
    return 'partial';
}

function normalizeSemesterFees(fees) {
    if (!Array.isArray(fees)) return [];
    const seen = new Set();
    return fees.map((fee) => {
        const semester = Number(fee.semester);
        if (seen.has(semester)) {
            throw new ApiError(400, 'Each semester fee must use a unique semester number');
        }
        seen.add(semester);

        const amount = Number(fee.amount);
        const paidAmount = fee.paidAmount == null || fee.paidAmount === '' ? 0 : Number(fee.paidAmount);
        const entry = {
            semester,
            amount,
            paidAmount,
            currency: String(fee.currency || 'INR').trim() || 'INR',
            status: feeStatus(amount, paidAmount),
        };
        if (fee.dueDate) entry.dueDate = new Date(fee.dueDate);
        if (fee.paidDate) entry.paidDate = new Date(fee.paidDate);
        return entry;
    });
}

function normalizeStudent(payload, { includeFees }) {
    const enrollmentDate = new Date(payload.enrollmentDate);
    const courseCompletionDate = new Date(payload.courseCompletionDate);
    if (courseCompletionDate < enrollmentDate) {
        throw new ApiError(400, 'Course completion date must be on or after the enrollment date');
    }

    const student = {
        uuid: String(payload.uuid || '').trim(),
        name: String(payload.name || '').trim(),
        fatherName: String(payload.fatherName || '').trim(),
        dob: new Date(payload.dob),
        contact: String(payload.contact || '').trim(),
        email: String(payload.email || '').trim().toLowerCase(),
        course: payload.course,
        reference: payload.reference ? payload.reference : null,
        enrollmentDate,
        courseCompletionDate,
    };

    if (includeFees) {
        student.semesterFees = normalizeSemesterFees(payload.semesterFees);
    }

    return student;
}

async function assertCourse(id) {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid course ID');
    }
    const course = await Course.findById(id).select('_id');
    if (!course) {
        throw new ApiError(400, 'Course not found');
    }
}

async function assertReference(id) {
    if (!id) return null;
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid partner reference');
    }
    const partner = await Partner.findById(id).select('_id');
    if (!partner) {
        throw new ApiError(400, 'Reference partner not found');
    }
    return partner._id;
}

async function assertUniqueStudent({ uuid, email, excludeId }) {
    const identityQuery = excludeId ? { _id: { $ne: excludeId } } : {};
    const [existingUuid, existingEmail] = await Promise.all([
        Student.findOne({ ...identityQuery, uuid }),
        Student.findOne({ ...identityQuery, email }),
    ]);
    if (existingUuid) {
        throw new ApiError(400, 'A student with this id already exists');
    }
    if (existingEmail) {
        throw new ApiError(400, 'A student with this email already exists');
    }
}

function rethrowStudentError(error) {
    if (error instanceof ApiError) throw error;
    if (error?.code === 11000) {
        const field = Object.keys(error.keyPattern || {})[0];
        if (field === 'email') throw new ApiError(400, 'A student with this email already exists');
        if (field === 'uuid') throw new ApiError(400, 'A student with this id already exists');
        throw new ApiError(400, 'Student already exists');
    }
    if (error?.name === 'ValidationError') {
        const message = Object.values(error.errors || {})
            .map((item) => item.message)
            .join(', ');
        throw new ApiError(400, message || 'Invalid student details');
    }
    throw error;
}

const createStudent = async (payload) => {
    const studentData = normalizeStudent(payload, { includeFees: true });
    await assertCourse(studentData.course);
    studentData.reference = await assertReference(studentData.reference);
    await assertUniqueStudent(studentData);

    try {
        const student = await Student.create(studentData);
        return Student.findById(student._id).populate(populateStudent);
    } catch (error) {
        rethrowStudentError(error);
    }
};

const getAllStudents = async (filter = {}, options = {}) => {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Number(options.limit) || 50);
    const skip = (page - 1) * limit;
    const query = {};

    if (filter.course) {
        if (!isValidObjectId(filter.course)) {
            throw new ApiError(400, 'Invalid course ID');
        }
        query.course = filter.course;
    }
    if (filter.reference) {
        if (!isValidObjectId(filter.reference)) {
            throw new ApiError(400, 'Invalid partner reference');
        }
        query.reference = filter.reference;
    }
    if (filter.search) {
        const regex = { $regex: filter.search, $options: 'i' };
        query.$or = [
            { name: regex },
            { fatherName: regex },
            { email: regex },
            { contact: regex },
            { uuid: regex },
        ];
    }

    const [students, total] = await Promise.all([
        Student.find(query).populate(populateStudent).skip(skip).limit(limit).sort({ createdAt: -1 }),
        Student.countDocuments(query),
    ]);
    const totalPages = Math.ceil(total / limit) || 1;

    return {
        students,
        pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    };
};

const getStudentById = async (id) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid student ID');
    }
    const student = await Student.findById(id).populate(populateStudent);
    if (!student) {
        throw new ApiError(404, 'Student not found');
    }
    return student;
};

const updateStudent = async (id, payload) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid student ID');
    }

    const existing = await Student.findById(id);
    if (!existing) {
        throw new ApiError(404, 'Student not found');
    }

    const studentData = normalizeStudent(payload, {
        includeFees: payload.semesterFees !== undefined,
    });
    await assertCourse(studentData.course);
    studentData.reference = await assertReference(studentData.reference);
    await assertUniqueStudent({ ...studentData, excludeId: id });

    if (payload.semesterFees === undefined) {
        delete studentData.semesterFees;
    }

    try {
        const student = await Student.findByIdAndUpdate(id, studentData, {
            new: true,
            runValidators: true,
        }).populate(populateStudent);
        if (!student) {
            throw new ApiError(404, 'Student not found');
        }
        return student;
    } catch (error) {
        rethrowStudentError(error);
    }
};

const deleteStudent = async (id) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, 'Invalid student ID');
    }
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
        throw new ApiError(404, 'Student not found');
    }
    return student;
};

module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
};
