// middleware/registerauth.middleware.js
import jwt from "jsonwebtoken";
import Registeruser from "../models/Registeruser.js"; // Make sure path is correct

export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
     console.log("✅ Received token:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn("[Auth Middleware] No token provided in Authorization header.");
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
    console.log("✅ Received token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      console.warn("[Auth Middleware] Token decoded but missing userId.");
      return res.status(401).json({ message: "Invalid token payload: userId missing." });
    }

    const user = await Registeruser.findById(decoded.userId).select("-password");

    if (!user) {
      console.warn(`[Auth Middleware] User with ID ${decoded.userId} not found in DB.`);
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Attach user object and userId for controller use
    req.user = user;
    req.userId = user._id;

    console.log(`[Auth Middleware] ✅ User ${user._id} authenticated successfully.`);
    next();
  } catch (error) {
    console.error("[Auth Middleware] ❌ Authentication error:", error.name, "-", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }

    return res.status(500).json({ message: "Server error during authentication." });
  }
};
