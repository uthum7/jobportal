// Backend/src/lib/utils.js

import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"; // <-- ADD THIS IMPORT

/**
 * Generate a JWT token and set it in an HTTP-only cookie.
 * 
 * @param {string} userId - The ID of the user
 * @param {import('express').Response} res - Express response object
 * @returns {string} token - The generated JWT token
 */
export const generateToken = (userId, res) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRE_IN || "7d";

    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign({ userId }, secret, { expiresIn });

    res.cookie("jwt", token, {
        httpOnly: true,                           // Prevents JS access
        secure: process.env.NODE_ENV === "production", // Send only over HTTPS in production
        sameSite: "strict",                      // Protects against CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000,         // 7 days in milliseconds
    });

    return token;
};

// PASTE THIS NEW VERSION INTO YOUR utils.js FILE

/**
 * Sends an email using Nodemailer and credentials from the .env file.
 * 
 * @param {object} options - Email options
 * @param {string} options.email - The recipient's email address
 * @param {string} options.subject - The subject of the email
 * @param {string} options.message - The plain text message body
 */
export const sendEmail = async (options) => {
    // This now correctly uses your .env file
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // `false` for port 587
        auth: {
            user: process.env.EMAIL_USER, // Reads the user from .env
            pass: process.env.EMAIL_PASS, // Reads the password from .env
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM, // Reads the "from" address from .env
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent to ${options.email} via Brevo`);
    } catch (error) {
        console.error("Email could not be sent:", error);
        // This makes sure that if Brevo fails, your controller knows about it.
        throw new Error("Email service failed to send the token."); 
    }
};
