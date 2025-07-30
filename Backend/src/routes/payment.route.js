import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createBookingPayment,
  getPaymentStatus,
  confirmPayment,
  refundBooking,
  handleStripeWebhook
} from "../controllers/payment.controller.js";

const router = express.Router();

// Webhook route (raw body middleware is handled at server level)
router.post("/webhook", handleStripeWebhook);

// Protected routes
router.post("/booking/:bookingId/create-payment-intent", createBookingPayment);
router.get("/booking/:bookingId/status", getPaymentStatus);
router.post("/booking/:bookingId/confirm", confirmPayment);
router.post("/booking/:bookingId/refund", refundBooking);

export default router;
