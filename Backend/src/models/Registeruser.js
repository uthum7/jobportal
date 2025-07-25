// Backend/src/models/Registeruser.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;

const RegisteruserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"], // Match previous user model
    },
    profilePic: {
      type: String,
      default: "", // Optional, frontend can fall back to placeholder
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: [String],
      required: [true, "At least one role is required"],
      enum: ["MENTOR", "MENTEE", "JOBSEEKER", "ADMIN", "EMPLOYEE"],
      validate: {
        validator: function (roles) {
          return roles && roles.length > 0;
        },
        message: "At least one role must be selected",
      },
    },
    resetPasswordToken: {
      type: String,
      default: undefined,
    },
    resetPasswordExpires: {
      type: Date,
      default: undefined,
    },

   
    phone: {
      type: String,
      default: "", // Optional, validate if needed
    },
    
  },
  { timestamps: true }
);

// ✅ Hash password before saving
RegisteruserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Compare password method
RegisteruserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Registeruser = mongoose.model("Registeruser", RegisteruserSchema);
export default Registeruser;
