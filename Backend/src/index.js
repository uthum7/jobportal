// index.js (Backend Main Server File)
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

// Import Routes - Ensure these paths are correct relative to your index.js
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import dashboardRoutes from './routes/dashboard.route.js';
import messageRoutes from "./routes/message.route.js";
import registerUserRoutes from "./routes/register.routes.js";
import cvRoutes from "./routes/cv.routes.js";
import jobPostRoutes from "./routes/Job.route.js";
import savedJobRoutes from "./routes/savedJob.route.js";
import appliedJobRoutes from "./routes/appliedJobs.route.js";
import applicationRoutes from "./routes/application.route.js";

// --- FIX 1: Correctly import the AI routes ---
import aiRoutes from "./routes/gemini.route.js"; // Renamed variable to camelCase `aiRoutes` for consistency

// Import app and server from your socket setup
import { app, server } from "./lib/socket.js";

// Load environment variables from .env file
dotenv.config();

// Configuration constants
const PORT = process.env.PORT || 5001;
const MONGO_URL = process.env.MONGO_URL;

console.log("--- The MongoDB connection string my app is using is:", MONGO_URL);

if (!MONGO_URL) {
    console.error("FATAL ERROR: MONGO_URL is not defined in your .env file.");
    process.exit(1);
}

// --- Core Middleware ---
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Database Connection ---
// const connectDB = async () => {
//     try {
//         await mongoose.connect(MONGO_URL);
//         console.log('✅ MongoDB connected successfully');
//     } catch (error) {
//         console.error('❌ MongoDB connection error:', error.message);
//         process.exit(1);
//     }
// };

// --- API Routes Registration ---
console.log("Registering API routes...");
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/register", registerUserRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/job", jobPostRoutes);
app.use('/api/saved-jobs', savedJobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/applied-jobs', appliedJobRoutes);

// --- FIX 2: Connect the AI routes to your app ---
app.use("/api/ai", aiRoutes); // This will make your route available at /api/ai/...
console.log("API routes registered.");
app.use('/api/dashboard', dashboardRoutes);


// --- Error Handling Middleware ---
// ... (Your error handling code is perfect, no changes needed here) ...
app.use('/api/*', (req, res, next) => {
    if (!res.headersSent) {
        console.warn(`[API 404] Endpoint not found: ${req.method} ${req.originalUrl}`);
        res.status(404).json({ message: `The API endpoint ${req.method} ${req.originalUrl} was not found.` });
    } else {
        next();
    }
});

app.use((err, req, res, next) => {
    console.error("--- GLOBAL ERROR HANDLER CAUGHT ---");
    console.error("Error Message:", err.message);
    console.error("Error Status Code:", err.statusCode || err.status);
    if (process.env.NODE_ENV === 'development') {
        console.error("Error Stack:", err.stack);
    }
    console.error("---------------------------------");

    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'An unexpected server error occurred.';

    if (req.path.startsWith('/api/')) {
        res.status(statusCode).json({
            message: message,
            ...(process.env.NODE_ENV === 'development' && { errorDetails: err.toString(), stack: err.stack }),
        });
    } else {
        res.status(statusCode).send(message);
    }
});


// --- Start Server ---
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
        console.log(`🔌 Socket.IO is attached and listening on the same port.`);
    });
}).catch(err => {
    console.error("Failed to start server due to DB connection issue:", err);
    process.exit(1);
});