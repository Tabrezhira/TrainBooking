const Train = require("../models/trainmodel");
const User = require("../models/usermodel");
const Station  = require('../models/stationmodel')
const Coach = require('../models/coachmodel')
// ✅ Add a Train
const addTrain = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fromId, toId } = req.params;
        const {  trainName, departureTime, arrivalTime } = req.body;

        if ( !trainName || !departureTime || !arrivalTime ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findById(userId);
        if (!user || user.userRole !== "Admin") {
            return res.status(403).json({ message: "Unauthorized Access" });
        }

        const fromStation = await Station.findById(fromId)
        const toStation = await Station.findById(toId)

        if (  !fromStation || !toStation) {
            return res.status(400).json({ message: "All station is not there" });
        }
        const prefix = trainName.slice(0, 3).toUpperCase(); // Take first 3 letters
        const randomNum = Math.floor(100 + Math.random() * 900); // 3-digit random number

        const trainNumber = prefix + randomNum;

        const newTrain = new Train({
            trainNumber, trainName, source: fromId, destination: toId,
            departureTime, arrivalTime, currentBooking: 0, currentWaiting: 0, createdBy: userId
        });

        await newTrain.save();

        fromStation.train_ids.push(newTrain._id)
        toStation.train_ids.push(newTrain._id)
        await fromStation.save();
        await  toStation.save();

        res.status(201).json({ message: "Train added successfully", train: newTrain });

    } catch (error) {
        console.error("Error in addTrain:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ Update Train
const updateTrain = async (req, res) => {
    try {
        const userId = req.user._id;
        const { Id } = req.params;
        const updates = req.body;

        const user = await User.findById(userId);
        if (!user || user.userRole !== "Admin") {
            return res.status(403).json({ message: "Unauthorized Access" });
        }

        const updatedTrain = await Train.findByIdAndUpdate(Id, updates, { new: true });
        if (!updatedTrain) return res.status(404).json({ message: "Train not found" });

        res.status(200).json({ message: "Train updated successfully", train: updatedTrain });

    } catch (error) {
        console.error("Error in updateTrain:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ Get All Trains
const getAllTrains = async (req, res) => {
    try {
        const trains = await Train.find();
        res.status(200).json({ trains });

    } catch (error) {
        console.error("Error in getAllTrains:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// ✅ Delete Train
const deleteTrain = async (req, res) => {
    try {
        const userId = req.user._id;
        const { Id } = req.params;

        // ✅ Check if user exists and is an Admin
        const user = await User.findById(userId);
        if (!user || user.userRole !== "Admin") {
            return res.status(403).json({ message: "Unauthorized Access" });
        }

        // ✅ Find the train
        const train = await Train.findById(Id);
        if (!train) {
            return res.status(404).json({ message: "Train not found" });
        }

        // ✅ Remove the train from source and destination stations
        await Station.updateMany(
            { train_ids: Id },
            { $pull: { train_ids: Id } }
        );

        // ✅ Delete the train
        await Train.findByIdAndDelete(Id);

        res.status(200).json({ message: "Train deleted successfully" });

    } catch (error) {
        console.error("Error in deleteTrain:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


// ✅ Get Train Details
const getTrainDetails = async (req, res) => {
    try {
        const { trainId } = req.query;
        if (!trainId) return res.status(400).json({ message: "Train ID is required" });

        const train = await Train.findById(trainId);
        if (!train) return res.status(404).json({ message: "Train not found" });

        res.status(200).json({ train });

    } catch (error) {
        console.error("Error in getTrainDetails:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = { addTrain, updateTrain, getAllTrains, deleteTrain, getTrainDetails };
