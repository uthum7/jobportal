<<<<<<< HEAD
// routes/register.routes.js (or your auth routes file)
import express from "express";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import Registeruser from "../models/Registeruser.js";
import jwt from "jsonwebtoken";
import Counselor from "../models/counselors.model.js";


// --- Import the controller functions ---
import {
    forgotPassword,
    resetPassword
} from "../controllers/registerauth.controller.js"; // Assuming you have a registerauth.controller.js
import { addCounselee } from "../controllers/counselees.controller.js";


const router = express.Router();
// It's better to ensure JWT_SECRET is defined at the start or throw an error
if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
    process.exit(1); // Stop the server if secret is missing
=======
// routes/register.routes.js

import express from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
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


const router = express.Router();

// Ensure JWT_SECRET is defined at the start
if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
    process.exit(1);
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
}
const JWT_SECRET = process.env.JWT_SECRET;


<<<<<<< HEAD
=======
// --- PUBLIC REGISTRATION ROUTE ---
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { username, email, password, roles } = req.body;

<<<<<<< HEAD
    console.log("Registration attempt for email:", email);
    console.log("Roles received:", roles);

=======
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
    if (!username || !email || !password || !roles || !Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({ 
        message: "All fields are required, and roles must be a non-empty array." 
      });
    }

<<<<<<< HEAD
    const validRoles = ["MENTOR", "MENTEE", "JOBSEEKER", "ADMIN"];
    const invalidRoles = roles.filter(role => !validRoles.includes(String(role).toUpperCase())); // Ensure roles are checked case-insensitively
    
    if (invalidRoles.length > 0) {
      return res.status(400).json({ 
        message: `Invalid roles provided: ${invalidRoles.join(", ")}. Valid roles are: ${validRoles.join(", ")}` 
      });
    }
    const upperCaseRoles = roles.map(role => String(role).toUpperCase());


=======
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

>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
    const existingUser = await Registeruser.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const newUser = await Registeruser.create({
      username,
      email: email.toLowerCase(),
<<<<<<< HEAD
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
=======
      password, // Hashed by pre-save middleware
      roles: upperCaseRoles,
      // The passwordResetRequired field will correctly default to false here.
    });

    if (newUser) {
      // You might not want to automatically log in a user after registration.
      // But if you do, this is correct.
      const payload = { userId: newUser._id, roles: newUser.roles };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
      
      res.status(201).json({
        userId: newUser._id,
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
        username: newUser.username,
        email: newUser.email,
        roles: newUser.roles,
        token,
        message: "Registration successful."
      });
    } else {
<<<<<<< HEAD
      // This case is less likely if create() doesn't throw but good to have
=======
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
      res.status(400).json({ message: "Invalid user data, registration failed." });
    }
  })
);

<<<<<<< HEAD
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password, role } = req.body; // 'role' here is the specific role user is trying to log in AS
=======

// --- LOGIN ROUTE ---
// The logic for handling passwordResetRequired is in the CONTROLLER, not here.
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
    
    if (!email || !password || !role) {
        return res.status(400).json({ message: "Email, password, and role are required." });
    }
    const requestedRole = String(role).toUpperCase();
<<<<<<< HEAD

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
        userId: user._id,         // Send userId explicitly
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
=======
    const user = await Registeruser.findOne({ email: email.toLowerCase() });
    
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (!user.roles.includes(requestedRole)) {
      return res.status(403).json({ message: "You do not have permission to log in with this role." });
    }

    // --- ⬇ THIS IS THE NEW LOGIC YOU'LL ADD TO THE CONTROLLER LATER ⬇ ---
    // Check for the password reset flag
    if (user.passwordResetRequired) {
        const payload = { userId: user._id };
        const tempToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
        
        return res.status(200).json({
            message: "Password reset is required.",
            passwordResetRequired: true,
            tempToken: tempToken,
        });
    }
    // --- ⬆ END OF NEW LOGIC PREVIEW ⬆ ---

    const payload = { userId: user._id, roles: user.roles, currentRole: requestedRole };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

    res.status(200).json({
        token,
        userId: user._id,
        username: user.username,
        email: user.email,
        role: requestedRole,
        allRoles: user.roles,
        message: "Login successful."
    });
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


// --- LOGOUT ROUTE ---
router.post(
  "/logout",
  asyncHandler(async (req, res) => {
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
    res.status(200).json({ message: "Logged out successfully." });
  })
);


<<<<<<< HEAD

// Test password endpoint can be removed if not needed for debugging
// router.post("/test-password", ...);

=======
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
export default router;