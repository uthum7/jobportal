import express from 'express';
import { getAppliedJobsByUser } from '../controllers/appliedJobs.controller.js';

const router = express.Router();

// Route to fetch applied jobs by user ID
router.get('/:userId', getAppliedJobsByUser);

export default router;
