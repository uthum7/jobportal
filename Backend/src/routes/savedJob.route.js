import express from 'express';
import {
  saveJob,
  saveJobAlt,
  getSavedJobsByUser,
  deleteSavedJob,
  deleteSavedJobAlt,
  checkSavedJob
} from '../controllers/savedJob.controller.js';

const router = express.Router();

// Routes for JobDetails page
router.post('/save', saveJob);
router.delete('/remove', deleteSavedJob);

// Alternative routes for JobCard component
router.post('/', saveJobAlt);
router.delete('/:userId/:jobId', deleteSavedJobAlt);

// Common routes
router.get('/user/:userId', getSavedJobsByUser);
router.get('/check/:userId/:jobId', checkSavedJob);

export default router;