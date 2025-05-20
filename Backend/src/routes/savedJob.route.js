// routes/savedJob.routes.js
import express from 'express';
import { saveJob, getSavedJobsByUser, deleteSavedJob, checkSavedJob } from '../controllers/savedJob.controller.js';

const router = express.Router();

router.post('/save', saveJob);
router.get('/:userId', getSavedJobsByUser);
router.delete('/remove', deleteSavedJob);
router.get('/check/:userId/:jobId', checkSavedJob);

export default router;
