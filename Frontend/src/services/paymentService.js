import axios from "axios";

// Create authenticated axios instance for payment services
const paymentAPI = axios.create({
  baseURL: "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token interceptor
paymentAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

paymentAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Authentication required for payment operation");
    }
    return Promise.reject(error);
  }
);

class PaymentService {
  // Create payment intent for a booking
  async createPaymentIntent(bookingId) {
    try {
      const response = await paymentAPI.post(`/payments/booking/${bookingId}/create-payment-intent`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get payment status for a booking
  async getPaymentStatus(bookingId) {
    try {
      const response = await paymentAPI.get(`/payments/booking/${bookingId}/status`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Confirm payment manually (if needed)
  async confirmPayment(bookingId, paymentIntentId) {
    try {
      const response = await paymentAPI.post(`/payments/booking/${bookingId}/confirm`, {
        payment_intent_id: paymentIntentId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Request refund for a booking
  async refundBooking(bookingId, amount = null, reason = 'requested_by_customer') {
    try {
      const response = await paymentAPI.post(`/payments/booking/${bookingId}/refund`, {
        amount,
        reason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default new PaymentService();
