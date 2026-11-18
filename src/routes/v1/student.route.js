const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const { studentValidation } = require('../../validations');
const studentController = require('../../controllers/student.controller');

router
    .route('/')
    .get(auth, studentController.getAllStudents)
    .post(auth, validate(studentValidation.createStudentValidation), studentController.createStudent);

router
    .route('/:id')
    .get(auth, validate(studentValidation.studentIdValidation), studentController.getStudentById)
    .put(auth, validate(studentValidation.updateStudentValidation), studentController.updateStudent)
    .delete(auth, validate(studentValidation.studentIdValidation), studentController.deleteStudent);

module.exports = router;
