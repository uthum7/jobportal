import mongoose from "mongoose";

// Schema for individual time slots
const timeSlotSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});

// Main schedule schema
const scheduleSchema = new mongoose.Schema(
  {
    counselor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    dayOfWeek: {
      type: String,
      required: true,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    timeSlots: [timeSlotSchema]
  },
  { timestamps: true }
);

// Create a compound index to ensure a counselor can only have one schedule per day
scheduleSchema.index({ counselor: 1, dayOfWeek: 1 }, { unique: true });

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;