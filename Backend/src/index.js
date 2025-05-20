import express from "express";
import dotenv from "dotenv";
import cors from "cors"; //  Import CORS
import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import jobRoutes from "./routes/job.route.js";
import messageRoutes from "./routes/message.route.js";
import savedJobRoutes from './routes/savedJob.route.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS for frontend (http://localhost:5173)
app.use(cors({
  origin: "http://localhost:5173"
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to the MongoDB database
connectDB();

// Optional test route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/jobs", jobRoutes);
app.use('/api/saved-jobs', savedJobRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
