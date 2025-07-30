<<<<<<< HEAD
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
=======
import jwt from "jsonwebtoken"; // Library for JSON Web Token handling
import Registeruser from "../models/Registeruser.js"; // Replace with your user model

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // Extract JWT from cookies
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

<<<<<<< HEAD
=======
    // Verify the token
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

<<<<<<< HEAD
    const user = await User.findById(decoded.userId).select("-password");
=======
    // Find the user in Registeruser collection
    const user = await Registeruser.findById(decoded.userId).select("-password");
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

<<<<<<< HEAD
=======
    // Attach the user object to the request
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
<<<<<<< HEAD
};
=======
};
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
