const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 8090;
const MONGODB_URL = process.env.MONGODB_URL;

// Middleware
app.use(cors());
app.use(express.json()); // bodyParser is built into Express now

// Connect to MongoDB
mongoose.connect(MONGODB_URL)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Check MongoDB connection
mongoose.connection.once('open', () => {
  console.log("🔗 MongoDB connection success!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port: ${PORT}`);
});

const registeruserRoutes = require('./routes/Registerusers');
app.use('/registerusers', registeruserRoutes);
