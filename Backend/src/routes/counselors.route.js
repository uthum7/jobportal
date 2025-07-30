import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getAllCounselors,
  getCounselorById,
  createCounselor,
  updateCounselor,
  deleteCounselor,
  hardDeleteCounselor,
  getCounselorsBySpecialty,
  updateCounselorRating
} from "../controllers/counselors.controller.js";

const router = express.Router();

// Public routes
router.get("/", getAllCounselors); // GET /api/counselors?page=1&limit=10&specialty=Resume&search=Michael&sort=rating
router.get("/:id", getCounselorById); // GET /api/counselors/682de84959a764d6f9f186c1
router.get("/specialty/:specialty", getCounselorsBySpecialty); // GET /api/counselors/specialty/Resume Building

// Protected routes (require authentication)
router.post("/", createCounselor); // POST /api/counselors
router.put("/:id", protectRoute, updateCounselor); // PUT /api/counselors/682de84959a764d6f9f186c1
router.delete("/:id", protectRoute, deleteCounselor); // DELETE /api/counselors/682de84959a764d6f9f186c1 (soft delete)
router.delete("/:id/hard", protectRoute, hardDeleteCounselor); // DELETE /api/counselors/682de84959a764d6f9f186c1/hard (permanent delete)

// Rating route
router.post("/:id/rating", protectRoute, updateCounselorRating); // POST /api/counselors/682de84959a764d6f9f186c1/rating

export default router;
