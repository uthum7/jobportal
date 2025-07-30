import Job from "../models/Job.model.js";

import mongoose from 'mongoose';
export const getJobCount = async (req, res) => {
    try {
        const jobCount = await Job.countDocuments();
        res.status(200).json({
            "Message": "Success",
            "JobCount": jobCount,
        });
    } catch (err) {
        res.json({
            "Error": err
        }).status(500);
    }
}

export const deleteJobPost = async (req, res) => {
    try {
        const jobId = req.params.id;

        // Validate if jobId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid job ID format"
            });
        }

        // Option 1: Using mongoose (recommended)
        const deletedJob = await Job.findByIdAndDelete(jobId);

        // Option 2: If you prefer ObjectId (but not necessary with mongoose)
        // const deletedJob = await Job.findByIdAndDelete(new ObjectId(jobId));

        console.log(jobId + " Deleted");

        if (!deletedJob) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Job deleted successfully",
            jobId: jobId
        });
    } catch (err) {
        console.error("Delete job error:", err);
        res.status(500).json({
            success: false,
            message: "Error deleting job",
            error: err.message
        });
    }
}
export const createJobPost = async (req, res) => {
    try {
        const {
            JobTitle,
            JobExperienceYears,
            JobMode,
            JobType,
            JobDeadline,
            JobDescription,
            JobRequirements,
            JobQualifications,
            JobResponsibilities,
            JobTags
        } = req.body;


        const job = new Job({
            "JobTitle": JobTitle,
            "JobMode": JobMode,
            "JobExperienceYears": JobExperienceYears,
            "JobType": JobType,
            "JobDeadline": JobDeadline,
            "JobDescription": JobDescription,
            "Requirements": JobRequirements,
            "Qualifications": JobQualifications,
            "Responsibilities": JobResponsibilities,
            "Tags": JobTags
        })

        await job.save()

        res.status(200).json({
            "Message": "Success",
            "JobID": job._id,

        })
    } catch (err) {
        res.json({
            "Error": err
        }).status(500)
    }
}

export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ postedDate: -1 });
        console.log("Job API Called");
        console.log(jobs);
        res.status(200).json({
            "Message": "Success",
            "Jobs": jobs
        })
    } catch (err) {
        res.json({
            "Error": err
        }).status(500)
    }
}

// Get all jobs with keyword filter only
export const getAllFiteredJobs = async (req, res) => {
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