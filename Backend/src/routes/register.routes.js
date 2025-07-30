// routes/register.routes.js

import express from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import Counselor from "../models/counselors.model.js";
import Registeruser from "../models/Registeruser.js";

// --- Middleware ---
import { protectRoute } from '../middleware/registerauth.middleware.js';

// --- Controllers ---
// Consolidate imports from the same controller file
import {
    forgotPassword,
    resetPassword,
    forceResetPassword
} from "../controllers/registerauth.controller.js";
import { addCounselee } from "../controllers/counselees.controller.js";


const router = express.Router();

// Ensure JWT_SECRET is defined at the start
if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
    process.exit(1);
}
const JWT_SECRET = process.env.JWT_SECRET;


// --- PUBLIC REGISTRATION ROUTE ---
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { username, email, password, roles } = req.body;

    if (!username || !email || !password || !roles || !Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({ 
        message: "All fields are required, and roles must be a non-empty array." 
      });
    }
   

    // --- ⬇ CRITICAL SECURITY UPDATE ⬇ ---
    // Define which roles are allowed for public, self-registration
    const selfRegisterRoles = ["MENTEE", "JOBSEEKER"];
    const containsForbiddenRole = roles.some(role => !selfRegisterRoles.includes(String(role).toUpperCase()));
    
    if (containsForbiddenRole) {
        // If a user tries to register as a MENTOR, ADMIN, or EMPLOYEE, reject the request.
        return res.status(403).json({ message: "Forbidden. You can only register as a Mentee or Jobseeker." });
    }
    // --- ⬆ END OF SECURITY UPDATE ⬆ ---


    const upperCaseRoles = roles.map(role => String(role).toUpperCase());

    const existingUser = await Registeruser.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const newUser = await Registeruser.create({
      username,
      email: email.toLowerCase(),
      password, // Hashed by pre-save middleware
      roles: upperCaseRoles,
      // The passwordResetRequired field will correctly default to false here.
    });

    console.log(password);
    if (newUser) {
      // You might not want to automatically log in a user after registration.
      // But if you do, this is correct.
      const payload = { userId: newUser._id, roles: newUser.roles };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
      
      res.status(201).json({
        userId: newUser._id,
        username: newUser.username,
        email: newUser.email,
        roles: newUser.roles,
        token,
        message: "Registration successful."
      });
    } else {
      res.status(400).json({ message: "Invalid user data, registration failed." });
    }
  })
);


// --- LOGIN ROUTE ---
// The logic for handling passwordResetRequired is in the CONTROLLER, not here.
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;
    
    if (!email || !password || !role) {
        return res.status(400).json({ message: "Email, password, and role are required." });
    }
    const requestedRole = String(role).toUpperCase();
    const user = await Registeruser.findOne({ email: email.toLowerCase() });
    console.log("User found:", user);
    
    if (!user || !await user.matchPassword(password)) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (!user.roles.includes(requestedRole)) {
      return res.status(403).json({ message: "You do not have permission to log in with this role." });
    }

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

      let roleObj;
      if (requestedRole === "MENTOR") {
        roleObj = await Counselor.findOne({ _id: user.counselors_id });
      } else if(requestedRole === "MENTEE") {
        roleObj = {};
      }
      // --- CORRECTED JWT PAYLOAD ---
      const payload = {
        userId: user._id,      // <<<<---- CHANGE 'id' TO 'userId' HERE ---->>>>
        roles: user.roles,     // Include all user's roles in the token
        currentRole: requestedRole, // The specific role they logged in as for this session
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

      console.log("Login successful for:", email, "as role:", requestedRole);
     console.log(roleObj)
      // Create response object step by step for debugging
      const responseData = {
        token,
        userId: user._id,
        username: user.username,
        email: user.email,
        role: requestedRole,      // The role they logged in as for this session
        allRoles: user.roles,     // All roles the user possesses
        message: "Login successful.",
        counselors_id: user.counselors_id ? user.counselors_id.toString() : null, // Ensure string or null
        fullName: user.fullName || user.username, // Add full name
        profilePic: user.profilePic || null, // Add profile picture
        specialty: roleObj ? roleObj.specialty || null : null, // Add specialty if available
      };
      
      res.status(200).json(responseData);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  })
);


// --- PASSWORD MANAGEMENT ROUTES ---

// Route for when a user forgets their password and requests a reset token
router.post('/forgot-password', asyncHandler(forgotPassword));

// Route for resetting the password using the token from the email
router.post('/reset-password', asyncHandler(resetPassword));

// --- ⬇ NEWLY ADDED ROUTE ⬇ ---
// Route for a user created by an admin to set their initial password
// This route is protected because the user must have a valid temporary token from the login step.
router.post('/force-reset-password', asyncHandler(forceResetPassword));
// --- ⬆ END OF NEW ROUTE ⬆ ---


// --- GET USER BY ID ROUTE ---
router.get(
  "/users/:userId",
  protectRoute,
  asyncHandler(async (req, res) => {
    try {
      const { userId } = req.params;
      
      const user = await Registeruser.findById(userId).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      
      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        fullName: user.fullName,
        profilePic: user.profilePic,
        phone: user.phone,
        isOnline: user.isOnline,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  })
);
// --- LOGOUT ROUTE ---
router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Logged out successfully." });
  })
);

export default router;