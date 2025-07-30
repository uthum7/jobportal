// Backend/src/controllers/registerauth.controller.js

import Registeruser from "../models/Registeruser.js";
import { generateToken,sendEmail } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import UserCv from "../models/UserCv.js";

import Counselors from "../models/counselors.model.js";

// --- NEW IMPORTS for Password Reset ---
import crypto from 'crypto';
// import sendEmail from '../lib/utils.js'; // Assuming you created sendEmail in utils.js

// --- EXISTING SIGNUP FUNCTION (No Changes) ---
export const signup = async (req, res) => {
    const { username, email, password } = req.body;

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
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Registeruser.create({
            username,
            email,
            password: hashedPassword,
        });
        await UserCv.create({
            userId: newUser._id,
            personalInfo: {},
            educationDetails: {},
            professionalExperience: [],
            skill: [],
            summary: "",
            references: []
        });
        generateToken(newUser._id, res);
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

// --- EXISTING LOGIN FUNCTION (No Changes) ---
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Registeruser.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        generateToken(user._id, res);
        if (user.roles && user.roles[0] === 'MENTOR') {
            console.log("Mentor login detected, including counselors_id if available.");
            res.status(200).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.roles[0],
                counselors_id: user.counselors_id || null // Include counselors_id if it exists

            });
        } else {
            res.status(200).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.roles[0]
                
            });
        }
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// --- EXISTING LOGOUT FUNCTION (No Changes) ---
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { httpOnly: true, maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// --- EXISTING CHECKAUTH FUNCTION (No Changes) ---
export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Check auth error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// --- NEW FORGOT PASSWORD FUNCTION ---
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Registeruser.findOne({ email });

        if (!user) {
            // Security measure: Do not reveal if the user exists.
            return res.status(200).json({ message: 'If an account with that email exists, a reset token has been sent.' });
        }

        // Generate a 6-digit token
        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Hash the token for database storage
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        // Set token to expire in 15 minutes
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; 

        await user.save();

        // Send the plain (un-hashed) token to the user's email
        const message = `Your password reset token is: ${resetToken}\nThis token is valid for 15 minutes.`;

        await sendEmail({
            email: user.email,
            subject: 'JobPortal Password Reset Token',
            message,
        });

        res.status(200).json({ message: 'If an account with that email exists, a reset token has been sent.' });

    } catch (error) {
        console.error("FORGOT PASSWORD ERROR:", error);
        res.status(500).json({ message: "An error occurred while sending the reset email." });
    }
};

// --- NEW RESET PASSWORD FUNCTION ---
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required." });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Hash the incoming token to match the one in the database
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await Registeruser.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }, // Check that the token is not expired
        });

        if (!user) {
            return res.status(400).json({ message: "Token is invalid or has expired." });
        }

        // Hash the new password before saving
        user.password = await bcrypt.hash(newPassword, 10);
        // Clear the token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        // Optionally, log the user in immediately after reset by generating a new token
        // generateToken(user._id, res);

        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error("RESET PASSWORD ERROR:", error);
        res.status(500).json({ message: "An error occurred while resetting the password." });
    }
};