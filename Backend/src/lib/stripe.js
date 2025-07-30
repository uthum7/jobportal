import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Check if Stripe secret key is available
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('❌ STRIPE_SECRET_KEY is not set in environment variables');
  throw new Error('Stripe configuration error: STRIPE_SECRET_KEY is required');
}

if (!stripeSecretKey.startsWith('sk_')) {
  console.error('❌ Invalid Stripe secret key format. It should start with "sk_"');
  throw new Error('Stripe configuration error: Invalid secret key format');
}

console.log('✅ Stripe configuration loaded successfully');
console.log(`🔐 Using Stripe key: ${stripeSecretKey.substring(0, 20)}...`);

// Initialize Stripe with your secret key
const stripe = new Stripe(stripeSecretKey);

export default stripe;

// Helper function to create a payment intent
export const createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

// Helper function to retrieve a payment intent
export const retrievePaymentIntent = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    throw error;
  }
};

// Helper function to confirm a payment intent
export const confirmPaymentIntent = async (paymentIntentId, paymentMethodId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });
    return paymentIntent;
  } catch (error) {
    console.error('Error confirming payment intent:', error);
    throw error;
  }
};

// Helper function to create a refund
export const createRefund = async (paymentIntentId, amount = null, reason = 'requested_by_customer') => {
  try {
    const refundData = {
      payment_intent: paymentIntentId,
      reason,
    };

    if (amount) {
      refundData.amount = Math.round(amount * 100); // Stripe expects amount in cents
    }

    const refund = await stripe.refunds.create(refundData);
    return refund;
  } catch (error) {
    console.error('Error creating refund:', error);
    throw error;
  }
};

// Helper function to construct webhook events
export const constructWebhookEvent = (payload, signature, endpointSecret) => {
  try {
    const event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    return event;
  } catch (error) {
    console.error('Error constructing webhook event:', error);
    throw error;
  }
};
