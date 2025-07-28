import bcrypt from 'bcryptjs';
import Registeruser from '../models/Registeruser.js';


export const changeAdminPassword = async (req, res) => {
  const userId = req.userId;  // this should be set by your authenticate middleware
  const { oldPassword, newPassword, confirmPassword } = req.body;

  console.log('Change Password Request:', { userId, oldPassword, newPassword, confirmPassword });
  try {
    const user = await Registeruser.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

    // Check if new and confirm passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    // Hash new password
    // const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Save updated password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getAdminProfile = async (req, res) => {
  try {
    const user = await Registeruser.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('[Get Admin Profile Error]', error.message);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};
