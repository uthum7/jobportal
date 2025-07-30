import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';
import paymentService from '../../services/paymentService';

// Load Stripe (replace with your publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key_here');

// Card element options
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      iconColor: '#666EE8',
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

// Payment form component
const PaymentForm = ({ booking, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create payment intent when component mounts
    createPaymentIntent();
  }, [booking.id]);

  const createPaymentIntent = async () => {
    try {
      setIsLoading(true);
      const response = await paymentService.createPaymentIntent(booking.id);
      setPaymentIntent(response.data);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      setError(error.message || 'Failed to initialize payment');
      toast.error('Failed to initialize payment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !paymentIntent) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    // Confirm the payment
    const { error, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(
      paymentIntent.client_secret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: booking.user?.username || 'Customer',
            email: booking.user?.email,
          },
        },
      }
    );

    if (error) {
      console.error('Payment failed:', error);
      setError(error.message);
      toast.error(error.message);
      onPaymentError && onPaymentError(error);
    } else if (confirmedPaymentIntent.status === 'succeeded') {
      console.log('Payment succeeded:', confirmedPaymentIntent);
      toast.success('Payment successful! Your booking has been confirmed.');
      onPaymentSuccess && onPaymentSuccess(confirmedPaymentIntent);
    }

    setIsLoading(false);
  };

  if (!paymentIntent && isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="loading loading-spinner loading-lg"></div>
        <span className="ml-3">Initializing payment...</span>
      </div>
    );
  }

  if (error && !paymentIntent) {
    return (
      <div className="alert alert-error">
        <div>
          <h3 className="font-bold">Payment Error</h3>
          <div className="text-xs">{error}</div>
        </div>
        <button className="btn btn-outline btn-sm" onClick={createPaymentIntent}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Booking Summary */}
      <div className="bg-base-200 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-3">Payment Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Counselor:</span>
            <span className="font-medium">{booking.counselor?.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{booking.date}</span>
          </div>
          <div className="flex justify-between">
            <span>Time:</span>
            <span>{booking.time}</span>
          </div>
          <div className="flex justify-between">
            <span>Duration:</span>
            <span>{booking.duration} minutes</span>
          </div>
          <div className="flex justify-between">
            <span>Type:</span>
            <span>{booking.type}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total Amount:</span>
            <span>${booking.price}</span>
          </div>
        </div>
      </div>

      {/* Card Input */}
      <div className="space-y-3">
        <label className="label">
          <span className="label-text font-medium">Card Information</span>
        </label>
        <div className="border border-base-300 rounded-lg p-4 bg-base-100">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="alert alert-error">
          <div>
            <strong>Payment Error:</strong> {error}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
      >
        {isLoading ? 'Processing...' : `Pay $${booking.price}`}
      </button>

      {/* Security Notice */}
      <div className="text-sm text-gray-500 text-center">
        <p>🔒 Your payment information is secure and encrypted</p>
        <p>Powered by Stripe</p>
      </div>
    </form>
  );
};

// Main Payment Modal Component
const PaymentModal = ({ booking, isOpen, onClose, onPaymentSuccess }) => {
  const handlePaymentSuccess = (paymentIntent) => {
    onClose();
    onPaymentSuccess && onPaymentSuccess(paymentIntent, booking);
  };

  const handlePaymentError = (error) => {
    console.error('Payment error in modal:', error);
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Complete Payment</h2>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        <Elements stripe={stripePromise}>
          <PaymentForm
            booking={booking}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentModal;
