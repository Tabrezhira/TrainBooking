const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
    trainNumber: {
        type: String,
        required: true,
        unique: true,
    },
    trainName: {
        type: String,
        required: true,
    },
    coach:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coach",
        required: true
    }],
    source: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Station",
        required: true,
    },
    destination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Station",
        required: true,
    },
    departureTime: {
        type: String, // Store time as "HH:mm"
        required: true,
    },
    arrivalTime: {
        type: String, // Store time as "HH:mm"
        required: true,
    },
    totalSeats: {
        type: Number, // Change to number
        required: true,
    },

    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }


}, { timestamps: true });

module.exports = mongoose.model('Train', trainSchema);
