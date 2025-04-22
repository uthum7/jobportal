import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cv7.module.css";
import { useCVForm } from "../../context/CVFormContext";
import { getUserId } from "../../utils/auth";

const initialReference = { name: "", position: "", company: "", contact: "" };

const Cv7 = () => {
  const navigate = useNavigate();
  const { resumeData, updateResumeData } = useCVForm();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [referenceList, setReferenceList] = useState([initialReference]);

  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

  // Load existing data
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

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        

        updateResumeData(data);
      } catch (error) {
        console.error("Error fetching CV data:", error);
      }
    };

    fetchCVData();
  }, [updateResumeData]);

  const handleReferenceChange = (index, field, value) => {
    const updated = [...referenceList];
    updated[index][field] = value;
    setReferenceList(updated);
    updateResumeData({ ...resumeData, references: updated });
  };

  const handleAddReference = () => {
    const updated = [...referenceList, { ...initialReference }];
    setReferenceList(updated);
    updateResumeData({ ...resumeData, references: updated });
  };

  const handleRemoveReference = (index) => {
    const updated = referenceList.filter((_, i) => i !== index);
    setReferenceList(updated);
    updateResumeData({ ...resumeData, references: updated });
  };

  const validateForm = () => {
    for (let ref of referenceList) {
      if (!ref.name || !ref.contact) {
        alert("Each reference must have a name and contact info.");
        return false;
      }
    }
    return true;
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
          step: "references",
          data: referenceList,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("References saved successfully!");
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving references:", error);
      alert("Failed to save references. Try again later.");
    }
  };

  const {
    personalInfo = {},
    educationDetails = {},
    skill = [],
    summary,
    professionalExperience = [],
  } = resumeData;

  const {
    fullname,
    jobTitle,
    address,
    email,
    phone,
    profileParagraph,
  } = personalInfo;

  return (
    <div className={styles.resumeBuilder}>
      {!isSidebarVisible && (
        <button className={styles.toggleButton} onClick={toggleSidebar}>☰</button>
      )}

      <aside className={`${styles.sidebar} ${isSidebarVisible ? styles.visible : ""}`}>
        <div className={styles.profile}>
          <img src="profile.jpg" alt="User" className={styles.profileImg} />
          <h4>{fullname || "Your Name"}</h4>
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
          <button className={styles.navButton} onClick={() => navigate("/Cv6")}>Previous</button>
          <button className={styles.navButton} onClick={() => navigate("/Cv8")}>Next</button>
        </div>

        <div className={styles.formContainer}>
          <h3>References</h3>
          <form onSubmit={handleSubmit}>
            {referenceList.map((ref, index) => (
              <div key={index} className={styles.referenceGroup}>
                <input
                  type="text"
                  placeholder="Name"
                  value={ref.name}
                  onChange={(e) => handleReferenceChange(index, "name", e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Position"
                  value={ref.position}
                  onChange={(e) => handleReferenceChange(index, "position", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={ref.company}
                  onChange={(e) => handleReferenceChange(index, "company", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Contact Info"
                  value={ref.contact}
                  onChange={(e) => handleReferenceChange(index, "contact", e.target.value)}
                  required
                />
                {referenceList.length > 1 && (
                  <button type="button" onClick={() => handleRemoveReference(index)}>Remove</button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddReference}>Add More Reference</button>
            <button type="submit" className={styles.saveBtn}>Save</button>
          </form>
        </div>

        <div className={styles.cvPreview}>
          <div className={styles.cvContainer}>
            <div className={styles.cvLeft}>
              <div className={styles.profileSection}>
                <img src="profile.jpg" alt="Profile" className={styles.profileImage} />
                <h3>{jobTitle || "Your Profession"}</h3>
                <h2>{fullname || "Your Name"}</h2>
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
                <ul className={styles.skillsColumn}>
                  {skill.map((sk, idx) => (
                    <li key={idx}>{sk.skillName} - {sk.skillLevel}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.summary}>
                <h4>Summary</h4>
                <p>{summary}</p>
              </div>

              <div className={styles.references}>
                <h4>References</h4>
                {referenceList.map((ref, idx) => (
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
  );
};

export default Cv7;
