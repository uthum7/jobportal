import express from "express";
import { 
    createJobPost, 
    getAllJobs, 
    getJobCount, 
    deleteJobPost, 
    getAllJobApplications,
    getJobsWithApplications,
    getJobApplications
} from "../controllers/Job.controller.js";

const router = express.Router();

router.post("/create", createJobPost);
router.get("/count", getJobCount);
router.get("/all", getAllJobs);
router.get("/with-applications", getJobsWithApplications); // NEW
router.get("/:jobId/applications", getJobApplications); // NEW
router.delete("/delete/:id", deleteJobPost);
router.get("/candidates", getAllJobApplications);

// Route to get all keyword filtered jobs 
router.get("/", getAllFiteredJobs);

// Route to get a specific job by its ID
router.get("/:id", getJobById);

export default router;