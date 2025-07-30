import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load env variables

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://Awarjana:Left.1234@jobportal.2vt1i.mongodb.net/jobportal_db?retryWrites=true&w=majority&appName=jobPortal");
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};
