import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";
import {
  createSchedule,
  getScheduleByDay,
  getCounselorSchedule,
  getAvailableTimeSlots,
  deleteSchedule
} from "../controllers/schedule.controller.js";

const router = express.Router();

// Create or update schedule (counselors only)
router.post("/", protectRoute, checkRole(["counselor"]), createSchedule);

// Get schedule for a specific day (counselors only)
router.get("/day/:dayOfWeek", protectRoute, checkRole(["counselor"]), getScheduleByDay);

// Get all schedules for a counselor (public)
router.get("/counselor/:counselorId", getCounselorSchedule);

// Get available time slots for a specific date (public)
router.get("/available/:counselorId/:date", getAvailableTimeSlots);

// Delete a schedule (counselors only)
router.delete("/:scheduleId", protectRoute, checkRole(["counselor"]), deleteSchedule);

export default router;