// index.js (Backend Main Server File)
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import RegisterUserRoutes from "./routes/RegisterUser.route.js";
import ProfileRoutes from "./routes/Profile.route.js";
import AdminChangePasswordRoutes from "./routes/AdminChangePassword.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";


import registerUserRoutes from "./routes/register.routes.js";
import cvRoutes from "./routes/cv.routes.js";
import jobPostRoutes from "./routes/Job.route.js";
import aiRoutes from "./routes/gemini.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import savedJobRoutes from "./routes/savedJob.route.js";
import appliedJobRoutes from "./routes/appliedJobs.route.js";
import applicationRoutes from "./routes/application.route.js";

import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("❌ FATAL ERROR: MONGO_URL is not defined in your .env file.");
  process.exit(1);
}

console.log(`🛠 Environment: ${process.env.NODE_ENV || "development"}`);

// ✅ --- Apply Middleware BEFORE routes ---
app.use(express.json()); // ✅ Fix: must be before all routes that use req.body
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS: only apply once
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5176",
  "http://localhost:5174"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ Not allowed by CORS: " + origin));
      }
    },
    credentials: true
  })
);

// ✅ --- Connect DB & Start Server ---
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    server.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log("🔌 Socket.IO is attached and listening on the same port.");
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });

// ✅ --- Route Registration ---
console.log("🔧 Registering API routes...");

app.use("/api/users", RegisterUserRoutes);
app.use("/api", ProfileRoutes);
app.use("/api/admin", AdminChangePasswordRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/register", registerUserRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/job", jobPostRoutes);
app.use('/api/saved-jobs', savedJobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/applied-jobs', appliedJobRoutes);

app.use("/api/ai", aiRoutes);
app.use('/api/dashboard', dashboardRoutes);


console.log("✅ API routes registered.");

// ✅ --- 404 Handler ---
app.use("/api/*", (req, res, next) => {
  if (!res.headersSent) {
    console.warn(`[API 404] Endpoint not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
      message: `The API endpoint ${req.method} ${req.originalUrl} was not found.`
    });
  } else {
    next();
  }
});

// ✅ --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR HANDLER");
  console.error("Error:", err.message);
  if (process.env.NODE_ENV === "development") {
    console.error("Stack:", err.stack);
  }

  if (res.headersSent) return next(err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "An unexpected server error occurred.";

  if (req.path.startsWith("/api/")) {
    res.status(statusCode).json({
      message,
      ...(process.env.NODE_ENV === "development" && {
        errorDetails: err.toString(),
        stack: err.stack
      })
    });
  } else {
    res.status(statusCode).send(message);
  }
});
