import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cv6.module.css";
import { useCVForm } from "../../context/CVFormContext";

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Cv6 = () => {
  const navigate = useNavigate();
  const {
    resumeData,
    addProfessionalExperience,
    updateProfessionalExperience,
    removeProfessionalExperience,
    updateResumeSection,
    fetchResumeData,
  } = useCVForm();

  const {
    professionalExperience = [],
    personalInfo = {},
    educationDetails = {},
    summary = "",
  } = resumeData || {};


  useEffect(() => {
    if (!resumeData || Object.keys(resumeData).length === 0) {
      const userId = personalInfo.userId || localStorage.getItem("userId");
      if (userId) {
        fetchResumeData(userId);
      }
    }
  }, [resumeData, personalInfo.userId]);


  useEffect(() => {
    if (!personalInfo.userId) {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        updateResumeSection("personalInfo", {
          ...personalInfo,
          userId: storedUserId,
        });
      } else {
        console.error("User ID is missing. Please ensure the user is logged in.");
      }
    }

    if (!professionalExperience || professionalExperience.length === 0) {
      addProfessionalExperience({
        jobTitle: "",
        companyName: "",
        jstartDate: "",
        jendDate: "",
        jobDescription: "",
      });
    }
  }, [personalInfo, professionalExperience, addProfessionalExperience, updateResumeSection]);


  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    const updated = {
      ...professionalExperience[index],
      [name]: value,
    };
    updateProfessionalExperience(index, updated);
  };


  const validateForm = () => {
    for (const exp of professionalExperience) {
      if (
        !exp.jobTitle ||
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

  /*handleSubmit Function */
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
        }),
      });

      const data = await res.json();
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


  const handleChange = (e) => {
    const { name, value } = e.target;
    updateResumeSection("personalInfo", {
      ...personalInfo,
      [name]: value,
    });
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
          {/* formContainer */}
          <div className={styles.formContainer}>
            <h3 className={styles.header}>Professional Experience</h3>
            <form onSubmit={handleSubmit}>
              {professionalExperience.map((exp, index) => (
                <div key={index} className={styles.experienceForm}>
                  <input
                    type="text"
                    name="jobTitle"
                    placeholder="Job Title"
                    value={exp.jobTitle || ""}
                    onChange={(e) => handleExperienceChange(index, e)}
                    required
                  />
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name"
                    value={exp.companyName || ""}
                    onChange={(e) => handleExperienceChange(index, e)}
                    required
                  />
                  <input
                    type="date"
                    name="jstartDate"
                    value={formatDate(exp.jstartDate)}
                    onChange={(e) => handleExperienceChange(index, e)}
                    required
                  />
                  <input
                    type="date"
                    name="jendDate"
                    value={formatDate(exp.jendDate)}
                    onChange={(e) => handleExperienceChange(index, e)}
                    required
                  />
                  <textarea
                    name="jobDescription"
                    placeholder="Job Description"
                    value={exp.jobDescription || ""}
                    onChange={(e) => handleExperienceChange(index, e)}
                    required
                  />
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => removeProfessionalExperience(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className={styles.buttonsContainer}>
                <button className={styles.addButton} type="button" onClick={addProfessionalExperience}>
                  AddMore
                </button>
                <button className={styles.saveBtn} type="submit">Save</button>
              </div>
            </form>

            {/* <div className={styles.instractionSection}>
              <h3>Instructions</h3>
              <ul>
                <li>
                  Fill in your professional experience details.
                  <div className={styles.instractionDetail}>
                    Include your job title, company name, dates, and description of responsibilities.
                  </div>
                </li>
                <li>
                  Click "Add More" to add additional experiences.
                  <div className={styles.instractionDetail}>
                    You can add multiple professional experiences to showcase your career history.
                  </div>
                </li>
                <li>
                  Click "Save" to save your changes.
                  <div className={styles.instractionDetail}>
                    Make sure to save before moving to the next section.
                  </div>
                </li>
                <li>
                  You can edit your details later.
                  <div className={styles.instractionDetail}>
                    All information can be updated at any time before final submission.
                  </div>
                </li>
              </ul>
            </div> */}
          </div>

          {/* cvPrivewSection */}
          <div className={styles.cvPreview}>
            <div className={styles.cvContainer}>
              <div className={styles.cvLeft}>
                <div className={styles.profileSection}>
                  <label htmlFor="profilePicture" className={styles.profilePictureLabel}>
                    <img
                      src={personalInfo.profilePicture || "profile.jpg"}
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
                  <h4 className={styles.h4Headers}>Contact</h4>
                  <p>{personalInfo.phone || "Phone Number"}</p>
                  <p>{personalInfo.email || "Email Address"}</p>
                  <p>{personalInfo.address || "Your Address"}</p>
                </div>

                <div className={styles.education}>
                  <h4>Education</h4>
                  <div className={styles.educationItem}>
                    <h5>{educationDetails.universityName || "University of Moratuwa"}</h5>
                    <span>
                          {formatDate(educationDetails.uniStartDate)} - {" "}
                          {formatDate(educationDetails.uniEndDate)}
                        </span>
                    <p>
                      {educationDetails.uniMoreDetails ||
                        "Bachelor of Science in Computer Science"}
                    </p>
                  </div>
                  <div className={styles.educationItem}>
                    <h5>{educationDetails.SchoolName || "Rahula College Matara"}</h5>
                    <span>
                          {formatDate(educationDetails.startDate)} - {" "}
                          {formatDate(educationDetails.endDate)}
                        </span>
                    <p>
                      {educationDetails.moreDetails ||
                        "Advanced Level in Physical Science"}
                    </p>
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
                      <h5>{exp.jobTitle || "Job Title"}</h5>
                      <span>
                        {exp.jstartDate ? new Date(exp.jstartDate).toLocaleDateString() : "Start Date"} -{" "}
                        {exp.jendDate ? new Date(exp.jendDate).toLocaleDateString() : "End Date"}
                      </span>
                      <p>{exp.jobDescription || "Job Description"}</p>
                    </div>
                  ))}
                </div>

                {/*  skills section */}
                <div className={styles.skillsColumns}>
                  <h4 className={styles.h4Headers}>Skills</h4>
                  <ul className={styles.skillsList}>
                    {resumeData.skill && resumeData.skill.length > 0 ? (
                      resumeData.skill.map((skill, index) => (
                        <li key={index} className={styles.skillRow}>
                          <span className={styles.skillName}>{skill.skillName || "Skill"}</span>
                          <span className={styles.skillStars}>
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`${styles.star} ${i < (skill.skillLevel || 0) ? styles.checked : ""
                                  }`}
                              >
                                &#9733;
                              </span>
                            ))}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li>No skills added yet</li>
                    )}
                  </ul>
                </div>


                <div className={styles.summary}>
                  <h4>Summary</h4>
                  <p>{resumeData.summary || "No summary added yet"}</p>
                </div>


                <div className={styles.references}>
                  <h4>References</h4>
                  {resumeData.references && resumeData.references.length > 0 ? (
                    resumeData.references.map((ref, index) => (
                      <p key={index}>
                        {ref.referenceName} - {ref.position} at {ref.company} - {ref.contact}
                      </p>
                    ))
                  ) : (
                    <p>No references added yet</p>
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

export default Cv6;