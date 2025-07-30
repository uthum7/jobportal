import Booking from "../models/booking.model.js";
import { 
  createPaymentIntent, 
  retrievePaymentIntent, 
  createRefund,
  constructWebhookEvent 
} from "../lib/stripe.js";

// Create payment intent for booking
export const createBookingPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { return_url } = req.body;

    // Find the booking
    const booking = await Booking.findById(bookingId)
      .populate('counselor_id', 'name specialty')
      .populate('user_id', 'username email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Check if booking is in a valid state for payment
    if (!['Pending', 'Approved', 'Payment Pending', 'Payment Failed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: "Booking is not eligible for payment"
      });
    }

    // Check if payment is already completed
    if (booking.payment_status === 'Paid') {
      return res.status(400).json({
        success: false,
        message: "Payment already completed for this booking"
      });
    }

    if (booking.price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Booking price must be greater than 0"
      });
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent(
      booking.price,
      'usd',
      {
        booking_id: booking._id.toString(),
        counselor_id: booking.counselor_id._id.toString(),
        user_id: booking.user_id._id.toString(),
        counselor_name: booking.counselor_id.name,
        user_email: booking.user_id.email,
      }
    );

    // Update booking with payment intent ID and set status to Payment Pending
    await Booking.findByIdAndUpdate(bookingId, {
      payment_intent_id: paymentIntent.id,
      status: 'Payment Pending',
      payment_status: 'Pending'
    });

    res.status(200).json({
      success: true,
      message: "Payment intent created successfully",
      data: {
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
        amount: booking.price,
        currency: 'usd'
      }
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment intent",
      error: error.message
    });
  }
};

// Get payment status for a booking
export const getPaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    let paymentDetails = null;
    if (booking.payment_intent_id) {
      try {
        paymentDetails = await retrievePaymentIntent(booking.payment_intent_id);
      } catch (error) {
        console.error('Error retrieving payment intent:', error);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        booking_id: booking._id,
        payment_status: booking.payment_status,
        booking_status: booking.status,
        payment_intent_id: booking.payment_intent_id,
        amount: booking.price,
        payment_details: paymentDetails ? {
          status: paymentDetails.status,
          amount_received: paymentDetails.amount_received / 100,
          created: paymentDetails.created,
          currency: paymentDetails.currency
        } : null
      }
    });

  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({
      success: false,
      message: "Failed to get payment status",
      error: error.message
    });
  }
};

// Confirm payment manually (if needed)
export const confirmPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { payment_intent_id } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Retrieve payment intent to check status
    const paymentIntent = await retrievePaymentIntent(payment_intent_id);
    
    if (paymentIntent.status === 'succeeded') {
      // Update booking status to Scheduled and payment status to Paid
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          status: 'Scheduled',
          payment_status: 'Paid',
          payment_intent_id: payment_intent_id
        },
        { new: true }
      ).populate('counselor_id', 'name specialty')
        .populate('user_id', 'username email');

      res.status(200).json({
        success: true,
        message: "Payment confirmed and booking scheduled",
        data: updatedBooking
      });
    } else {
      res.status(400).json({
        success: false,
        message: `Payment not successful. Status: ${paymentIntent.status}`
      });
    }

  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      success: false,
      message: "Failed to confirm payment",
      error: error.message
    });
  }
};

// Create refund for a booking
export const refundBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { amount, reason = 'requested_by_customer' } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (!booking.payment_intent_id) {
      return res.status(400).json({
        success: false,
        message: "No payment found for this booking"
      });
    }

    if (booking.payment_status !== 'Paid') {
      return res.status(400).json({
        success: false,
        message: "Cannot refund unpaid booking"
      });
    }

    // Create refund
    const refund = await createRefund(booking.payment_intent_id, amount, reason);

    // Update booking status
    await Booking.findByIdAndUpdate(bookingId, {
      payment_status: 'Refunded',
      status: 'Cancelled',
      cancellation_reason: reason
    });

    res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      data: {
        refund_id: refund.id,
        amount: refund.amount / 100,
        status: refund.status,
        reason: refund.reason
      }
    });

  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({
      success: false,
      message: "Failed to process refund",
      error: error.message
    });
  }
};

// Stripe webhook handler
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = constructWebhookEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object;
        await handlePaymentSuccess(paymentIntentSucceeded);
        break;

      case 'payment_intent.payment_failed':
        const paymentIntentFailed = event.data.object;
        await handlePaymentFailure(paymentIntentFailed);
        break;

      case 'payment_intent.canceled':
        const paymentIntentCanceled = event.data.object;
        await handlePaymentCancellation(paymentIntentCanceled);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

// Helper function to handle successful payment
const handlePaymentSuccess = async (paymentIntent) => {
  try {
    const bookingId = paymentIntent.metadata.booking_id;
    
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        status: 'Scheduled',
        payment_status: 'Paid',
        payment_intent_id: paymentIntent.id
      });
      
      console.log(`Payment successful for booking ${bookingId}, status updated to Scheduled`);
    }
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
};

// Helper function to handle failed payment
const handlePaymentFailure = async (paymentIntent) => {
  try {
    const bookingId = paymentIntent.metadata.booking_id;
    
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        status: 'Payment Failed',
        payment_status: 'Failed'
      });
      
      console.log(`Payment failed for booking ${bookingId}, status updated to Payment Failed`);
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
};

// Helper function to handle payment cancellation
const handlePaymentCancellation = async (paymentIntent) => {
  try {
    const bookingId = paymentIntent.metadata.booking_id;
    
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        status: 'Cancelled',
        payment_status: 'Failed',
        cancellation_reason: 'Payment cancelled'
      });
      
      console.log(`Payment cancelled for booking ${bookingId}, status updated to Cancelled`);
    }
  } catch (error) {
    console.error('Error handling payment cancellation:', error);
  }
};
