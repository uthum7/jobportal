import { axiosInstance } from "../lib/axios.js";

// Counselor API calls
export const getCounselorById = async (id) => {
  try {
    const response = await axiosInstance.get(`/counselors/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching counselor:", error);
    throw error;
  }
};

export const getAllCounselors = async () => {
  try {
    const response = await axiosInstance.get("/counselors");
    return response.data;
  } catch (error) {
    console.error("Error fetching counselors:", error);
    throw error;
  }
};

// Booking API calls
export const createBooking = async (bookingData) => {
  try {
    const response = await axiosInstance.post("/bookings", bookingData);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const getBookingsByUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`/bookings/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    throw error;
  }
};

export const getBookingsByCounselor = async (counselorId) => {
  try {
    const response = await axiosInstance.get(`/bookings/counselor/${counselorId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching counselor bookings:", error);
    throw error;
  }
};

export const updateBooking = async (id, updateData) => {
  try {
    const response = await axiosInstance.put(`/bookings/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

export const cancelBooking = async (id) => {
  try {
    const response = await axiosInstance.patch(`/bookings/${id}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Error canceling booking:", error);
    throw error;
  }
};

export const rescheduleBooking = async (id, rescheduleData) => {
  try {
    const response = await axiosInstance.patch(`/bookings/${id}/reschedule`, rescheduleData);
    return response.data;
  } catch (error) {
    console.error("Error rescheduling booking:", error);
    throw error;
  }
};

// Counselees API calls
export const getCounselees = async (counselorId, filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.sort) params.append('sort', filters.sort);
    
    const response = await axiosInstance.get(`/counselees/${counselorId}?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching counselees:", error);
    throw error;
  }
};

export const getCounseleeById = async (counselorId, counseleeId) => {
  try {
    const response = await axiosInstance.get(`/counselees/${counselorId}/${counseleeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching counselee:", error);
    throw error;
  }
};

export const addCounselee = async (counselorId, counseleeData) => {
  try {
    const response = await axiosInstance.post(`/counselees/${counselorId}`, counseleeData);
    return response.data;
  } catch (error) {
    console.error("Error adding counselee:", error);
    throw error;
  }
};

export const updateCounselee = async (counselorId, counseleeId, updateData) => {
  try {
    const response = await axiosInstance.put(`/counselees/${counselorId}/${counseleeId}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating counselee:", error);
    throw error;
  }
};

export const deleteCounselee = async (counselorId, counseleeId) => {
  try {
    const response = await axiosInstance.delete(`/counselees/${counselorId}/${counseleeId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting counselee:", error);
    throw error;
  }
};

export const getCounseleeSessionHistory = async (counselorId, counseleeId) => {
  try {
    const response = await axiosInstance.get(`/counselees/${counselorId}/${counseleeId}/sessions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching session history:", error);
    throw error;
  }
};

export const scheduleSession = async (counselorId, counseleeId, sessionData) => {
  try {
    const response = await axiosInstance.post(`/counselees/${counselorId}/${counseleeId}/sessions`, sessionData);
    return response.data;
  } catch (error) {
    console.error("Error scheduling session:", error);
    throw error;
  }
};

export const updateSessionProgress = async (counselorId, counseleeId, progressData) => {
  try {
    const response = await axiosInstance.put(`/counselees/${counselorId}/${counseleeId}/progress`, progressData);
    return response.data;
  } catch (error) {
    console.error("Error updating session progress:", error);
    throw error;
  }
};
