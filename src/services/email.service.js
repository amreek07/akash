const { transporter } = require("../config/nodeMailer");

const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transporter.sendMail(msg);
};

const sendOtp = async (to, otp) => {
  const subject = "Forget Password";

  const text = `Dear user,
Welcome to our application! Your One-Time Password (OTP) for account verification is provided below. Please use this OTP to complete your registration process.,
 OTP: ${otp}
If you did not create an account, then ignore this email.`;

  await sendEmail(to, subject, text);
};

module.exports = {
  sendEmail,
  sendOtp,
};
