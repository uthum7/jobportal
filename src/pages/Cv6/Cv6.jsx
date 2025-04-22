import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cv6.module.css";
import { useCVForm } from "../../context/CVFormContext";

const Cv6 = () => {
  const navigate = useNavigate();
  const {
    resumeData,
    addProfessionalExperience,
    updateProfessionalExperience,
    removeProfessionalExperience,
    updateResumeSection,
  } = useCVForm();

  const {
    professionalExperience = [],
    personalInfo,
    educationDetails,
    summary,
  } = resumeData || {};

  useEffect(() => {
    if (!professionalExperience || professionalExperience.length === 0) {
      addProfessionalExperience({
        pjobTitle: "",
        companyName: "",
        jstartDate: "",
        jendDate: "",
        jobDescription: "",
      });
    }
  }, [professionalExperience, addProfessionalExperience]);

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    const updated = {
      ...professionalExperience[index],
      [name]: value,
    };
    updateProfessionalExperience(index, updated);
  };

  const validateForm = () => {
    if (!personalInfo.fullname || !personalInfo.jobTitle) {
      alert("Please fill out Full Name and Job Title.");
      return false;
    }

    for (const exp of professionalExperience) {
      if (
        !exp.pjobTitle ||
        !exp.companyName ||
        !exp.jstartDate ||
        !exp.jendDate ||
        !exp.jobDescription
      ) {
        alert("Please complete all fields in professional experience.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    // Sanitize and deep-clone only the required fields
    const cleanExperience = professionalExperience.map((exp) => ({
      pjobTitle: exp.pjobTitle,
      companyName: exp.companyName,
      jstartDate: exp.jstartDate,
      jendDate: exp.jendDate,
      jobDescription: exp.jobDescription,
    }));
  
    // Debugging line to ensure no circular refs
    try {
      console.log("Sanitized Experience to send:", cleanExperience);
      JSON.stringify(cleanExperience);
    } catch (err) {
      console.error("Circular reference detected in professionalExperience:", err);
      alert("Error preparing data. Please check the experience fields.");
      return;
    }
  
    try {
      const res = await fetch("http://localhost:8091/api/cv/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          userId: personalInfo.userId,
          step: "professionalExperience",
          data: cleanExperience,
        }),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert("Professional experience saved!");
        navigate("/Cv3");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving data. Try again.");
    }
  };
  

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateResumeSection("personalInfo", {
          ...personalInfo,
          profilePicture: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.resumeBuilder}>
      <main className={styles.content}>
        <div className={styles.navigationButtons}>
          <button onClick={() => navigate("/Cv2")} className={styles.navButton}>Previous</button>
          <button onClick={() => navigate("/Cv3")} className={styles.navButton}>Next</button>
        </div>

        <div className={styles.formContainer}>
          <h3>Professional Experience</h3>
          <form onSubmit={handleSubmit}>
            {professionalExperience.map((exp, index) => (
              <div key={index} className={styles.experienceForm}>
                <input type="text" name="pjobTitle" placeholder="Job Title" value={exp.pjobTitle} onChange={(e) => handleExperienceChange(index, e)} required />
                <input type="text" name="companyName" placeholder="Company Name" value={exp.companyName} onChange={(e) => handleExperienceChange(index, e)} required />
                <input type="date" name="jstartDate" value={exp.jstartDate} onChange={(e) => handleExperienceChange(index, e)} required />
                <input type="date" name="jendDate" value={exp.jendDate} onChange={(e) => handleExperienceChange(index, e)} required />
                <textarea name="jobDescription" placeholder="Job Description" value={exp.jobDescription} onChange={(e) => handleExperienceChange(index, e)} required />
                <button type="button" onClick={() => removeProfessionalExperience(index)}>Remove</button>
              </div>
            ))}
            <button type="button" onClick={addProfessionalExperience}>Add Experience</button>
            <button type="submit">Save</button>
          </form>
        </div>

        {/* CV Preview Section - no changes needed here */}
        <div className={styles.cvPreview}>
          <div className={styles.cvContainer}>
            <div className={styles.cvLeft}>
              <div className={styles.profileSection}>
                <label htmlFor="profilePicture" className={styles.profilePictureLabel}>
                  <img src={personalInfo.profilePicture || "profile.jpg"} alt="Profile" className={styles.profileImage} />
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
                <p>{personalInfo.phone || "Phone Number"}</p>
                <p>{personalInfo.email || "Email Address"}</p>
                <p>{personalInfo.address || "Your Address"}</p>
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
                <p>{personalInfo.profileParagraph || "Your profile summary goes here."}</p>
              </div>

              <div className={styles.experience}>
                <h4>Professional Experience</h4>
                {professionalExperience.map((exp, i) => (
                  <div key={i} className={styles.experienceItem}>
                    <h5>{exp.pjobTitle || "Job Title"}</h5>
                    <span>{exp.jstartDate} - {exp.jendDate}</span>
                    <p>{exp.jobDescription}</p>
                  </div>
                ))}
              </div>

              <div className={styles.skillsColumns}>
                <h4>Skills</h4>
                <ul>
                  <li>JavaScript</li>
                  <li>React</li>
                  <li>Node.js</li>
                  <li>Database Management</li>
                  <li>Project Management</li>
                  <li>HTML/CSS</li>
                  <li>Git</li>
                  <li>REST APIs</li>
                  <li>Agile Methodologies</li>
                  <li>Problem Solving</li>
                </ul>
              </div>

              <div className={styles.summary}>
                <h4>Summary</h4>
                <p>{summary || "Your personal summary statement."}</p>
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

export default Cv6;
