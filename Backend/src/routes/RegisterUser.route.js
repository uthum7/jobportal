import express from 'express';
import { getCounselors, getCounselees, getJobseekers,
    getEmployees,getCounselorById,updateCounselor,deleteCounselor,
    getCounseleeById,updateCounselee,deleteCounselee,
    getEmployeeById,updateEmployee,deleteEmployee,
    getJobseekerById,updateJobseeker,deleteJobseeker,
    getRecentJobsByEmployee,getApplicationCountByEmployee,getJobById,
    updateJobDetails,getRecentBookingsForCounselor,
    cancelBookingByAdmin,getAdminById
 } from '../controllers/RegisterUser.controller.js';


const router = express.Router();

// Example (Express Router)
router.get('/counselors', getCounselors);
router.get('/counselors/:id', getCounselorById);
router.put('/counselors/:id', updateCounselor);
router.delete('/counselors/:id', deleteCounselor);

router.get('/counselees', getCounselees);
router.get('/counselees/:id', getCounseleeById);
router.put('/counselees/:id', updateCounselee);
router.delete('/counselees/:id', deleteCounselee);

router.get('/employees', getEmployees);
router.get('/employees/:id', getEmployeeById);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deleteEmployee);

router.get('/jobseekers', getJobseekers);
router.get('/jobseekers/:id', getJobseekerById);
router.put('/jobseekers/:id', updateJobseeker);
router.delete('/jobseekers/:id', deleteJobseeker);

router.get("/recent/:PostedBy", getRecentJobsByEmployee);
router.get('/applicationcount/:id', getApplicationCountByEmployee);
router.get("/:id", getJobById);
router.put('/jobs/:id/updatedetails', updateJobDetails);
router.get('/recentbookings/:counselorId', getRecentBookingsForCounselor);
router.put('/cancelbooking/:bookingId', cancelBookingByAdmin);


router.get('/admin/:id', getAdminById);

export default router;
