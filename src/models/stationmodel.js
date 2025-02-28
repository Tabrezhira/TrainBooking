const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    stationName: {
        type: String,
        required: true,
        unique: true,
    },
    stationCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    location: {
        type: String,
        required: true,
    },
    train_ids: [{  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Train',
        default:null,
        required: true
    }],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Station', stationSchema);
