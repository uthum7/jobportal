import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cv2.module.css";
import { getUserId } from "../../utils/auth";
import { useCVForm } from "../../context/CVFormContext";
import { saveEducationDetails } from "../../services/api";

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

const formatDateForInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Cv2 = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);

  const { resumeData, updateEducationDetails, fetchResumeData } = useCVForm();
  const educationData = resumeData.educationDetails || {};
  const personalInfo = resumeData.personalInfo || {};

  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      fetchResumeData(userId);
    }
  }, []);


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture" && files && files[0]) {
      setPreviewImg(URL.createObjectURL(files[0]));
      updateEducationDetails({ [name]: files[0] });
    } else {
      updateEducationDetails({ [name]: value });
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
      alert("Education details saved successfully");
      navigate("/Cv6");
    } catch (error) {
      alert("An error occurred while saving. Please try again.");
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
        <main className={`${styles.content} ${isSidebarVisible ? styles.shifted : ""}`}>
         

          <div className={styles.formContainer}>
            <h3 className={styles.header}>Education Details</h3>
            <form onSubmit={handleSubmit}>
              <h4 className={styles.sectionTitle}>School Details</h4>
              <input
                type="text"
                name="schoolName"
                placeholder="School Name"
                value={educationData.schoolName || ""}
                onChange={handleChange}
              />
              <div className={styles.formColumns}>
                <div className={styles.formLeft}>
                  <input
                    type="date"
                    name="startDate"
                    value={formatDateForInput(educationData.startDate)}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.formRight}>
                  <input
                    type="date"
                    name="endDate"
                    value={formatDateForInput(educationData.endDate)}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <textarea
                name="moreDetails"
                placeholder="School Details"
                value={educationData.moreDetails || ""}
                onChange={handleChange}
                rows={4}
              />

              <h4 className={styles.sectionTitle}>University Details</h4>
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
                    value={formatDateForInput(educationData.uniStartDate)}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.formRight}>
                  <input
                    type="date"
                    name="uniEndDate"
                    value={formatDateForInput(educationData.uniEndDate)}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <textarea
                name="uniMoreDetails"
                placeholder="Degree Program & Details"
                value={educationData.uniMoreDetails || ""}
                onChange={handleChange}
                rows={4}
              />

              <div className={styles.saveButtonContainer}>
                <button type="submit" className={styles.saveBtn}>Save</button>
              </div>
            </form>
          </div>


          {/* CvpreviewSection */}
          <div className={styles.cvPreview}>
            <div className={styles.cvContainer}>
              <div className={styles.cvLeft}>

                {/* Profile Section */}
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


                {/* Contact Section */}
                <div className={styles.contactInfo}>
                  <h4>Contact</h4>
                  <p>{personalInfo.phone || "Phone"}</p>
                  <p>{personalInfo.email || "Email"}</p>
                  <p>{personalInfo.address || "Address"}</p>
                </div>


                {/* Education Section */}
                <div className={styles.education}>
                  <h4>Education</h4>
                  {(educationData.universitiyName || educationData.schoolName) ? (
                    <div className={styles.educationItem}>
                      {educationData.universitiyName && (
                        <>
                          <h5>{educationData.universitiyName}</h5>
                          <span>{formatDate(educationData.uniStartDate)} -{" "}
                            {formatDate(educationData.uniEndDate)}</span>
                          <p>{educationData.uniMoreDetails || "Degree details"}</p>
                        </>
                      )}
                      {educationData.schoolName && (
                        <>
                          <h5>{educationData.schoolName}</h5>
                          <span>{formatDate(educationData.startDate)} -{" "}
                            {formatDate(educationData.endDate)}
                          </span>
                          <p>{educationData.moreDetails || "Additional details"}</p>
                        </>
                      )}
                    </div>
                  ) : (
                    <p>No education details added yet.</p>
                  )}
                </div>
              </div>

            <div className={styles.verticalLine}></div>

              <div className={styles.cvRight}>

                {/* Profile Summary */}
                <div className={styles.profilePara}>
                  <h4>Profile</h4>
                  <p>{personalInfo.profileParagraph || "Your profile summary"}</p>
                </div>

                {/* Professional Experience */}
                <div className={styles.experience}>
                  <h4>Professional Experience</h4>
                  {(resumeData.professionalExperience || []).length > 0 ? (
                    resumeData.professionalExperience.map((exp, index) => (
                      <div key={index} className={styles.experienceItem}>
                        <h5>{exp.jobTitle || "Job Title"}</h5>
                        <span>
                        {exp.jstartDate ? new Date(exp.jstartDate).toLocaleDateString() : "Start Date"} -{" "}
                        {exp.jendDate ? new Date(exp.jendDate).toLocaleDateString() : "End Date"}
                      </span>
                        <p>{exp.jobDescription || "Job description"}</p>
                      </div>
                    ))
                  ) : (
                    <p>No professional experience added yet.</p>
                  )}
                </div>


                {/* Skills Section */}
                <div className={styles.skillsColumns}>
                  <h4 className={styles.h4Header}>Skills</h4>
                  {Array.isArray(resumeData.skill) && resumeData.skill.length > 0 ? (
                    <ul className={styles.skillsList}>
                      {resumeData.skill.map((skill, index) => (
                        <li key={index} className={styles.skillRow}>
                          <span className={styles.skillName}>{skill.skillName || "Skill"}</span>
                          <span className={styles.skillStars}>
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`${styles.star} ${i < Number(skill.skillLevel) ? styles.checked : ""}`}
                              >★</span>
                            ))}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className={styles.skillsList}><li>No skills added yet.</li></ul>
                  )}
                </div>


                {/* Summary Section */}
                <div className={styles.summary}>
                  <h4>Summary</h4>
                  <p>{typeof resumeData.summary === "string" ? resumeData.summary : "Professional summary"}</p>
                </div>


                {/* References Section */}
                <div className={styles.references}>
                  <h4>References</h4>
                  {(resumeData.references || []).length > 0 ? (
                    resumeData.references.map((ref, index) => (
                      <p key={index}>
                        {ref.referenceName || "Name"} - {ref.position || "Position"} at {ref.company || "Company"} - {ref.contact || "Email"}
                      </p>
                    ))
                  ) : (
                    <p>No references added yet.</p>
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

export default Cv2;
