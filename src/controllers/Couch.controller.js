const Station = require('../models/stationmodel')
const Train = require('../models/trainmodel')
const User = require('../models/usermodel')
const Coach = require('../models/coachmodel')

const addCoach = async(req , res) => {
    try {
        const userId = req.user._id;
        const { trainId } = req.params;
        const{coachType, numberOfSeat, price} = req.body
        if(!coachType || !numberOfSeat || !trainId || !price){
            return res.status(400).json({ message: "All fields are required" });
        }
        if(!userId){
            return res.status(400).json({ message: "Userid is not Available" });
        }
        const user = await User.findById(userId)

        if (user.userRole !== "Admin"){
            return res.status(403).json({ message: "unAuthorized Access" });
        }
        const train = await Train.findById(trainId)
        if(!train){
            return res.status(400).json({ message: "Userid is not Available" });
        }

        const newCoach = new Coach({
            train_id:trainId,
            coachType,
            numberOfSeat,
            price,
            createdBy:userId
        })

        await newCoach.save()

        train.coach.push(newCoach._id);
        await train.save();

        res.status(201).json({ message: "Coach added successfully", coach: newCoach });
        
    } catch (error) {
        console.log("Error in  addStation controller", error.message);
        res.status(500).json({ message: "Internal Server Error" }); 
    }
}

const updateCoach = async(req , res) => {
    try {
        const userId = req.user._id;
        const { Id } = req.params;
        const{coachType, numberOfSeat, price} = req.body
        if(!coachType || !numberOfSeat || !Id || !price){
            return res.status(400).json({ message: "All fields are required" });
        }

        if(!userId){
            return res.status(400).json({ message: "Userid is not Available" });
        }

        const user = await User.findById(userId)

        if (user.userRole !== "Admin"){
            return res.status(403).json({ message: "unAuthorized Access" });
        }

        const existingCoach = await Coach.findById(Id);
        if (!existingCoach) {
            return res.status(404).json({ message: "Coach not found" });
        }

        existingCoach.coachType = coachType;
        existingCoach.seatCapacity = numberOfSeat;
        existingCoach.price = price;

        await existingCoach.save();

        res.status(200).json({
            message: "Coach updated successfully",
            coach: existingCoach
        });
        
    } catch (error) {
        console.log("Error in  addStation controller", error.message);
        res.status(500).json({ message: "Internal Server Error" }); 
    }
}

const coachDetails = async(req , res) => {
    try {
        const userId = req.user._id;
        const { Id } = req.params;

        if(!userId){
            return res.status(400).json({ message: "Userid is not Available" });
        }

        const user = await User.findById(userId)

        if (!user ) {
            return res.status(404).json({ message: "user not found" });
        }


        const coach = await Coach.findById(Id);
        if (!coach) {
            return res.status(404).json({ message: "Coach not found" });
        }


        res.status(200).json({
            message: "Coach detail",
            coach: coach
        });
        
    } catch (error) {
        console.log("Error in  addStation controller", error.message);
        res.status(500).json({ message: "Internal Server Error" }); 
    }
}

const getAllCoach = async(req , res) => {
    try {
        const userId = req.user._id;
        const { trainId } = req.params;

        if(!trainId ){
            return res.status(400).json({ message: "All fields are required" });
        }
        if(!userId){
            return res.status(400).json({ message: "Userid is not Available" });
        }
        const user = await User.findById(userId)

        if (user.userRole !== "Admin"){
            return res.status(403).json({ message: "unAuthorized Access" });
        }
        const train = await Train.findById(trainId)
        if(!train){
            return res.status(400).json({ message: "Userid is not Available" });
        }

        const coach = await Coach.find({train_id:trainId})
        if(!coach){
            return res.status(400).json({ message: "Userid is not Available" });
        }

        res.status(200).json({
            message: "Coach detail",
            coach: coach
        });

        
    } catch (error) {
        console.log("Error in  addStation controller", error.message);
        res.status(500).json({ message: "Internal Server Error" }); 
    }
}

const deleteCoach = async(req , res) => {
    try {
        const userId = req.user._id;
        const { Id } = req.params;
     
        if( !Id ){
            return res.status(400).json({ message: "All fields are required" });
        }

        if(!userId){
            return res.status(400).json({ message: "Userid is not Available" });
        }

        const user = await User.findById(userId)

        if (user.userRole !== "Admin"){
            return res.status(403).json({ message: "unAuthorized Access" });
        }
        const coach = await Coach.findById(Id);
        if (!coach) {
            return res.status(404).json({ message: "Coach not found" });
        }
        await Train.findByIdAndUpdate(coach.train_id, {
            $pull: { coaches: Id }
        });
        await Coach.findByIdAndDelete(Id);

        res.status(200).json({ message: "Coach deleted successfully" });
        
    } catch (error) {
        console.log("Error in  addStation controller", error.message);
        res.status(500).json({ message: "Internal Server Error" }); 
    }
}



module.exports = {addCoach,updateCoach,deleteCoach,getAllCoach,coachDetails}  