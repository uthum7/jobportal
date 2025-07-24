// Backend/src/models/application.model.js
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'jobs', required: true },
  userId: { type: String, required: true },
  applicationData: {
    fullName: { type: String, required: true },
    nic: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    birthday: { type: Date, required: true },  
    gender: { type: String, required: true }, 
    skills: [{ type: String }],
    education: [{
      institute: String,
      degree: String,
      startDate: Date,
      endDate: Date,
      currentlyStudying: Boolean
    }],
    summary: String,
    workExperience: [{
      jobTitle: String,
      company: String,
      startDate: Date,
      endDate: Date,
      description: String,
      currentlyWorking: Boolean
    }],
    certifications: [{ type: String }],
    coverLetter: String
  },
  appliedDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'reviewed', 'shortlisted', 'rejected'], default: 'pending' }
});

// Prevent duplicate applications for same job by same user
applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

export const Application = mongoose.model("Application", applicationSchema);