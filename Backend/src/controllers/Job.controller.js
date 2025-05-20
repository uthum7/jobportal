import Job from "../models/Job.model.js";

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


