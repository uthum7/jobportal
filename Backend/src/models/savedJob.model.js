// src/models/savedJob.model.js

import mongoose from 'mongoose';

// Define the schema for a saved job
const savedJobSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true, // jobId is required
  },
  userId: {
    type: String,
    required: true, // userId is required
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create a compound index to ensure each job can be saved only once per user
savedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

// Create a model named 'SavedJob' from the schema
const SavedJob = mongoose.model('SavedJob', savedJobSchema);

export default SavedJob; // Export the model to be used in controller
