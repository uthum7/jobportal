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

