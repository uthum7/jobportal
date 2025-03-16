// const router = express.Router();


const express = require("express");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Registeruser = require("../models/Registeruser"); // Import the model
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
/** 
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
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
      // const salt = await bcrypt.genSalt(10);
     //  const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await Registeruser.create({
            username,
            email,
            password,//: hashedPassword, // Save hashed password
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

/** 
 * @route   POST /api/auth/login
 * @desc    Login user & return user info
 * @access  Public
 */
router.post(
    "/login",
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;
        console.log("Login attempt for email:", email);

        const user = await Registeruser.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email" });
        }

        console.log("Entered password:", password);
        console.log("Stored hashed password:", user.password);

        // Compare passwords
        // const isMatch = await bcrypt.compare(password, user.password);
        // console.log("Password match result:", isMatch);


      // const isMatch = await bcrypt.compare(password, user.password);
       //console.log(isMatch);

         const isMatch = password === user.password;

        if (isMatch) {

            // Create a JWT token
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token,
                message: "Login successful",
            });
        } else {
            res.status(401).json({ message: "Invalid password" });
        }
    })
);

/** 
 * @route   POST /api/auth/logout
 * @desc    Logout user (clear session/cookies)
 * @access  Private
 */
router.post(
    "/logout",
    asyncHandler(async (req, res) => {
        res.json({ message: "Logged out successfully" });
    })
);

module.exports = router;
