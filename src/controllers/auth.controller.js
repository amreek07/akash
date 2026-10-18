const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse")
const { userService, emailService, tokenService } = require("../services");

const register = asyncHandler(async (req, res) => {
  const existingUser = await userService.getUserByEmail(req.body.email);
  if (existingUser) {
    throw new ApiError(400, "Email address already registered");
  }

  const user = await userService.createUser(req.body);
  res
    .status(200)
    .json(new ApiResponse(201, {user}, "User registered successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.getUserByEmail(email);

  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const { otp, otpExpires } = userService.generateOTP();
  await userService.updateUser(user._id, { otp, otpExpires });
  await emailService.sendOtp(user.email, otp);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { email: user.email },
        "OTP sent to email successfully"
      )
    );
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await userService.getUserForOTPVerification(email);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user.otp !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }
  if (Date.now() > user.otpExpires) {
    throw new ApiError(400, "OTP has expired");
  }

  const accessToken = tokenService.generateAccessToken(user);
  const refreshToken = tokenService.generateRefreshToken(user);
  await userService.updateUser(user._id, {
    otp: null,
    otpExpires: null,
    refreshToken: refreshToken,
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user, token: { accessToken, refreshToken } },
        "OTP verified successfully"
      )
    );
});

const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const { otp, otpExpires } = userService.generateOTP();
  await userService.updateUser(user._id, { otp, otpExpires });
  await emailService.sendOtp(user.email, otp);

  res
    .status(200)
    .json(
      new ApiResponse(200, { email: user.email }, "OTP resent successfully")
    );
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const { otp, otpExpires } = userService.generateOTP();
  await userService.updateUser(user._id, { otp, otpExpires });
  await emailService.sendOtp(user.email, otp);

  res
    .status(200)
    .json(
      new ApiResponse(200, { email: user.email }, "OTP sent to email successfully")
    );
});

const verifyForgotPasswordOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await userService.getUserForOTPVerification(email);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user.otp !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }
  if (Date.now() > user.otpExpires) {
    throw new ApiError(400, "OTP has expired");
  }
  await userService.updateUser(user._id, { otp: null, otpExpires: null });
  res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP verified successfully"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if ((await user.isPasswordMatch(newPassword))) {
    throw new ApiError(400, "New password cannot be the same as the old password");
  }
  await userService.updateUser(user._id, { password: newPassword });
  res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (!(await user.isPasswordMatch(oldPassword))) {
    throw new ApiError(400, "Invalid old password");
  }
  await userService.updateUser(user._id, { password: newPassword });
  res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully")); 
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies || req.body;
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token not provided");
  }

  const decoded = tokenService.decodeRefreshToken(refreshToken);
  const user = await userService.getUserById(decoded.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const newAccessToken = tokenService.generateAccessToken(user);
  res
    .status(200)
    .cookie("accessToken", newAccessToken, { httpOnly: true, secure: true })
    .json(
      new ApiResponse(
        200,
        { accessToken: newAccessToken },
        "Access token refreshed successfully"
      )
    );
});

const me = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  res
    .status(200)
    .json(new ApiResponse(200, { user }, "User details fetched successfully"));
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies || req.body;
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token not provided");
  }

  const decoded = tokenService.decodeRefreshToken(refreshToken);
  const user = await userService.getUserById(decoded.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await userService.updateUser(user._id, { refreshToken: null });
  res
    .status(200)
    .clearCookie("refreshToken")
    .clearCookie("accessToken")
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

module.exports = {
  register,
  login,
  verifyOTP,
  resendOTP,
  refreshToken,
  logout,
  forgotPassword,
  verifyForgotPasswordOTP,
  resetPassword,
  changePassword,
  me
};
