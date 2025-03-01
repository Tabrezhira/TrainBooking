const express = require("express");
const { 
    addTrain, 
    updateTrain, 
    getAllTrains, 
    deleteTrain, 
    getTrainDetails 
} = require("../controllers/TrainController");
const protectRoute  = require("../middleware/auth.middleware.js");

const router = express.Router();


router.post("/addTrain/:fromId/:toId", protectRoute, addTrain);


router.patch("/updateTrain/:Id", protectRoute, updateTrain);


router.get('/getAllTrain', protectRoute, getAllTrains);


router.delete("/deleteTrain/:Id", protectRoute, deleteTrain);


router.get('/trainDetails', protectRoute, getTrainDetails);

module.exports = router;