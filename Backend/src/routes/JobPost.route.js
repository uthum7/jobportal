import express from "express";
import { createJobPost } from "../controllers/JobPost.controller.js";

const router = express.Router();

router.post("/create", createJobPost);

export default router;
