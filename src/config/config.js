const dotenv = require("dotenv");
const path = require("path");
const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

module.exports = {
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10),
  corsOrigin: process.env.CORS_ORIGIN,
  nodeEnv: process.env.NODE_ENV,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN̥,
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    from: process.env.EMAIL_FROM,
  },
};
