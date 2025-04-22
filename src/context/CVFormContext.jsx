// src/context/CVFormContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchResumeData } from '../services/api';
import { getUserId } from '../utils/auth'; // ✅ Import utility to extract userId

const CVFormContext = createContext();

export const CVFormProvider = ({ children }) => {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullname: "",
      nameWithInitials: "",
      jobTitle: "",
      address: "",
      addressOptional: "",
      email: "",
      phone: "",
      profileParagraph: ""
    },
    educationDetails: {
      SchoolName: "",
      startDate: null,
      endDate: null,
      moreDetails: "",
      universityName: "",
      uniStartDate: null,
      uniEndDate: null,
      uniMoreDetails: ""
    },
    skill: [],
    summary: "",
    professionalExperience: [],
    references: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const userId = getUserId(); // ✅ Extract userId from token
        if (!userId) throw new Error("User ID is undefined or invalid");

        const data = await fetchResumeData(userId);
        if (data) {
          setResumeData(prev => ({
            personalInfo: { ...prev.personalInfo, ...(data.personalInfo || {}) },
            educationDetails: data.educationDetails
              ? { ...prev.educationDetails, ...data.educationDetails }
              : prev.educationDetails,
            skill: Array.isArray(data.skill) ? data.skill : [],
            summary: data.summary || "",
            professionalExperience: Array.isArray(data.professionalExperience)
              ? data.professionalExperience
              : [],
            references: Array.isArray(data.references) ? data.references : []
          }));
        }
      } catch (err) {
        setError(err.message);
        console.error("Failed to load resume data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadResumeData();
  }, []);

  const updateResumeSection = (section, newData) => {
    setResumeData(prev => ({
      ...prev,
      [section]: newData
    }));
  };

  const updateEducationDetails = (newEducationDetails) => {
    setResumeData(prev => ({
      ...prev,
      educationDetails: {
        ...prev.educationDetails,
        ...newEducationDetails
      }
    }));
  };

  const addSkill = (newSkill) => {
    setResumeData(prev => ({
      ...prev,
      skill: [...prev.skill, newSkill]
    }));
  };

  const updateSkill = (index, updatedSkill) => {
    setResumeData(prev => {
      const newSkills = [...prev.skill];
      newSkills[index] = updatedSkill;
      return {
        ...prev,
        skill: newSkills
      };
    });
  };

  const removeSkill = (index) => {
    setResumeData(prev => ({
      ...prev,
      skill: prev.skill.filter((_, i) => i !== index)
    }));
  };

  const addProfessionalExperience = (newExperience) => {
    setResumeData(prev => ({
      ...prev,
      professionalExperience: [...prev.professionalExperience, newExperience]
    }));
  };

  const updateProfessionalExperience = (index, updatedExperience) => {
    setResumeData(prev => {
      const newExperiences = [...prev.professionalExperience];
      newExperiences[index] = updatedExperience;
      return {
        ...prev,
        professionalExperience: newExperiences
      };
    });
  };

  const removeProfessionalExperience = (index) => {
    setResumeData(prev => ({
      ...prev,
      professionalExperience: prev.professionalExperience.filter((_, i) => i !== index)
    }));
  };

  const addReference = (newReference) => {
    setResumeData(prev => ({
      ...prev,
      references: [...prev.references, newReference]
    }));
  };

  const removeReference = (index) => {
    setResumeData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }));
  };

  const updateReference = (index, updatedReference) => {
    setResumeData(prev => {
      const newReferences = [...prev.references];
      newReferences[index] = updatedReference;
      return {
        ...prev,
        references: newReferences
      };
    });
  };

  return (
    <CVFormContext.Provider
      value={{
        resumeData,
        loading,
        error,
        updateResumeSection,
        updateEducationDetails,
        addSkill,
        updateSkill,
        removeSkill,
        addProfessionalExperience,
        updateProfessionalExperience,
        removeProfessionalExperience,
        addReference,
        removeReference,
        updateReference,
        fetchResumeData // ← ✅ ADD THIS
      }}
    >
      {children}
    </CVFormContext.Provider>
  );
};

export const useCVForm = () => {
  const context = useContext(CVFormContext);
  if (!context) {
    throw new Error('useCVForm must be used within a CVFormProvider');
  }
  return context;
};

export default CVFormProvider;
