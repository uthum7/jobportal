import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";// Authentication endpoints (login, register, etc.)
import { connectDB } from "./lib/db.js";// MongoDB connection utility

import messageRoutes from "./routes/message.route.js";
import jobPostRoutes from "./routes/JobPost.route.js";
import cookieParser from "cookie-parser";
import{app,server} from "./lib/socket.js";




dotenv.config(); // <-- Load environment variables

const PORT = process.env.PORT;

app.use(express.json({ limit: "10mb" }));// Parse JSON request bodies with 10mb size limit for file uploads
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174","http://localhost:5175","http://localhost:5177"],
        credentials:true,//n your CORS configuration to allow cookies in cross-origin requests
    }))

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/job", jobPostRoutes);


// Start the server and connect to database
server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
    connectDB();// Establish MongoDB connection after server starts
});



