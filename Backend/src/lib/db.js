import mongoose from "mongoose";
<<<<<<< HEAD
=======
import dotenv from "dotenv";

dotenv.config(); // Load env variables
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://Awarjana:Left.1234@jobportal.2vt1i.mongodb.net/jobportal_db?retryWrites=true&w=majority&appName=jobPortal");
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
<<<<<<< HEAD
        console.log("MongoDB connection error:", error);
=======
        console.error("MongoDB connection error:", error);
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
    }
};
