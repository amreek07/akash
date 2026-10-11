const User = require('../model');

const createUser = async (userData) => {
    const user = new User(userData);
    await user.save();
    return user;
}

const getUserByEmail = async (email) => {
    return await User.findOne({email});
}

const getUserById = async (id) => {
    return await User.findById(id);
}

const updateUser = async (id, updateData) => {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
}

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    updateUser
}