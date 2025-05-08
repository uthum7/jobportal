/*import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true }, // J0001 format
  title: { type: String, required: true },
  jobType: { type: String, required: true }, // e.g., full time, part time
  experienceYears: { type: Number, required: true },
  salary: {
    min: { type: Number },
    max: { type: Number },
  },
  role: { type: String, required: true },
  postDate: { type: Date, required: true },
  applicationDeadline: { type: Date },
  jobDescription: { type: String, required: true }, 
  requirements: { type: [String], default: [] },
  responsibilities: { type: [String], default: [] },
  qualificationSkills: [String],
  tags: [String],
  
});

export const Job = mongoose.model("Job", jobSchema);*/

import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  JobTitle: { type: String, required: true },
  JobExperienceYears: { type: Number, required: true },
  JobMode: { type: String, required: true }, // e.g., Onsite, Remote
  JobType: { type: String, required: true },  // e.g., Full-time, Part-time
  JobDeadline: { type: Date },
  JobDescription: { type: String, required: true },
  Requirements: { type: [String], default: [] },
  Responsibilities: { type: [String], default: [] },
  Qualifications: { type: [String], default: [] },
  Tags: { type: [String], default: [] },
  postedDate: { type: Date, required: true },
});

export const Job = mongoose.model("Job", jobSchema);


