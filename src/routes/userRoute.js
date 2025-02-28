const express = require("express");
const { checkAuth, login, logout, signup, allBooking, makeAdmin} = require("../controllers/User.controller.js");
const protectRoute  = require("../middleware/auth.middleware.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.put("/makeAdimn", protectRoute,makeAdmin )

router.get("/logout", logout);
router.get('/bookingHistory',protectRoute, allBooking)
router.get("/check", protectRoute, checkAuth);

module.exports = router
