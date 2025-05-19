import { Job } from "../models/job.model.js";

export const getJobs = async (req, res) => {
  try {
    const { keyword, experience, postedDate, jobMode } = req.query;
    const query = {};
    const andConditions = [];
    
    // Keyword filter (JobTitle, JobDescription, Tags)
    if (keyword) {
      const regex = new RegExp(keyword, "i");
      andConditions.push({
        $or: [
          { JobTitle: regex },
          { JobDescription: regex },
          { Tags: regex }
        ]
      });
    }
    
    // Experience filter
    if (experience) {
      const exp = parseInt(experience);
      if (!isNaN(exp)) {
        if (exp === 0) {
          andConditions.push({ JobExperienceYears: { $lt: 1 } });
        } else if (exp === 10) {
          andConditions.push({ JobExperienceYears: { $gte: 10 } });
        } else {
          andConditions.push({ JobExperienceYears: exp });
        }
      }
    }
    
    // Posted date filter
    if (postedDate) {
      const postedDateFilters = postedDate.split(",");
      const now = Date.now();
      const postedDateConditions = [];
      postedDateFilters.forEach((filter) => {
        switch (filter) {
          case "last_hour":
            postedDateConditions.push({ postedDate: { $gte: new Date(now - 60 * 60 * 1000) } });
            break;
          case "last_24_hours":
            postedDateConditions.push({ postedDate: { $gte: new Date(now - 24 * 60 * 60 * 1000) } });
            break;
          case "last_week":
            postedDateConditions.push({ postedDate: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } });
            break;
          case "last_30_days":
            postedDateConditions.push({ postedDate: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } });
            break;
          case "older":
            postedDateConditions.push({ postedDate: { $lt: new Date(now - 30 * 24 * 60 * 60 * 1000) } });
            break;
        }
      });
      if (postedDateConditions.length > 0) {
        andConditions.push({ $or: postedDateConditions });
      }
    }
    
    // Job Type filter
    if (req.query.jobType) {
      andConditions.push({ JobType: req.query.jobType });
    }
    
    // Job Mode filter
    if (req.query.jobMode) {
      andConditions.push({ JobMode: req.query.jobMode });
    }
    
    // Combine all conditions
    if (andConditions.length > 0) {
      query.$and = andConditions;
    }
    
    const jobs = await Job.find(query).sort({ postedDate: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Error fetching jobs", details: err.message });
  }
};

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