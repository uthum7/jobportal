// models/UserCv.js
import mongoose from "mongoose";

const { Schema } = mongoose;

// --- SUB-SCHEMAS FOR BETTER ORGANIZATION ---
const PersonalInfoSchema = new Schema({
  fullname: { type: String, default: "" },
  nameWithInitials: { type: String, default: "" },
  jobTitle: { type: String, default: "" },
  address: { type: String, default: "" },
  addressOptional: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  profileParagraph: { type: String, default: "" },
  profilePicture: { type: String, default: null }, // Store as URL or base64 string
}, { _id: false });

const EducationDetailsSchema = new Schema({
    schoolName: { type: String, default: "" },
    startDate: { type: String, default: "" }, // Store as string (YYYY-MM-DD) or Date
    endDate: { type: String, default: "" },   // Store as string (YYYY-MM-DD) or Date
    moreDetails: { type: String, default: "" },
    universitiyName: { type: String, default: "" }, // Keeping typo if strictly needed by frontend logic
    // universityName: { type: String, default: "" }, // Preferred name
    uniStartDate: { type: String, default: "" }, // Store as string (YYYY-MM-DD) or Date
    uniEndDate: { type: String, default: "" },   // Store as string (YYYY-MM-DD) or Date
    uniMoreDetails: { type: String, default: "" },
}, { _id: false });

const ProfessionalExperienceSchema = new Schema({
  jobTitle: { type: String, default: "" },
  companyName: { type: String, default: "" },
  jstartDate: { type: String, default: "" }, // Store as string (YYYY-MM-DD) or Date
  jendDate: { type: String, default: "" },   // Store as string (YYYY-MM-DD) or Date
  jobDescription: { type: String, default: "" },
}, { _id: false });

const SkillSchema = new Schema({
  skillName: { type: String, default: "" },
  skillLevel: { type: Number, default: 0 },
}, { _id: false });

const ReferenceSchema = new Schema({
  referenceName: { type: String, default: "" },
  position: { type: String, default: "" },
  company: { type: String, default: "" },
  contact: { type: String, default: "" },
}, { _id: false });


// --- MAIN CV SCHEMA ---
const UserCvSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Make sure you have a 'User' model correctly named
      required: true,
      unique: true, // Ensures one CV document per user
    },
    personalInfo: {
      type: PersonalInfoSchema,
      default: () => ({}), // Default to an empty object, Mongoose will apply sub-schema defaults
    },
    educationDetails: {
        type: EducationDetailsSchema,
        default: () => ({}),
    },
    professionalExperience: {
        type: [ProfessionalExperienceSchema], // Array of experiences
        default: [],
    },
    skill: { // Array of skill objects
        type: [SkillSchema],
        default: [],
    },
    summary: {
      type: String,
      default: "",
    },
    references: {
      type: [ReferenceSchema], // Array of references
      default: [],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Ensure `User` model is registered if not already, or handle potential compilation issues
// if this file is imported before User model in some scenarios.
// Typically, Mongoose handles this well if models are structured in separate files.

const UserCv = mongoose.model("UserCv", UserCvSchema);

export default UserCv;