// src/models/savedJob.model.js

import mongoose from 'mongoose';

const savedJobSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
}, { timestamps: true });

savedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

const SavedJob = mongoose.model('SavedJob', savedJobSchema);

export default SavedJob;
