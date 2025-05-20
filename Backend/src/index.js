import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

// Import Routes
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import registerUserRoutes from "./routes/register.routes.js"; // Corrected name
import cvRoutes from "./routes/cv.routes.js"; // Corrected name

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL; // Corrected to match .env variable

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
const connectDB = async () => {
    try {
        // Removed the deprecated options
        await mongoose.connect(MONGO_URL);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1); // Stop server if DB fails
    }
};

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/register", registerUserRoutes);
app.use("/api/cv", cvRoutes);

// New Route for saving data
app.post('/api/save', (req, res) => {
    const { key, data } = req.body;

    // Simulate saving data to a database
    console.log(`Saving data for key: ${key}`, data);

    res.status(200).send({ message: 'Data saved successfully' });
});

// Start server after DB is connected
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on PORT: ${PORT}`);
    });
});
