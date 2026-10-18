const {User} = require('../model');
const crypto = require('crypto');

const generateOTP = ()=>{
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    return { otp, otpExpires}
}

const createUser = async (userData) => {
    const user = new User(userData);
    await user.save();
    return user;
}

const getUserByEmail = async (email) => {
    return await User.findOne({email:email.toLowerCase()});
}

const getUserById = async (id) => {
    return await User.findById(id);
}

const updateUser = async (id, updateData) => {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
}

const getUserForOTPVerification = async (email) => {
    return await User.findOne({ email }).select('+otp +otpExpires');
}

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    updateUser,
    generateOTP,
    getUserForOTPVerification
}