import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    counselor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registeruser', // Assuming your user model is named RegisterUser
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registeruser',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Payment Pending', 'Confirmed', 'Cancelled'],
      default: 'Payment Pending',
    },
    location: {
      type: String,
    },
    type: {
      type: String,
      enum: ['Video Call', 'Phone Call', 'In-Person'],
      default: 'Video Call',
    },
    notes: {
      type: String,
    },
    duration: {
      type: Number, // In minutes
    },
    price: {
      type: Number,
    },
    payment_status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    payment_intent_id: {
      type: String,
    },
    cancellation_reason: {
      type: String,
    },
    cancelled_by: {
      type: String,
      enum: ['user', 'counselor', 'admin', null],
      default: null,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

export default mongoose.model('bookings', bookingSchema);
