import express from 'express';
import {
    getDashboardStats,
    getMonthlyAnalytics,
    getJobTypeDistribution,
    getJobModeDistribution,
    getExperienceLevelDistribution,
    getRecentActivity
} from '../controllers/dashboard.controller.js';
import { protectRoute } from "../middleware/auth.middleware.js";
import { getDashboardData } from "../controllers/dashboardSeeker.controller.js";

const router = express.Router();

// Dashboard routes
router.get('/stats', getDashboardStats);
router.get('/analytics/monthly', getMonthlyAnalytics);
router.get('/analytics/job-types', getJobTypeDistribution);
router.get('/analytics/job-modes', getJobModeDistribution);
router.get('/analytics/experience-levels', getExperienceLevelDistribution);
router.get('/recent-activity', getRecentActivity);
router.get("/dashboard", protectRoute, getDashboardData);

export default router;