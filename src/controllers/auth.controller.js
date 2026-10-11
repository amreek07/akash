const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { userService } = require("../services");

const register = asyncHandler(async (req, res) => {
  const existingUser = await userService.getUserByEmail(req.body.email);
  if (existingUser) {
    throw new ApiError(400, "Email address already registered");
  }

  const user = await userService.createUser(req.body);
  res
    .status(200)
    .json(new ApiResponse(201, {}, "User registered successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.getUserByEmail(email);

  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(401, "Invalid email or password");
  }
});
