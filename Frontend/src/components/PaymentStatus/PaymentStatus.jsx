import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import paymentService from '../../services/paymentService';

const PaymentStatus = ({ bookingId, onStatusChange }) => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (bookingId) {
      fetchPaymentStatus();
    }
  }, [bookingId]);

  const fetchPaymentStatus = async () => {
    try {
      setIsLoading(true);
      const response = await paymentService.getPaymentStatus(bookingId);
      setPaymentStatus(response.data);
      onStatusChange && onStatusChange(response.data);
    } catch (error) {
      console.error('Error fetching payment status:', error);
      setError(error.message || 'Failed to fetch payment status');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'badge-success';
      case 'Pending':
        return 'badge-warning';
      case 'Failed':
        return 'badge-error';
      case 'Refunded':
        return 'badge-info';
      default:
        return 'badge-neutral';
    }
  };

  const getBookingStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'badge-success';
      case 'Pending':
        return 'badge-warning';
      case 'Payment Pending':
        return 'badge-warning';
      case 'Payment Failed':
        return 'badge-error';
      case 'Cancelled':
        return 'badge-error';
      case 'Completed':
        return 'badge-info';
      case 'Approved':
        return 'badge-info';
      default:
        return 'badge-neutral';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="loading loading-spinner loading-sm"></div>
        <span className="text-sm">Loading payment status...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error alert-sm">
        <div>
          <span className="text-xs">{error}</span>
        </div>
        <button className="btn btn-xs btn-outline" onClick={fetchPaymentStatus}>
          Retry
        </button>
      </div>
    );
  }

  if (!paymentStatus) {
    return (
      <div className="text-sm text-gray-500">
        No payment information available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Booking Status:</span>
        <span className={`badge ${getBookingStatusColor(paymentStatus.booking_status)}`}>
          {paymentStatus.booking_status}
        </span>
      </div>

      {paymentStatus.amount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Amount:</span>
          <span className="text-sm font-semibold">${paymentStatus.amount}</span>
        </div>
      )}

      {paymentStatus.payment_details && (
        <div className="bg-base-200 p-3 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Payment Details</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="capitalize">{paymentStatus.payment_details.status}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount Received:</span>
              <span>${paymentStatus.payment_details.amount_received}</span>
            </div>
            <div className="flex justify-between">
              <span>Currency:</span>
              <span className="uppercase">{paymentStatus.payment_details.currency}</span>
            </div>
            {paymentStatus.payment_details.created && (
              <div className="flex justify-between">
                <span>Created:</span>
                <span>{new Date(paymentStatus.payment_details.created * 1000).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {paymentStatus.payment_intent_id && (
        <div className="text-xs text-gray-500">
          Payment ID: {paymentStatus.payment_intent_id.substring(0, 20)}...
        </div>
      )}

      <button 
        className="btn btn-xs btn-outline w-full" 
        onClick={fetchPaymentStatus}
      >
        Refresh Status
      </button>
    </div>
  );
};

export default PaymentStatus;
