const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");
const { responseValidation } = require("../../validations");
const responseController = require("../../controllers/response.controller");

router
  .route("/")
  .post(
    auth,
    validate(responseValidation.createResponseValidation),
    responseController.createResponse
  )
  .get(auth, responseController.getAllResponses);

router
  .route("/:id")
  .get(
    auth,
    validate(responseValidation.responseIdValidation),
    responseController.getResponseById
  )
  .delete(
    auth,
    validate(responseValidation.responseIdValidation),
    responseController.deleteResponse
  )
  .put(
    auth,
    validate(responseValidation.updateResponseValidation),
    responseController.updateResponse
  );

module.exports = router;
