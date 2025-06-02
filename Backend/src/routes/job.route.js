// job.route.js
import express from "express";

// Import controller functions for job operations
import { getAllJobs } from "../controllers/job.controller.js";
import { getJobById } from "../controllers/job.controller.js";
import { createJob } from "../controllers/job.controller.js";

const router = express.Router(); // Create Express router

// Route to get all jobs (GET request)
router.get("/", getAllJobs);

// Route to get a specific job by its ID (GET request)
router.get("/:id", getJobById);

// Route to create a new job (POST request)
router.post("/", createJob);

export default router; // Export router to be used in app.js
