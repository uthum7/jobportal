import express from 'express';
import { getCounselors, getCounselees, getJobseekers,getEmployees,getCounselorById,updateCounselor,deleteCounselor } from '../controllers/RegisterUser.controller.js';

const router = express.Router();

router.get('/counselors', getCounselors);
router.get('/counselees', getCounselees);
router.get('/employees', getEmployees);
router.get('/jobseekers', getJobseekers);



router.get('/counselors/:id', getCounselorById);         // View single counselor
router.put('/counselors/:id', updateCounselor);          // Edit counselor
router.delete('/counselors/:id', deleteCounselor);       // Delete counselor

export default router;
