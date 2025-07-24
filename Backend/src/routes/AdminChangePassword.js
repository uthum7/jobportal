import express from 'express';
import { changeAdminPassword } from '../controllers/Admin.controller.js';
import {protectRoute } from '../middleware/registerauth.middleware.js';
import { getAdminProfile } from '../controllers/Admin.controller.js';

const router = express.Router();
// ✅ TEMPORARY DEBUG ROUTE
router.get('/ping', (req, res) => {
  res.send('Admin API is reachable');
});

router.put('/change-password', protectRoute, changeAdminPassword);
router.get('/profile', protectRoute, getAdminProfile);
export default router;
