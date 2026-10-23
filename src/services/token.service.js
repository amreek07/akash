const jwt = require("jsonwebtoken");
const config = require("../config/config");
const ApiError = require("../utils/ApiError");

const generateAccessToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

const generateRefreshToken = (user) => {
  const payload = {
    id: user._id,
  };
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

const decodeRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.jwt.refreshSecret);
    if (!decoded) {
      throw new ApiError(401, "Invalid refresh token");
    }
    return decoded;
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
};


module.exports = {
    decodeRefreshToken,
    generateAccessToken,
    generateRefreshToken
}
