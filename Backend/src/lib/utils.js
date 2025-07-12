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

/**
 * Sends an email using Nodemailer with Ethereal for development.
 * 
 * @param {object} options - Email options
 * @param {string} options.email - The recipient's email address
 * @param {string} options.subject - The subject of the email
 * @param {string} options.message - The plain text message body
 */
export const sendEmail = async (options) => {
    // For development, using a temporary Ethereal email account
    // In production, you would replace these transport options with your actual email provider (SendGrid, etc.)
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'maddison53@ethereal.email', // Public test account from Nodemailer docs
            pass: 'jn7jnAPss4f63QBp6D'      // Public test account password
        }
    });

    const mailOptions = {
        from: '"JobPortal Support" <no-reply@jobportal.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        // The Preview URL lets you see the email in your browser without a real inbox
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error("Email could not be sent:", error);
        // Throw an error so the calling function (forgotPassword) knows it failed
        throw new Error("Email service failed to send the token."); 
    }
};