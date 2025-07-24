import jwt from "jsonwebtoken"; // Library for JSON Web Token handling
import Registeruser from "../models/Registeruser.js"; // Replace with your user model

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // Extract JWT from cookies

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // Find the user in Registeruser collection
    const user = await Registeruser.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the user object to the request
    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
