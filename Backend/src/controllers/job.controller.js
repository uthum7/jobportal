import { Job } from "../models/job.model.js";

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postDate: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Error fetching jobs" });
  }
};

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
