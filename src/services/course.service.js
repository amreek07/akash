const { Course, Category } = require('../model');
const ApiError = require('../utils/ApiError');
const { isValidObjectId } = require('mongoose');

const populateCategory = { path: 'category', select: 'name isActive' };

async function attachParentStatus(courseData) {
    if (!courseData.category) return courseData;
    if (!isValidObjectId(courseData.category)) {
        throw new ApiError(400, "Invalid category ID");
    }
    const category = await Category.findById(courseData.category);
    if (!category) {
        throw new ApiError(400, "Category not found");
    }
    return {
        ...courseData,
        isParentActive: category.isActive,
    };
}

const createCourse = async (courseData) => {
    const payload = await attachParentStatus(courseData);
    const existingCourse = await Course.findOne({ title: payload.title });
    if (existingCourse) {
        throw new ApiError(400, "Course already exists");
    }
    const newCourse = await Course.create(payload);
    if (!newCourse) {
        throw new ApiError(400, "Failed to create course");
    }
    return Course.findById(newCourse._id).populate(populateCategory);
}

const getAllCourses = async (filter ={}, options ={}) => {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Number(options.limit) || 50);
    const skip = (page - 1) * limit;
    const query = filter.search ? { title: { $regex: filter.search, $options: 'i' } } : {};
    const courses = await Course.find(query).populate(populateCategory).skip(skip).limit(limit).sort({ createdAt: -1 });
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
    const course = await Course.findById(id).populate(populateCategory);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }
    return course;
}

const updateCourse = async (id, courseData) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid course ID");
    }
    const payload = await attachParentStatus(courseData);
    if (payload.title) {
        const existingCourse = await Course.findOne({ title: payload.title, _id: { $ne: id } });
        if (existingCourse) {
            throw new ApiError(400, "Course already exists");
        }
    }
    const course = await Course.findByIdAndUpdate(id, payload, { new: true }).populate(populateCategory);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }
    return course;
}

const deleteCourse = async (id) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid course ID");
    }
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }
    return true;
}

async function requireCourse(id) {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid course ID");
    }
    const course = await Course.findById(id);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }
    return course;
}

const courseStatusToggle = async (id) => {
    const course = await requireCourse(id);
    course.isActive = !course.isActive;
    await course.save();
    return Course.findById(course._id).populate(populateCategory);
}

const getFeaturedCourses = async () => {
    const courses = await Course.find({ isFeatured: true }).populate(populateCategory).sort({ createdAt: -1 });
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
    const course = await requireCourse(courseId);
    course.isFeatured = !course.isFeatured;
    await course.save();
    return Course.findById(course._id).populate(populateCategory);
}

const togglePublished = async (courseId) => {
    const course = await requireCourse(courseId);
    course.isPublished = !course.isPublished;
    await course.save();
    return Course.findById(course._id).populate(populateCategory);
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
