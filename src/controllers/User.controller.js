const  generateToken  = require ("../utils/utils.js");
const User = require ("../models/usermodel.js");
const bcrypt = require ("bcryptjs");

 const signup = async (req, res) => {
  const { username, email, password,mobile } = req.body;
  try {
    if (!username || !email || !password || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      mobile
    });

    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        mobile: newUser.mobile,
        role:newUser.userRole
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

 const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");;

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(500).json({ message: "User password is missing" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      role: user.userRole
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" });
  }
};

 const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const allBooking = async(req, res) => {
  try {
    const userId = req.user._id;
    if(!userId){
      return res.status(400).json({ message: "Userid is not Available" });
    }
    const user = await User.findById(userId._id)
    if(!user){
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.userRole !== "Admin"){
      return res.status(403).json({ message: "unAuthorized Access" });
    }

    res.status(200).json({BookingHistory: user.BookingHistory, userData: user})
  } catch (error) {
    console.log("Error in allBooking controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const makeAdmin = async(req,res) => {
  try {
    const userId = req.user._id;
    if(!userId){
      return res.status(400).json({ message: "Userid is not Available" });
    }
    const user = await User.findByIdAndUpdate(userId,{userRole:"Admin"},{ new: true })
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated to Admin successfully", data: user });

  } catch (error) {
    console.log("Error in makeAdmin controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


 const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {signup, login, logout, checkAuth, allBooking,makeAdmin}
