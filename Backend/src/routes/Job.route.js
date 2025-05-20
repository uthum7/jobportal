import express from "express";
import { createJobPost, getJobCount } from "../controllers/Job.controller.js";

const router = express.Router();

router.post("/create", createJobPost);
router.get("/count", getJobCount);
export default router;
