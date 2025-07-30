// Backend/routes/admin.routes.js

import express from 'express';
import asyncHandler from "express-async-handler";

// --- Middleware ---
// Import the middleware functions needed to protect the routes.
import { protectRoute, isAdmin } from '../middleware/registerauth.middleware.js';

// --- Controller ---
// Import the controller function that will handle the route's logic.
import { adminCreateUser } from '../controllers/registerauth.controller.js';

const router = express.Router();

// =================================================================
// @route   POST /api/admin/create-user
// @desc    Allows an admin to create a new user (e.g., Mentor or Employee).
// @access  Private (Admin Only)
// =================================================================
router.post(
    '/create-user',
    protectRoute, // 1. First, verify that a valid user token is present.
    isAdmin,      // 2. Second, verify that the user has the 'ADMIN' role.
    asyncHandler(adminCreateUser) // 3. If both checks pass, execute the controller logic.
);

// You can add other admin-only routes here using the same pattern.
// For example:
// router.get('/dashboard-stats', protectRoute, isAdmin, asyncHandler(getDashboardStats));

export default router;