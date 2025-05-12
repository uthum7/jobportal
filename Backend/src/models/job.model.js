
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


