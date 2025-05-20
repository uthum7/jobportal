import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";

import messageRoutes from "./routes/message.route.js";
import JobRoutes from "./routes/Job.route.js";
import cookieParser from "cookie-parser";
import{app,server} from "./lib/socket.js";

dotenv.config(); // <-- Load environment variables

const PORT = process.env.PORT;

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174","http://localhost:5175","http://localhost:5177"],
        credentials:true, 
    }))

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/job", JobRoutes);


server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
    connectDB();
});



