// Backend/src/controllers/registerauth.controller.js

import Registeruser from "../models/Registeruser.js";
import UserCv from "../models/UserCv.js";
import { sendEmail } from "../lib/utils.js"; // Your email sending utility
import crypto from 'crypto';
import jwt from "jsonwebtoken";

// =====================================================================
// --- STANDARD AUTHENTICATION CONTROLLERS ---
// =====================================================================
// signup, login, logout, and checkAuth controllers remain the same...

/**
 * Handles public registration for roles like MENTEE and JOBSEEKER.
 */
export const signup = async (req, res) => {
    const { username, email, password, roles } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const existingUser = await Registeruser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const newUser = await Registeruser.create({
            username,
            email,
            password: hashedPassword,
        });
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
        });
    } catch (error) {
        console.error("Signup error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Handles user login for all roles.
 */
export const login = async (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return res.status(400).json({ message: "Email, password, and role are required." });
    }
    const requestedRole = String(role).toUpperCase();
    try {
        const user = await Registeruser.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        if (!user.roles.includes(requestedRole)) {
          return res.status(403).json({ message: "You do not have permission to log in with this role." });
        }
         const token = generateToken(user._id);
        res.status(200).json({
            message: "Login successful",
            token, // Send token to frontend
            _id: user._id,
            username: user.username,
            email: user.email,
            roles: user.roles,
        });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { httpOnly: true, maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const checkAuth = (req, res) => {
    try {
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
 * Generates a token and sends it to the user's email.
 */
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Registeruser.findOne({ email });

        if (!user) {
            // Security Best Practice: Don't reveal if an email exists or not.
            return res.status(200).json({ message: 'If an account with that email exists, a reset token has been sent.' });
        }

        // --- Generate a non-hashed token for the email ---
        const resetToken = crypto.randomBytes(32).toString('hex');

        // --- Hash the token before saving it to the database for security ---
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Token is valid for 15 minutes
        await user.save();

        // --- Construct the message with the token for the user ---
        // This is the raw token the user will paste into the form on the frontend.
        const message = `You requested a password reset. Please use the following token to reset your password. The token is valid for 15 minutes:\n\n${resetToken}\n\nIf you did not request this, please ignore this email.`;

        // Send the email using the utility function
        await sendEmail({
            email: user.email,
            subject: 'JobPortal Password Reset Request',
            message: message, // Use the constructed message
        });

        // Send a success response to the frontend
        res.status(200).json({ message: 'If an account with that email exists, a reset token has been sent to it.' });

    } catch (error) {
        console.error("FORGOT PASSWORD ERROR:", error);
        // Clear sensitive fields in case of a failure after they were set
        if (req.body.email) {
            const user = await Registeruser.findOne({ email: req.body.email });
            if (user) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                await user.save();
            }
        }
        res.status(500).json({ message: "An error occurred while sending the reset email." });
    }
};

// --- NEW RESET PASSWORD FUNCTION ---
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: "A valid token and a new password (min 6 chars) are required." });
        }
        // Hash the token received from the user to compare it with the one in the database
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await Registeruser.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }, // Check if the token has not expired
        });

        if (!user) {
            return res.status(400).json({ message: "Token is invalid or has expired." });
        }

        // If the token is valid, update the password and clear the reset fields
        user.password = newPassword;
        // Clear the token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save(); // The pre-save hook will hash the new password

        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error("RESET PASSWORD ERROR:", error);
        res.status(500).json({ message: "An error occurred while resetting the password." });
    }
};

// =====================================================================
// --- ADMIN & ACTIVATION CONTROLLERS ---
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

        // Use the same token logic as password reset, but with a longer expiry
        const resetToken = crypto.randomBytes(32).toString('hex');
        newUser.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        newUser.resetPasswordExpires = Date.now() + 24 * 60 * 60 * 1000; // 24-hour expiry
        await newUser.save();

        const resetURL = `${process.env.FRONTEND_URL}/force-reset-password?token=${resetToken}`;
        const message = `Hello ${newUser.username},\n\nAn administrator has created an account for you on our JobPortal.\n\nPlease click the following link to set your password and activate your account. This link is valid for 24 hours:\n\n${resetURL}\n\nThank you,\nThe JobPortal Team`;

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
        res.status(200).json({ message: "Password has been set successfully. You can now log in." });
    } catch (error) {
        console.error("Force Reset Password Error:", error);
        res.status(500).json({ message: "Failed to update password due to a server error." });
    }
};