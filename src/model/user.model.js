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
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true});

userSchema.index({ email: 1 }, { unique: true });

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, config.bcryptSaltRounds);
    next();
});

userSchema.methods.isPasswordMatch = async function(password){
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;