const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    mobile: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/, // Validates 10-digit numbers
    },
    BookingHistory:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true
    }],
    userRole:{
        type: String,
        enum: ["User", "Admin"],
        required: true,
        default: 'User'
    }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
