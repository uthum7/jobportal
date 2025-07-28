import mongoose from 'mongoose';

const RegisterUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  roles: { type: [String], default: [] }, // array of roles like ['jobseeker', 'mentor']
  // add other fields you have
}, {
  timestamps: true,
  collection: 'registerusers'  // force collection name to 'registerusers'
});

const RegisterUser = mongoose.model('RegisterUser', RegisterUserSchema);

export default RegisterUser;
