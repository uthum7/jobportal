import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8091/api",
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
