const { Course } = require('../model');
const ApiError = require('../utils/ApiError');
const { isValidObjectId } = require('mongoose');

const createCourse = async (courseData) => {
    const existingCourse = await Course.findOne({ title: courseData.title });
    if (existingCourse) {
        throw new ApiError(400, "Course already exists");
    }
    const newCourse = await Course.create(courseData);
    if (!newCourse) {
        throw new ApiError(400, "Failed to create course");
    }
    return newCourse;
}

const getAllCourses = async (filter ={}, options ={}) => {
    const { limit = 10, page = 1 } = options;
    const skip = (page - 1) * limit;
    const query = filter.search ? { title: { $regex: filter.search, $options: 'i' } } : {};
    const courses = await Course.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Course.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const pagination = {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    }
    return { courses, pagination };
}

const getCourseById = async (id) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid course ID");
    }
    const course = await Course.findById(id);
    return course;
}

const updateCourse = async (id, courseData) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid course ID");
    }
    const existingCourse = await Course.findOne({ title: courseData.title, _id: { $ne: id } });
    if (existingCourse) {
        throw new ApiError(400, "Course already exists");
    }
    const course = await Course.findByIdAndUpdate(id, courseData, { new: true });
    return course;
}

const deleteCourse = async (id) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid course ID");
    }
    await Course.findByIdAndDelete(id);
    return true;
}

const courseStatusToggle = async (id) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid course ID");
    }
    const course = await Course.findById(id);
    course.isActive = !course.isActive;
    await course.save();
    return course;
}

const getFeaturedCourses = async () => {
    const courses = await Course.find({ isFeatured: true }).sort({ createdAt: -1 });
    return courses;
}

const toggleParent = async (categoryId, status) => {
    if (!isValidObjectId(categoryId)) {
        throw new ApiError(400, "Invalid category ID");
    }
    await Course.updateMany({ category: categoryId }, { isParentActive: status });
    return true;
}

const toggleFeatured = async (courseId) =>{
    if (!isValidObjectId(courseId)) {
        throw new ApiError(400, "Invalid course ID");
    }
    const course = await Course.findById(courseId);
    course.isFeatured = !course.isFeatured;
    await course.save();
    return course;
}

const togglePublished = async (courseId) => {
    if (!isValidObjectId(courseId)) {
        throw new ApiError(400, "Invalid course ID");
    }
    const course = await Course.findById(courseId);
    course.isPublished = !course.isPublished;
    await course.save();
    return course;
}

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    courseStatusToggle,
    getFeaturedCourses,
    toggleParent,
    toggleFeatured,
    togglePublished,
}