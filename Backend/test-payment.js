// Test script for Stripe payment integration
// Run this with: node test-payment.js

import dotenv from 'dotenv';
import { createPaymentIntent, retrievePaymentIntent } from './src/lib/stripe.js';

dotenv.config();

async function testStripeIntegration() {
  console.log('🧪 Testing Stripe Integration...\n');

  try {
    // Test 1: Create a payment intent
    console.log('1. Creating payment intent...');
    const paymentIntent = await createPaymentIntent(
      29.99, // $29.99
      'usd',
      {
        booking_id: 'test_booking_123',
        user_email: 'test@example.com'
      }
    );
    
    console.log('✅ Payment intent created successfully');
    console.log(`   ID: ${paymentIntent.id}`);
    console.log(`   Amount: $${paymentIntent.amount / 100}`);
    console.log(`   Status: ${paymentIntent.status}`);
    console.log(`   Client Secret: ${paymentIntent.client_secret.substring(0, 20)}...`);

    // Test 2: Retrieve the payment intent
    console.log('\n2. Retrieving payment intent...');
    const retrieved = await retrievePaymentIntent(paymentIntent.id);
    
    console.log('✅ Payment intent retrieved successfully');
    console.log(`   Status: ${retrieved.status}`);
    console.log(`   Created: ${new Date(retrieved.created * 1000).toLocaleString()}`);

    console.log('\n🎉 All tests passed! Stripe integration is working correctly.');
    console.log('\n📝 Next steps:');
    console.log('   1. Set up webhook endpoint');
    console.log('   2. Test with frontend payment form');
    console.log('   3. Test complete booking flow');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check your STRIPE_SECRET_KEY in .env file');
    console.log('   2. Make sure you have internet connection');
    console.log('   3. Verify your Stripe account is active');
  }
}

// Run the test
testStripeIntegration();
