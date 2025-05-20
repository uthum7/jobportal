import express from "express";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import Registeruser from "../models/Registeruser.js"; // <-- Default import

 // Use default export for Registeruser
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;


router.post(
    "/register",
    asyncHandler(async (req, res) => {
        const { username, email, password } = req.body;

        console.log("Registration attempt for email:", email);

        // Check if user already exists
        const existingUser = await Registeruser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user with hashed password
        const newUser = await Registeruser.create({
            username,
            email,
            password: hashedPassword, // Save hashed password
        });

        if (newUser) {
            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    })
);


router.post(
    "/login",
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        // Log the login attempt
        console.log("Login attempt for email:", email);

        try {
            // Find user by email
            const user = await Registeruser.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: "Invalid email" });
            }

            // Log the entered and stored passwords for debugging
            // console.log("Entered password:", password);
            // console.log("Stored hashed password:", user.password);

            // // Compare entered password with hashed password
            // const isMatch = await user.matchPassword(password); // Ensure matchPassword is implemented in the model
            // if (!isMatch) {
            //     return res.status(401).json({ message: "Invalid password" });
            // }
           
            // Create a JWT token
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            // Respond with user data and token
            res.status(200).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token,
                message: "Login successful",
            });
        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    })
);


router.post("/test-password", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Registeruser.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await user.matchPassword(password);
        if (isMatch) {
            return res.status(200).json({ message: "Password matches" });
        } else {
            return res.status(401).json({ message: "Password does not match" });
        }
    } catch (error) {
        console.error("Error testing password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post(
    "/logout",
    asyncHandler(async (req, res) => {
        res.json({ message: "Logged out successfully" });
    })
);

export default router; // Use default export for router
