// CVFormContext.jsx

// --- CHANGE 1: Import `useEffect` from React ---
import React, { createContext, useState, useContext, useCallback, useEffect } from "react";
import { getToken, getUserId as authGetUserId } from "../utils/auth"; // Ensure path is correct

const CVFormContext = createContext(undefined);

const toBase64 = file => new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
        if (typeof file === 'string') return resolve(file);
        console.warn("toBase64: Input was not a File, but was a string. Passing through:", file);
        return resolve(file); // Pass through if it's already a string (URL/base64)
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export const CVFormProvider = ({ children }) => {
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
    professionalExperience: [],
    skill: [],
    summary: "",
    references: [],
  };

  const [resumeData, setResumeData] = useState(initialResumeState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // This error is for context-level operations
  
  // --- CHANGE 2: Add the state and useEffect hook for completion status ---
  const [completionStatus, setCompletionStatus] = useState({});

  useEffect(() => {
    if (resumeData) {
      const {
        personalInfo,
        educationDetails,
        professionalExperience,
        skill,
        summary,
        references,
      } = resumeData;

      // These keys ('personalinfo', 'education', etc.) MUST match the keys in your ProgressBar.jsx
      const newCompletionStatus = {
        personalinfo: !!(personalInfo?.fullname && personalInfo?.email && personalInfo?.jobTitle),
        education: !!(educationDetails?.schoolName || educationDetails?.universitiyName),
        experience: professionalExperience && professionalExperience.length > 0,
        skills: skill && skill.length > 0,
        summary: summary && summary.length > 20,
        references: references && references.length > 0,
        preview: false, 
      };

      setCompletionStatus(newCompletionStatus);
    }
  }, [resumeData]); // This hook runs every time resumeData changes


  const fetchResumeData = useCallback(async () => {
    const userId = authGetUserId(); // Using the aliased import
    const token = getToken();

    if (!userId || !token) {
      const msg = !userId ? "User ID not found." : "Authentication token not found.";
      console.warn("[Context] fetchResumeData precondition failed:", msg);
      setError(msg + " Please login.");
      setResumeData(initialResumeState); // Reset on auth failure
      return { error: msg + " Cannot fetch CV data." };
    }

    setLoading(true);
    setError(null);
    console.log("[Context] Fetching resume data for user ID:", userId);

    try {
      const response = await fetch(`http://localhost:5001/api/cv/`, { 
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(`[Context] API error fetching/initializing data (Status: ${response.status}):`, data.message || "Unknown server error");
        throw new Error(data.message || `Failed to fetch/initialize CV (Status: ${response.status})`);
      }

      console.log("[Context] Successfully fetched/initialized CV Data:", data);
      const newResumeData = { ...initialResumeState };
      for (const key in initialResumeState) {
        if (data.hasOwnProperty(key) && data[key] !== null && data[key] !== undefined) {
            if (Array.isArray(initialResumeState[key]) && !Array.isArray(data[key])) {
                newResumeData[key] = [];
            } else {
                newResumeData[key] = data[key];
            }
        }
      }
      newResumeData.userId = data.userId || userId;

      setResumeData(newResumeData);
      setError(null);
      return { success: true, data: newResumeData, isNew: data._isNewCvTemplate || false };

    } catch (err) {
      console.error("[Context] Catch block: Error fetching/initializing CV data:", err);
      setError(err.message || "An unexpected error occurred while fetching CV data.");
      setResumeData(prev => ({ ...initialResumeState, userId: prev.userId || userId })); 
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

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

    if (sectionKey === "personalInfo" && sectionDataFromComponent && sectionDataFromComponent.profilePicture instanceof File) {
      try {
        const base64Image = await toBase64(sectionDataFromComponent.profilePicture);
        dataPayloadForBackend = { ...sectionDataFromComponent, profilePicture: base64Image };
      } catch (e) {
        console.error("[Context] Error converting profile picture for save:", e);
        const { profilePicture, ...restData } = sectionDataFromComponent;
        dataPayloadForBackend = restData; 
      }
    }

    console.log(`[Context] Attempting to save step: "${sectionKey}".`);
    console.log("[Context] Data being sent to backend for this step:", dataPayloadForBackend);

    try {
      const response = await fetch(`http://localhost:5001/api/cv/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ step: sectionKey, data: dataPayloadForBackend }),
      });

      const serverResponseData = await response.json();

      if (!response.ok) {
        console.error(`[Context] API error saving data (Status: ${response.status}):`, serverResponseData.message || serverResponseData.error || "Unknown save error");
        throw new Error(serverResponseData.message || serverResponseData.error || `Failed to save ${sectionKey}`);
      }
      
      console.log(`[Context] Successfully saved "${sectionKey}". Full CV from server:`, serverResponseData);
      setResumeData(prev => ({ ...prev, ...serverResponseData }));
      setError(null);
      return serverResponseData;
    } catch (err) {
      console.error(`[Context] Catch block error saving "${sectionKey}":`, err);
      setError(err.message || `An unexpected error occurred while saving ${sectionKey}.`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateResumeSection = useCallback((sectionKey, dataToMerge) => {
    setResumeData((prev) => {
      const currentSectionData = prev[sectionKey];
      let newSectionData;

      if (typeof currentSectionData === 'object' && currentSectionData !== null && !Array.isArray(currentSectionData)) {
        newSectionData = { ...currentSectionData, ...dataToMerge };
      } else if (Array.isArray(currentSectionData)) {
        console.warn(`[Context] updateResumeSection used for array section '${sectionKey}'. Consider specific array handlers.`);
        newSectionData = Array.isArray(dataToMerge) ? dataToMerge : currentSectionData;
      } else {
        newSectionData = dataToMerge;
      }
      return { ...prev, [sectionKey]: newSectionData };
    });
  }, []);

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
      else experiences[index] = updatedExperience;
      return { ...prev, professionalExperience: experiences };
    });
  }, []);

  const removeProfessionalExperience = useCallback((index) => {
     setResumeData(prev => ({ ...prev, professionalExperience: (prev.professionalExperience || []).filter((_, i) => i !== index) }));
  }, []);

  const addSkill = useCallback((newSkill = {}) => {
    const defaultSkill = { skillName: "", skillLevel: "0" };
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
  const removeSkill = useCallback((index) => {
    setResumeData(prev => ({ ...prev, skill: (prev.skill || []).filter((_, i) => i !== index) }));
  }, []);
  
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
    resumeData, setResumeData,
    updateResumeSection, fetchResumeData, saveToDatabase,
    updateEducationDetails,
    addProfessionalExperience, updateProfessionalExperience, removeProfessionalExperience,
    addSkill, removeSkill, updateSkill,
    addReference, updateReference, removeReference,
    loading, error, setError,
    // --- CHANGE 3: Add completionStatus to the value provided by the context ---
    completionStatus,
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
    throw new Error('useCVForm must be used within a CVFormProvider. Check your App.jsx component tree.');
  }
  return context;
};

export default CVFormContext;
