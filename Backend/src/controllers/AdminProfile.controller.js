import Registeruser from '../models/Registeruser.js';

export const getAdminDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Registeruser.findById(id).select('name email _id');

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    return res.status(200).json({
      success: true,
      admin,
    });
  } catch (err) {
    console.error('Error fetching admin:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
