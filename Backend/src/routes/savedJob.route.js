// routes/savedJob.route.js
import express from 'express';
// Import controller functions related to saving jobs
import { saveJob, getSavedJobsByUser, deleteSavedJob, checkSavedJob } from '../controllers/savedJob.controller.js';

const router = express.Router(); // Create an Express router instance

// Route to save a job (POST request)
router.post('/save', saveJob);

// Route to get all saved jobs for a specific user (GET request)
router.get('/:userId', getSavedJobsByUser);

// Route to delete a saved job (DELETE request)
router.delete('/remove', deleteSavedJob);

// Route to check if a specific job is saved by a user (GET request)
router.get('/check/:userId/:jobId', checkSavedJob);

export default router; // Export the router for use in the main app
