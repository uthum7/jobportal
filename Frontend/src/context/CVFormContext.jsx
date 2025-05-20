import React, { createContext, useState, useContext } from "react";

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
      profileParagraph: "",
    },
    educationDetails: {}, // Changed to object
    skill: [],
    summary: "",
    professionalExperience: [],
    references: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch resume data from the backend
  const fetchResumeData = async (userId) => {
    try {
      setLoading(true);
      console.log("Fetching resume data for userId:", userId);

      const response = await fetch(`http://localhost:5001/api/cv/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch resume data");
      }

      const data = await response.json();
      console.log("Fetched Resume Data:", data);

      // Store userId in localStorage for future use
      if (data.userId) {
        localStorage.setItem("userId", data.userId);
      }

      // Update resume data state
      setResumeData((prev) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, ...(data.personalInfo || {}) },
        educationDetails: data.educationDetails || {},
        skill: Array.isArray(data.skill) ? data.skill : [],
        summary: data.summary || "",
        professionalExperience: Array.isArray(data.professionalExperience)
          ? data.professionalExperience
          : [],
        references: Array.isArray(data.references) ? data.references : [],
      }));
    } catch (err) {
      console.error("Error fetching resume data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save data to the backend
  const saveToDatabase = async (key, data) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found");
      }

      const response = await fetch(`http://localhost:5001/api/cv/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ userId, step: key, data }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save ${key}`);
      }

      const updatedData = await response.json();
      console.log(`Successfully saved ${key}:`, updatedData);

      // Update the context with the new data
      setResumeData((prev) => ({
        ...prev,
        [key]: updatedData[key],
      }));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      alert(`Failed to save ${key}. Please try again.`);
    }
  };

  // Add a new professional experience
  const addProfessionalExperience = (newExperience) => {
    setResumeData((prev) => ({
      ...prev,
      professionalExperience: [
        ...prev.professionalExperience,
        newExperience || {
          jobTitle: "",
          companyName: "",
          jstartDate: "",
          jendDate: "",
          jobDescription: "",
        },
      ],
    }));
  };

  // Update a specific professional experience
  const updateProfessionalExperience = (index, updatedExperience) => {
    setResumeData((prev) => {
      const updatedExperiences = [...prev.professionalExperience];
      updatedExperiences[index] = updatedExperience;
      return { ...prev, professionalExperience: updatedExperiences };
    });
  };

  // Remove a specific professional experience
  const removeProfessionalExperience = (index) => {
    setResumeData((prev) => ({
      ...prev,
      professionalExperience: prev.professionalExperience.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // Update education details
  const updateEducationDetails = (newEducationDetails) => {
    setResumeData((prev) => ({
      ...prev,
      educationDetails: {
        ...prev.educationDetails,
        ...newEducationDetails,
      },
    }));
  };

  // Add a new skill
  const addSkill = (newSkill) => {
    setResumeData((prev) => ({
      ...prev,
      skill: [...prev.skill, newSkill],
    }));
  };

  // Update an existing skill
  const updateSkill = (index, updatedSkill) => {
    setResumeData((prev) => {
      const updatedSkills = [...prev.skill];
      updatedSkills[index] = updatedSkill;
      return { ...prev, skill: updatedSkills };
    });
  };

  // Remove a skill
  const removeSkill = (index) => {
    setResumeData((prev) => ({
      ...prev,
      skill: prev.skill.filter((_, i) => i !== index),
    }));
  };

  // Update a specific reference
  const updateReference = (index, updatedReference) => {
    setResumeData((prev) => {
      const updatedReferences = [...prev.references];
      updatedReferences[index] = updatedReference;
      return { ...prev, references: updatedReferences };
    });
  };

  // Add a new reference
  const addReference = (newReference) => {
    setResumeData((prev) => ({
      ...prev,
      references: [...prev.references, newReference],
    }));
  };

  // Remove a reference
  const removeReference = (index) => {
    setResumeData((prev) => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index),
    }));
  };

  // Add this function to update a specific section of the resume data
  const updateResumeSection = (section, data) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const cleanExperience = professionalExperience.map((exp) => ({
      jobTitle: exp.jobTitle,
      companyName: exp.companyName,
      jstartDate: exp.jstartDate ? new Date(exp.jstartDate).toISOString() : null,
      jendDate: exp.jendDate ? new Date(exp.jendDate).toISOString() : null,
      jobDescription: exp.jobDescription,
    }));

    console.log("Clean Experience Data:", cleanExperience);
    console.log("User ID:", personalInfo.userId);

    if (!personalInfo.userId) {
      alert("User ID is missing. Please log in again.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/cv/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          userId: personalInfo.userId,
          step: "professionalExperience",
          data: cleanExperience,
          personalInfo: {
            fullname: personalInfo.fullname, // Include fullname
            jobTitle: personalInfo.jobTitle, // Include jobTitle
          },
        }),
      });

      const data = await res.json();
      console.log("Response Data:", data);

      if (res.ok) {
        alert("Professional experience saved!");
        navigate("/Cv3");
      } else {
        console.error("Error Response:", data);
        alert(`Error: ${data.error || "Failed to save professional experience."}`);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving data. Try again.");
    }
  };

  return (
    <CVFormContext.Provider
      value={{
        resumeData,
        setResumeData,
        addSkill,
        removeSkill,
        updateSkill,
        fetchResumeData,
        saveToDatabase,
        updateEducationDetails,
        addProfessionalExperience,
        updateProfessionalExperience,
        removeProfessionalExperience,
        updateReference,
        addReference,
        removeReference,
        updateResumeSection, // Add this to the context
        loading,
        error,
      }}
    >
      {children}
    </CVFormContext.Provider>
  );
};

export const useCVForm = () => useContext(CVFormContext);

export default CVFormProvider;
