// routes/admin.routes.js
import express from 'express';
import { protectRoute } from '../middleware/registerauth.middleware.js';
import Registeruser from '../models/Registeruser.js';

const router = express.Router();

router.get('/profile', protectRoute, async (req, res) => {
  try {
    const user = await Registeruser.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.roles.includes('ADMIN')) {
      return res.status(403).json({ message: 'Access denied: Not an admin' });
    }

    res.status(200).json({
      name: user.username,
      role: 'ADMIN',
      email: user.email,
      profileImage: user.profileImage || 'https://via.placeholder.com/150'
    });
  } catch (err) {
    console.error('Error fetching admin profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
