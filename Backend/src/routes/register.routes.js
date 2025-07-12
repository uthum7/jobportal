// routes/register.routes.js (or your auth routes file)
import express from "express";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import Registeruser from "../models/Registeruser.js";
import jwt from "jsonwebtoken";


// --- Import the controller functions ---
import {
    forgotPassword,
    resetPassword
} from "../controllers/registerauth.controller.js"; // Assuming you have a registerauth.controller.js


const router = express.Router();
// It's better to ensure JWT_SECRET is defined at the start or throw an error
if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
    process.exit(1); // Stop the server if secret is missing
}
const JWT_SECRET = process.env.JWT_SECRET;


router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { username, email, password, roles } = req.body;

    console.log("Registration attempt for email:", email);
    console.log("Roles received:", roles);

    if (!username || !email || !password || !roles || !Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({ 
        message: "All fields are required, and roles must be a non-empty array." 
      });
    }

    const validRoles = ["MENTOR", "MENTEE", "JOBSEEKER", "ADMIN"];
    const invalidRoles = roles.filter(role => !validRoles.includes(String(role).toUpperCase())); // Ensure roles are checked case-insensitively
    
    if (invalidRoles.length > 0) {
      return res.status(400).json({ 
        message: `Invalid roles provided: ${invalidRoles.join(", ")}. Valid roles are: ${validRoles.join(", ")}` 
      });
    }
    const upperCaseRoles = roles.map(role => String(role).toUpperCase());


    const existingUser = await Registeruser.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const newUser = await Registeruser.create({
      username,
      email: email.toLowerCase(),
      password, // Will be hashed by pre-save middleware in model
      roles: upperCaseRoles,
    });

    if (newUser) {
      const payload = { 
        userId: newUser._id, // Use 'userId' as the key
        roles: newUser.roles // Include all roles of the user
      };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

      console.log("User registered successfully:", newUser.email);
      res.status(201).json({
        _id: newUser._id, // For client convenience
        userId: newUser._id, // Explicitly send userId
        username: newUser.username,
        email: newUser.email,
        roles: newUser.roles,
        token,
        message: "Registration successful."
      });
    } else {
      // This case is less likely if create() doesn't throw but good to have
      res.status(400).json({ message: "Invalid user data, registration failed." });
    }
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password, role } = req.body; // 'role' here is the specific role user is trying to log in AS
    
    if (!email || !password || !role) {
        return res.status(400).json({ message: "Email, password, and role are required." });
    }
    const requestedRole = String(role).toUpperCase();

    console.log("Login attempt for email:", email, "as role:", requestedRole);

    try {
      const user = await Registeruser.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        console.log("Login failed: User not found for email:", email);
        return res.status(401).json({ message: "Invalid credentials or role." }); // Generic message
      }

      // Check if the user actually has the role they are trying to log in with
      if (!user.roles.map(r => r.toUpperCase()).includes(requestedRole)) {
        console.log(`Login failed: Role mismatch for user ${email}. User roles: ${user.roles.join(', ')}, Requested role: ${requestedRole}`);
        return res.status(401).json({ message: "You do not have permission to log in with this role." });
      }

      const isPasswordValid = await user.matchPassword(password); // Use instance method
      if (!isPasswordValid) {
        console.log("Login failed: Invalid password for user:", email);
        return res.status(401).json({ message: "Invalid credentials or role." }); // Generic message
      }

      // --- CORRECTED JWT PAYLOAD ---
      const payload = {
        userId: user._id,      // <<<<---- CHANGE 'id' TO 'userId' HERE ---->>>>
        roles: user.roles,     // Include all user's roles in the token
        currentRole: requestedRole // The specific role they logged in as for this session
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

      console.log("Login successful for:", email, "as role:", requestedRole);

      res.status(200).json({
        token,
        userId: user._id,         // Send userId explicitly
        username: user.username,
        email: user.email,
        role: requestedRole,      // The role they logged in as for this session
        allRoles: user.roles,     // All roles the user possesses
        message: "Login successful."
      });

    } catch (error) {
      console.error("Server error during login:", error.message, error.stack);
      res.status(500).json({ message: "Server error during login. Please try again later." });
    }
  })
);

router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    // For JWT, logout is typically handled client-side by deleting the token.
    // Server-side might involve blacklisting tokens if using a more complex setup.
    // For a simple setup, just acknowledge.
    console.log("Logout request received.");
    res.status(200).json({ message: "Logged out successfully." });
  })
);



// Test password endpoint can be removed if not needed for debugging
// router.post("/test-password", ...);

export default router;