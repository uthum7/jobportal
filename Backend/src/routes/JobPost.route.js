import express from "express";
import { createJobPost } from "../controllers/JobPost.controller.js";

const router = express.Router();

router.get("/create", createJobPost);

export default router;
