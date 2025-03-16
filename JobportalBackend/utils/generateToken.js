const jwt = require("jsonwebtoken");

const generateToken = (res, userId) => {
    // Ensure JWT_EXPIRE_IN is in the correct format
    const expiresIn = process.env.JWT_EXPIRE_IN || "1h"; // Default to 1 hour if not set

    // Generate the JWT token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn, // Use the expiresIn value
    });

    // Set the token in an HTTP-only cookie
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Ensure cookies are only sent over HTTPS in production
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Return the token (optional, if needed elsewhere)
    return token;
};

module.exports = generateToken;