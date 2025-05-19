import express from "express";
import { getJobs } from "../controllers/job.controller.js";
import { getJobById } from "../controllers/job.controller.js";
import { createJob } from "../controllers/job.controller.js";


const router = express.Router();

router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", createJob);

export default router;
