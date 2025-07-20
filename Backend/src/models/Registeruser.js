// Backend/src/models/Registeruser.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;

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
        enum: ["MENTOR", "MENTEE", "JOBSEEKER", "ADMIN", "EMPLOYEE"],
        validate: {
            validator: function (roles) {
                return roles && roles.length > 0;
            },
            message: "At least one role must be selected"
        }
    },
    resetPasswordToken: {
        type: String,
        default: undefined
    },
    resetPasswordExpires: {
        type: Date,
        default: undefined
    }
}, { timestamps: true });

// ✅ Hash password before saving
RegisteruserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // only hash if modified

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

const Registeruser = mongoose.model('Registeruser', RegisteruserSchema);
export default Registeruser;
