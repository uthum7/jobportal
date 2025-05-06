import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";

import messageRoutes from "./routes/message.route.js";
import jobPostRoutes from "./routes/JobPost.route.js";



dotenv.config(); // <-- Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json())

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/job", jobPostRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
    connectDB();
});
