import jwt from "jsonwebtoken";

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
