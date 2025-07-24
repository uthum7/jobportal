import express from 'express';
import {
    getDashboardStats,
    getMonthlyAnalytics,
    getJobTypeDistribution,
    getJobModeDistribution,
    getExperienceLevelDistribution,
    getRecentActivity,
    getMonthlyUserAnalytics
} from '../controllers/dashboard.controller.js';

const router = express.Router();

// Dashboard routes
router.get('/stats', getDashboardStats);
router.get('/analytics/monthly', getMonthlyAnalytics);
router.get('/analytics/job-types', getJobTypeDistribution);
router.get('/analytics/job-modes', getJobModeDistribution);
router.get('/analytics/experience-levels', getExperienceLevelDistribution);
router.get('/recent-activity', getRecentActivity);
router.get('/analytics/users-monthly', getMonthlyUserAnalytics);

export default router;