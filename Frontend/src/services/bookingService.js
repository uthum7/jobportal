import { axiosInstance } from '../lib/axios.js';

class BookingService {
  // Create a new booking
  async createBooking(bookingData) {
    try {
      const response = await axiosInstance.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get all bookings with filters
  async getAllBookings(params = {}) {
    try {
      const response = await axiosInstance.get('/bookings', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get booking by ID
  async getBookingById(id) {
    try {
      const response = await axiosInstance.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Update booking
  async updateBooking(id, updateData) {
    try {
      const response = await axiosInstance.put(`/bookings/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Approve booking (for counselors/admins)
  async approveBooking(id, approvalData = {}) {
    try {
      const response = await axiosInstance.patch(`/bookings/${id}/approve`, approvalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Approve booking (for counselors/admins)
  async approveBooking(id, approvalData = {}) {
    try {
      const response = await axiosInstance.patch(`/bookings/${id}/approve`, approvalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Cancel booking
  async cancelBooking(id, cancellationData) {
    try {
      const response = await axiosInstance.patch(`/bookings/${id}/cancel`, cancellationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Reschedule booking
  async rescheduleBooking(id, rescheduleData) {
    try {
      const response = await axiosInstance.patch(`/bookings/${id}/reschedule`, rescheduleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Delete booking (soft delete)
  async deleteBooking(id) {
    try {
      const response = await axiosInstance.delete(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get bookings by counselor
  async getBookingsByCounselor(counselorId, params = {}) {
    try {
      const response = await axiosInstance.get(`/bookings/counselor/${counselorId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get bookings by user
  async getBookingsByUser(userId, params = {}) {
    try {
      const response = await axiosInstance.get(`/bookings/user/${userId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get booking statistics
  async getBookingStats(params = {}) {
    try {
      const response = await axiosInstance.get('/bookings/stats', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default new BookingService();
