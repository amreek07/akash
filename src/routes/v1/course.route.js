const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const { courseValidation } = require("../../validations");
const courseController = require("../../controllers/course.controller");


router.route("/")
    .post(auth, validate(courseValidation.createCourseValidation), courseController.createCourse)
    .get(auth, courseController.getAllCourses);

router.route("/featured")
    .get(auth, courseController.featuredCourses);

router.route("/featured/:id")
    .patch(auth, validate(courseValidation.courseIdValidation), courseController.toggleFeatured);

router.route("/published/:id")
    .patch(auth, validate(courseValidation.courseIdValidation), courseController.togglePublished);

router.route("/:id")
    .get(auth, validate(courseValidation.courseIdValidation), courseController.getCourseById)
    .put(auth, validate(courseValidation.updateCourseValidation), courseController.updateCourse)
    .delete(auth, validate(courseValidation.courseIdValidation), courseController.deleteCourse)
    .patch(auth, validate(courseValidation.courseIdValidation), courseController.courseStatusToggle);

module.exports = router;