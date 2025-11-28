const express = require("express")
const router = express.Router()
const User = require("../model/User.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const generalTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    )
    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    )
    return { accessToken, refreshToken }
}

router.post("/register", async (req, res) => {
    try {
        const { name, gender, email, password, mobileNumber, address } = req.body

        //check exists user or not 
        const existingUser = await User.findOne({ email })
        console.log(existingUser)
        if (existingUser) {
            return res.status(409).json({ "message": "exists user" })
        }

        //password ni encrpt cheyadaniki
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = User({
            name, gender, email,
            password: hashedPassword,
            mobileNumber, address
        })
        await newUser.save()
        res.status(200).json({ "message": "user added successfully" })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ "message": "internal server error" })
    }
})
router.post("/login", async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user)
        return res.status(400).json({ "message": "user not found" })
    //compare password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
        return res.status(400).json({ "message": "password is invalid" })
    // const token = jwt.sign(
    //     { id: user._id, email: user.email },
    //     process.env.JWT_SECRET,
    //     { expiresIn: "1h" }
    // )
    const { accessToken, refreshToken } = generalTokens(user)
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        path: "/",
        secure: false,
        sameSite: "lax"
    })
    res.status(200).json({
        "message": "user identified",
        token: accessToken,
        user: { id: user._id, name: user.name, email: user.email }
    })
})
router.get("/refresh-token", async (req, res) => {
    const token = req.cookies.refreshToken
    console.log(req.cookies)
    if (!token)
        return res.status(401).json({ "message": "no token apperead" })
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
        const user = await User.findById(decoded.id)
        const newAccessToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        )
        res.json({
            accessToken: newAccessToken,
            user: { id: user._id, email: user.email, name: user.name }
        })
    }
    catch (err) {
        console.log("error from refresh token", err)
        return res.status(401).json({ "message": "invalid refresh token" })
    }
})
router.post("/logout", (req, res) => {
    res.clearCookie("refreshToken")
    res.status(200).json({ "message": 'logged out successfully' })
})
router.put("/:id", async (req, res) => {
    try {
        const { password } = req.body; // extract password if sent
        let updateData = { password };

        // If password is being updated → hash it
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,        // which user?
            req.body,             // updated data
            { new: true }         // return updated document
        );
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = router