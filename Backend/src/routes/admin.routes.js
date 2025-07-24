// routes/admin.routes.js

import express from 'express';
import asyncHandler from "express-async-handler";

// --- Import Middleware ---
// We import both middleware functions. They will be chained together to protect the route.
import { protectRoute, isAdmin } from '../middleware/registerauth.middleware.js';

// --- Import Controller ---
// We import the specific controller function that handles the logic for this route.
// Make sure the path to your controller file is correct.
import { adminCreateUser, forceResetPassword } from '../controllers/registerauth.controller.js';

const router = express.Router();


// ------------------- ADMIN ROUTES -------------------

/**
 * @route   POST /api/admin/create-user
 * @desc    Admin creates a new user (Mentor or Employee)
 * @access  Private/Admin
 */
router.post(
    '/create-user',       // The path for this specific route
    protectRoute,         // 1st middleware: Checks if a user is logged in with a valid token.
    isAdmin,              // 2nd middleware: Checks if the logged-in user has the 'ADMIN' role.
    asyncHandler(adminCreateUser) // 3rd: The actual controller logic to execute if both checks pass.
);


// Note: Although forceResetPassword is not strictly an "admin" task,
// it's part of the user management flow initiated by an admin.
// For logical grouping, you could place its route here or in register.routes.js.
// Let's keep it in a primary auth file for better separation of concerns.
// If you had other admin-only GET/DELETE/PUT routes (e.g., get all users, delete a user),
// you would add them here following the same pattern.
//
// Example:
//
// router.get(
//   '/users',
//   protectRoute,
//   isAdmin,
//   asyncHandler(getAllUsersController)
// );


export default router;