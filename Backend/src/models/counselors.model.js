import mongoose from "mongoose";

const counselorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    specialty: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    availability: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: "/placeholder.svg?height=80&width=80",
    }
  },
  { timestamps: true }
);

// Index for better search performance
counselorSchema.index({ name: 'text', specialty: 'text' });

const Counselor = mongoose.model("counselors", counselorSchema);

export default Counselor;