const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser'); // Added for JWT authentication

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 8091;
const MONGODB_URL = process.env.MONGODB_URL;

// Middleware
app.use(cors());
app.use(express.json()); // Built-in body parser
app.use(cookieParser()); // Parses cookies for authentication

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL); // Removed deprecated options
        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1); // Exit process if connection fails
    }
};

connectDB();

// Register routes
const registerUserRoutes = require('./routes/Registerusers'); // Fixed incorrect import
app.use('/api/register', registerUserRoutes); // RESTful route naming

const cvRoutes = require('./routes/CvRoutes');
app.use('/api/cv', cvRoutes); // Changed route name for consistency

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
});