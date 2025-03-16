import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cv6.module.css"; // Import CSS Module

const Cv2 = () => {
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
  const [experiences, setExperiences] = useState([]); // State for professional experiences
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "profilePicture") {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file); // Create a URL for the uploaded file
        setFormData({ ...formData, [e.target.name]: imageUrl });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedExperiences = [...experiences];
    updatedExperiences[index][name] = value;
    setExperiences(updatedExperiences);
  };

  const addExperience = () => {
    setExperiences([...experiences, { Profession: "", PstartDate: "", PendDate: "", Pmoredetails: "" }]);
  };

  const removeExperience = (index) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ ...formData, experiences });
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div>
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
            <button className={styles.navButton} onClick={() => navigate("/Cv2")}>Previous</button>
            <button className={styles.navButton} onClick={() => navigate("/Cv3")}>Next</button>
          </div>
          <div className={styles.formContainer}>
            <h3>Professional Experience</h3>
            <form onSubmit={handleSubmit}>
              {experiences.map((experience, index) => (
                <div key={index} className={styles.experienceForm}>
                  <input
                    type="text"
                    name="jobtitle"
                    placeholder="jobtitle"
                    value={experience.Profession}
                    onChange={(e) => handleExperienceChange(index, e)}
                    required
                  />
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name"
                    value={experience.comanyName}
                    onChange={(e) => handleExperienceChange(index, e)}
                    required
                  /> 

                  <div className={styles.formColumns}>
                    <div className={styles.formLeft}>
                      <input
                        type="date"
                        name="jstartDate"
                        placeholder="Entry Date"
                        value={experience.PstartDate}
                        onChange={(e) => handleExperienceChange(index, e)}
                        required
                      />
                    </div>
                    <div className={styles.formRight}>
                      <input
                        type="date"
                        name="PendDate"
                        placeholder="Leaving Date"
                        value={experience.PendDate}
                        onChange={(e) => handleExperienceChange(index, e)}
                        required
                      />
                    </div>
                  </div>
                  <textarea
                    name="Pmoredetails"
                    placeholder="More Details About Your Profession"
                    value={experience.Pmoredetails}
                    onChange={(e) => handleExperienceChange(index, e)}
                    required
                  />
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => removeExperience(index)}
                  >
                    Remove Experience
                  </button>
                </div>
              ))}
              <button type="button" className={styles.addButton} onClick={addExperience}>
                Add Experience
              </button>
              <button type="submit" className={styles.saveBtn}>
                Save
              </button>
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
                <div className={styles.education}>
                  <h4>Education</h4>
                  <div className={styles.educationItem}>
                    <h5>University of Moratuwa</h5>
                    <span>2022 - 2025</span>
                    <p>Bachelor of Science in Computer Science</p>
                  </div>
                  <div className={styles.educationItem}>
                    <h5>Rahula College Matara</h5>
                    <span>2018 - 2021</span>
                    <p>Advanced Level in Physical Science</p>
                  </div>
                </div>
              </div>
              <div className={styles.verticalLine}></div>
              <div className={styles.cvRight}>
                <div className={styles.profilePara}>
                  <h4>Profile</h4>
                  <p>
                    {formData.profilePara ||
                      "Experienced Full Stack Developer with a strong background in developing scalable web applications and managing complex projects."}
                  </p>
                </div>
                <div className={styles.experience}>
                  <h4>Professional Experience</h4>
                  {experiences.map((experience, index) => (
                    <div key={index} className={styles.experienceItem}>
                      <h5>{experience.Profession || "Software Engineer"}</h5>
                      <span>{experience.PstartDate || "2022"} - {experience.PendDate || "2024"}</span>
                      <p>{experience.Pmoredetails || "Designed and implemented backend services and APIs."}</p>
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
                    {formData.summary ||
                      "Experienced Full Stack Developer with a strong background in developing scalable web applications and managing complex projects."}
                  </p>
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

export default Cv2;