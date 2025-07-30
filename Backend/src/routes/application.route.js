import express from "express";
import { 
  checkApplicationStatus, 
  submitApplication,
  getApplicationById,
  getApplicationsByUser,
  getApplicationsByJob,
  updateApplicationStatus,
  deleteApplication,
  getAllApplications
} from "../controllers/application.controller.js";

const router = express.Router();

// Check if user has already applied for a specific job
// GET /api/applications/status/:userId/:jobId
router.get("/status/:userId/:jobId", checkApplicationStatus);

// Submit a new job application
// POST /api/applications
router.post("/submit", submitApplication);

// Get a specific application by ID
// GET /api/applications/:id
router.get("/:id", getApplicationById);

// Get all applications by a specific user
// GET /api/applications/user/:userId
router.get("/user/:userId", getApplicationsByUser);

// Get all applications for a specific job
// GET /api/applications/job/:jobId
router.get("/job/:jobId", getApplicationsByJob);

// Update application status (for employers/admins)
// PUT /api/applications/:id/status
router.put("/:id/status", updateApplicationStatus);

// Delete an application
// DELETE /api/applications/:id
router.delete("/:id", deleteApplication);

// Get all applications (for admin use)
// GET /api/applications
router.get("/", getAllApplications);

export default router;