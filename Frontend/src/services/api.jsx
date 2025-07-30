import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Authentication required");
    }
    return Promise.reject(error);
  }
);

const updateResumeSection = async (userId, section, data) => {
  try {
    const response = await api.patch(`/cv/${userId}`, {
      [section]: data,
    });
    return response.data;
  } catch (error) {
    console.error(`Error saving ${section}:`, error);
    throw error;
  }
};

export const fetchResumeData = async (userId) => {
  console.log("Fetching resume for userId:", userId);
  try {
    const response = await api.get(`/cv/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching resume data:", error);
    throw error;
  }
};

export const savePersonalInfo = (userId, data) =>
  updateResumeSection(userId, "personalInfo", data);

export const saveEducationDetails = async (userId, data) => {
  try {
    const response = await api.post("/cv/update", {
      userId,
      step: "educationDetails",
      data,
    });
    return response.data;
  } catch (err) {
    console.error("Error saving education details:", err);
    throw err;
  }
};

export const saveProfessionalExperience = (userId, data) =>
  updateResumeSection(userId, "professionalExperience", data);

export const saveSkills = (userId, data) =>
  updateResumeSection(userId, "skill", data);

export const saveSummary = (userId, data) =>
  updateResumeSection(userId, "summary", data);

export const saveReferences = (userId, data) =>
  updateResumeSection(userId, "references", data);

export const createNewResume = async (userId) => {
  try {
    const response = await api.post("/cv", { userId });
    return response.data;
  } catch (error) {
    console.error("Error creating new resume:", error);
    throw error;
  }
};
<<<<<<< HEAD

// Booking API functions
export const bookingAPI = {
  // Get all bookings with optional filters
  getAllBookings: async (params = {}) => {
    try {
      const response = await api.get("/bookings", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  },

  // Get bookings by user ID
  getBookingsByUser: async (userId, params = {}) => {
    try {
      const response = await api.get(`/bookings/user/${userId}`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      throw error;
    }
  },

  // Get bookings by counselor ID
  getBookingsByCounselor: async (counselorId, params = {}) => {
    try {
      const response = await api.get(`/bookings/counselor/${counselorId}`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching counselor bookings:", error);
      throw error;
    }
  },

  // Get single booking by ID
  getBookingById: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching booking:", error);
      throw error;
    }
  },

  // Create new booking
  createBooking: async (bookingData) => {
    try {
      const response = await api.post("/bookings", bookingData);
      return response.data;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  },

  // Update booking
  updateBooking: async (bookingId, updateData) => {
    try {
      const response = await api.put(`/bookings/${bookingId}`, updateData);
      return response.data;
    } catch (error) {
      console.error("Error updating booking:", error);
      throw error;
    }
  },

  // Approve booking
  approveBooking: async (bookingId, approvalData = {}) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/approve`, approvalData);
      return response.data;
    } catch (error) {
      console.error("Error approving booking:", error);
      throw error;
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId, cancellationData) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/cancel`, cancellationData);
      return response.data;
    } catch (error) {
      console.error("Error cancelling booking:", error);
      throw error;
    }
  },

  // Reschedule booking
  rescheduleBooking: async (bookingId, rescheduleData) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/reschedule`, rescheduleData);
      return response.data;
    } catch (error) {
      console.error("Error rescheduling booking:", error);
      throw error;
    }
  },

  // Delete booking (soft delete)
  deleteBooking: async (bookingId) => {
    try {
      const response = await api.delete(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting booking:", error);
      throw error;
    }
  },

  // Get booking statistics
  getBookingStats: async (params = {}) => {
    try {
      const response = await api.get("/bookings/stats", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching booking stats:", error);
      throw error;
    }
  }
};

export default api;
=======
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
