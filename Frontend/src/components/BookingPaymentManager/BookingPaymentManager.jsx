import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import PaymentModal from '../PaymentModal/PaymentModal';
import PaymentStatus from '../PaymentStatus/PaymentStatus';
import paymentService from '../../services/paymentService';

const BookingPaymentManager = ({ booking, onBookingUpdate }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);

  const canMakePayment = () => {
    return booking && 
           ['Pending', 'Approved', 'Payment Pending', 'Payment Failed'].includes(booking.status) &&
           booking.payment_status !== 'Paid' &&
           booking.price > 0;
  };

  const canRefund = () => {
    return booking && 
           booking.payment_status === 'Paid' &&
           ['Scheduled', 'Cancelled'].includes(booking.status);
  };

  const handlePaymentSuccess = (paymentIntent, updatedBooking) => {
    toast.success('Payment successful! Your booking has been confirmed.');
    // Refresh the booking data or call parent callback
    onBookingUpdate && onBookingUpdate({
      ...booking,
      status: 'Scheduled',
      payment_status: 'Paid',
      payment_intent_id: paymentIntent.id
    });
  };

  const handleRefund = async () => {
    if (!booking || !canRefund()) return;

    const confirmed = window.confirm(
      `Are you sure you want to refund $${booking.price} for this booking? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setIsProcessingRefund(true);
      const response = await paymentService.refundBooking(booking._id);
      
      toast.success('Refund processed successfully');
      onBookingUpdate && onBookingUpdate({
        ...booking,
        status: 'Cancelled',
        payment_status: 'Refunded'
      });
    } catch (error) {
      console.error('Error processing refund:', error);
      toast.error(error.message || 'Failed to process refund');
    } finally {
      setIsProcessingRefund(false);
    }
  };

  const getStatusText = () => {
    if (!booking) return '';

    switch (booking.status) {
      case 'Pending':
        return 'Waiting for counselor approval';
      case 'Approved':
        return 'Approved - Payment required to confirm';
      case 'Payment Pending':
        return 'Payment in progress';
      case 'Payment Failed':
        return 'Payment failed - Please try again';
      case 'Scheduled':
        return 'Booking confirmed and scheduled';
      case 'Cancelled':
        return 'Booking cancelled';
      case 'Completed':
        return 'Session completed';
      default:
        return booking.status;
    }
  };

  const getActionButtons = () => {
    if (!booking) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {canMakePayment() && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowPaymentModal(true)}
          >
            Pay ${booking.price}
          </button>
        )}

        {canRefund() && (
          <button
            className={`btn btn-warning btn-sm ${isProcessingRefund ? 'loading' : ''}`}
            onClick={handleRefund}
            disabled={isProcessingRefund}
          >
            {isProcessingRefund ? 'Processing...' : 'Request Refund'}
          </button>
        )}

        {booking.status === 'Scheduled' && booking.meeting_link && (
          <a
            href={booking.meeting_link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success btn-sm"
          >
            Join Meeting
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Booking Information */}
      <div className="bg-base-100 p-4 rounded-lg border">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">Booking Details</h3>
            <p className="text-sm text-gray-600">{getStatusText()}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">${booking?.price || 0}</p>
            <p className="text-xs text-gray-500">{booking?.duration || 60} minutes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-medium">Counselor:</span> {booking?.counselor?.name || 'N/A'}
          </div>
          <div>
            <span className="font-medium">Date:</span> {booking?.date || 'N/A'}
          </div>
          <div>
            <span className="font-medium">Time:</span> {booking?.time || 'N/A'}
          </div>
          <div>
            <span className="font-medium">Type:</span> {booking?.type || 'N/A'}
          </div>
          <div className="md:col-span-2">
            <span className="font-medium">Topic:</span> {booking?.topic || 'N/A'}
          </div>
          {booking?.notes && (
            <div className="md:col-span-2">
              <span className="font-medium">Notes:</span> {booking.notes}
            </div>
          )}
        </div>

        {getActionButtons()}
      </div>

      {/* Payment Status */}
      {booking && (
        <div className="bg-base-100 p-4 rounded-lg border">
          <h4 className="font-medium mb-3">Payment Information</h4>
          <PaymentStatus 
            bookingId={booking._id} 
            onStatusChange={(status) => {
              // Handle status changes if needed
              console.log('Payment status updated:', status);
            }}
          />
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        booking={booking}
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default BookingPaymentManager;
