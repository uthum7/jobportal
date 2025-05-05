import { Job } from "../models/job.model.js";

export const getJobs = async (req, res) => {
  try {
    const { keyword, experience } = req.query;
    const query = {};

    // Handle keyword search
    if (keyword) {
      const regex = new RegExp(keyword, "i"); // Case-insensitive partial match
      query.$or = [
        { title: regex },
        { role: regex },
        { jobDescription: regex },
        { tags: regex }
      ];
    }

    // Handle experience level filtering
    if (experience) {
      const experienceLevels = experience.split(",");
      const experienceConditions = [];

      experienceLevels.forEach((level) => {
        switch (level) {
          case "Beginner":
            experienceConditions.push({ experienceYears: { $lt: 1 } });
            break;
          case "1+ Year":
            experienceConditions.push({ experienceYears: { $gte: 1 } });
            break;
          case "2 Year":
            experienceConditions.push({ experienceYears: { $gte: 2 } });
            break;
          case "3+ Year":
            experienceConditions.push({ experienceYears: { $gte: 3 } });
            break;
          case "4+ Year":
            experienceConditions.push({ experienceYears: { $gte: 4 } });
            break;
          case "5+ Year":
            experienceConditions.push({ experienceYears: { $gte: 5 } });
            break;
          case "10+ Year":
            experienceConditions.push({ experienceYears: { $gte: 10 } });
            break;
          default:
            break;
        }
      });

      if (experienceConditions.length > 0) {
        query.$or = experienceConditions;
      }
    }

    const jobs = await Job.find(query).sort({ postDate: -1 });
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
}