const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { Registeruser } = require("../models/Registeruser");
require("dotenv").config();

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check if token exists in cookies
    if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        // Fallback: Check if token is in the Authorization header
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by ID and exclude the password field
        req.user = await Registeruser.findById(decoded.userId).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "Not authorized, user not found" });
        }

        // Proceed to the next middleware/route handler
        next();
    } catch (error) {
        console.error("Token verification error:", error.message);
        return res.status(401).json({ message: "Not authorized, invalid token" });
    }
});

module.exports = protect;