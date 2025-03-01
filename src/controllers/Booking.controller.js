const Station = require('../models/stationmodel')
const Train = require('../models/trainmodel')
const User = require('../models/usermodel')
const Coach = require('../models/coachmodel')
const Booking = require('../models/bookingmodel')

const createBooking = async(req , res) => {
    try {
        const userId = req.user._id;
        
        const{ journeyDate, trainId, sourceStationId,destinationStationId,coachId} = req.body
        if( !journeyDate || !trainId || !sourceStationId || !destinationStationId || !coachId ){
            return res.status(400).json({ message: "All fields are required" });
        }
        if(!userId){
            return res.status(400).json({ message: "Userid is not Available" });
        }
        const user = await User.findById(userId)

        if (!user){
            return res.status(403).json({ message: "user not found" });
        }

        const fromStation = await Station.findById(sourceStationId)
        if (!fromStation){
            return res.status(403).json({ message: "unAuthorized Access1" });
        }
        const toStation = await Station.findById(destinationStationId)
        if (!toStation){
            return res.status(403).json({ message: "unAuthorized Access2" });
        }

        const train = await Train.findById(trainId)
        if (!train){
            return res.status(403).json({ message: "unAuthorized Access3" });
        }

        const coach = await Coach.findById(coachId)
        if (!coach){
            return res.status(403).json({ message: "unAuthorized Access4" });
        }

        const seatAvailable = coach.currentBooking.length < coach.numberOfSeat;
        console.log(seatAvailable)
        console.log(coach.currentBooking)
        console.log(coach.numberOfSeat)
        let status = null
        let seatNo = null
        if(seatAvailable){
            status = "Confirmed";
            seatNo = coach.currentBooking.length + 1;
        }
        if(!seatAvailable){
            status = "Waiting";
            seatNo = coach.currentWaiting.length + 1;
        }

        const newBooking = new Booking({
            userId,
            trainId,
            sourceStationId,
            destinationStationId,
            passengerName: user.username,
            coachId,
            status,
            journeyDate,
            totalFare:coach.price,
            trainName:train.trainName,
            From:fromStation.stationName,
            to:toStation.stationName,
            seatNo
        })
        await newBooking.save()

        user.BookingHistory.push(newBooking._id);
        await user.save()

        if(seatAvailable){
            coach.currentBooking.push(newBooking._id);
            await coach.save()
        }
        if(!seatAvailable){
            coach.currentWaiting.push(newBooking._id);
            await coach.save()
        }

        res.status(201).json({ message: "Booking added successfully", Booking: newBooking });
        
    } catch (error) {
        console.log("Error in  addStation controller", error);
        res.status(500).json({ message: "Internal Server Error" }); 
    }
}



// Get booking by ID
const getBookingId = async (req, res) => {
    try {
        const bookingId = req.params.Id;
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({ booking });
    } catch (error) {
        console.log("Error in getBookingId controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get bookings by user ID
const getBookingUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const bookings = await Booking.find({ userId });

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this user" });
        }

        res.status(200).json({ bookings });
    } catch (error) {
        console.log("Error in getBookingUser controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get bookings by train ID
const getBookingTrain = async (req, res) => {
    try {
        const trainId = req.params.trainId;
        const bookings = await Booking.find({ trainId });

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this train" });
        }

        res.status(200).json({ bookings });
    } catch (error) {
        console.log("Error in getBookingTrain controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get all bookings
const AllBooking = async (req, res) => {
    try {
        const bookings = await Booking.find();

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found" });
        }

        res.status(200).json({ bookings });
    } catch (error) {
        console.log("Error in AllBooking controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Cancel a booking
const cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.Id;
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Find the coach associated with the booking
        const coach = await Coach.findById(booking.coachId);
        if (!coach) {
            return res.status(404).json({ message: "Coach not found" });
        }

        // Update booking status to "Cancelled"
        booking.status = "Cancelled";
        await booking.save();

        // Remove the booking from the coach's currentBooking or currentWaiting array
        if (coach.currentBooking.includes(bookingId)) {
            coach.currentBooking.pull(bookingId);
        } else if (coach.currentWaiting.includes(bookingId)) {
            coach.currentWaiting.pull(bookingId);
        }

        // If there are bookings in the waiting list, promote the first one to currentBooking
        if (coach.currentWaiting.length > 0) {
            const nextBookingId = coach.currentWaiting.shift();
            const nextBooking = await Booking.findById(nextBookingId);

            if (nextBooking) {
                // Assign the same seat number to the promoted booking
                nextBooking.seatNo = booking.seatNo;
                nextBooking.status = "Confirmed";
                await nextBooking.save();

                // Add the promoted booking to currentBooking
                coach.currentBooking.push(nextBookingId);
            }
        }

        // Save the updated coach
        await coach.save();

        res.status(200).json({ message: "Booking cancelled successfully", booking });
    } catch (error) {
        console.log("Error in cancelBooking controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};




module.exports = {createBooking,getBookingId,getBookingUser,getBookingTrain,AllBooking,cancelBooking}  