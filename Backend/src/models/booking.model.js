import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    counselor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "counselors",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registeruser",
      required: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Approved","Payment Pending","Payment Failed","Scheduled","Cancelled", "Completed", "Rescheduled"],
      default: "Pending",
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Video Call", "Phone Call", "In-Person", "Chat"],
      default: "Video Call",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    meeting_link: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number, // Duration in minutes
      default: 60,
      min: 15,
      max: 180,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    payment_status: {
      type: String,
      enum: ["Pending", "Paid", "Refunded", "Failed"],
      default: "Pending",
    },
    payment_intent_id: {
      type: String,
      trim: true,
    },
    cancelled_by: {
      type: String,
      enum: ["user", "counselor", "admin"],
    },
    cancellation_reason: {
      type: String,
      trim: true,
    },
    rescheduled_from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bookings",
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better performance
bookingSchema.index({ counselor_id: 1, date: 1 });
bookingSchema.index({ user_id: 1, status: 1 });
bookingSchema.index({ status: 1, date: 1 });
bookingSchema.index({ deleted_at: 1 });

// Virtual for populating counselor details
bookingSchema.virtual('counselor', {
  ref: 'counselors',
  localField: 'counselor_id',
  foreignField: '_id',
  justOne: true
});

// Virtual for populating user details
bookingSchema.virtual('user', {
  ref: 'users',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true
});

// Query middleware to exclude soft-deleted records by default
bookingSchema.pre(/^find/, function(next) {
  this.find({ deleted_at: null });
  next();
});

// Instance method to soft delete
bookingSchema.methods.softDelete = function() {
  this.deleted_at = new Date();
  return this.save();
};

// Instance method to restore soft deleted record
bookingSchema.methods.restore = function() {
  this.deleted_at = null;
  return this.save();
};

// Static method to find deleted records
bookingSchema.statics.findDeleted = function() {
  return this.findWithDeleted({ deleted_at: { $ne: null } });
};

// Static method to find all records including deleted
bookingSchema.statics.findWithDeleted = function(filter = {}) {
  return this.find(filter);
};

const Booking = mongoose.model("bookings", bookingSchema);

export default Booking;
