// Backend/src/models/Registeruser.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const Schema = mongoose.Schema;

// Registeruser Schema
const RegisteruserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
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
        minlength: [5, "Password must be at least 5 characters"],
    },
    roles: {
        type: [String],
        required: [true, "At least one role is required"],
        enum: ["MENTOR", "MENTEE", "JOBSEEKER", "ADMIN"],
        validate: {
            validator: function(roles) {
                return roles && roles.length > 0;
            },
            message: "At least one role must be selected"
        }
    },
    // Reference to counselor profile if user is a MENTOR
    counselors_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Counselor',
        required: false // Only required if user has MENTOR role
    },
    // Full name field
    fullName: {
        type: String,
        required: false,
        trim: true
    },
    // Profile picture URL
    profilePic: {
        type: String,
        required: false
    },
    // --- ADD THESE TWO NEW FIELDS HERE ---
    resetPasswordToken: {
        type: String,
        default: undefined // It will not exist in the document unless set
    },
    resetPasswordExpires: {
        type: Date,
        default: undefined // It will not exist in the document unless set
    },
    // ------------------------------------
}, { timestamps: true });

// Hash password before saving
RegisteruserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare passwords
RegisteruserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Registeruser = mongoose.model('Registeruser', RegisteruserSchema);
export default Registeruser;