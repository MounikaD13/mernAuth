const jwt = require("jsonwebtoken")
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers["authorization"]
        if (!token) {
            return res.status(401).json({ "meassage": "token not provided" })
        }
        const finalToken = token.split(" ")[1]
        const decoded = jwt.verify(finalToken, process.env.JWT_SECRET)
        req.user = decoded
        next()
    }
    catch (err) {
        return res.status(401).json({ "messsage": "invalid or token expired" })
    }
}
module.exports = authMiddleware