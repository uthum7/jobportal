import Job from "../models/Job.model.js";
import { Application } from "../models/application.model.js";
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

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid job ID format"
            });
        }

        const deletedJob = await Job.findByIdAndDelete(jobId);

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
            JobTags,
            PostedBy
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
            "Tags": JobTags,
            "PostedBy": new mongoose.Types.ObjectId(PostedBy)
        })

        await job.save()

        res.status(200).json({
            "Message": "Success",
            "JobID": job._id,
        })
    } catch (err) {
        res.status(500).json({
            "Error": err.message
        })
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

// NEW: Get jobs with application counts
export const getJobsWithApplications = async (req, res) => {
    try {
        const jobsWithApplications = await Job.aggregate([
            {
                $lookup: {
                    from: "applications",
                    localField: "_id",
                    foreignField: "jobId",
                    as: "applications"
                }
            },
            {
                $addFields: {
                    applicationCount: { $size: "$applications" },
                    pendingCount: {
                        $size: {
                            $filter: {
                                input: "$applications",
                                cond: { $eq: ["$$this.status", "pending"] }
                            }
                        }
                    },
                    acceptedCount: {
                        $size: {
                            $filter: {
                                input: "$applications",
                                cond: { $eq: ["$$this.status", "accepted"] }
                            }
                        }
                    },
                    rejectedCount: {
                        $size: {
                            $filter: {
                                input: "$applications",
                                cond: { $eq: ["$$this.status", "rejected"] }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    applications: 0 // Remove the full applications array from response
                }
            },
            {
                $sort: { postedDate: -1 }
            }
        ]);

        res.status(200).json({
            "Message": "Success",
            "Jobs": jobsWithApplications
        });
    } catch (err) {
        res.status(500).json({
            "Error": err.message
        });
    }
}

// export const getJobsWithApplications = async (req, res) => {
//     try {
//         const jobsWithApplications = await Job.aggregate([
//             {
//                 $lookup: {
//                     from: "applications",
//                     localField: "_id",
//                     foreignField: "jobId",
//                     as: "applications"
//                 }
//             },
//             {
//                 $addFields: {
//                     applicationCount: { $size: "$applications" },
//                     pendingCount: {
//                         $size: {
//                             $filter: {
//                                 input: "$applications",
//                                 cond: { 
//                                     $or: [
//                                         { $eq: ["$this.status", "pending"] },
//                                         { $eq: ["$this.status", "reviewed"] }
//                                     ]
//                                 }
//                             }
//                         }
//                     },
//                     acceptedCount: {
//                         $size: {
//                             $filter: {
//                                 input: "$applications",
//                                 cond: { 
//                                     $or: [
//                                         { $eq: ["$this.status", "shortlisted"] },
//                                         { $eq: ["$this.status", "hired"] }
//                                     ]
//                                 }
//                             }
//                         }
//                     },
//                     rejectedCount: {
//                         $size: {
//                             $filter: {
//                                 input: "$applications",
//                                 cond: { $eq: ["$this.status", "rejected"] }
//                             }
//                         }
//                     }
//                 }
//             },
//             {
//                 $project: {
//                     applications: 0 // Remove the full applications array from response
//                 }
//             },
//             {
//                 $sort: { postedDate: -1 }
//             }
//         ]);

//         res.status(200).json({
//             "Message": "Success",
//             "Jobs": jobsWithApplications
//         });
//     } catch (err) {
//         res.status(500).json({
//             "Error": err.message
//         });
//     }
// };





// NEW: Get applications for a specific job
export const getJobApplications = async (req, res) => {
    try {
        const jobId = req.params.jobId;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid job ID format"
            });
        }

        const applications = await Application.find({ jobId: jobId })
            .sort({ appliedDate: -1 });

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        res.status(200).json({
            "Message": "Success",
            "Job": job,
            "Applications": applications
        });
    } catch (err) {
        res.status(500).json({
            "Error": err.message
        });
    }
}

export const getAllJobApplications = async (req, res) => {
    try {
        const applications = await Application.aggregate([
            {
                $group: {
                    _id: "$jobId",
                    applications: { $push: "$$ROOT" }
                }
            },
            {
                $sort: {
                    appliedDate: -1
                }
            }
        ]);
        console.log("Job Applications API Called");
        console.log(applications);
        res.status(200).json({
            "Message": "Success",
            "Applications": applications
        })
    } catch (err) {
        res.json({
            "Error": err.message
        }).status(500)
    }
}// Get all jobs with keyword filter only
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