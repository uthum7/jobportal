// pages/Cv3/Cv3.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Cv3.module.css'; // Ensure this path is correct and styles are defined
import { useCVForm } from '../../context/CVFormContext';
import { isAuthenticated } from '../../utils/auth';

// Re-usable initial state for a single skill item for resetting form
const initialSkillFormState = {
  skillName: '',
  skillRating: 0, // Use number for rating
};

// Initial state for preview sections (defaults if context data is not yet available)
const initialPreviewStates = {
    personalInfo: { fullname: "Your Name", jobTitle: "Your Profession", profilePicture: "/default-profile.png", phone: "Phone", email: "Email", address: "Address", profileParagraph: "Your profile summary." },
    educationDetails: { universitiyName: "University Name", schoolName: "School Name", uniStartDate: "", uniEndDate: "", uniMoreDetails: "", startDate: "", endDate: "", moreDetails:"" },
    professionalExperience: [],
    skill: [], // Added skill here for consistency though preview might use context directly
    summary: "Your professional summary.",
    references: [],
};

const Cv3 = () => {
  const navigate = useNavigate();
  const {
    resumeData: contextResumeData,
    fetchResumeData: contextFetchResumeData,
    addSkill: contextAddSkill,
    updateSkill: contextUpdateSkill,
    removeSkill: contextRemoveSkill,
    saveToDatabase,
    loading: contextLoading,
    error: contextError,
    setError: setContextError,
  } = useCVForm();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [pageError, setPageErrorLocal] = useState(null);

  // Local state for the skill input form
  const [currentSkill, setCurrentSkill] = useState({ ...initialSkillFormState });
  const [editingIndex, setEditingIndex] = useState(null);

  // Data for CV Preview (synced from context, with fallbacks)
  const [personalInfoPreview, setPersonalInfoPreview] = useState(initialPreviewStates.personalInfo);
  const [educationPreview, setEducationPreview] = useState(initialPreviewStates.educationDetails);
  const [experiencePreview, setExperiencePreview] = useState(initialPreviewStates.professionalExperience);
  const [summaryPreview, setSummaryPreview] = useState(initialPreviewStates.summary);
  const [referencesPreview, setReferencesPreview] = useState(initialPreviewStates.references);
  // Skills for preview will come directly from contextResumeData.skill

  const hasAttemptedFetch = useRef(false);

  // Effect for initial data fetching
  useEffect(() => {
    if (!isAuthenticated()) {
      setPageErrorLocal("User not authenticated. Redirecting to login...");
      setIsPageLoading(false);
      navigate("/login", { replace: true });
      return;
    }

    if (!hasAttemptedFetch.current) {
      hasAttemptedFetch.current = true;
      setIsPageLoading(true);
      setPageErrorLocal(null);
      if (setContextError) setContextError(null);

      contextFetchResumeData()
        .then((fetchResult) => {
          console.log("Cv3.jsx: contextFetchResumeData promise resolved. Result:", fetchResult);
        })
        .catch((err) => {
          console.error("Cv3.jsx: Error from contextFetchResumeData promise:", err);
        })
        .finally(() => {
          setIsPageLoading(false);
        });
    } else {
      setIsPageLoading(false);
    }
  }, [contextFetchResumeData, navigate, setContextError]);

  // Effect to synchronize preview data with contextResumeData
  useEffect(() => {
    if (contextResumeData) {
      setPersonalInfoPreview(contextResumeData.personalInfo || initialPreviewStates.personalInfo);
      setEducationPreview(contextResumeData.educationDetails || initialPreviewStates.educationDetails);
      setExperiencePreview(contextResumeData.professionalExperience || initialPreviewStates.professionalExperience);
      setSummaryPreview(contextResumeData.summary !== undefined ? contextResumeData.summary : initialPreviewStates.summary);
      setReferencesPreview(contextResumeData.references || initialPreviewStates.references);
    }
  }, [contextResumeData]);

  const handleSkillInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSkill(prev => ({
      ...prev,
      [name]: name === 'skillRating' ? parseInt(value, 10) : value,
    }));
  };

  const handleAddOrUpdateSkill = () => {
    if (!currentSkill.skillName.trim() || currentSkill.skillRating <= 0 || currentSkill.skillRating > 5) {
      alert("Please enter a skill name and select a valid rating (1-5).");
      return;
    }
    setPageErrorLocal(null);

    const skillToProcess = {
      skillName: currentSkill.skillName.trim(),
      skillLevel: currentSkill.skillRating,
    };

    if (editingIndex !== null) {
      contextUpdateSkill(editingIndex, skillToProcess);
      setEditingIndex(null);
    } else {
      contextAddSkill(skillToProcess);
    }
    setCurrentSkill({ ...initialSkillFormState });
  };

  const handleEditSkill = (index) => {
    const skillToEdit = (contextResumeData?.skill || [])[index];
    if (skillToEdit) {
      setCurrentSkill({
        skillName: skillToEdit.skillName,
        skillRating: parseInt(skillToEdit.skillLevel, 10) || 0,
      });
      setEditingIndex(index);
    }
  };

  const handleDeleteSkill = (index) => {
    contextRemoveSkill(index);
    if (editingIndex === index) {
      setCurrentSkill({ ...initialSkillFormState });
      setEditingIndex(null);
    }
  };

  const handleSubmitSkills = async (e) => {
    e.preventDefault();
    if (setContextError) setContextError(null);
    setPageErrorLocal(null);

    const skillsToSave = (contextResumeData?.skill || []).map(skill => ({
      skillName: skill.skillName,
      skillLevel: Number(skill.skillLevel) || 0,
    }));

    try {
      await saveToDatabase("skill", skillsToSave);
      // alert("Skills saved successfully!");
      navigate("/cv-builder/summary");
    } catch (err) {
      console.error("Cv3.jsx: Error during handleSubmitSkills (saveToDatabase failed):", err);
    }
  };

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "Present";
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "Invalid Date";
        return date.toLocaleDateString(undefined, { year: "numeric", month: "short" });
    } catch {
        return "Invalid Date";
    }
  };
  
  const displayedError = pageError || (contextError ? (typeof contextError === 'string' ? contextError : contextError.message) : null);

  if (isPageLoading) {
    return <div className={styles.loading}>Loading Skills Section...</div>;
  }

  if (displayedError) {
    return (
      <div className={styles.error}>
        <p>Error: {displayedError}</p>
        <button onClick={() => { 
            if (setContextError) setContextError(null);
            setPageErrorLocal(null);
            if (displayedError.toLowerCase().includes("auth") || displayedError.toLowerCase().includes("login") || displayedError.toLowerCase().includes("user id") || displayedError.toLowerCase().includes("token")) {
                navigate("/login", { replace: true });
            } else {
                hasAttemptedFetch.current = false;
                setIsPageLoading(true);
                contextFetchResumeData().finally(() => setIsPageLoading(false));
            }
        }}>
          {displayedError.toLowerCase().includes("auth") || displayedError.toLowerCase().includes("login") || displayedError.toLowerCase().includes("user id") || displayedError.toLowerCase().includes("token") ? "Go to Login" : "Try Again"}
        </button>
      </div>
    );
  }
  
  const skillsListForDisplayAndPreview = contextResumeData?.skill || [];
  let profileImageSrcForPreview = personalInfoPreview.profilePicture || "/default-profile.png"; // Path to your actual default image

  return (
    <>
      {/* <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}><span>R</span><span>e</span><span>s</span><span>u</span><span>m</span><span>e</span> <span>B</span><span>u</span><span>i</span><span>l</span><span>d</span><span>e</span><span>r</span></h1>
        <p className={styles.pageSubtitle}>Highlight your key skills and proficiencies.</p>
      </header> */}

      <div className={styles.resumeBuilder}>
        <main className={styles.content}>
          <div className={styles.formContainer}>
            <h3 className={styles.header}>Step 4: Skills</h3>
            <div className={styles.skillInputForm}>
                <input
                    type="text" name="skillName" placeholder="Skill Name (e.g., JavaScript)"
                    value={currentSkill.skillName} onChange={handleSkillInputChange}
                    className={styles.inputField}
                />
                <select
                    name="skillRating" value={currentSkill.skillRating}
                    onChange={handleSkillInputChange} className={styles.selectField}
                >
                    <option value={0} disabled>Rate proficiency (1-5)</option>
                    {[1, 2, 3, 4, 5].map((val) => (
                        <option key={val} value={val}>{val} Star{val > 1 ? "s" : ""}</option>
                    ))}
                </select>
                <button
                    type="button" className={styles.addButton}
                    onClick={handleAddOrUpdateSkill} disabled={contextLoading}
                >
                    {editingIndex !== null ? "Update Skill" : "Add Skill"}
                </button>
                {editingIndex !== null && (
                    <button type="button" className={styles.cancelButton}
                        onClick={() => { setCurrentSkill({ ...initialSkillFormState }); setEditingIndex(null); }}
                    >
                        Cancel
                    </button>
                )}
            </div>

            <div className={styles.skillsListContainer}>
                <h4>Your Skills:</h4>
                {skillsListForDisplayAndPreview.length === 0 ? (
                    <p className={styles.noSkillsMessage}>No skills added yet. Use the form above.</p>
                ) : (
                    <ul className={styles.skillsDisplayList}>
                        {skillsListForDisplayAndPreview.map((skill, index) =>
                        skill && typeof skill.skillName === 'string' ? (
                            <li key={index} className={styles.skillDisplayItem}>
                                <span className={styles.skillNameDisplay}>{skill.skillName}</span>
                                <div className={styles.skillStarsDisplay}>
                                    {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`${styles.star} ${i < (Number(skill.skillLevel) || 0) ? styles.checked : ""}`}>★</span>
                                    ))}
                                </div>
                                <div className={styles.skillActions}>
                                    <button type="button" className={`${styles.actionButton} ${styles.editBtn}`} onClick={() => handleEditSkill(index)} disabled={contextLoading}>Edit</button>
                                    <button type="button" className={`${styles.actionButton} ${styles.deleteBtn}`} onClick={() => handleDeleteSkill(index)} disabled={contextLoading}>Delete</button>
                                </div>
                            </li>
                        ) : null
                        )}
                    </ul>
                )}
            </div>
            
            <form onSubmit={handleSubmitSkills} className={styles.submitForm}>
                <button type="submit" className={styles.saveBtn} disabled={contextLoading || skillsListForDisplayAndPreview.length === 0}>
                    {contextLoading ? "Saving..." : "Save"}
                </button>
            </form>
            <div className={styles.instractionSection}>
                <h3>Instructions</h3>
                <ul>
                    <li>Enter a skill and rate your proficiency from 1 to 5 stars.</li>
                    <li>Click "Add Skill" to add it to your list. You can edit or delete skills from the list.</li>
                    <li>Once all skills are added, click "Save" to proceed.</li>
                </ul>
            </div>
          </div>

          {/* CV Preview Section */}    
          <div className={styles.cvPreview}>
            <div className={styles.cvContainer}>
              <div className={styles.cvLeft}>
                <div className={styles.profileSection}>
                  <img src={profileImageSrcForPreview} alt="Profile" className={styles.profileImage}/>
                  <h3>{personalInfoPreview.jobTitle || "Your Profession"}</h3>
                  <h2>{personalInfoPreview.fullname || "Your Name"}</h2>
                </div>
                <div className={styles.contactInfo}><h4 className={styles.h4Headers}>Contact</h4><p>{personalInfoPreview.phone || "Phone"}</p><p>{personalInfoPreview.email || "Email"}</p><p>{personalInfoPreview.address || "Address"}</p></div>
                <div className={styles.education}><h4 className={styles.h4Headers}>Education</h4>
                  {(educationPreview.universitiyName || educationPreview.schoolName) ? (<div className={styles.educationItem}>
                    {educationPreview.universitiyName && (<><h5>{educationPreview.universitiyName}</h5><span>{formatDateForDisplay(educationPreview.uniStartDate)} - {formatDateForDisplay(educationPreview.uniEndDate)}</span><p className={styles.uniPara}>{educationPreview.uniMoreDetails || ""}</p></>)}
                    {educationPreview.schoolName && (<><h5>{educationPreview.schoolName}</h5><span>{formatDateForDisplay(educationPreview.startDate)} - {formatDateForDisplay(educationPreview.endDate)}</span><p>{educationPreview.moreDetails || ""}</p></>)}
                  </div>) : ( <p>Education details will appear here.</p> )}
                </div>
              </div>
              <div className={styles.verticalLine}></div>
              <div className={styles.cvRight}>
                <div className={styles.profilePara}><h4 className={styles.h4Headers}>Profile</h4><p>{personalInfoPreview.profileParagraph || "Your profile summary."}</p></div>
                
                <div className={styles.experience}><h4 className={styles.h4Headers}>Professional Experience</h4>
                  {(experiencePreview || []).length > 0 ? (
                    experiencePreview.map((exp, i) => (
                      <div key={`exp-preview-${i}`} className={styles.experienceItem}>
                        <h5>{exp.jobTitle || "Job Title"}</h5><p className={styles.companyName}>{exp.companyName}</p>
                        <span>{exp.jstartDate ? formatDateForDisplay(exp.jstartDate) : "Start"} - {exp.jendDate ? formatDateForDisplay(exp.jendDate) : "Present"}</span>
                        <p className={styles.jobDescription}>{exp.jobDescription}</p>
                      </div>))
                  ) : ( <p>Experience details will appear here.</p> )}
                </div>

                <div className={styles.skillsColumns}><h4 className={styles.h4Headers}>Skills</h4>
                  <ul className={styles.skillsDisplayList}>
                    {skillsListForDisplayAndPreview.length > 0 ? (
                      skillsListForDisplayAndPreview.map((skill, index) => (
                        <li key={`skill-preview-${index}`} className={styles.skillDisplayItem}>
                          <span className={styles.skillNameDisplay}>{skill.skillName}</span>
                          <div className={styles.skillStarsDisplay}>
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`${styles.star} ${i < (Number(skill.skillLevel) || 0) ? styles.checked : ""}`}>★</span>
                            ))}
                          </div>
                        </li>
                      ))
                    ) : ( <li>Skills will appear here.</li> )}
                  </ul>
                </div>
                <div className={styles.summary}><h4 className={styles.h4Headers}>Summary</h4><p>{typeof summaryPreview === "string" && summaryPreview ? summaryPreview : "Summary will appear here."}</p></div>
                <div className={styles.references}><h4 className={styles.h4Headers}>References</h4>
                  {(referencesPreview || []).length > 0 ? (referencesPreview.map((ref, index) => (
                    <p key={`ref-preview-${index}`}>{ref.referenceName || "Name"} - {ref.position || "Position"} at {ref.company || "Company"} - {ref.contact || "Contact"}</p>))
                  ) : ( <p>References will appear here.</p> )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Cv3;