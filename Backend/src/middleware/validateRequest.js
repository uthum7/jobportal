// backend/middleware/validateRequest.js
const mongoose = require('mongoose');

exports.validateUserId = (req, res, next) => {
  const userId = req.params.userId || req.body.userId;
  
  // Case 1: Missing completely
  if (userId === undefined) {
    return res.status(400).json({ 
      error: "User ID is required",
      solution: "Check if authorization token is valid"
    });
  }
  
  // Case 2: Literally "undefined" string
  if (userId === "undefined") {
    return res.status(401).json({
      error: "Invalid authentication",
      solution: "Re-login and check token payload"
    });
  }

  // Case 3: Invalid format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      error: "Invalid User ID format",
      received: userId,
      expected: "Valid MongoDB ObjectId"
    });
  }

  next();
};

exports.validateToken = async (req, res, next) => {
  const token = req.cookies?.jwt || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Attach to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};