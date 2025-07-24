import RegisterUser from '../models/RegisterUser.model.js';


// ✅ Get profile of logged-in user (admin)
export const getAdminProfile = async (req, res) => {
  try {
    const userId = req.userId;

    // Populate user details from RegisterUser
    let profile = await Profile.findOne({ userId }).populate('userId', 'name email roles');

    // If profile doesn't exist, create an empty one
    if (!profile) {
      profile = await Profile.create({ userId });
      const user = await RegisterUser.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json({
        name: user.name,
        email: user.email,
        role: user.roles?.[0] || 'ADMIN',
        profileImage: null
      });
    }

    const user = profile.userId;

    res.json({
      name: user.name,
      email: user.email,
      role: user.roles?.[0] || 'ADMIN',
      profileImage: profile.profileImage || null
    });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error });
  }
};

// ✅ Update profile info of logged-in user (admin)
export const updateAdminProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { phone, address, profileImage } = req.body;

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      { phone, address, profileImage },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated',
      profileImage: updatedProfile.profileImage || null,
      phone: updatedProfile.phone,
      address: updatedProfile.address
    });
  } catch (error) {
    console.error('Error updating admin profile:', error);
    res.status(500).json({ message: 'Error updating profile', error });
  }
};
