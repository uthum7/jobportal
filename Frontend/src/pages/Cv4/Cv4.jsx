import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import styles from "./Cv4.module.css";
import { getUserId } from "../../utils/auth";
import { useCVForm } from "../../context/CVFormContext";

const Cv4 = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "uthum wijenayake",
    nameWithInitial: "",
    jobTitle: "ui ux",
    address: "",
    addressOptional: "",
    email: "",
    phone: "",
    profilePicture: null,
    profileParagraph: "",
    SchoolName: "",
    startDate: "",
    endDate: "",
    moreDetails: "",
    universitiyName: "",
    uniStartDate: "",
    uniEndDate: "",
    uniMoreDetails: "",
    professionalExperience: [],
    summary: "",
    references: [],
  });

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const validateForm = () => {
    if (!formData.summary || formData.summary.trim() === "") {
      alert("Summary is required.");
      return false;
    }
    return true;
  };


  const enhanceSummary = async () => {
    if (!formData.summary.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post("/api/generate-summary", { text: formData.summary });
      setFormData({ ...formData, summary: response.data.enhancedSummary });
    } catch (error) {
      console.error("Error enhancing summary:", error);
    }
    setLoading(false);
  };


  useEffect(() => {
    const fetchCVData = async () => {
      const userId = getUserId();
      if (!userId) {
        alert("User not logged in");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5001/api/cv/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          ...data,
          summary: data.summary || "",
          references: Array.isArray(data.references) ? data.references : [],
        }));
      } catch (error) {
        console.error("Error fetching CV data:", error);
      }
    };

    fetchCVData();
  }, []);


  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      fetchResumeData(userId);
    }
  }, []);


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture" && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        profilePicture: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const userId = getUserId();
    if (!userId) {
      alert("User not logged in");
      return;
    }

    if (typeof formData.summary !== "string") {
      alert("Summary must be a string.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/cv/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          userId,
          step: "summary",
          data: formData.summary.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("CV details updated successfully");
        navigate("/Cv7");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error saving CV:", error);
      alert("An error occurred while saving your CV. Please try again.");
    }
  };

  

  const {
    fullName,
    jobTitle,
    email,
    phone,
    address,
    profileParagraph,
    professionalExperience,
    SchoolName,
    startDate,
    endDate,
    moreDetails,
    universitiyName,
    uniStartDate,
    uniEndDate,
    uniMoreDetails,
    summary,
    references = [],
  } = formData;

  const { resumeData, fetchResumeData } = useCVForm();

  const {
    personalInfo,
    educationDetails,
    skill,
    summary: resumeSummary,
    professionalExperience: resumeProfessionalExperience,
    references: resumeReferences,
  } = resumeData || {};
  

 
  const formatDate = (date) => {
    if (!date) return "Present";
    try {
      return new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      });
    } catch {
      return "Invalid Date";
    }
  };


  return (
    <>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <span>R</span><span>e</span><span>s</span><span>u</span><span>m</span><span>e</span>
          <span> </span>
          <span>B</span><span>u</span><span>i</span><span>l</span><span>d</span><span>e</span><span>r</span>
        </h1>
        <p className={styles.pageSubtitle}>Create your professional CV in minutes with AI integrations</p>
      </header>
      
      <div className={styles.resumeBuilder}>
        <main className={styles.content}>

          <div className={styles.formContainer}>
            <h3 className={styles.header}>Summary</h3>
            <form onSubmit={handleSubmit}>
              <div className={styles.formColumns}>
                <div className={styles.formLeft}>
                  <div className={styles.labelButtonContainer}>
                    <label htmlFor="summary">Add Summary Your Job Title</label>
                    <button 
                      onClick={enhanceSummary} 
                      disabled={loading}
                      className={styles.aiButton}
                    >
                      {loading ? "Generating..." : "Generate From AI"}
                    </button>
                  </div>
                  <textarea
                    id="summary"
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    placeholder="Add your summary"
                  ></textarea>
                </div>
              </div>
              <button type="submit" className={styles.saveBtn} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
            </form>

            <div className={styles.instractionSection}>
              <h3>Instructions</h3>
              <ul>
                <li>
                  Write a compelling professional summary.
                  <div className={styles.instractionDetail}>
                    Highlight your key skills, experience, and career goals.
                  </div>
                </li>
                <li>
                  Use the AI generator for suggestions.
                  <div className={styles.instractionDetail}>
                    Click "Generate From AI" to get a professionally written summary.
                  </div>
                </li>
                <li>
                  Keep it concise and impactful.
                  <div className={styles.instractionDetail}>
                    Aim for 3-5 sentences that capture your professional identity.
                  </div>
                </li>
                <li>
                  Click "Save" to proceed.
                  <div className={styles.instractionDetail}>
                    Your summary will be saved and you'll move to the next step.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.cvPreview}>
            <div className={styles.cvContainer}>
              <div className={styles.cvLeft}>

                <div className={styles.profileSection}>
                  <img src="profile.jpg" alt="Profile" className={styles.profileImage} />
                  <h3>{personalInfo?.jobTitle || "Your Profession"}</h3>
                  <h2>{personalInfo?.fullname || "Your Name"}</h2>
                </div>
                
                <div className={styles.contactInfo}>
                  <h4>Contact</h4>
                  <p>{personalInfo?.phone || "Phone Number"}</p>
                  <p>{personalInfo?.email || "Email Address"}</p>
                  <p>{personalInfo?.address || "Your Address"}</p>
                </div>

                <div className={styles.education}>
                  <h4>Education</h4>
                  <div className={styles.educationItem}>
                    <h5>{educationDetails?.universityName || "University of Moratuwa"}</h5>
                    <span>
                      {formatDate(educationDetails?.uniStartDate || "2022")} -{" "}
                      {formatDate(educationDetails?.uniEndDate || "2024")}
                    </span>
                    <p>{educationDetails?.uniMoreDetails || "Bachelor of Science in Computer Science"}</p>
                  </div>
                  <div className={styles.educationItem}>
                    <h5>{educationDetails?.SchoolName || "Rahula College Matara"}</h5>
                    <span>
                      {formatDate(educationDetails?.startDate || "2018")} -{" "}
                      {formatDate(educationDetails?.endDate || "2021")}
                    </span>
                    <p>{educationDetails?.moreDetails || "Advanced Level in Physical Science"}</p>
                  </div>
                </div>
              </div>

              <div className={styles.verticalLine}></div>

              <div className={styles.cvRight}>
                <div className={styles.profilePara}>
                  <h4>Profile</h4>
                  <p>{personalInfo?.profileParagraph || "Your profile summary"}</p>
                </div>

                <div className={styles.experience}>
                  <h4>Professional Experience</h4>
                  {Array.isArray(professionalExperience) && professionalExperience.length > 0 ? (
                    professionalExperience.map((exp, index) => (
                      <div key={index} className={styles.experienceItem}>
                        <h5>{exp.jobTitle || "Job Title not provided"}</h5>
                        <span>
                          {exp.jstartDate ? new Date(exp.jstartDate).toLocaleDateString() : "Start Date"} -{" "}
                          {exp.jendDate ? new Date(exp.jendDate).toLocaleDateString() : "End Date"}
                        </span>
                        <p>{exp.jobDescription || "Job Description"}</p>
                      </div>
                    ))
                  ) : (
                    <p>No professional experience available.</p>
                  )}
                </div>

                <div className={styles.skillsColumns}>
                  <h4>Skills</h4>
                  <div className={styles.skillsList}>
                    {Array.isArray(skill) &&
                      skill.map((skillItem, index) => (
                        <div key={index} className={styles.skillRow}>
                          <span className={styles.skillName}>{skillItem.skillName}</span>
                          <span className={styles.skillStars}>
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`${styles.star} ${
                                  i < parseInt(skillItem.skillLevel) ? styles.checked : ""
                                }`}
                              >
                                &#9733;
                              </span>
                            ))}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className={styles.summary}>
                  <h4>Summary</h4>
                  <p>{typeof summary === "string" ? summary : "No summary provided."}</p>
                </div>
                
                <div className={styles.references}>
                  <h4>References</h4>
                  {Array.isArray(references) && references.length > 0 ? (
                    references.map((ref, idx) => (
                      <p key={idx}>
                        {ref.referenceName || "Name not provided"} - {ref.position || "Position not provided"} at {ref.company || "Company not provided"} - {ref.contact || "Contact not provided"}
                      </p>
                    ))
                  ) : (
                    <p>No references available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Cv4;