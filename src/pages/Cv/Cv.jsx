import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./Cv.module.css";
import { getUserId } from "../../utils/auth";

const Cv = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    initials: "",
    jobTitle: "",
    address: "",
    address2: "",
    email: "",
    phone: "",
    profilePicture: null,
    summary: "",
  });

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  // Handle form input change
  const handleChange = (e) => {
    if (e.target.name === "profilePicture") {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setFormData({ ...formData, [e.target.name]: imageUrl });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = getUserId();
    if (!userId) {
      alert("User not logged in");
      return;
    }

    try {
      const response = await fetch("http://localhost:8091/cvRoutes/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          userId,
          step: "personalInfo",
          data: formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Personal details saved successfully");
      } else {
        alert(`Error: ${data.error}`); // Fixed error message formatting
      }
    } catch (error) {
      console.error("Error saving CV:", error);
      alert("An error occurred while saving your CV. Please try again.");
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div>
      <div className={styles.resumeBuilder}>
        {/* Sidebar Button */}
        {!isSidebarVisible && (
          <button className={styles.toggleButton} onClick={toggleSidebar}>
            ☰
          </button>
        )}

        {/* Sidebar */}
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

        {/* Main Content */}
        <main className={`${styles.content} ${isSidebarVisible ? styles.shifted : ""}`}>
          <div className={styles.navigationButtons}>
            <button className={styles.navButton}>Previous</button>
            <button className={styles.navButton} onClick={() => navigate('/Cv2')}>Next</button>
          </div>
          <div className={styles.formContainer}>
            <h3>Personal Details</h3>
            <form onSubmit={handleSubmit}> {/* Use onSubmit instead of onClick */}
              <div className={styles.formColumns}>
                <div className={styles.formLeft}>
                  <input type="text" id="fullName" name="fullName" placeholder="Full Name" autoComplete="name" value={formData.fullName} onChange={handleChange} required />
                  <input type="text" id="initials" name="initials" placeholder="Name with Initials" value={formData.initials} onChange={handleChange} required />
                  <input type="text" id="jobTitle" name="jobTitle" placeholder="Job Title" value={formData.jobTitle} onChange={handleChange} required />
                </div>
                <div className={styles.formRight}>
                  <input type="text" id="address" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
                  <input type="text" id="address2" name="address2" placeholder="Address Line 2" value={formData.address2} onChange={handleChange} />
                  <input type="email" id="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                  <input type="tel" id="phone" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                </div>
              </div>
              <textarea
                id="summary"
                name="summary"
                placeholder="Add Your Profile Details"
                value={formData.summary}
                onChange={handleChange}
                required
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
                      src={formData.profilePicture || "profile.jpg"}
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
                  <h2>{formData.fullName || "Saman Kumara"}</h2>
                  <h3>{formData.jobTitle || "Full Stack Developer"}</h3>
                </div>
                <div className={styles.contactInfo}>
                  <h4>Contact</h4>
                  <p>{formData.phone || "0771200506"}</p>
                  <p>{formData.email || "samankumara@gmail.com"}</p>
                  <p>{formData.address || "123 Anywhere St., Any City"}</p>
                </div>
              </div>
              <div className={styles.verticalLine}></div>
              <div className={styles.cvRight}>
                <div className={styles.profilePara}>
                  <h4>Profile</h4>
                  <p>{formData.summary || "Experienced Full Stack Developer..."}</p>
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
    </div>
  );
};

export default Cv;
