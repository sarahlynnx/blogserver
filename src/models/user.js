const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['author', 'user'], default: 'user' },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    resetPasswordToken: String,
    resetPasswordExpires: Date, 
});

module.exports = mongoose.model('User', userSchema);