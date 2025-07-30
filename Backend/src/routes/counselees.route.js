import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getCounselees,
  getCounseleeById,
  addCounselee,
  updateCounselee,
  deleteCounselee,
  getCounseleeSessionHistory,
  scheduleSession,
  updateSessionProgress
} from "../controllers/counselees.controller.js";

const router = express.Router();

// Get all counselees for a counselor
router.get("/:counselorId", getCounselees); // GET /api/counselees/counselor123

// Get specific counselee details
router.get("/:counselorId/:counseleeId", getCounseleeById); // GET /api/counselees/counselor123/user456

// Add new counselee
router.post("/:counselorId", addCounselee); // POST /api/counselees/counselor123

// Update counselee information
router.put("/:counselorId/:counseleeId", updateCounselee); // PUT /api/counselees/counselor123/user456

// Delete counselee relationship
router.delete("/:counselorId/:counseleeId", deleteCounselee); // DELETE /api/counselees/counselor123/user456

// Get session history for a counselee
router.get("/:counselorId/:counseleeId/sessions", getCounseleeSessionHistory); // GET /api/counselees/counselor123/user456/sessions

// Schedule new session
router.post("/:counselorId/:counseleeId/sessions", scheduleSession); // POST /api/counselees/counselor123/user456/sessions

// Update session progress
router.put("/:counselorId/:counseleeId/progress", updateSessionProgress); // PUT /api/counselees/counselor123/user456/progress

export default router;
