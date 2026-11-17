const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const { studentService } = require('../services');

function toCourse(course) {
    if (!course) return null;
    if (typeof course === 'object') {
        return {
            id: String(course._id || course.id || ''),
            title: course.title || '',
        };
    }
    return { id: String(course), title: '' };
}

function toReference(reference) {
    if (!reference) return null;
    if (typeof reference === 'object') {
        return {
            id: String(reference._id || reference.id || ''),
            partnerId: reference.partnerId || '',
            name: reference.name || '',
        };
    }
    return { id: String(reference), partnerId: '', name: '' };
}

function toSemesterFee(fee) {
    return {
        id: String(fee._id || fee.id || ''),
        semester: fee.semester,
        amount: fee.amount,
        paidAmount: fee.paidAmount ?? 0,
        currency: fee.currency || 'INR',
        dueDate: fee.dueDate || null,
        paidDate: fee.paidDate || null,
        status: fee.status || 'pending',
    };
}

function toStudent(student) {
    const data = typeof student.toObject === 'function' ? student.toObject() : student;
    return {
        id: String(data._id || data.id || ''),
        uuid: data.uuid || '',
        name: data.name || '',
        fatherName: data.fatherName || '',
        dob: data.dob || null,
        contact: data.contact || '',
        email: data.email || '',
        course: toCourse(data.course),
        reference: toReference(data.reference),
        enrollmentDate: data.enrollmentDate || null,
        courseCompletionDate: data.courseCompletionDate || null,
        semesterFees: Array.isArray(data.semesterFees) ? data.semesterFees.map(toSemesterFee) : [],
        createdAt: data.createdAt || null,
        updatedAt: data.updatedAt || null,
    };
}

const createStudent = asyncHandler(async (req, res) => {
    const student = await studentService.createStudent(req.body);
    res.status(201).json(new ApiResponse(201, { student: toStudent(student) }, 'Student created successfully'));
});

const getAllStudents = asyncHandler(async (req, res) => {
    const { search, page, limit, course, reference } = req.query;
    const { students, pagination } = await studentService.getAllStudents(
        { search, course, reference },
        { page: Number(page) || 1, limit: Number(limit) || 50 },
    );
    res.status(200).json(
        new ApiResponse(
            200,
            { students: students.map(toStudent), pagination },
            'Students fetched successfully',
        ),
    );
});

const getStudentById = asyncHandler(async (req, res) => {
    const student = await studentService.getStudentById(req.params.id);
    res.status(200).json(new ApiResponse(200, { student: toStudent(student) }, 'Student fetched successfully'));
});

const updateStudent = asyncHandler(async (req, res) => {
    const student = await studentService.updateStudent(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, { student: toStudent(student) }, 'Student updated successfully'));
});

const deleteStudent = asyncHandler(async (req, res) => {
    await studentService.deleteStudent(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Student deleted successfully'));
});

module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
};
