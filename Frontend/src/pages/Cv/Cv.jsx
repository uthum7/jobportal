// pages/Cv2/Cv2.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cv2.module.css"; // Assuming this path is correct
import { isAuthenticated, getUserId } from "../../utils/auth";
import { useCVForm } from "../../context/CVFormContext";

// Re-usable initial state for education (if needed for reset or default)
const initialEducationState = {
  schoolName: "",
  startDate: "",
  endDate: "",
  moreDetails: "",
  universitiyName: "", // Corrected typo from universitiyName
  uniStartDate: "",
  uniEndDate: "",
  uniMoreDetails: "",
};

// Helper to format date for display (e.g., "Jan 2023")
const formatDateForDisplay = (dateStr) => {
  if (!dateStr) return "Present"; // Or "" if you prefer empty for ongoing
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short" });
  } catch {
    return "Invalid Date";
  }
};

// Helper to format date for <input type="date"> (YYYY-MM-DD)
const formatDateForInput = (dateStr) => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
};

const Cv2 = () => {
  const navigate = useNavigate();
  const {
    resumeData: contextResumeData,
    saveToDatabase, // Use this from context for saving
    fetchResumeData: contextFetchResumeData,
    loading: contextLoading,
    error: contextError,
    setError: setContextError,
    updateEducationDetails: contextUpdateEducationDetails, // Can be used for optimistic UI in context
  } = useCVForm();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [pageError, setPageErrorLocal] = useState(null);

  // Local state for the education form data
  const [educationForm, setEducationForm] = useState(
    contextResumeData?.educationDetails || initialEducationState
  );

  // Data for CV Preview (synced from context)
  const [personalInfoPreview, setPersonalInfoPreview] = useState(contextResumeData?.personalInfo || {});
  // other preview states if needed for this page's preview
  const [experiencePreview, setExperiencePreview] = useState(contextResumeData?.professionalExperience || []);
  const [skillsPreview, setSkillsPreview] = useState(contextResumeData?.skill || []);
  const [summaryPreview, setSummaryPreview] = useState(contextResumeData?.summary || "");
  const [referencesPreview, setReferencesPreview] = useState(contextResumeData?.references || []);


  const hasAttemptedFetch = useRef(false);

  // Effect for initial data fetching
  useEffect(() => {
    if (!isAuthenticated()) {
      setPageErrorLocal("User not authenticated. Redirecting to login...");
      setIsPageLoading(false);
      navigate("/login", { replace: true });
      return;
    }
    // No need to pass userId, contextFetchResumeData gets it
    if (!hasAttemptedFetch.current) {
      hasAttemptedFetch.current = true;
      setIsPageLoading(true);
      setPageErrorLocal(null);
      if (setContextError) setContextError(null);

      console.log("Cv2.jsx: Attempting initial fetch via contextFetchResumeData...");
      contextFetchResumeData()
        .then((fetchResult) => {
          console.log("Cv2.jsx: contextFetchResumeData promise resolved. Result:", fetchResult);
          // Logic to handle fetchResult similar to Cv.jsx
          if (fetchResult && fetchResult.noDataFound) {
            console.log("Cv2.jsx: No existing CV data. Form will use initial state from context.");
          } else if (fetchResult && fetchResult.error) {
            console.warn("Cv2.jsx: Context reported an error during fetch:", fetchResult.error);
          }
        })
        .catch((err) => {
          console.error("Cv2.jsx: Critical error from contextFetchResumeData promise:", err);
          setPageErrorLocal(err.message || "Unexpected error loading CV data.");
        })
        .finally(() => {
          setIsPageLoading(false);
        });
    } else {
      setIsPageLoading(false);
    }
  }, [contextFetchResumeData, navigate, setContextError]);

  // Effect to synchronize local form state and preview data with contextResumeData
  useEffect(() => {
    if (contextResumeData) {
      console.log("Cv2.jsx: Syncing local state with contextResumeData", contextResumeData);
      setEducationForm(contextResumeData.educationDetails || initialEducationState);
      setPersonalInfoPreview(contextResumeData.personalInfo || {});
      // Sync other preview states if they are part of this page's preview
      setExperiencePreview(contextResumeData.professionalExperience || []);
      setSkillsPreview(contextResumeData.skill || []);
      setSummaryPreview(contextResumeData.summary || "");
      setReferencesPreview(contextResumeData.references || []);
    }
  }, [contextResumeData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEducationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // If you want optimistic updates reflected in the context immediately (e.g., for a global preview)
    // you can call contextUpdateEducationDetails here, but it's often better to wait for save.
    // if (contextUpdateEducationDetails) {
    //   contextUpdateEducationDetails({ [name]: value });
    // }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (setContextError) setContextError(null);
    setPageErrorLocal(null);

    // Validate educationForm if needed before submitting
    // e.g., if (!educationForm.schoolName && !educationForm.universitiyName) { ... }

    try {
      console.log("Cv2.jsx: Submitting educationDetails:", educationForm);
      // Use saveToDatabase from context
      await saveToDatabase("educationDetails", educationForm);
      alert("Education details saved successfully!");
      navigate("/cv-builder/experience"); // Navigate to the next step
    } catch (err) {
      console.error("Cv2.jsx: Error during handleSubmit (saveToDatabase failed):", err);
      // contextError will be set by saveToDatabase from context.
      // Optionally set pageErrorLocal for more specific messages:
      // setPageErrorLocal(err.message || "Failed to save education details.");
    }
  };

  const displayedError = pageError || (contextError ? (typeof contextError === 'string' ? contextError : contextError.message) : null);

  if (isPageLoading) {
    return <div className={styles.loading}>Loading Education Details...</div>;
  }

  if (displayedError) {
    return (
      <div className={styles.error}>
        <p>Error: {displayedError}</p>
        <button onClick={() => {
          if (setContextError) setContextError(null);
          setPageErrorLocal(null);
          if (displayedError.toLowerCase().includes("auth") || 
              displayedError.toLowerCase().includes("login") || 
              displayedError.toLowerCase().includes("user id") ||
              displayedError.toLowerCase().includes("token")) {
            navigate("/login", { replace: true });
          } else {
            hasAttemptedFetch.current = false;
            setIsPageLoading(true);
            contextFetchResumeData().finally(() => setIsPageLoading(false));
          }
        }}>
          {displayedError.toLowerCase().includes("auth") || 
           displayedError.toLowerCase().includes("login") || 
           displayedError.toLowerCase().includes("user id") ||
           displayedError.toLowerCase().includes("token") ? "Go to Login" : "Try Again"}
        </button>
      </div>
    );
  }
  
  // For CV Preview, use data synced from context
  let profileImageSrcForPreview = "/default-profile.png"; // Ensure you have this asset
  if (typeof personalInfoPreview.profilePicture === 'string' && personalInfoPreview.profilePicture) {
    profileImageSrcForPreview = personalInfoPreview.profilePicture;
  }


  return (
    <>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}><span>R</span><span>e</span><span>s</span><span>u</span><span>m</span><span>e</span> <span>B</span><span>u</span><span>i</span><span>l</span><span>d</span><span>e</span><span>r</span></h1>
        <p className={styles.pageSubtitle}>Showcase your academic achievements.</p>
      </header>

      <div className={styles.resumeBuilder}>
        <main className={styles.content}> {/* Removed isSidebarVisible logic unless needed */}
          <div className={styles.formContainer}>
            <h3 className={styles.header}>Step 2: Education Details</h3>
            <form onSubmit={handleSubmit}>
              <h4 className={styles.sectionTitle}>School Details (Optional)</h4>
              <input
                type="text"
                name="schoolName"
                placeholder="School Name (e.g., City High School)"
                value={educationForm.schoolName || ""}
                onChange={handleChange}
                className={styles.inputField}
              />
              <div className={styles.formColumns}>
                <div className={styles.formLeft}>
                  <label htmlFor="schoolStartDate" className={styles.label}>Start Date</label>
                  <input
                    type="date"
                    id="schoolStartDate"
                    name="startDate" // Matches educationForm key
                    value={formatDateForInput(educationForm.startDate)}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                </div>
                <div className={styles.formRight}>
                  <label htmlFor="schoolEndDate" className={styles.label}>End Date (or expected)</label>
                  <input
                    type="date"
                    id="schoolEndDate"
                    name="endDate" // Matches educationForm key
                    value={formatDateForInput(educationForm.endDate)}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                </div>
              </div>
              <textarea
                name="moreDetails" // Matches educationForm key
                placeholder="Additional details (e.g., major subjects, achievements)"
                value={educationForm.moreDetails || ""}
                onChange={handleChange}
                rows={3}
                className={styles.textareaField}
              />

              <h4 className={styles.sectionTitle}>University/College Details (Optional)</h4>
              <input
                type="text"
                name="universitiyName" // Corrected: should be universityName in state/backend
                placeholder="University/College Name (e.g., State University)"
                value={educationForm.universitiyName || ""} // Keep typo if backend expects it, otherwise correct
                onChange={handleChange}
                className={styles.inputField}
              />
              <div className={styles.formColumns}>
                <div className={styles.formLeft}>
                  <label htmlFor="uniStartDate" className={styles.label}>Start Date</label>
                  <input
                    type="date"
                    id="uniStartDate"
                    name="uniStartDate" // Matches educationForm key
                    value={formatDateForInput(educationForm.uniStartDate)}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                </div>
                <div className={styles.formRight}>
                  <label htmlFor="uniEndDate" className={styles.label}>End Date (or expected)</label>
                  <input
                    type="date"
                    id="uniEndDate"
                    name="uniEndDate" // Matches educationForm key
                    value={formatDateForInput(educationForm.uniEndDate)}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                </div>
              </div>
              <textarea
                name="uniMoreDetails" // Matches educationForm key
                placeholder="Degree Program, Major, Minor, Thesis, GPA, Honors, etc."
                value={educationForm.uniMoreDetails || ""}
                onChange={handleChange}
                rows={4}
                className={styles.textareaField}
              />

              <div className={styles.saveButtonContainer}>
                <button type="submit" className={styles.saveBtn} disabled={contextLoading}>
                  {contextLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
            
          </div>

          {/* CV Preview Section - shows data from synced preview states */}
          <div className={styles.cvPreview}>
            <div className={styles.cvContainer}>
              <div className={styles.cvLeft}>
                <div className={styles.profileSection}>
                  <img src={profileImageSrcForPreview} alt="Profile" className={styles.profileImage} />
                  <h3>{personalInfoPreview.jobTitle || "Your Profession"}</h3>
                  <h2>{personalInfoPreview.fullname || "Your Name"}</h2>
                </div>
                <div className={styles.contactInfo}>
                  <h4 className={styles.h4Headers}>Contact</h4>
                  <p>{personalInfoPreview.phone || "Phone"}</p>
                  <p>{personalInfoPreview.email || "Email"}</p>
                  <p>{personalInfoPreview.address || "Address"}</p>
                </div>
                <div className={styles.education}>
                  <h4 className={styles.h4Headers}>Education</h4>
                  {/* Use educationForm for live preview of current edits, or contextResumeData.educationDetails for saved state */}
                  {(educationForm.universitiyName || educationForm.schoolName) ? (
                    <div className={styles.educationItem}>
                      {educationForm.universitiyName && (
                        <>
                          <h5>{educationForm.universitiyName}</h5>
                          <span>{formatDateForDisplay(educationForm.uniStartDate)} - {formatDateForDisplay(educationForm.uniEndDate)}</span>
                          <p className={styles.uniPara}>{educationForm.uniMoreDetails || "Degree details"}</p>
                        </>
                      )}
                      {educationForm.schoolName && (
                        <>
                          <h5>{educationForm.schoolName}</h5>
                          <span>{formatDateForDisplay(educationForm.startDate)} - {formatDateForDisplay(educationForm.endDate)}</span>
                          <p>{educationForm.moreDetails || "Additional details"}</p>
                        </>
                      )}
                    </div>
                  ) : (
                    <p>Your education details will appear here as you fill them.</p>
                  )}
                </div>
              </div>
              <div className={styles.verticalLine}></div>
              <div className={styles.cvRight}>
                <div className={styles.profilePara}><h4 className={styles.h4Headers}>Profile</h4><p>{personalInfoPreview.profileParagraph || "Your profile summary"}</p></div>
                <div className={styles.experience}><h4 className={styles.h4Headers}>Professional Experience</h4>{(experiencePreview || []).length > 0 ? (experiencePreview.map((exp, index) => (<div key={index} className={styles.experienceItem}><h5>{exp.jobTitle || "Job Title"}</h5><span>{exp.jstartDate ? formatDateForDisplay(exp.jstartDate) : "Start"} - {exp.jendDate ? formatDateForDisplay(exp.jendDate) : "End"}</span><p>{exp.jobDescription || "Job description"}</p></div>))) : ( <p>Experience details will appear here.</p> )}</div>
                <div className={styles.skillsColumns}><h4 className={styles.h4Headers}>Skills</h4><ul className={styles.skillsList}>{Array.isArray(skillsPreview) && skillsPreview.length > 0 ? (skillsPreview.map((skill, index) => (<li key={index} className={styles.skillRow}><span className={styles.skillName}>{skill.skillName || "Skill"}</span><span className={styles.skillStars}>{[...Array(5)].map((_, i) => (<span key={i} className={`${styles.star} ${i < (skill.skillLevel || 0) ? styles.checked : ""}`}>★</span>))}</span></li>))) : ( <li>Skills will appear here.</li> )}</ul></div>
                <div className={styles.summary}><h4 className={styles.h4Headers}>Summary</h4><p>{typeof summaryPreview === "string" && summaryPreview ? summaryPreview : "Summary will appear here."}</p></div>
                <div className={styles.references}><h4 className={styles.h4Headers}>References</h4>{(referencesPreview || []).length > 0 ? (referencesPreview.map((ref, index) => (<p key={index}>{ref.referenceName || "Name"} - {ref.position || "Position"} at {ref.company || "Company"} - {ref.contact || "Email"}</p>))) : ( <p>References will appear here.</p> )}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Cv2;