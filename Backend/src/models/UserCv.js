// models/UserCv.js
import mongoose from "mongoose";

const { Schema } = mongoose;

// --- PersonalInfoSchema and other schemas (except Education) remain the same ---
const PersonalInfoSchema = new Schema({
  fullname: { type: String, default: "" },
  nameWithInitials: { type: String, default: "" },
  gender: { type: String, default: "" },
  birthday: { type: Date, default: null },
  address: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  profileParagraph: { type: String, default: "" },
  profilePicture: { type: String, default: null },
}, { _id: false });

// --- NEW, DETAILED EDUCATION SUB-SCHEMAS TO MATCH THE NEW FRONTEND ---
// Sub-schema for A/L subjects (subject and grade)
const ALEntrySchema = new Schema({
  subject: { type: String, required: true },
  grade: { type: String, required: true },
}, { _id: false });

// Main schema for a single education entry
const EducationEntrySchema = new Schema({
  institute: { type: String, default: "" },
  educationLevel: { type: String, default: "" }, // Stores: A/L, Diploma, Bachelor's, etc.
  fieldOfStudy: { type: String, default: "" }, // For A/L stream or Degree major
  gpaOrGrade: { type: String, default: "" }, // For non-A/L degrees
  startDate: { type: Date, default: null }, // For non-A/L degrees
  endDate: { type: Date, default: null }, // For non-A/L degrees
  currentlyStudying: { type: Boolean, default: false },
  alYear: { type: String, default: "" }, // For A/L only
  alSubjects: { type: [ALEntrySchema], default: [] }, // An array for A/L subjects
}, { _id: false });


const ProfessionalExperienceSchema = new Schema({
  jobTitle: { type: String, default: "" },
  companyName: { type: String, default: "" },
  jstartDate: { type: String, default: "" },
  jendDate: { type: String, default: "" },
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
      ref: "User",
      required: true,
      unique: true,
    },
    personalInfo: {
      type: PersonalInfoSchema,
      default: () => ({}),
    },
    // --- THIS IS THE KEY CHANGE ---
    // educationDetails is now an array of the new, complex EducationEntrySchema.
    // It replaces the old EducationDetailsSchema.
    educationDetails: {
        type: [EducationEntrySchema],
        default: [],
    },
    professionalExperience: {
        type: [ProfessionalExperienceSchema],
        default: [],
    },
    skill: {
        type: [SkillSchema],
        default: [],
    },
    summary: {
      type: String,
      default: "",
    },
    references: {
      type: [ReferenceSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const UserCv = mongoose.model("UserCv", UserCvSchema);

export default UserCv;