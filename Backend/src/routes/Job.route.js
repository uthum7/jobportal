import express from "express";
import { createJobPost, getAllJobs, getJobCount, deleteJobPost } from "../controllers/Job.controller.js";

const router = express.Router();

router.post("/create", createJobPost);
router.get("/count", getJobCount);
router.get("/all", getAllJobs);
router.delete("/delete/:id", deleteJobPost);
export default router;
