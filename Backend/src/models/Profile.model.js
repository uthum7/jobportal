// models/Profile.model.js
import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'RegisterUser', unique: true, required: true },
  phone: String,
  address: String,
  profileImage: String,
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
