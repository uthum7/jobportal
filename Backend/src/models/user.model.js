import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,  
    },
    profilePic: {// Profile picture URL (optional, default is an empty string)
      type: String,
      default: "",
    },
    counselors_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "counselors",
      default: null, 
    },
  },
  { timestamps: true }// Automatically adds createdAt and updatedAt timestamps
);

const User = mongoose.model("User", userSchema);

export default User;
