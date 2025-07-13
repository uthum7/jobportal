import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  userId: { type: String, required: true },
  applicationData: {
    fullName: { type: String, required: true },
    nic: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
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

export const Application = mongoose.model("Application", applicationSchema);