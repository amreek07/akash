const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/category.controller");
const auth = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const { categoryValidation } = require("../../validations");

router
  .route("/")
  .post(
    auth,
    validate(categoryValidation.createCategoryValidation),
    categoryController.createCategory
  )
  .get(auth, categoryController.getAllCategories);

router
  .route("/:id")
  .get(auth, validate(categoryValidation.categoryIdValidation), categoryController.getCategoryById)
  .put(
    auth,
    validate(categoryValidation.updateCategoryValidation),
    categoryController.updateCategory
  )
  .delete(auth, validate(categoryValidation.categoryIdValidation), categoryController.deleteCategory)
  .patch(auth, validate(categoryValidation.categoryIdValidation), categoryController.categoryStatusToggle);

module.exports = router;
