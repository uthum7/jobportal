// /context/CVFormContext.jsx

import React, { createContext, useState, useContext, useCallback, useEffect } from "react";
import { getToken, getUserId } from "../utils/auth"; // Ensure you have a getUserId function
import axios from "axios"; // Using axios for simplicity and better error handling

const CVFormContext = createContext(undefined);

// Helper to convert an image file to a base64 string for JSON transfer
const toBase64 = file => new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
        // If it's already a string (like a URL from the DB), just pass it through.
        return resolve(file);
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export const CVFormProvider = ({ children }) => {
  // ===============================================
  // ===        UPDATED INITIAL STATE            ===
  // ===============================================
  const initialResumeState = {
    userId: null,
    personalInfo: {
      fullname: "", nameWithInitials: "", gender: "", birthday: "", address: "",
      email: "", phone: "", profileParagraph: "", profilePicture: null,
    },
    educationDetails: [], // FIX: Must be an array
    professionalExperience: [],
    skill: [],
    summary: "",
    references: [],
  };

  const [resumeData, setResumeData] = useState(initialResumeState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completionStatus, setCompletionStatus] = useState({});

  // ===============================================
  // ===   UPDATED COMPLETION STATUS LOGIC       ===
  // ===============================================
  useEffect(() => {
    if (resumeData) {
      const {
        personalInfo, educationDetails, professionalExperience,
        skill, summary, references,
      } = resumeData;

      // This logic now correctly checks the new data structures
      setCompletionStatus({
        personalinfo: !!(personalInfo?.fullname && personalInfo?.email),
        education: Array.isArray(educationDetails) && educationDetails.length > 0, // FIX: Check if array has items
        experience: Array.isArray(professionalExperience) && professionalExperience.length > 0,
        skills: Array.isArray(skill) && skill.length > 0,
        summary: !!(summary && summary.trim().length > 10),
        references: Array.isArray(references) && references.length > 0,
      });
    }
  }, [resumeData]);


  const fetchResumeData = useCallback(async () => {
    const userId = getUserId();
    const token = getToken();
    if (!userId || !token) {
      setError("Authentication error. Please log in.");
      setResumeData(initialResumeState);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5001/api/cv/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResumeData(prev => ({ ...prev, ...response.data, userId }));
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to fetch CV data.";
      setError(errorMsg);
      console.error("[Context] Fetch Error:", errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ===============================================
  // ===      UPDATED SAVE TO DATABASE LOGIC     ===
  // ===============================================
  const saveToDatabase = async (sectionKey, sectionData) => {
    const token = getToken();
    if (!token) {
      setError("Authentication error. Please log in again.");
      throw new Error("User not authenticated.");
    }
    
    setLoading(true);
    setError(null);

    let dataPayload = sectionData;

    // Handle profile picture conversion if it's a new file
    if (sectionKey === "personalInfo" && sectionData?.profilePicture instanceof File) {
      try {
        const base64Image = await toBase64(sectionData.profilePicture);
        dataPayload = { ...sectionData, profilePicture: base64Image };
      } catch (e) {
        console.error("Error converting profile picture:", e);
        // Proceed without the picture if conversion fails
        const { profilePicture, ...restData } = sectionData;
        dataPayload = restData;
      }
    }
    
    try {
      const response = await axios.post("http://localhost:5001/api/cv/update",
        { step: sectionKey, data: dataPayload },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // CRITICAL FIX: Update the context's state with the full, fresh data from the server.
      // This is what allows the progress bar to update correctly.
      setResumeData(response.data);
      
      return response.data; // Return data on success for the promise chain
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Failed to save ${sectionKey}.`;
      setError(errorMessage);
      console.error(`[Context] Save Error for ${sectionKey}:`, errorMessage);
      // Re-throw the error to be caught by toast.promise on the page
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Simplified context handlers for skills, as local state is managed on the page
  const addSkill = useCallback((newSkill) => {
    setResumeData(prev => ({ ...prev, skill: [...(prev.skill || []), newSkill] }));
  }, []);

  const updateSkill = useCallback((index, updatedSkill) => {
     setResumeData(prev => {
      const skills = [...(prev.skill || [])];
      skills[index] = updatedSkill;
      return { ...prev, skill: skills };
    });
  }, []);

  const removeSkill = useCallback((index) => {
    setResumeData(prev => ({ ...prev, skill: (prev.skill || []).filter((_, i) => i !== index) }));
  }, []);
  
  const contextValue = {
    resumeData,
    loading,
    error,
    setError,
    completionStatus,
    fetchResumeData,
    saveToDatabase,
    // Provide skill handlers for Cv3.jsx
    addSkill,
    updateSkill,
    removeSkill,
  };

  return (
    <CVFormContext.Provider value={contextValue}>
      {children}
    </CVFormContext.Provider>
  );
};

export const useCVForm = () => {
  const context = useContext(CVFormContext);
  if (context === undefined) {
    throw new Error('useCVForm must be used within a CVFormProvider.');
  }
  return context;
};