// Backend/src/lib/utils.js

import jwt from "jsonwebtoken";
<<<<<<< HEAD
import nodemailer from "nodemailer"; // <-- ADD THIS IMPORT

/**
 * Generate a JWT token and set it in an HTTP-only cookie.
 * 
=======
import nodemailer from "nodemailer";

/**
 * Generate a JWT token and set it in an HTTP-only cookie.
 * This function is unchanged and remains as it was.
 *
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
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
<<<<<<< HEAD
        httpOnly: true,                           // Prevents JS access
        secure: process.env.NODE_ENV === "production", // Send only over HTTPS in production
        sameSite: "strict",                      // Protects against CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000,         // 7 days in milliseconds
=======
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
    });

    return token;
};

<<<<<<< HEAD
/**
 * Sends an email using Nodemailer with Ethereal for development.
 * 
=======

/**
 * Sends an email using Nodemailer and the Gmail SMTP credentials from the .env file.
 *
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
 * @param {object} options - Email options
 * @param {string} options.email - The recipient's email address
 * @param {string} options.subject - The subject of the email
 * @param {string} options.message - The plain text message body
 */
export const sendEmail = async (options) => {
<<<<<<< HEAD
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
=======
    try {
        // 1. Create the Nodemailer transporter using Gmail's SMTP credentials
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,      // Should be 'smtp.gmail.com' in your .env
            port: process.env.EMAIL_PORT,      // Should be 587 in your .env
            secure: false,                     // false because we use TLS on port 587. true is for port 465.
            auth: {
                user: process.env.EMAIL_USER,  // Your full Gmail address from .env
                pass: process.env.EMAIL_PASS,  // Your 16-character Google App Password from .env
            },
        });

        // 2. Define the email data (no changes needed here)
        const mailOptions = {
            from: process.env.EMAIL_FROM,      // The "from" address from your .env file
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        // 3. Send the email
        await transporter.sendMail(mailOptions);
        // ✅ FIX: String with a variable must use a template literal (backticks)
        console.log(`Email sent successfully to ${options.email} via Gmail.`); // Updated log message

    } catch (error) {
        console.error("Email could not be sent:", error);
        // This error is thrown so the controller function that called it knows the email failed.
        // This is crucial for sending the correct error response back to the client.
        throw new Error("Email service failed to send the token.");
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
    }
};