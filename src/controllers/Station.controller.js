const Station = require('../models/stationmodel')
const Train = require('../models/trainmodel')
const User = require('../models/usermodel')


const addStation = async(req , res) => {
    try {
        const userId = req.user._id;
        const{stationName,location} = req.body
        if(!stationName || !location){
            return res.status(400).json({ message: "All fields are required" });
        }

        if(!userId){
            return res.status(400).json({ message: "Userid is not Available" });
        }

        const user = await User.findById(userId)

        if (user.userRole !== "Admin"){
            return res.status(403).json({ message: "unAuthorized Access" });
        }

        const station = await Station.findOne({stationName})

        if(station){
            return res.status(400).json({ message: "Station already exists" });  
        }
        const prefix = stationName.slice(0, 3).toUpperCase(); // Take first 3 letters
        const randomNum = Math.floor(100 + Math.random() * 900); // 3-digit random number

        const stationCode = prefix + randomNum;

        const newStation = new Station({
            stationName,
            location,
            stationCode,
            createdBy:userId
        })

        await newStation.save()

        res.status(201).json({
            _id: newStation._id,
            stationName: newStation.stationName,
            location: newStation.location,
            stationCode: newStation.stationCode,
            createdBy:newStation.createdBy
          });
        
    } catch (error) {
        console.log("Error in  addStation controller", error.message);
        res.status(500).json({ message: "Internal Server Error" }); 
    }
}

const updateStation = async(req , res) => {
    try {
        const { stationCode } = req.params;
        const{stationName,location} = req.body
        const userId = req.user._id;
        if(!userId){
            return res.status(400).json({ message: "Userid is not Available" });
        }

        const user = await User.findById(userId)

        if (user.userRole !== "Admin"){
            return res.status(403).json({ message: "unAuthorized Access" });
        }

        let updateFields = {};
        if (stationName) updateFields.stationName = stationName;
        if (location) updateFields.location = location;
  

        if(stationName){
            const prefix = stationName.slice(0, 3).toUpperCase(); // Take first 3 letters
            const randomNum = Math.floor(100 + Math.random() * 900); // 3-digit random number
            const stationCode = prefix + randomNum;
            if (stationCode) updateFields.stationCode = stationCode;
            if (userId) updateFields.createdBy = userId;
        }


        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No fields provided for update" });
        }

        // const station = await Station.findOne({ stationCode });
        const station = await Station.findOneAndUpdate(
            { stationCode}, 
            { $set: updateFields }, 
            { new: true } 
          );
      
        if (!station) {
            return res.status(404).json({ message: "Station not found" });
        }

        res.status(200).json({ message: "Station updated successfully", data: station });


    } catch (error) {
        console.log("Error in updateStation controller", error.message);
        res.status(500).json({ message: "Internal Server Error" }); 
    }
}

const allStation = async(req , res) => {
    try {
        const userId = req.user._id;

        if(!userId){
            return res.status(400).json({ message: "Userid is not Available" });
        }

        const user = await User.findById(userId)
        if(!user){
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (user.userRole !== "Admin"){
            return res.status(403).json({ message: "unAuthorized Access" });
        }

        const station = await Station.find()

        res.status(200).json({ message: "Station Details", data: station });

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" }); 
    }
}

const getAllTrain = async(req , res) => {
    try {
        const { stationId } = req.params;
        const userId = req.user._id;

        if(!userId){
            return res.status(400).json({ message: "Userid is not Available" });
        }

        const user = await User.findById(userId)
          if(!user){
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const station = await Station.findById(stationId ).populate("train_ids", "trainNumber trainName departureTime arrivalTime");

        if (!station) {
          return res.status(404).json({ message: "Station not found" });
        }
    
        res.status(200).json({ data: station });

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" }); 
    }
}

const fromToTrain = async(req , res) => {
    try {
        const {fromStationCode, toStationCode} = req.query

        const userId = req.user._id;

        if(!userId){
            return res.status(400).json({ message: "Userid is not Available" });
        }

        const user = await User.findById(userId)

        if(!user){
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if(!fromStationCode, !toStationCode){
            return res.status(400).json({message:"Both fromStationCode and toStationCode are required"})
        }

        const fromStation = await Station.findOne({stationCode: fromStationCode}).populate("train_ids")
        const toStation = await Station.findOne({stationCode: fromStationCode}).populate("train_ids")

        if(!fromStation || !toStation){
            return res.status(404).json({message:"One or both stations not found"})
        }

        const fromTrain = fromStation.train_ids.map(train => train._id.toString());
        const toTrain = toStation.train_ids.map(train => train._id.toString())

        const commonTrainIds = fromTrain.filter(trainId => toTrain.includes(trainId))

        if(commonTrainIds.length === 0) {
            return res.status(404).json({message: "No direct trains available between these stations" })
        }

        const trains = await Train.find({_id:{$in: commonTrainIds}})

        res.status(200).json({ data: trains });
    } catch (error) {
         console.error("Error in getTrainsBetweenStations:", error.message);
         res.status(500).json({ message: "Internal Server Error" });
    }
}


module.exports = {addStation,fromToTrain, updateStation, allStation,getAllTrain}