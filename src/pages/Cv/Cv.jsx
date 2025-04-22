import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cv.module.css";
import { getUserId, isAuthenticated } from "../../utils/auth";
import { useCVForm } from "../../context/CVFormContext";

const Cv = () => {
  const navigate = useNavigate();
  const {
    resumeData,
    updateResumeSection,
    fetchResumeData,
    loading: contextLoading,
    error: contextError,
  } = useCVForm();

  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  const personalInfo = resumeData.personalInfo;
  const educationData = resumeData.educationDetails || {};


  useEffect(() => {
    const loadResume = async () => {
      try {
        setIsLoading(true);
        const userId = getUserId();
        if (!userId) throw new Error("User not authenticated");

        await fetchResumeData(userId);
      } catch (err) {
        console.error("Error loading resume:", err);
        setLocalError(err.message);
        if (err.message.includes("authenticated")) navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated()) {
      loadResume();
    } else {
      setLocalError("User not authenticated");
    }
  }, [navigate, fetchResumeData]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    const newValue = type === "file" ? files[0] : value;

    if (type === "file" && files[0]) {
      setPreviewImg(URL.createObjectURL(files[0]));
    }

    updateResumeSection("personalInfo", {
      ...personalInfo,
      [name]: newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = getUserId();
    const token = localStorage.getItem("authToken");

    if (!userId) {
      setLocalError("User not authenticated. Please login.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:8091/api/cv/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          step: "personalInfo",
          data: personalInfo,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save data");
      }

      alert("Personal details saved successfully");
      navigate("/Cv2");
    } catch (err) {
      console.error("Error saving CV:", err);
      setLocalError(err.message || "An error occurred while saving your CV.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      });
    } catch {
      return "Date";
    }
  };

  if (isLoading || contextLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (localError || contextError) {
    return (
      <div className={styles.error}>
        <p>Error: {localError || contextError}</p>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className={styles.resumeBuilder}>
      {!isSidebarVisible && (
        <button className={styles.toggleButton} onClick={toggleSidebar}>
          ☰
        </button>
      )}

      <aside className={`${styles.sidebar} ${isSidebarVisible ? styles.visible : ""}`}>
        <div className={styles.profile}>
          <img
            src={
              previewImg ||
              (personalInfo.profilePicture
                ? URL.createObjectURL(personalInfo.profilePicture)
                : "profile.jpg")
            }
            alt="User"
            className={styles.profileImg}
          />
          <h4>{personalInfo.fullname || "User Name"}</h4>
          <p className={styles.rating}>⭐⭐⭐⭐⭐ 4.7</p>
        </div>
        <nav>
          <ul>
            <li>📋 My Profile</li>
            <li className={styles.active}>📄 My Resumes</li>
            <li>✅ Applied Jobs</li>
          </ul>
        </nav>
        <button className={styles.closeButton} onClick={toggleSidebar}>
          ✕
        </button>
      </aside>

      <main className={`${styles.content} ${isSidebarVisible ? styles.shifted : ""}`}>
        <div className={styles.navigationButtons}>
          <button className={styles.navButton}>Previous</button>
          <button className={styles.navButton} onClick={() => navigate("/Cv2")}>
            Next
          </button>
        </div>

        <div className={styles.formContainer}>
          <h3>Personal Details</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formColumns}>
              <div className={styles.formLeft}>
                <input
                  type="text"
                  name="fullname"
                  placeholder="Full Name"
                  value={personalInfo.fullname || ""}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="nameWithInitials"
                  placeholder="Name with Initials"
                  value={personalInfo.nameWithInitials || ""}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="jobTitle"
                  placeholder="Job Title"
                  value={personalInfo.jobTitle || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formRight}>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={personalInfo.address || ""}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="addressOptional"
                  placeholder="Address Optional"
                  value={personalInfo.addressOptional || ""}
                  onChange={handleChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={personalInfo.email || ""}
                  onChange={handleChange}
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={personalInfo.phone || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <textarea
              name="profileParagraph"
              placeholder="Add Your Profile Details"
              value={personalInfo.profileParagraph || ""}
              onChange={handleChange}
              required
            />
            <button type="submit" className={styles.saveBtn} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </button>
          </form>
        </div>

        <div className={styles.cvPreview}>
          <div className={styles.cvContainer}>
            <div className={styles.cvLeft}>
              <div className={styles.profileSection}>
                <label htmlFor="profilePicture" className={styles.profilePictureLabel}>
                  <img
                    src={
                      previewImg ||
                      (personalInfo.profilePicture
                        ? URL.createObjectURL(personalInfo.profilePicture)
                        : "profile.jpg")
                    }
                    alt="Profile"
                    className={styles.profileImage}
                  />
                  <input
                    type="file"
                    id="profilePicture"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleChange}
                    style={{ display: "none" }}
                  />
                  <span className={styles.uploadIcon}>📷</span>
                </label>
                <h3>{personalInfo.jobTitle || "Your Profession"}</h3>
                <h2>{personalInfo.fullname || "Your Name"}</h2>
              </div>
              <div className={styles.contactInfo}>
                <h4>Contact</h4>
                <p>{personalInfo.phone || "Phone"}</p>
                <p>{personalInfo.email || "Email"}</p>
                <p>{personalInfo.address || "Address"}</p>
              </div>

              <div className={styles.education}>
                <h4>Education</h4>
                <div className={styles.educationItem}>
                  <h5>{educationData.universitiyName || "University of Moratuwa"}</h5>
                  <span>{educationData.uniStartDate || "2022"}</span> - <span>{educationData.uniEndDate || "2024"}</span>
                  <p>{educationData.uniMoreDetails || "Bachelor of Science in Computer Science"}</p>
                </div>
                <div className={styles.educationItem}>
                  <h5>{educationData.SchoolName || "Rahula College Matara"}</h5>
                  <span>{educationData.startDate || "2018"}</span> - <span>{educationData.endDate || "2021"}</span>
                  <p>{educationData.moreDetails || "Advanced Level in Physical Science"}</p>
                </div>
              </div>

            </div>
            <div className={styles.verticalLine}></div>
            <div className={styles.cvRight}>
              <div className={styles.profilePara}>
                <h4>Profile</h4>
                <p>{personalInfo.profileParagraph || "Your profile summary"}</p>
              </div>
              <div className={styles.experience}>
                <h4>Professional Experience</h4>
                {resumeData.professionalExperience?.map((exp, index) => (
                  <div key={index} className={styles.experienceItem}>
                    <h5>{exp.pjobTitle || "Job Title"}</h5>
                    <span>
                      {formatDate(exp.jstartDate)} - {formatDate(exp.jendDate)}
                    </span>
                    <p>{exp.jobDescription || "Job description"}</p>
                  </div>
                ))}
              </div>
              <div className={styles.skillsColumns}>
                <h4>Skills</h4>
                <ul>
                  {resumeData.skill?.map((skill, index) => (
                    <li key={index} className={styles.listItem}>
                      {skill.skillName || "Skill"} ({skill.skillLevel || "Level"})
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.summary}>
                <h4>Summary</h4>
                <p>{resumeData.summary || "Professional summary"}</p>
              </div>
             
              <div className={styles.references}>
                <h4>References</h4>
                <p>John Doe - Senior Developer at Tech Corp - john.doe@techcorp.com</p>
                <p>Jane Smith - Project Manager at Innovate LLC - jane.smith@innovate.com</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cv;
