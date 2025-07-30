<<<<<<< HEAD
// CVFormContext.jsx
import React, { createContext, useState, useContext, useCallback } from "react";
import { getToken, getUserId as authGetUserId } from "../utils/auth"; // Ensure path is correct

const CVFormContext = createContext(undefined);

const toBase64 = file => new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
        if (typeof file === 'string') return resolve(file);
        console.warn("toBase64: Input was not a File, but was a string. Passing through:", file);
        return resolve(file); // Pass through if it's already a string (URL/base64)
=======
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
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export const CVFormProvider = ({ children }) => {
<<<<<<< HEAD
  const initialResumeState = {
    userId: null,
    personalInfo: {
      fullname: "", nameWithInitials: "", jobTitle: "", address: "",
      addressOptional: "", email: "", phone: "", profileParagraph: "",
      profilePicture: null,
    },
    educationDetails: {
      schoolName: "", startDate: "", endDate: "", moreDetails: "",
      universitiyName: "", uniStartDate: "", uniEndDate: "", uniMoreDetails: "",
    },
=======
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
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
    professionalExperience: [],
    skill: [],
    summary: "",
    references: [],
  };

  const [resumeData, setResumeData] = useState(initialResumeState);
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const [error, setError] = useState(null); // This error is for context-level operations

  const fetchResumeData = useCallback(async () => {
    const userId = authGetUserId(); // Using the aliased import
    const token = getToken();

    if (!userId || !token) {
      const msg = !userId ? "User ID not found." : "Authentication token not found.";
      console.warn("[Context] fetchResumeData precondition failed:", msg);
      setError(msg + " Please login.");
      setResumeData(initialResumeState); // Reset on auth failure
      // throw new Error(msg + " Cannot fetch CV data."); // Or throw
      return { error: msg + " Cannot fetch CV data." };
=======
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
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
    }

    setLoading(true);
    setError(null);
<<<<<<< HEAD
    console.log("[Context] Fetching resume data for user ID:", userId);

    try {
      const response = await fetch(`http://localhost:5001/api/cv/`, { // Backend GET /api/cv now uses authenticated user
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`[Context] API error fetching/initializing data (Status: ${response.status}):`, data.message || "Unknown server error");
        throw new Error(data.message || `Failed to fetch/initialize CV (Status: ${response.status})`);
      }

      console.log("[Context] Successfully fetched/initialized CV Data:", data);
      // Ensure all keys from initialResumeState are present, then merge fetched data.
      // This handles cases where backend might not return all sections if they are empty.
      const newResumeData = { ...initialResumeState };
      for (const key in initialResumeState) {
        if (data.hasOwnProperty(key) && data[key] !== null && data[key] !== undefined) {
            // For arrays, ensure they are arrays if backend sends null instead of []
            if (Array.isArray(initialResumeState[key]) && !Array.isArray(data[key])) {
                newResumeData[key] = [];
            } else {
                newResumeData[key] = data[key];
            }
        }
      }
      // If backend sends userId, use it, otherwise keep from auth (though usually backend provides it)
      newResumeData.userId = data.userId || userId;

      setResumeData(newResumeData);
      setError(null);
      return { success: true, data: newResumeData, isNew: data._isNewCvTemplate || false };

    } catch (err) {
      console.error("[Context] Catch block: Error fetching/initializing CV data:", err);
      setError(err.message || "An unexpected error occurred while fetching CV data.");
      setResumeData(prev => ({ ...initialResumeState, userId: prev.userId || userId })); // Reset but keep userId if available
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  }, [/* stable setters like setResumeData, setLoading, setError */]);

  const saveToDatabase = useCallback(async (sectionKey, sectionDataFromComponent) => {
    setLoading(true);
    setError(null);
    const currentUserId = authGetUserId();
    const token = getToken();

    if (!currentUserId || !token) {
      const errorMsg = "User ID or Token not found. Cannot save. Please login.";
      console.error("[Context] saveToDatabase:", errorMsg);
      setError(errorMsg);
      setLoading(false);
      throw new Error(errorMsg);
    }

    let dataPayloadForBackend = sectionDataFromComponent;

    // Handle profile picture for 'personalInfo' section
    if (sectionKey === "personalInfo" && sectionDataFromComponent && sectionDataFromComponent.profilePicture instanceof File) {
      try {
        const base64Image = await toBase64(sectionDataFromComponent.profilePicture);
        dataPayloadForBackend = { ...sectionDataFromComponent, profilePicture: base64Image };
      } catch (e) {
        console.error("[Context] Error converting profile picture for save:", e);
        // Decide how to handle: send without pic, or error out
        const { profilePicture, ...restData } = sectionDataFromComponent;
        dataPayloadForBackend = restData; // Example: send without picture
        // setError("Failed to process profile picture for saving."); // Optionally set an error
      }
    }

    console.log(`[Context] Attempting to save step: "${sectionKey}".`);
    console.log("[Context] Data being sent to backend for this step:", dataPayloadForBackend);
    // ^^^ THIS LOG IS CRUCIAL FOR THE SUMMARY ISSUE ^^^
    // For "summary", dataPayloadForBackend should be a string.

    try {
      const response = await fetch(`http://localhost:5001/api/cv/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        // Backend expects userId from token, not in body for /update
        body: JSON.stringify({ step: sectionKey, data: dataPayloadForBackend }),
      });

      const serverResponseData = await response.json();

      if (!response.ok) {
        console.error(`[Context] API error saving data (Status: ${response.status}):`, serverResponseData.message || serverResponseData.error || "Unknown save error");
        throw new Error(serverResponseData.message || serverResponseData.error || `Failed to save ${sectionKey}`);
      }
      
      console.log(`[Context] Successfully saved "${sectionKey}". Full CV from server:`, serverResponseData);
      // Backend should return the entire updated CV document.
      setResumeData(prev => ({ ...prev, ...serverResponseData })); // Merge, server response is source of truth
      setError(null);
      return serverResponseData; // Return the full updated CV
    } catch (err) {
      console.error(`[Context] Catch block error saving "${sectionKey}":`, err);
      setError(err.message || `An unexpected error occurred while saving ${sectionKey}.`);
      throw err; // Re-throw for the component to catch and handle UI
    } finally {
      setLoading(false);
    }
  }, [/* stable setters */]);

  const updateResumeSection = useCallback((sectionKey, dataToMerge) => {
    setResumeData((prev) => {
      const currentSectionData = prev[sectionKey];
      let newSectionData;

      if (typeof currentSectionData === 'object' && currentSectionData !== null && !Array.isArray(currentSectionData)) {
        newSectionData = { ...currentSectionData, ...dataToMerge };
      } else if (Array.isArray(currentSectionData)) {
        // This is a simplified merge for arrays; usually, you'd have specific add/update/remove for array items.
        // For direct array replacement (like skills, experience):
        // newSectionData = Array.isArray(dataToMerge) ? dataToMerge : currentSectionData;
        // This generic updateResumeSection might not be ideal for arrays if `dataToMerge` isn't the full new array.
        console.warn(`[Context] updateResumeSection used for array section '${sectionKey}'. Consider specific array handlers.`);
        newSectionData = Array.isArray(dataToMerge) ? dataToMerge : currentSectionData;
      } else {
        // For primitive types (like summary string) or if section doesn't exist as object/array
        newSectionData = dataToMerge;
      }
      return { ...prev, [sectionKey]: newSectionData };
    });
  }, [/* stable setters */]);

  // --- Specific array/object section modifiers ---
  const updateEducationDetails = useCallback((newEducationDetails) => {
    setResumeData(prev => ({ ...prev, educationDetails: { ...(prev.educationDetails || {}), ...newEducationDetails }}));
  }, []);

  const addProfessionalExperience = useCallback((newExperience = {}) => {
    const defaultExp = { jobTitle: "", companyName: "", jstartDate: "", jendDate: "", jobDescription:"" };
    setResumeData(prev => ({ ...prev, professionalExperience: [...(prev.professionalExperience || []), {...defaultExp, ...newExperience}] }));
  }, []);
  const updateProfessionalExperience = useCallback((index, updatedExperience) => {
    setResumeData(prev => {
      const experiences = [...(prev.professionalExperience || [])];
      if(experiences[index] !== undefined) experiences[index] = {...experiences[index], ...updatedExperience};
      else experiences[index] = updatedExperience; // If it was an empty slot
      return { ...prev, professionalExperience: experiences };
    });
  }, []);
  const removeProfessionalExperience = useCallback((index) => {
     setResumeData(prev => ({ ...prev, professionalExperience: (prev.professionalExperience || []).filter((_, i) => i !== index) }));
  }, []);

  const addSkill = useCallback((newSkill = {}) => {
    const defaultSkill = { skillName: "", skillLevel: "0" }; // skillLevel as string consistent with form
    setResumeData(prev => ({ ...prev, skill: [...(prev.skill || []), {...defaultSkill, ...newSkill}] }));
  }, []);
  const updateSkill = useCallback((index, updatedSkill) => {
     setResumeData(prev => {
      const skills = [...(prev.skill || [])];
      if(skills[index] !== undefined) skills[index] = {...skills[index], ...updatedSkill};
      else skills[index] = updatedSkill;
      return { ...prev, skill: skills };
    });
  }, []);
=======
    try {
      // ✅ FIX: URL must be a string, and Authorization header must use a template literal (backticks)
      const response = await axios.get('http://localhost:5001/api/cv/', {
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
      // ✅ FIX: Authorization header must use a template literal (backticks)
      const response = await axios.post("http://localhost:5001/api/cv/update",
        { step: sectionKey, data: dataPayload },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // CRITICAL FIX: Update the context's state with the full, fresh data from the server.
      // This is what allows the progress bar to update correctly.
      setResumeData(response.data);
      
      return response.data; // Return data on success for the promise chain
    } catch (err) {
      // ✅ FIX: Strings with variables must use template literals (backticks)
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

>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
  const removeSkill = useCallback((index) => {
    setResumeData(prev => ({ ...prev, skill: (prev.skill || []).filter((_, i) => i !== index) }));
  }, []);
  
<<<<<<< HEAD
  const addReference = useCallback((newReference = {}) => {
    const defaultRef = { referenceName: "", position: "", company: "", contact: "" };
    setResumeData(prev => ({ ...prev, references: [...(prev.references || []), {...defaultRef, ...newReference}] }));
  }, []);
  const updateReference = useCallback((index, updatedReference) => {
    setResumeData(prev => {
      const references = [...(prev.references || [])];
      if(references[index] !== undefined) references[index] = {...references[index], ...updatedReference};
      else references[index] = updatedReference;
      return { ...prev, references: references };
    });
  }, []);
  const removeReference = useCallback((index) => {
    setResumeData(prev => ({ ...prev, references: (prev.references || []).filter((_, i) => i !== index) }));
  }, []);

  const contextValue = {
    resumeData, setResumeData, // Use setResumeData sparingly from components
    updateResumeSection, fetchResumeData, saveToDatabase,
    updateEducationDetails,
    addProfessionalExperience, updateProfessionalExperience, removeProfessionalExperience,
    addSkill, removeSkill, updateSkill,
    addReference, updateReference, removeReference,
    loading, error, setError,
=======
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
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
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
<<<<<<< HEAD
    throw new Error('useCVForm must be used within a CVFormProvider. Check your App.jsx component tree.');
  }
  return context;
};

// Default export can be the provider itself or an object containing both
export default CVFormContext; // Exporting context itself if preferred for direct import elsewhere
// export { CVFormProvider, useCVForm }; // Alternative more common export pattern
=======
    throw new Error('useCVForm must be used within a CVFormProvider.');
  }
  return context;
};
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
