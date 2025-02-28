const express = require("express");

const protectRoute  = require("../middleware/auth.middleware.js");
const { addStation, updateStation,fromToTrain,  allStation, getAllTrain } = require("../controllers/Station.controller.js");

const router = express.Router();

router.post("/addStation",protectRoute,addStation)
router.patch("/updateStation/:stationCode",protectRoute,updateStation)

router.get('/allStation',protectRoute,allStation)
router.get("/getAllTrain/:stationCode",protectRoute,getAllTrain)

router.get('/fromToTrain',protectRoute,fromToTrain)

module.exports = router
