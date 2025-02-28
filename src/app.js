const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const UserRoutes = require("./routes/userRoute.js");
const stationRoutes = require("./routes/stationRoute.js");
const path = require("path");
const  {connectDB } = require("./config/db");
const coachRoutes = require('./routes/coachRoutes.js')
const trainRoutes = require('./routes/trainRoutes.js')

dotenv.config();

const app = express();
const PORT = process.env.PORT;


app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use('/api/user', UserRoutes)
app.use('/api/station',stationRoutes)
app.use('/api/coach',coachRoutes)
app.use('/api/train',trainRoutes)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
  connectDB();
});
