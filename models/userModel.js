const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: 2,
        trim: true
    },
    lastName: {
        type: String,
        minlength: 2,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        minlength: 6,
        trim: true
    },
    confirmPassword: {
        type: String,
        minlength: 6,
        trim: true
    },
    role: {
        type: String,
        enum: ['student', 'mentor', 'admin'],
        default: 'student',
        lowercase: true,
        trim: true
    },
    image: {
        type: String,
    },

}, {
    timestamps: true,
});


// password hashing before save 
userSchema.pre('save', async function (next) {

    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.confirmPassword = undefined;
    next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;