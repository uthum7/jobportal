import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import styles from "./Cv4.module.css";
import { getUserId } from "../../utils/auth";

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
    references: []
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
        const response = await fetch(`http://localhost:8091/api/cv/${userId}`, {
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
        }));
      } catch (error) {
        console.error("Error fetching CV data:", error);
      }
    };

    fetchCVData();
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

    try {
      const response = await fetch("http://localhost:8091/api/cv/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          userId,
          step: "summary",
          data: formData.summary,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("CV details updated successfully");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error saving CV:", error);
      alert("An error occurred while saving your CV. Please try again.");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
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

  const educationDetails = {
    universityName: universitiyName,
    uniStartDate,
    uniEndDate,
    uniMoreDetails,
    SchoolName,
    startDate,
    endDate,
    moreDetails,
  };

  return (
    <div>
      <div className={styles.resumeBuilder}>
        {!isSidebarVisible && (
          <button className={styles.toggleButton} onClick={toggleSidebar}>☰</button>
        )}

        <aside className={`${styles.sidebar} ${isSidebarVisible ? styles.visible : ""}`}>
          <div className={styles.profile}>
            <img src="profile.jpg" alt="User" className={styles.profileImg} />
            <h4>Piyumi Hansamali</h4>
            <span className={styles.rating}>⭐⭐⭐⭐⭐ 4.7</span>
          </div>
          <nav>
            <ul>
              <li>📋 My Profile</li>
              <li className={styles.active}>📄 My Resumes</li>
              <li>✅ Applied Jobs</li>
            </ul>
          </nav>
          <button className={styles.closeButton} onClick={toggleSidebar}>✕</button>
        </aside>

        <main className={`${styles.content} ${isSidebarVisible ? styles.shifted : ""}`}>
          <div className={styles.navigationButtons}>
            <button className={styles.navButton} onClick={() => navigate('/Cv3')}>Previous</button>
            <button className={styles.navButton} onClick={() => navigate('/Cv7')}>Next</button>
          </div>

          <div className={styles.summaryContainer}>
            <h3>Summary</h3>
            <form onSubmit={handleSubmit}>
              <div className={styles.labelButtonContainer}>
                <label>Add Summary Your Job Title</label>
                <button onClick={enhanceSummary} disabled={loading}>
                  {loading ? "Generating..." : "Generate From AI"}
                </button>
              </div>
              <textarea
                name="summary"
                value={summary}
                onChange={handleChange}
                placeholder="Add your summary"
              ></textarea>
              <button className={styles.saveButton} type="submit">Save</button>
            </form>
          </div>

          <div className={styles.cvPreview}>
            <div className={styles.cvContainer}>

              <div className={styles.cvLeft}>
                <div className={styles.profileSection}>
                  <img src="profile.jpg" alt="Profile" className={styles.profileImage} />
                  <h3>{jobTitle || "Your Profession"}</h3>
                  <h2>{fullName || "Your Name"}</h2>
                </div>
                <div className={styles.contactInfo}>
                  <h4>Contact</h4>
                  <p>{phone || "Phone Number"}</p>
                  <p>{email || "Email Address"}</p>
                  <p>{address || "Your Address"}</p>
                </div>

                <div className={styles.education}>
                  <h4>Education</h4>
                  <div className={styles.educationItem}>
                    <h5>{educationDetails.universityName || "University of Moratuwa"}</h5>
                    <span>{educationDetails.uniStartDate || "2022"}</span> - <span>{educationDetails.uniEndDate || "2024"}</span>
                    <p>{educationDetails.uniMoreDetails || "Bachelor of Science in Computer Science"}</p>
                  </div>
                  <div className={styles.educationItem}>
                    <h5>{educationDetails.SchoolName || "Rahula College Matara"}</h5>
                    <span>{educationDetails.startDate || "2018"}</span> - <span>{educationDetails.endDate || "2021"}</span>
                    <p>{educationDetails.moreDetails || "Advanced Level in Physical Science"}</p>
                  </div>
                </div>
              </div>

              <div className={styles.verticalLine}></div>

              <div className={styles.cvRight}>
                <div className={styles.profilePara}>
                  <h4>Profile</h4>
                  <p>{profileParagraph}</p>
                </div>

                <div className={styles.experience}>
                  <h4>Professional Experience</h4>
                  {professionalExperience.map((exp, i) => (
                    <div key={i} className={styles.experienceItem}>
                      <h5>{exp.pjobTitle}</h5>
                      <span>{exp.jstartDate?.substring(0, 10)} - {exp.jendDate?.substring(0, 10)}</span>
                      <p>{exp.jobDescription}</p>
                    </div>
                  ))}
                </div>

                <div className={styles.skillsColumns}>
                  <h4>Skills</h4>
                  <div className={styles.skillsColumn}>
                    <ul>
                      <li className={styles.listItem}>JavaScript</li>
                      <li className={styles.listItem}>React</li>
                      <li className={styles.listItem}>Node.js</li>
                      <li className={styles.listItem}>Database Management</li>
                      <li className={styles.listItem}>Project Management</li>
                      <li className={styles.listItem}>HTML/CSS</li>
                      <li className={styles.listItem}>Git</li>
                      <li className={styles.listItem}>REST APIs</li>
                      <li className={styles.listItem}>Agile Methodologies</li>
                      <li className={styles.listItem}>Problem Solving</li>
                    </ul>
                  </div>
                </div>

                <div className={styles.summary}>
                  <h4>Summary</h4>
                  <p>
                    {summary || "Experienced Full Stack Developer with a strong background in developing scalable web applications and managing complex projects..."}
                  </p>
                </div>

                <div className={styles.references}>
                  <h4>References</h4>
                  {references.map((ref, idx) => (
                    <p key={idx}>
                      {ref.name} - {ref.position} at {ref.company} - {ref.contact}
                    </p>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Cv4;
