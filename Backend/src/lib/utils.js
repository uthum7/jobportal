// Backend/src/lib/utils.js

import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

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
        httpOnly: true,                           // Prevents client-side JS access
        secure: process.env.NODE_ENV === "production", // Send only over HTTPS in production
        sameSite: "strict",                      // Helps protect against CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000,         // 7 days in milliseconds
    });

    return token;
};


/**
 * Sends an email using Nodemailer and the Brevo SMTP credentials from the .env file.
 * 
 * @param {object} options - Email options
 * @param {string} options.email - The recipient's email address
 * @param {string} options.subject - The subject of the email
 * @param {string} options.message - The plain text message body
 */
export const sendEmail = async (options) => {
    try {
        // 1. Create the Nodemailer transporter using credentials from your .env file
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_PORT == 465, // `true` for port 465, `false` for other ports like 587
            auth: {
                user: process.env.EMAIL_USER, // Your Brevo SMTP login username
                pass: process.env.EMAIL_PASS, // Your Brevo SMTP password
            },
        });

        // 2. Define the email data
        const mailOptions = {
            from: process.env.EMAIL_FROM, // The "from" address configured in your .env file
            to: options.email,
            subject: options.subject,
            text: options.message,
            // You could also add an html property for richer emails:
            // html: '<b>Hello world?</b>'
        };

        // 3. Send the email
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${options.email} via Brevo.`);

    } catch (error) {
        console.error("Email could not be sent:", error);
        // Throw a new error to be caught by the controller function that called this.
        // This ensures the controller knows the email failed and can send a 500 error back to the client.
        throw new Error("Email service failed to send the token."); 
    }
};