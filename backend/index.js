require("dotenv").config()
const mongoose = require("mongoose")
const cors = require("cors")
const express = require("express")
const app = express()
const authRoutes = require("./routes/Authentication.js")
const dashboardRoutes = require("./routes/dashboard.js")
const cookieParser = require("cookie-parser")

app.use(cors({
    origin: "https://mernauth-client-wzll.onrender.com",
    credentials: true,
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("DB connected successfully"))
    .catch(err => console.log(err))
app.get("/", (req, res) => res.json({ "message": 'dummy route' }))
app.use("/api", authRoutes)
app.use("/api", dashboardRoutes)
app.listen(process.env.PORT, () => { console.log("server started successfully") })