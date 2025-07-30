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
<<<<<<< HEAD
    profilePic: {
      type: String,
      default: "",
    },
    counselors_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "counselors",
      default: null, 
    },
  },
  { timestamps: true }
=======
    profilePic: {// Profile picture URL (optional, default is an empty string)
      type: String,
      default: "",
    },
  },
  { timestamps: true }// Automatically adds createdAt and updatedAt timestamps
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
);

const User = mongoose.model("User", userSchema);

export default User;
