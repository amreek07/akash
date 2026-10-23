const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/config');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    }, 
    email:{
        type: String, 
        unique: true,
        required: true,
    },
    countryCode: {
        type: String,
    },
    phone: {
        type: String,
    },
    avatar: {
        type: String,
        default: '',
    },
    password: {
        type: String,
        required: true,
        select: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    otp: {
        type: String,
        select: false,
    },
    otpExpires: {
        type: Date,
        select: false,
    },
    refreshToken: {
        type: String,
        select: false,
    }

}, { timestamps: true});

userSchema.pre('save', async function(){
    if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, config.bcryptSaltRounds);
});

userSchema.methods.isPasswordMatch = async function(password){
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;