import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cv2.module.css";
import { getUserId } from "../../utils/auth";
import { useCVForm } from "../../context/CVFormContext";
import { saveEducationDetails } from "../../services/api";

const Cv2 = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);

  const { resumeData, updateEducationDetails } = useCVForm();
  const educationData = resumeData.educationDetails || {};
  const personalInfo = resumeData.personalInfo || {}; // ✅ Renamed from "personal"

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        setPreviewImg(URL.createObjectURL(file));
      }
    } else {
      updateEducationDetails({
        ...educationData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = getUserId();
    if (!userId) {
      alert("User not logged in");
      return;
    }

    try {
      await saveEducationDetails(userId, educationData);
      updateEducationDetails(educationData);
      alert("Education details saved successfully");
      navigate("/Cv6");
    } catch (error) {
      console.error("Error saving education details:", error);
      alert("An error occurred while saving. Please try again.");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className={styles.resumeBuilder}>
      {!isSidebarVisible && (
        <button className={styles.toggleButton} onClick={toggleSidebar}>
          ☰
        </button>
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
        <button className={styles.closeButton} onClick={toggleSidebar}>
          ✕
        </button>
      </aside>

      <main className={`${styles.content} ${isSidebarVisible ? styles.shifted : ""}`}>
        <div className={styles.navigationButtons}>
          <button className={styles.navButton} onClick={() => navigate("/Cv")}>Previous</button>
          <button className={styles.navButton} onClick={() => navigate("/Cv6")}>Next</button>
        </div>

        <div className={styles.formContainer}>
          <h3>Education Details</h3>
          <form onSubmit={handleSubmit}>
            <h4>School Details</h4>
            <input
              type="text"
              name="SchoolName"
              placeholder="School Name"
              value={educationData.SchoolName || ""}
              onChange={handleChange}
            />
            <div className={styles.formColumns}>
              <div className={styles.formLeft}>
                <input
                  type="date"
                  name="startDate"
                  value={educationData.startDate || ""}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formRight}>
                <input
                  type="date"
                  name="endDate"
                  value={educationData.endDate || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <input
              type="text"
              name="moreDetails"
              placeholder="Additional Details"
              value={educationData.moreDetails || ""}
              onChange={handleChange}
            />

            <h4>University Details</h4>
            <input
              type="text"
              name="universitiyName"
              placeholder="University Name"
              value={educationData.universitiyName || ""}
              onChange={handleChange}
            />
            <div className={styles.formColumns}>
              <div className={styles.formLeft}>
                <input
                  type="date"
                  name="uniStartDate"
                  value={educationData.uniStartDate || ""}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formRight}>
                <input
                  type="date"
                  name="uniEndDate"
                  value={educationData.uniEndDate || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
            <input
              type="text"
              name="uniMoreDetails"
              placeholder="Degree Program & Details"
              value={educationData.uniMoreDetails || ""}
              onChange={handleChange}
            />
            <button type="submit" className={styles.saveBtn}>Save</button>
          </form>
        </div>

        <div className={styles.cvPreview}>
          <div className={styles.cvContainer}>
            <div className={styles.cvLeft}>
              <div className={styles.profileSection}>
                <label htmlFor="profilePicture" className={styles.profilePictureLabel}>
                  <img
                    src={previewImg || "profile.jpg"}
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
                <div className={styles.experienceItem}>
                  <h5>Full Stack Developer</h5>
                  <span>2024 - Present</span>
                  <p>
                    Developed and maintained web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality software solutions.
                  </p>
                </div>
                <div className={styles.experienceItem}>
                  <h5>Software Engineer</h5>
                  <span>2022 - 2024</span>
                  <p>
                    Designed and implemented backend services and APIs. Conducted code reviews and mentored junior developers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cv2;
