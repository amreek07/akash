const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { courseService } = require("../services");

const createCourse = asyncHandler(async (req, res) => {
    const course = await courseService.createCourse(req.body);
    res.status(200).json(new ApiResponse(200, course, "Course created successfully"));
});

const getAllCourses = asyncHandler(async (req, res) => {
    const { courses, pagination } = await courseService.getAllCourses(req.query, req.options);
    res.status(200).json(new ApiResponse(200, { courses, pagination }, "Courses fetched successfully"));
});

const getCourseById = asyncHandler(async (req, res) => {
    const course = await courseService.getCourseById(req.params.id);
    res.status(200).json(new ApiResponse(200, course, "Course fetched successfully"));
});

const updateCourse = asyncHandler(async (req, res) => {
    const course = await courseService.updateCourse(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, course, "Course updated successfully"));
});

const deleteCourse = asyncHandler(async (req, res) => {
    await courseService.deleteCourse(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "Course deleted successfully"));
});

const courseStatusToggle = asyncHandler(async (req, res) => {
    const course = await courseService.courseStatusToggle(req.params.id);
    res.status(200).json(new ApiResponse(200, course, "Course status toggled successfully"));
});

const toggleFeatured = asyncHandler(async (req, res) => {
    const course = await courseService.toggleFeatured(req.params.id);
    res.status(200).json(new ApiResponse(200, course, "Course toggled successfully"));
});

const togglePublished = asyncHandler(async (req, res) => {
    const course = await courseService.togglePublished(req.params.id);
    res.status(200).json(new ApiResponse(200, course, "Course toggled successfully"));
});

const featuredCourses = asyncHandler(async (req, res) => {
    const courses = await courseService.getFeaturedCourses();
    res.status(200).json(new ApiResponse(200, courses, "Featured courses fetched successfully"));
});


module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    toggleFeatured,
    togglePublished,
    featuredCourses,
    courseStatusToggle,
};