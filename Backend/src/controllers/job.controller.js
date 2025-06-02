import { Job } from "../models/job.model.js";

// Get all jobs with keyword filter only
export const getAllJobs = async (req, res) => {
  try {
    const { keyword } = req.query;
    const query = {};

    // Keyword search filter (searches in JobTitle, Tags)
    if (keyword) {
      const regex = new RegExp(keyword, "i"); // Case-insensitive search
      query.$or = [
        { JobTitle: regex },
        { Tags: regex }
      ];
    }

    // Find jobs with keyword filter (if any) and sort by latest
    const jobs = await Job.find(query).sort({ postedDate: -1 });

    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Error fetching jobs", details: err.message });
  }
};

// Get job by ID 
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ error: "Error fetching job details", details: err.message });
  }
};

//  Create job 
export const createJob = async (req, res) => {
  try {
    const jobData = req.body;
    const job = new Job(jobData);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: "Failed to create job", details: err.message });
  }
};
