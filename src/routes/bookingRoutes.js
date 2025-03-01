const express = require("express");
const protectRoute  = require("../middleware/auth.middleware.js");
const router = express.Router();
const {createBooking,getBookingId,getBookingUser,getBookingTrain,AllBooking,cancelBooking}  = require('../controllers/Booking.controller.js');
const { allBooking } = require("../controllers/User.controller.js");

router.post("/createBooking",protectRoute,createBooking)


router.get("/getBookingTrain/:trainId",protectRoute,getBookingTrain)
router.get("/getBookingUser/:userId",protectRoute,getBookingUser)
router.get("/getBookingId/:Id",protectRoute,getBookingId)
router.get("/AllBooking",protectRoute,allBooking)

router.patch("/cancelBooking/:Id",protectRoute,cancelBooking)

module.exports = router