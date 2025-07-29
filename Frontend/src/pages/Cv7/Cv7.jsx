// pages/Cv7/Cv7.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cv7.module.css";
import { useCVForm } from "../../context/CVFormContext";
import { isAuthenticated } from "../../utils/auth";
import { toast } from 'sonner';

const initialReferenceState = { referenceName: "", position: "", company: "", contact: "" };

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

const Cv7 = () => {
  const navigate = useNavigate();
  const {
    resumeData: contextResumeData, fetchResumeData, saveToDatabase,
    loading: contextLoading, error: contextError,
  } = useCVForm();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [pageError, setPageErrorLocal] = useState(null);
  const [localReferences, setLocalReferences] = useState([]);
  const hasAttemptedFetch = useRef(false);

  const [personalInfoPreview, setPersonalInfoPreview] = useState({});
  const [educationPreview, setEducationPreview] = useState([]);
  const [experiencePreview, setExperiencePreview] = useState([]);
  const [skillsPreview, setSkillsPreview] = useState([]);
  const [summaryPreview, setSummaryPreview] = useState("");
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }
    if (!hasAttemptedFetch.current) {
      hasAttemptedFetch.current = true;
      fetchResumeData().finally(() => setIsPageLoading(false));
    } else {
      setIsPageLoading(false);
    }
  }, [fetchResumeData, navigate]);

  useEffect(() => {
    if (contextResumeData) {
        const refsFromContext = contextResumeData.references || [];
        // ✅ FIX: ID must be a valid template literal string
        setLocalReferences(refsFromContext.length > 0 ? refsFromContext : [{ ...initialReferenceState, id: `local-${Date.now()}` }]);
        
        setPersonalInfoPreview(contextResumeData.personalInfo || {});
        setEducationPreview(contextResumeData.educationDetails || []);
        setExperiencePreview(contextResumeData.professionalExperience || []);
        setSkillsPreview(contextResumeData.skill || []);
        setSummaryPreview(contextResumeData.summary || "");
    }
  }, [contextResumeData]);

  const handleReferenceChange = (index, field, value) => {
    const newRefs = [...localReferences];
    newRefs[index] = { ...newRefs[index], [field]: value };
    setLocalReferences(newRefs);
  };

  const handleAddReference = () => {
    // ✅ FIX: ID must be a valid template literal string
    setLocalReferences(prev => [...prev, { ...initialReferenceState, id: `local-${Date.now()}` }]);
  };

  const handleRemoveReference = (index) => {
    const newRefs = localReferences.filter((_, i) => i !== index);
    // ✅ FIX: ID must be a valid template literal string
    setLocalReferences(newRefs.length > 0 ? newRefs : [{ ...initialReferenceState, id: `local-${Date.now()}` }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const referencesToSave = localReferences
      .filter(ref => Object.values(ref).some(val => typeof val === 'string' && val.trim() !== ""))
      .map(({ id, ...rest }) => rest);
    
    const promise = saveToDatabase("references", referencesToSave);
    
    toast.promise(promise, {
        loading: 'Saving references...',
        success: () => {
            setTimeout(() => navigate("/cv-builder/preview"), 500);
            return "References saved successfully!";
        },
        error: (err) => {
            console.error("Cv7.jsx: Error saving references:", err);
            return err.message || "Failed to save references.";
        }
    });
  };

  const displayedError = pageError || (contextError ? contextError.message : null);

  if (isPageLoading) return <div className={styles.loading}>Loading References section...</div>;
  if (displayedError) return <div className={styles.error}><p>Error: {displayedError}</p></div>;

  let profileImageSrcForPreview = personalInfoPreview.profilePicture || "/default-profile.png";

  return (
      <div className={styles.resumeBuilder}>
        <main className={styles.content}>
          <div className={styles.formContainer}>
            <h3 className={styles.header}>Professional References</h3>
            <form onSubmit={handleSubmit}>
              {localReferences.slice(-2).map((ref, indexInSlicedArray) => {
                const originalIndex = localReferences.length - localReferences.slice(-2).length + indexInSlicedArray;
                return (
                  // ✅ FIX: The key prop must be a valid string or number. Use a template literal.
                  <div key={ref.id || `ref-${originalIndex}`} className={styles.referenceGroup}>
                    <h4>Reference #{originalIndex + 1}</h4>
                    <input type="text" name="referenceName" placeholder="Full Name of Reference" value={ref.referenceName || ""} onChange={(e) => handleReferenceChange(originalIndex, "referenceName", e.target.value)}/>
                    <input type="text" name="position" placeholder="Their Position/Title" value={ref.position || ""} onChange={(e) => handleReferenceChange(originalIndex, "position", e.target.value)}/>
                    <input type="text" name="company" placeholder="Their Company/Organization" value={ref.company || ""} onChange={(e) => handleReferenceChange(originalIndex, "company", e.target.value)}/>
                    <input type="text" name="contact" placeholder="Contact Info (Email or Phone)" value={ref.contact || ""} onChange={(e) => handleReferenceChange(originalIndex, "contact", e.target.value)}/>
                    {localReferences.length > 1 && (<button type="button" onClick={() => handleRemoveReference(originalIndex)} className={styles.removeBtn}>Remove This Reference</button>)}
                  </div>
                );
              })}
              <div className={styles.formActions}>
                <button type="button" className={styles.addMoreBtn} onClick={handleAddReference}>+ Add Another Reference</button>
                <button type="submit" className={styles.saveBtn} disabled={contextLoading}>{contextLoading ? "Saving..." : "Save & Finish"}</button>
              </div>
            </form>
          </div>
          
          <div className={styles.cvPreview}>
            <div className={styles.cvContainer}>
              <div className={styles.cvLeft}>
                <div className={styles.profileSection}>
                  <img src={profileImageSrcForPreview} alt="Profile" className={styles.profileImage} />
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
                            <span>{edu.fieldOfStudy} - {formatDate(edu.alYear, 'year')}</span>
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
                <div className={styles.profilePara}><h4 className={styles.h4Headers}>Profile</h4><p>{personalInfoPreview.profileParagraph || "Your profile summary"}</p></div>
                <div className={styles.experience}><h4 className={styles.h4Headers}>Professional Experience</h4>
                  {/* ✅ FIX: The key prop must be a valid string. Use a template literal. */}
                  {(experiencePreview || []).map((exp, i) => (<div key={`exp-preview-${i}`} className={styles.experienceItem}><h5>{exp.jobTitle}</h5><p className={styles.companyName}>{exp.companyName}</p><span>{formatDate(exp.jstartDate)} - {formatDate(exp.jendDate)}</span><p className={styles.jobDescription}>{exp.jobDescription}</p></div>))}
                </div>
                <div className={styles.skillsColumns}><h4 className={styles.h4Headers}>Skills</h4>
                  <ul className={styles.skillsDisplayList}>
                    {/* ✅ FIX: The key prop must be a valid string. Use a template literal. */}
                    {(skillsPreview || []).map((s, index) => (<li key={`skill-preview-${index}`} className={styles.skillDisplayItem}><span className={styles.skillNameDisplay}>{s.skillName}</span><div className={styles.skillStarsDisplay}>
                    {/* ✅ FIX: className must use a template literal wrapped in {} */}
                    {[...Array(5)].map((_, i) => (<span key={i} className={`${styles.star} ${i < (Number(s.skillLevel) || 0) ? styles.checked : ""}`}>★</span>))}</div></li>))}
                  </ul>
                </div>
                <div className={styles.summary}><h4 className={styles.h4Headers}>Summary</h4><p>{summaryPreview || "Your summary"}</p></div>
                <div className={styles.referencesPreviewSection}>
                  <h4 className={styles.h4Headers}>References</h4>
                  {localReferences && localReferences.filter(ref => ref.referenceName?.trim()).length > 0 ? (
                    localReferences.filter(ref => ref.referenceName?.trim()).map((ref, idx) => (
                      // ✅ FIX: The key prop must be a valid string. Use a template literal.
                      <div key={ref.id || `ref-preview-${idx}`} className={styles.referenceItemPreview}>
                        <p><strong>{ref.referenceName}</strong></p>
                        {ref.position && <p>{ref.position}{ref.company && ` at ${ref.company}`}</p>}
                        {ref.contact && <p>Contact: {ref.contact}</p>}
                      </div>
                    ))
                  ) : (<p>References will appear here if added.</p>)}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
};

export default Cv7;