// Backend/src/controllers/registerauth.controller.js

import Registeruser from "../models/Registeruser.js";
import UserCv from "../models/UserCv.js";
import { sendEmail } from "../lib/utils.js"; // Your email sending utility
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from 'crypto';

// =====================================================================
// --- STANDARD AUTHENTICATION CONTROLLERS ---
// =====================================================================

/**
 * Handles public registration for roles like MENTEE and JOBSEEKER.
 * This route is now protected by a security check in register.routes.js
 * to prevent admin/mentor/employee self-registration.
 */
export const signup = async (req, res) => {
    const { username, email, password, roles } = req.body; // Assuming roles are passed now
    try {
        if (!username || !email || !password || !roles) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const existingUser = await Registeruser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        // Create user. The pre-save hook in the model will hash the password.
        const newUser = await Registeruser.create({
            username, email, password, roles
        });

        // If the new user is a jobseeker, create a CV document for them
        if (roles.includes('JOBSEEKER')) {
            await UserCv.create({
                userId: newUser._id,
                personalInfo: {}, educationDetails: {}, professionalExperience: [],
                skill: [], summary: "", references: []
            });
        }

        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            message: "Registration successful. Please log in."
        });
    } catch (error) {
        console.error("Signup error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Handles user login for all roles.
 * Includes new logic to check if a user must reset their password.
 */
export const login = async (req, res) => {
    const { email, password, role } = req.body;
    
    if (!email || !password || !role) {
        return res.status(400).json({ message: "Email, password, and role are required." });
    }
    const requestedRole = String(role).toUpperCase();

    try {
        const user = await Registeruser.findOne({ email: email.toLowerCase() });
        
        if (!user || !(await user.matchPassword(password))) {
          return res.status(401).json({ message: "Invalid credentials or role." });
        }

        if (!user.roles.includes(requestedRole)) {
          return res.status(403).json({ message: "You do not have permission to log in with this role." });
        }

        // Check if the user must reset their password.
        // This is now a fallback, as the primary flow is the email link.
        if (user.passwordResetRequired) {
            return res.status(403).json({
                message: "Account not activated. Please use the activation link sent to your email to set your password."
            });
        }
        
        // If login is normal, create a standard JWT.
        const payload = {
            userId: user._id,
            roles: user.roles,
            currentRole: requestedRole
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

        res.status(200).json({
            token,
            userId: user._id,
            username: user.username,
            email: user.email,
            role: requestedRole,
            allRoles: user.roles,
            message: "Login successful."
        });

    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Internal server error during login." });
    }
};

/**
 * Handles user logout. For JWT, this is mainly a client-side action,
 * but a server endpoint is good practice.
 */
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { httpOnly: true, maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Endpoint to check if a user's token is still valid.
 * Used by the frontend to verify authentication status on page load.
 */
export const checkAuth = (req, res) => {
    try {
        // req.user is attached by the protectRoute middleware
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Check auth error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


// =====================================================================
// --- PASSWORD MANAGEMENT CONTROLLERS ---
// =====================================================================

/**
 * Handles the "Forgot Password" request.
 * Sends a password reset token to the user's email.
 */
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Registeruser.findOne({ email });

        if (!user) {
            // Security best practice: Don't reveal if an email exists or not.
            return res.status(200).json({ message: 'If an account with that email exists, a reset token has been sent.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Token expires in 15 minutes
        await user.save();

        const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`; // A page for this flow
        const message = `You requested a password reset. Please use the following link to reset your password. The link is valid for 15 minutes:\n\n${resetURL}`;

        await sendEmail({ email: user.email, subject: 'JobPortal Password Reset Request', message });
        res.status(200).json({ message: 'If an account with that email exists, a reset token has been sent.' });
    } catch (error) {
        console.error("FORGOT PASSWORD ERROR:", error);
        res.status(500).json({ message: "An error occurred while sending the reset email." });
    }
};

/**
 * Handles the actual password reset using a token from the "Forgot Password" email.
 */
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: "Valid token and new password (min 6 chars) are required." });
        }
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await Registeruser.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Token is invalid or has expired." });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error("RESET PASSWORD ERROR:", error);
        res.status(500).json({ message: "An error occurred while resetting the password." });
    }
};

// =====================================================================
// --- NEWLY ADDED ADMIN & ACTIVATION CONTROLLERS ---
// =====================================================================

/**
 * Creates a new user (Mentor or Employee) and sends them an activation email.
 */
export const adminCreateUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required." });
    }
    const creatableRoles = ["MENTOR", "EMPLOYEE"];
    if (!creatableRoles.includes(String(role).toUpperCase())) {
        return res.status(400).json({ message: "Admins can only create Mentor or Employee roles." });
    }

    try {
        const existingUser = await Registeruser.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "A user with this email already exists." });
        }

        const newUser = await Registeruser.create({
            username, email: email.toLowerCase(), password,
            roles: [String(role).toUpperCase()],
            passwordResetRequired: true,
        });

        const resetToken = crypto.randomBytes(32).toString('hex');
        newUser.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        newUser.resetPasswordExpires = Date.now() + 24 * 60 * 60 * 1000; // 24-hour expiry

        await newUser.save();

        const resetURL = `${process.env.FRONTEND_URL}/force-reset-password?token=${resetToken}`;
        const message = `Hello ${newUser.username},\n\nAn administrator has created an account for you on our JobPortal.\n\nPlease click the following link to set your password and activate your account. This link is valid for 24 hours:\n\n${resetURL}\n\nIf you did not request this, please ignore this email.\n\nThank you,\nThe JobPortal Team`;

        await sendEmail({
            email: newUser.email,
            subject: 'Activate Your JobPortal Account',
            message,
        });

        res.status(201).json({
            message: `User '${newUser.username}' created successfully. An activation email has been sent to ${newUser.email}.`,
        });

    } catch (error) {
        console.error("Admin Create User Error:", error);
        res.status(500).json({ message: "Failed to create user or send email due to a server error." });
    }
};

/**
 * Allows a user to set their password using a token from an activation email link.
 */
export const forceResetPassword = async (req, res) => {
    const { newPassword, token } = req.body;

    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }
    if (!token) {
        return res.status(400).json({ message: "Activation token is missing from the request." });
    }

    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await Registeruser.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Activation link is invalid or has expired." });
        }

        user.password = newPassword;
        user.passwordResetRequired = false;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        
        await user.save();

        res.status(200).json({ message: "Password has been set successfully. You can now log in with your new password." });

    } catch (error) {
        console.error("Force Reset Password Error:", error);
        res.status(500).json({ message: "Failed to update password due to a server error." });
    }
};