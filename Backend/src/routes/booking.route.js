import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  cancelBooking,
  rescheduleBooking,
  deleteBooking,
  hardDeleteBooking,
  getBookingsByCounselor,
  getBookingsByUser,
  getBookingStats,
  approveBooking
} from "../controllers/booking.controller.js";

const router = express.Router();

// Public routes (you might want to protect these based on your requirements)
router.get("/", getAllBookings); // GET /api/bookings?page=1&limit=10&status=Scheduled&counselor_id=123
router.get("/stats", getBookingStats); // GET /api/bookings/stats?counselor_id=123&date_from=2025-01-01&date_to=2025-01-31
router.get("/:id", getBookingById); // GET /api/bookings/675a1b2c3d4e5f6789012345

// Bookings by counselor and user
router.get("/counselor/:counselor_id", getBookingsByCounselor); // GET /api/bookings/counselor/675a1b2c3d4e5f6789012345?status=Scheduled
router.get("/user/:user_id", getBookingsByUser); // GET /api/bookings/user/675a1b2c3d4e5f6789012345?status=Completed

// Protected routes (require authentication)
router.post("/",  createBooking); // POST /api/bookings
router.put("/:id",  updateBooking); // PUT /api/bookings/675a1b2c3d4e5f6789012345
router.patch("/:id/approve",  approveBooking); // PATCH /api/bookings/675a1b2c3d4e5f6789012345/approve
router.patch("/:id/cancel",  cancelBooking); // PATCH /api/bookings/675a1b2c3d4e5f6789012345/cancel
router.patch("/:id/reschedule",  rescheduleBooking); // PATCH /api/bookings/675a1b2c3d4e5f6789012345/reschedule
router.delete("/:id",  deleteBooking); // DELETE /api/bookings/675a1b2c3d4e5f6789012345 (soft delete)
router.delete("/:id/hard",  hardDeleteBooking); // DELETE /api/bookings/675a1b2c3d4e5f6789012345/hard (permanent delete)

export default router;