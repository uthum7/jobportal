// Backend/src/models/application.model.js
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'jobs', required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // It’s better if userId is also ObjectId
    ref: "RegisterUser",                   // Reference to user model
    required: true
  },
  applicationData: {
    fullName: { type: String, required: true },
    nic: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    birthday: { type: Date, required: true },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Prefer not to say'] },
    age: { type: Number }, // auto-calculated, optional
    technicalSkills: [{ type: String }],
    languages: [{ type: String }],
    socialLinks: {
      linkedIn: { type: String },
      github: { type: String },
      portfolio: { type: String }
    },
    education: [{
      institute: { type: String, required: true },
      educationLevel: { type: String, required: true, enum: ['O/L', 'A/L', 'Diploma', 'Bachelor’s', 'Master’s', 'PhD', 'Other'] },
      fieldOfStudy: { type: String },
      gpaOrGrade: { type: String },
      results: [{ subject: String, grade: String }], // for O/L and A/L
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      currentlyStudying: { type: Boolean, default: false }
    }],
    workExperience: [{
      jobTitle: { type: String, required: true },
      company: { type: String, required: true },
      industry: { type: String },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      currentlyWorking: { type: Boolean, default: false },
      description: { type: String }
    }],
    projects: [{
      title: { type: String, required: true },
      description: { type: String },
      technologies: [{ type: String }],
      link: { type: String }
    }],
    certifications: [{
      name: { type: String, required: true },
      issuer: { type: String },
      year: { type: String }
    }],
    coverLetter: { type: String },
    summary: { type: String }
  },
  appliedDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
});

// Prevent duplicate applications for same job by same user
applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

export const Application = mongoose.model("Application", applicationSchema);