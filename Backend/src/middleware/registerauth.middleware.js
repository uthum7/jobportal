// middleware/registerauth.middleware.js
import jwt from "jsonwebtoken";
import Registeruser from "../models/Registeruser.js"; // Ensure this path is correct

export const protectRoute = async (req, res, next) => {
    let token;
    try {
        // 1. Get token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies?.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            console.warn("[Auth Middleware] No token provided.");
            return res.status(401).json({ message: "No token provided, authorization denied." });
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.userId) { // Ensure userId is in the token payload
            console.warn("[Auth Middleware] Token decoded but missing userId.");
            return res.status(401).json({ message: "Invalid token payload: userId missing." });
        }

        // 3. Check if user still exists and attach to request object
        const currentUser = await Registeruser.findById(decoded.userId).select("-password"); // Exclude password

        if (!currentUser) {
            console.warn(`[Auth Middleware] User with ID ${decoded.userId} from token not found in DB.`);
            return res.status(401).json({ message: "User belonging to this token no longer exists." });
        }

        req.user = currentUser; // Attach the full user object (minus password)
        console.log(`[Auth Middleware] User ${currentUser._id} authenticated successfully.`);
        next(); // Proceed to the next middleware or route handler

    } catch (error) {
        console.error("[Auth Middleware] Authentication error:", error.name, "-", error.message);

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token. Please log in again." });
        } else if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired. Please log in again." });
        }
        // For any other unexpected errors during authentication
        return res.status(500).json({ message: "Server error during authentication." });
    }
};


