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

export default router;