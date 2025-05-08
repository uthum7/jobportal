import { Job } from "../models/job.model.js";

export const getJobs = async (req, res) => {
  try {
    const { keyword, experience, postedDate } = req.query;
    const query = {};

    // Handle keyword search
    if (keyword) {
      const regex = new RegExp(keyword, "i"); // Case-insensitive partial match
      query.$or = [
        { JobTitle: regex },
        { JobDescription: regex },
        { Tags: regex }
      ];
    }

    // Handle experience level filtering
    if (experience) {
      const experienceValue = parseInt(experience);
    
      if (!isNaN(experienceValue)) {
        if (experienceValue === 0) {
          // Beginner: Less than 1 year
          query.JobExperienceYears = { $lt: 1 };
        } else if (experienceValue === 10) {
          // 10+ Years
          query.JobExperienceYears = { $gte: 10 };
        } else {
          // Exact year match
          query.JobExperienceYears = experienceValue;
        }
      }
    }

    // Posted date filter
    if (postedDate) {
      const postedDateFilters = postedDate.split(",");
      const postedDateConditions = [];

      postedDateFilters.forEach((filter) => {
        switch (filter) {
          case "last_hour":
            postedDateConditions.push({
              postedDate: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
            });
            break;
          case "last_24_hours":
            postedDateConditions.push({
              postedDate: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            });
            break;
          case "last_week":
            postedDateConditions.push({
              postedDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            });
            break;
          case "last_30_days":
            postedDateConditions.push({
              postedDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            });
            break;
          case "older":
            postedDateConditions.push({
              postedDate: { $lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            });
            break;
          default:
            break;
        }
      });

      if (postedDateConditions.length > 0) {
        query.$or = postedDateConditions;
      }
    }

    const jobs = await Job.find(query).sort({ postedDate: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Error fetching jobs", details: err.message });
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
