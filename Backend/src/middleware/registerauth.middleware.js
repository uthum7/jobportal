// middleware/registerauth.middleware.js

import jwt from "jsonwebtoken";
import Registeruser from "../models/Registeruser.js"; // Ensure this path is correct

/**
 * Middleware to protect routes by verifying a JWT token.
 * It checks for a token in the Authorization header or cookies.
 * If the token is valid, it decodes it, finds the user in the database,
 * and attaches the user object (without the password) to the request object (req.user).
 */
export const protectRoute = async (req, res, next) => {
    let token;
    try {
        // 1. Get token from header or cookies
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
        if (!decoded || !decoded.userId) {
            console.warn("[Auth Middleware] Token decoded but missing userId.");
            return res.status(401).json({ message: "Invalid token payload: userId missing." });
        }

        // 3. Check if user still exists and attach to request object
        const currentUser = await Registeruser.findById(decoded.userId).select("-password");

        if (!currentUser) {
            console.warn(`[Auth Middleware] User with ID ${decoded.userId} from token not found in DB.`);
            return res.status(401).json({ message: "User belonging to this token no longer exists." });
        }

        // Attach the user object to the request for subsequent middleware/controllers
        req.user = currentUser; 
        
        console.log(`[Auth Middleware] User ${currentUser._id} authenticated successfully.`);
        next(); // Proceed to the next middleware or route handler

    } catch (error) {
        console.error("[Auth Middleware] Authentication error:", error.name, "-", error.message);

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token. Please log in again." });
        } else if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired. Please log in again." });
        }
        
        return res.status(500).json({ message: "Server error during authentication." });
    }
};


// --- NEW MIDDLEWARE ADDED HERE ---

/**
 * Middleware to authorize admin access.
 * This function MUST be used AFTER the `protectRoute` middleware.
 * It checks if the `req.user` object (attached by protectRoute) has 'ADMIN' in its roles array.
 */
export const isAdmin = (req, res, next) => {
    // Check if the user object exists and if their roles array includes 'ADMIN'
    if (req.user && req.user.roles.includes('ADMIN')) {
        // If the user is an admin, allow the request to proceed
        next();
    } else {
        // If the user is not an admin, send a 403 Forbidden status
        console.warn(`[Auth Middleware] Forbidden. User ${req.user?._id} attempted to access an admin-only route.`);
        return res.status(403).json({ message: "Access denied. You do not have permission to perform this action." });
    }
};