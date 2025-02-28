const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
    train_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Train',
        required: true,
    },
    coachType: {
        type: String,
        enum: ["Sleeper", "AC", "General"],
        required: true,
        
    },
    numberOfSeat: {
        type: Number,
        required: true,
    },
    currentBooking:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        require:true,
        default:null
    }],
    currentWaiting:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        require:true,
        default:null
    }],
    cancelBooking:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        require:true,
        default:null
    }],
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["Available","Waiting"],
        default: "Available"
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Coach', coachSchema);
