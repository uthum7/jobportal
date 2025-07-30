# Stripe Payment Integration Guide

This guide will help you set up Stripe payment integration for your job portal booking system.

## Overview

The Stripe integration allows users to:
- Pay for counseling session bookings
- Automatically update booking status to "Scheduled" after successful payment
- Handle payment failures and retries
- Process refunds for cancelled bookings
- Receive real-time payment status updates via webhooks

## Backend Setup

### 1. Environment Variables

Add the following to your `Backend/.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 2. Stripe Account Setup

1. Sign up at [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your API keys from the [API Keys page](https://dashboard.stripe.com/apikeys)
3. Set up a webhook endpoint:
   - Go to [Webhooks](https://dashboard.stripe.com/webhooks)
   - Add endpoint: `https://yourdomain.com/api/payments/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_intent.canceled`
   - Copy the webhook signing secret

### 3. API Endpoints

The following endpoints are now available:

#### Payment Management
- `POST /api/payments/booking/:bookingId/create-payment-intent` - Create payment intent
- `GET /api/payments/booking/:bookingId/status` - Get payment status
- `POST /api/payments/booking/:bookingId/confirm` - Manually confirm payment
- `POST /api/payments/booking/:bookingId/refund` - Process refund

#### Webhook
- `POST /api/payments/webhook` - Stripe webhook handler

## Frontend Setup

### 1. Environment Variables

Add the following to your `Frontend/.env.local` file:

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
VITE_API_URL=http://localhost:5001
```

### 2. Components Available

#### PaymentModal
Complete payment form with Stripe Elements integration.

```jsx
import PaymentModal from './components/PaymentModal/PaymentModal';

// Usage
<PaymentModal
  booking={bookingData}
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onPaymentSuccess={(paymentIntent, booking) => {
    // Handle successful payment
    console.log('Payment successful!');
  }}
/>
```

#### PaymentStatus
Display current payment and booking status.

```jsx
import PaymentStatus from './components/PaymentStatus/PaymentStatus';

// Usage
<PaymentStatus
  bookingId={booking.id}
  onStatusChange={(status) => {
    // Handle status updates
  }}
/>
```

#### BookingPaymentManager
Complete booking management with payment integration.

```jsx
import BookingPaymentManager from './components/BookingPaymentManager/BookingPaymentManager';

// Usage
<BookingPaymentManager
  booking={bookingData}
  onBookingUpdate={(updatedBooking) => {
    // Handle booking updates
    setBooking(updatedBooking);
  }}
/>
```

## Payment Flow

### 1. Booking Creation
- User creates a booking with a price > 0
- Booking status is set to "Pending"
- Payment status is set to "Pending"

### 2. Payment Processing
- User clicks "Pay" button
- System creates Stripe payment intent
- Booking status changes to "Payment Pending"
- User enters card details and submits payment

### 3. Payment Success
- Stripe processes payment successfully
- Webhook updates booking status to "Scheduled"
- Payment status changes to "Paid"
- User receives confirmation

### 4. Payment Failure
- If payment fails, booking status changes to "Payment Failed"
- User can retry payment
- Previous payment intent is reused or new one is created

## Booking Status Flow

```
Pending → Approved → Payment Pending → Scheduled → Completed
                          ↓
                   Payment Failed → (retry payment)
```

## Error Handling

### Common Issues

1. **Invalid API Keys**
   - Ensure you're using the correct test/live keys
   - Check that keys are properly set in environment variables

2. **Webhook Failures**
   - Verify webhook URL is accessible from the internet
   - Check webhook signing secret is correct
   - Ensure raw body parsing for webhook endpoint

3. **Payment Intent Errors**
   - Validate booking exists and has a valid price
   - Check booking is in correct status for payment

### Testing

Use Stripe's test card numbers:
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`
- Insufficient funds: `4000 0000 0000 9995`

## Security Considerations

1. **API Keys**
   - Never expose secret keys in frontend code
   - Use publishable keys only in frontend
   - Store secret keys securely in environment variables

2. **Webhook Security**
   - Always verify webhook signatures
   - Use HTTPS for webhook endpoints
   - Handle webhook events idempotently

3. **Payment Validation**
   - Validate amounts on server side
   - Check booking ownership before processing payments
   - Implement proper authentication and authorization

## Customization

### Custom Payment Fields
You can extend the booking model to include additional payment-related fields:

```javascript
// In booking.model.js
payment_method_id: {
  type: String,
  trim: true,
},
transaction_fee: {
  type: Number,
  default: 0,
},
currency: {
  type: String,
  default: 'usd',
  enum: ['usd', 'eur', 'gbp', 'cad', 'aud']
}
```

### Custom Payment Logic
Extend the payment controller to handle:
- Multiple payment methods
- Subscription payments
- Partial payments
- Payment plans

## Production Deployment

1. **Environment Variables**
   - Use live Stripe keys for production
   - Set up production webhook endpoints
   - Update CORS origins

2. **SSL Certificate**
   - Ensure your domain has valid SSL certificate
   - Stripe requires HTTPS for webhooks

3. **Webhook Endpoints**
   - Update webhook URLs in Stripe Dashboard
   - Test webhook delivery in production

## Support

For issues related to:
- Stripe API: [Stripe Documentation](https://stripe.com/docs)
- Payment flow: Check browser console and server logs
- Integration bugs: Create an issue in your project repository

## Testing Checklist

- [ ] Can create payment intent for valid booking
- [ ] Can process successful payments
- [ ] Can handle payment failures
- [ ] Can process refunds
- [ ] Webhooks update booking status correctly
- [ ] Payment status displays correctly
- [ ] Error messages are user-friendly
- [ ] Security: No sensitive data exposed in frontend
