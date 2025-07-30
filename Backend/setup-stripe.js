#!/usr/bin/env node

// Setup script for Stripe payment integration
// Run this with: node setup-stripe.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🎉 Setting up Stripe Payment Integration...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('⚠️  No .env file found. Creating one from example...');
  
  const envContent = `# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Add your other environment variables below
MONGO_URL=mongodb://localhost:27017/jobportal
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=http://localhost:5173
PORT=5001
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file with Stripe placeholders');
} else {
  console.log('✅ .env file already exists');
}

// Check if Stripe keys are configured
if (envExists) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasStripeSecret = envContent.includes('STRIPE_SECRET_KEY=sk_');
  const hasStripePublishable = envContent.includes('STRIPE_PUBLISHABLE_KEY=pk_');
  const hasWebhookSecret = envContent.includes('STRIPE_WEBHOOK_SECRET=whsec_');

  if (!hasStripeSecret || !hasStripePublishable || !hasWebhookSecret) {
    console.log('⚠️  Please update your .env file with actual Stripe keys:');
    console.log('   1. Go to https://dashboard.stripe.com/apikeys');
    console.log('   2. Copy your Secret key (starts with sk_test_)');
    console.log('   3. Copy your Publishable key (starts with pk_test_)');
    console.log('   4. Set up webhooks and get the signing secret (starts with whsec_)');
  } else {
    console.log('✅ Stripe keys appear to be configured');
  }
}

// Check if frontend .env exists
const frontendEnvPath = path.join(__dirname, '../Frontend/.env.local');
const frontendEnvExists = fs.existsSync(frontendEnvPath);

if (!frontendEnvExists) {
  console.log('⚠️  No frontend .env.local file found. Creating one...');
  
  const frontendEnvContent = `# Stripe Configuration for Frontend
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
VITE_API_URL=http://localhost:5001
`;

  try {
    fs.writeFileSync(frontendEnvPath, frontendEnvContent);
    console.log('✅ Created frontend .env.local file');
  } catch (error) {
    console.log('⚠️  Could not create frontend .env.local file');
    console.log('   Please create it manually in the Frontend folder');
  }
} else {
  console.log('✅ Frontend .env.local file already exists');
}

console.log('\n📋 Setup Checklist:');
console.log('   ☐ Update backend .env with actual Stripe keys');
console.log('   ☐ Update frontend .env.local with Stripe publishable key');
console.log('   ☐ Set up Stripe webhook endpoint');
console.log('   ☐ Test payment flow');

console.log('\n📚 Next Steps:');
console.log('   1. Read STRIPE_INTEGRATION_GUIDE.md for detailed setup');
console.log('   2. Run "node test-payment.js" to test backend integration');
console.log('   3. Start your development servers and test the full flow');

console.log('\n🚀 Happy coding!');
