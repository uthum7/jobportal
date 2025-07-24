import express from "express";
import { createJobPost, getAllJobs, getJobCount, deleteJobPost } from "../controllers/Job.controller.js";
import { getAllFiteredJobs } from "../controllers/Job.controller.js";
import { getJobById } from "../controllers/Job.controller.js";

const router = express.Router();

router.post("/create", createJobPost);
router.get("/count", getJobCount);
router.get("/all", getAllJobs);
router.delete("/delete/:id", deleteJobPost);
// Route to get all keyword filtered jobs 
router.get("/", getAllFiteredJobs);

// Route to get a specific job by its ID
router.get("/:id", getJobById);

export default router;
