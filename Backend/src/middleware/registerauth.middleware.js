// middleware/registerauth.middleware.js

import jwt from "jsonwebtoken";
import Registeruser from "../models/Registeruser.js";

/**
 * Middleware to protect routes by verifying a JWT token.
 */
export const protectRoute = async (req, res, next) => {
    let token;
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // ✅ CRITICAL FIX: The token is the second part of the "Bearer <token>" string.
            // You must select the element at index 1 after splitting.
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies?.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return res.status(401).json({ message: "No token provided, authorization denied." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: "Invalid token payload: userId missing." });
        }

        const currentUser = await Registeruser.findById(decoded.userId).select("-password");

        if (!currentUser) {
            return res.status(401).json({ message: "User belonging to this token no longer exists." });
        }

        req.user = currentUser;
        next();

    } catch (error) {
        console.error("[Auth Middleware] Authentication Error:", error.message);
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token. Please log in again." });
        } else if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired. Please log in again." });
        }
        return res.status(500).json({ message: "Server error during authentication." });
    }
};

/**
 * Middleware to authorize admin-only routes.
 * Must be used AFTER `protectRoute`.
 */
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.roles.includes('ADMIN')) {
        next();
    } else {
        console.warn(`[Auth Middleware] Forbidden. User ${req.user?._id} attempted an admin route.`);
        return res.status(403).json({ message: "Access denied. You do not have permission to perform this action." });
    }
};
