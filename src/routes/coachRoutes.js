const express = require("express");
const protectRoute  = require("../middleware/auth.middleware.js");
const router = express.Router();
const {addCoach,updateCoach,deleteCoach,getAllCoach,coachDetails} = require('../controllers/Couch.controller.js')

router.post("/addCoach/:trainId",protectRoute,addCoach)
router.patch("/updateCoach/:Id",protectRoute,updateCoach)

router.get('/Coach/:Id',protectRoute,coachDetails)
router.get("/getAllCoach/:trainId",protectRoute,getAllCoach)

router.delete('/deleteCoach/:Id',protectRoute,deleteCoach)




module.exports = router
