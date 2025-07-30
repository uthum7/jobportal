
import jwt from "jsonwebtoken"; // Library for JSON Web Token handling
import Registeruser from "../models/Registeruser.js"; // Replace with your user model


export const protectRoute = async (req, res, next) => {
  try {

    let token;

    // 1. Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // 2. Fallback: check cookies
    else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }


    // 3. No token found
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }


    // 4. Verify token


    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }


    // 5. Find user

  

    const user = await Registeruser.findById(decoded.userId).select("-password");


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    // 6. Attach user to request

    // Attach the user object to the request

    req.user = user;

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }

};

