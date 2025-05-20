import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cv7.module.css";
import { useCVForm } from "../../context/CVFormContext";
import { getUserId, isAuthenticated } from "../../utils/auth";

const initialReference = { name: "", position: "", company: "", contact: "" };

const Cv7 = () => {
  const navigate = useNavigate();
  const {
    resumeData,
    fetchResumeData,
    updateReference,
    addReference,
    removeReference,
    saveToDatabase,
    loading,
    error,
  } = useCVForm();

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  const hasLoaded = useRef(false);


  useEffect(() => {
    const loadData = async () => {
      if (hasLoaded.current) return;
      hasLoaded.current = true;

      try {
        const userId = getUserId();
        if (!userId || !isAuthenticated()) {
          alert("User not logged in");
          navigate("/login");
          return;
        }
        await fetchResumeData(userId);
      } catch (err) {
        console.error("Error loading resume data:", err);
        alert("Failed to load resume data. Please try again.");
      } finally {
        setLocalLoading(false);
      }
    };

    loadData();
  }, [fetchResumeData, navigate]);

  const handleReferenceChange = (index, field, value) => {
    const updatedReference = { ...resumeData.references[index], [field]: value };
    updateReference(index, updatedReference);
  };

  const handleAddReference = () => {
    addReference(initialReference);
  };

  const handleRemoveReference = (index) => {
    removeReference(index);
  };

  const validateForm = () => {
    for (let ref of resumeData.references) {
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
      const sanitizedReferences = resumeData.references.map(({ _id, ...rest }) => rest);
      await saveToDatabase("references", sanitizedReferences);
      await fetchResumeData(userId);
      alert("References saved successfully!");
      navigate("/Cv5");
    } catch (error) {
      console.error("Error saving references:", error);
      alert("Failed to save references. Try again later.");
    }
  };

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

  const {
    personalInfo = {},
    educationDetails = {},
    skill = [],
    summary,
    professionalExperience = [],
  } = resumeData;

  const references = resumeData?.references || [];

  const {
    fullname,
    jobTitle,
    address,
    email,
    phone,
    profileParagraph,
  } = personalInfo;


  if (localLoading || loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error: {error}</p>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

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
            <h3 className={styles.header}>References</h3>
            <form onSubmit={handleSubmit}>
              {Array.isArray(references) && references.map((ref, index) => (
                <div key={index} className={styles.referenceGroup}>
                  <input
                    type="text"
                    placeholder="Name"
                    value={ref.name || ""}
                    onChange={(e) => handleReferenceChange(index, "name", e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Position"
                    value={ref.position || ""}
                    onChange={(e) => handleReferenceChange(index, "position", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={ref.company || ""}
                    onChange={(e) => handleReferenceChange(index, "company", e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Contact Info"
                    value={ref.contact || ""}
                    onChange={(e) => handleReferenceChange(index, "contact", e.target.value)}
                    required
                  />
                  {references.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveReference(index)}
                      className={styles.removeBtn}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              
              <div className={styles.saveButtonContainer}>
                <button
                  type="button"
                  className={styles.addMoreBtn}
                  onClick={handleAddReference}
                >
                  AddMore
                </button>
                <button
                  type="submit"
                  className={styles.saveBtn}
                >
                  Save
                </button>
              </div>
            </form>

            <div className={styles.instractionSection}>
              <h3>Instructions</h3>
              <ul>
                <li>
                  Add your professional references.
                  <div className={styles.instractionDetail}>
                    Include people who can vouch for your work experience and skills.
                  </div>
                </li>
                <li>
                  Click "Add More" to add additional references.
                  <div className={styles.instractionDetail}>
                    You can add multiple references to strengthen your application.
                  </div>
                </li>
                <li>
                  Click "Save" to save your changes.
                  <div className={styles.instractionDetail}>
                    Make sure to save before moving to the next section.
                  </div>
                </li>
                <li>
                  You can edit your references later.
                  <div className={styles.instractionDetail}>
                    All information can be updated at any time before final submission.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.cvPreview}>
            <div className={styles.cvContainer}>
              <div className={styles.cvLeft}>
                <div className={styles.profileSection}>
                  <img
                    src="profile.jpg"
                    alt="Profile"
                    className={styles.profileImage}
                  />
                  <h3>{jobTitle || "Your Profession"}</h3>
                  <h2>{fullname || "Your Name"}</h2>
                </div>
                <div className={styles.contactInfo}>
                  <h4 className={styles.h4Headers}>Contact</h4>
                  <p>{phone || "Phone Number"}</p>
                  <p>{email || "Email Address"}</p>
                  <p>{address || "Your Address"}</p>
                </div>
                <div className={styles.education}>
                  <h4 className={styles.h4Headers}>Education</h4>
                  <div className={styles.educationItem}>
                    <h5>{educationDetails.universitiyName || "University Name"}</h5>
                    <span>
                      {formatDate(educationDetails.uniStartDate)} -{" "}
                      {formatDate(educationDetails.uniEndDate)}
                    </span>
                    <p className={styles.uniPara}>
                      {educationDetails.uniMoreDetails || "Degree details"}
                    </p>
                  </div>
                  <div className={styles.educationItem}>
                    <h5>{educationDetails.schoolName || "School Name"}</h5>
                    <span>
                      {formatDate(educationDetails.startDate)} -{" "}
                      {formatDate(educationDetails.endDate)}
                    </span>
                    <p>{educationDetails.moreDetails || "Additional details"}</p>
                  </div>
                </div>
              </div>

              <div className={styles.verticalLine}></div>

              <div className={styles.cvRight}>

                <div className={styles.profilePara}>
                  <h4 className={styles.h4Headers}>Profile</h4>
                  <p>{profileParagraph || "Your profile summary"}</p>
                </div>

                <div className={styles.experience}>
                  <h4 className={styles.h4Headers}>Professional Experience</h4>
                  {professionalExperience.map((exp, i) => (
                    <div key={i} className={styles.experienceItem}>
                      <h5>{exp.jobTitle || "Job Title"}</h5>
                      <span>
                        {formatDate(exp.jstartDate)} - {formatDate(exp.jendDate)}
                      </span>
                      <p>{exp.jobDescription || "Job description"}</p>
                    </div>
                  ))}
                </div>

                <div className={styles.skillsColumns}>
                  <h4 className={styles.h4Headers}>Skills</h4>
                  <ul className={styles.skillsList}>
                    {skill.map((skill, index) => (
                      <li key={index} className={styles.skillRow}>
                        <span className={styles.skillName}>{skill.skillName || "Skill"}</span>
                        <span className={styles.skillStars}>
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`${styles.star} ${
                                i < (skill.skillLevel || 0) ? styles.checked : ""
                              }`}
                            >
                              &#9733;
                            </span>
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.summary}>
                  <h4 className={styles.h4Headers}>Summary</h4>
                  <p>{summary || "Professional summary"}</p>
                </div>
                
                <div className={styles.references}>
                  <h4 className={styles.h4Headers}>References</h4>
                  {references.map((ref, idx) => (
                    <p key={idx}>
                      {ref.name || "Name"} - {ref.position || "Position"} at{" "}
                      {ref.company || "Company"} - {ref.contact || "Contact"}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Cv7;