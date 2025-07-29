// pages/Cv3/Cv3.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Cv3.module.css';
import { useCVForm } from '../../context/CVFormContext';
import { isAuthenticated } from '../../utils/auth';
import { toast } from 'sonner'; // Added toast for notifications

const initialSkillFormState = {
  skillName: '',
  skillRating: 0,
};

// Helper function to format dates consistently
const formatDate = (dateStr, formatType = 'date') => {
  if (!dateStr) return "Present";
  if (formatType === 'year') return dateStr;
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short" });
  } catch {
    return "Invalid Date";
  }
};

const Cv3 = () => {
  const navigate = useNavigate();
  const {
    resumeData: contextResumeData,
    fetchResumeData: contextFetchResumeData,
    addSkill,
    updateSkill,
    removeSkill,
    saveToDatabase,
    loading: contextLoading,
    error: contextError,
    setError: setContextError,
  } = useCVForm();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [pageError, setPageErrorLocal] = useState(null);
  const [currentSkill, setCurrentSkill] = useState({ ...initialSkillFormState });
  const [editingIndex, setEditingIndex] = useState(null);

  const [personalInfoPreview, setPersonalInfoPreview] = useState({});
  const [educationPreview, setEducationPreview] = useState([]);
  const [experiencePreview, setExperiencePreview] = useState([]);
  const [summaryPreview, setSummaryPreview] = useState("");
  const [referencesPreview, setReferencesPreview] = useState([]);

  const hasAttemptedFetch = useRef(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }
    if (!hasAttemptedFetch.current) {
      hasAttemptedFetch.current = true;
      contextFetchResumeData().finally(() => setIsPageLoading(false));
    } else {
      setIsPageLoading(false);
    }
  }, [contextFetchResumeData, navigate]);

  useEffect(() => {
    if (contextResumeData) {
      setPersonalInfoPreview(contextResumeData.personalInfo || {});
      setEducationPreview(contextResumeData.educationDetails || []);
      setExperiencePreview(contextResumeData.professionalExperience || []);
      setSummaryPreview(contextResumeData.summary || "");
      setReferencesPreview(contextResumeData.references || []);
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
      toast.error("Please enter a skill name and select a valid rating (1-5).");
      return;
    }
    const skillToProcess = {
      skillName: currentSkill.skillName.trim(),
      skillLevel: currentSkill.skillRating,
    };

    if (editingIndex !== null) {
      updateSkill(editingIndex, skillToProcess);
      toast.success("Skill updated!");
      setEditingIndex(null);
    } else {
      addSkill(skillToProcess);
      toast.success("Skill added!");
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
    removeSkill(index);
    toast.info("Skill removed.");
    if (editingIndex === index) {
      setCurrentSkill({ ...initialSkillFormState });
      setEditingIndex(null);
    }
  };

  // ===============================================
  // ===        UPDATED SUBMIT FUNCTION        ===
  // ===============================================
  const handleSubmitSkills = async (e) => {
    e.preventDefault();
    const skillsToSave = (contextResumeData?.skill || []).map(skill => ({
      skillName: skill.skillName,
      skillLevel: Number(skill.skillLevel) || 0,
    }));
    
    const promise = saveToDatabase("skill", skillsToSave);

    toast.promise(promise, {
        loading: 'Saving your skills...',
        success: () => {
            setTimeout(() => navigate("/cv-builder/summary"), 500); // Navigate after success
            return "Skills saved successfully!";
        },
        error: (err) => {
            console.error("Cv3.jsx: Error during handleSubmitSkills:", err);
            return err.message || "Failed to save skills.";
        }
    });
  };

  const displayedError = pageError || (contextError ? (typeof contextError === 'string' ? contextError : contextError.message) : null);

  if (isPageLoading) return <div className={styles.loading}>Loading Skills Section...</div>;
  if (displayedError) return (
      <div className={styles.error}>
        <p>Error: {displayedError}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  
  const skillsListForDisplayAndPreview = contextResumeData?.skill || [];
  let profileImageSrcForPreview = personalInfoPreview.profilePicture || "/default-profile.png";

  return (
      <div className={styles.resumeBuilder}>
        <main className={styles.content}>
          <div className={styles.formContainer}>
            <h3 className={styles.header}>Step 4: Skills</h3>
            <div className={styles.skillInputForm}>
                <input type="text" name="skillName" placeholder="Skill Name (e.g., JavaScript)" value={currentSkill.skillName} onChange={handleSkillInputChange} className={styles.inputField} />
                <select name="skillRating" value={currentSkill.skillRating} onChange={handleSkillInputChange} className={styles.selectField}>
                    <option value={0} disabled>Rate proficiency (1-5)</option>
                    {[1,2,3,4,5].map((val) => (<option key={val} value={val}>{val} Star{val > 1 ? "s" : ""}</option>))}
                </select>
                <button type="button" className={styles.addButton} onClick={handleAddOrUpdateSkill} disabled={contextLoading}>
                    {editingIndex !== null ? "Update Skill" : "Add Skill"}
                </button>
                {editingIndex !== null && (<button type="button" className={styles.cancelButton} onClick={() => { setCurrentSkill({ ...initialSkillFormState }); setEditingIndex(null); }}>Cancel</button>)}
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
                                    {/* ✅ FIX: className must use a template literal wrapped in {} */}
                                    {[...Array(5)].map((_, i) => (<span key={i} className={`${styles.star} ${i < (Number(skill.skillLevel) || 0) ? styles.checked : ""}`}>★</span>))}
                                </div>
                                <div className={styles.skillActions}>
                                    {/* ✅ FIX: className must use a template literal wrapped in {} */}
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
                    {contextLoading ? "Saving..." : "Save & Next"}
                </button>
            </form>
            <div className={styles.instractionSection}>
                <h3>Instructions</h3>
                <ul>
                    <li>Enter a skill and rate your proficiency from 1 to 5 stars.</li>
                    <li>Click "Add Skill" to add it to your list.</li>
                    <li>Once all skills are added, click "Save & Next".</li>
                </ul>
            </div>
          </div>

          <div className={styles.cvPreview}>
            <div className={styles.cvContainer}>
              <div className={styles.cvLeft}>
                <div className={styles.profileSection}>
                  <img src={profileImageSrcForPreview} alt="Profile" className={styles.profileImage}/>
                  <h2>{personalInfoPreview.fullname || "Your Name"}</h2>
                </div>
                <div className={styles.contactInfo}><h4 className={styles.h4Headers}>Contact</h4><p>{personalInfoPreview.phone || "Phone"}</p><p>{personalInfoPreview.email || "Email"}</p><p>{personalInfoPreview.address || "Address"}</p></div>
                
                <div className={styles.education}>
                    <h4 className={styles.h4Headers}>Education</h4>
                    {Array.isArray(educationPreview) && educationPreview.length > 0 ? (
                    educationPreview.map((edu, index) => (
                        edu.institute && (
                        <div key={index} className={styles.educationItem}>
                            <h5>{edu.institute}</h5>
                            {edu.educationLevel === 'A/L' ? (
                            <>
                                <span>{edu.fieldOfStudy} - {formatDate(edu.alYear, 'year')}</span>
                            </>
                            ) : (
                            <>
                                <span>{formatDate(edu.startDate)} - {edu.currentlyStudying ? 'Present' : formatDate(edu.endDate)}</span>
                                <p><strong>{edu.fieldOfStudy}</strong></p>
                                  <p>GPA Value-{edu.gpaOrGrade}</p>
                            </>
                            )}
                        </div>
                        )
                    ))
                    ) : (
                    <p>Education details will appear here.</p>
                    )}
                </div>
              </div>
              <div className={styles.verticalLine}></div>
              <div className={styles.cvRight}>
                <div className={styles.profilePara}><h4 className={styles.h4Headers}>Profile</h4><p>{personalInfoPreview.profileParagraph || "Your profile summary."}</p></div>
                
                <div className={styles.experience}><h4 className={styles.h4Headers}>Professional Experience</h4>
                  {(experiencePreview || []).length > 0 ? (
                    experiencePreview.map((exp, i) => (
                      // ✅ FIX: The key prop must be a valid string or number. Use a template literal.
                      <div key={`exp-preview-${i}`} className={styles.experienceItem}>
                        <h5>{exp.jobTitle || "Job Title"}</h5><p className={styles.companyName}>{exp.companyName}</p>
                        <span>{formatDate(exp.jstartDate)} - {formatDate(exp.jendDate)}</span>
                        <p className={styles.jobDescription}>{exp.jobDescription}</p>
                      </div>))
                  ) : ( <p>Experience details will appear here.</p> )}
                </div>

                <div className={styles.skillsColumns}><h4 className={styles.h4Headers}>Skills</h4>
                  <ul className={styles.skillsDisplayList}>
                    {skillsListForDisplayAndPreview.length > 0 ? (
                      skillsListForDisplayAndPreview.map((skill, index) => (
                        // ✅ FIX: The key prop must be a valid string or number. Use a template literal.
                        <li key={`skill-preview-${index}`} className={styles.skillDisplayItem}>
                          <span className={styles.skillNameDisplay}>{skill.skillName}</span>
                          <div className={styles.skillStarsDisplay}>
                             {/* ✅ FIX: className must use a template literal wrapped in {} */}
                            {[...Array(5)].map((_, i) => (<span key={i} className={`${styles.star} ${i < (Number(skill.skillLevel) || 0) ? styles.checked : ""}`}>★</span>))}
                          </div>
                        </li>
                      ))
                    ) : ( <li>Skills will appear here.</li> )}
                  </ul>
                </div>
                <div className={styles.summary}><h4 className={styles.h4Headers}>Summary</h4><p>{summaryPreview || "Summary will appear here."}</p></div>
                <div className={styles.references}><h4 className={styles.h4Headers}>References</h4>
                  {(referencesPreview || []).length > 0 ? (referencesPreview.map((ref, index) => (
                  // ✅ FIX: The key prop must be a valid string or number. Use a template literal.
                  <p key={`ref-preview-${index}`}>{ref.referenceName || "Name"} - {ref.position || "Position"} at {ref.company || "Company"} - {ref.contact || "Contact"}</p>))
                  ) : ( <p>References will appear here.</p> )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
};

export default Cv3;