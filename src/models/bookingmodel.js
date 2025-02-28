const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    trainId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Train",
        required: true
    },
    sourceStationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Station",
        required: true
    },
    destinationStationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Station",
        required: true
    },
    passengerName: {
        type: String,
        required: true
    },
    coachId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coach",
        required: true
    },
    status: {
        type: String,
        enum: ["Confirmed", "Cancelled", "Pending"],
        required: true,
        default:'Pending'
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    journeyDate: {
        type: Date,
        required: true
    },
    totalFare: {
        type: Number, // Change from string to number
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["Paid", "Unpaid"],
        default: "Unpaid"
    },
    trainName:{
        type:String,
        require:true
    },
    From:{
        type:String,
        require:true
    },
    to:{
        type:String,
        require:true
    },
    seatNo:{
        type: Number, // Change from string to number
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
