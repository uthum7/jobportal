// pages/Cv4/Cv4.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import styles from "./Cv4.module.css";
import { isAuthenticated } from "../../utils/auth";
import { useCVForm } from "../../context/CVFormContext";
import { toast } from 'sonner';

// Helper function to format dates consistently
const formatDateForDisplay = (dateStr, formatType = 'date') => {
    if (!dateStr) return "Present";
    if (formatType === 'year') return dateStr;
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return "Invalid Date";
        return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
    } catch {
        return "Invalid Date";
    }
};

const Cv4 = () => {
  const navigate = useNavigate();
  const {
    resumeData: contextResumeData,
    fetchResumeData: contextFetchResumeData,
    saveToDatabase,
    loading: contextLoading,
    error: contextErrorGlobal,
  } = useCVForm();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [pageError, setPageErrorLocal] = useState(null);
  const [summary, setSummary] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      contextFetchResumeData().finally(() => setIsPageLoading(false));
    } else {
      setIsPageLoading(false);
    }
  }, [contextFetchResumeData, navigate]);

  useEffect(() => {
    if (contextResumeData && contextResumeData.summary !== undefined) {
      setSummary(contextResumeData.summary);
    }
  }, [contextResumeData]);

  const handleSummaryChange = (e) => setSummary(e.target.value);

  const enhanceSummaryWithAI = async () => {
    if (!summary.trim()) {
        toast.warning("Please write some summary text before using AI enhancement.");
        return;
    }
    setIsAiLoading(true);
    try {
      const response = await axios.post("http://localhost:5001/api/ai/enhance-summary", { summary });
      if (response.data?.enhancedSummary) {
        setSummary(response.data.enhancedSummary);
        toast.success("Summary enhanced with AI!");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "AI enhancement failed.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmitSummary = async (e) => {
    e.preventDefault();
    if (!summary.trim()) {
      toast.error("Summary cannot be empty.");
      return;
    }
    
    const promise = saveToDatabase("summary", summary.trim());

    toast.promise(promise, {
        loading: 'Saving summary...',
        success: () => {
            setTimeout(() => navigate("/cv-builder/references"), 500);
            return "Summary saved successfully!";
        },
        error: (err) => {
            console.error("Cv4.jsx: Error during handleSubmitSummary:", err);
            return err.message || "Failed to save summary.";
        }
    });
  };
  
  const displayedError = pageError || (contextErrorGlobal ? (typeof contextErrorGlobal === 'string' ? contextErrorGlobal : contextErrorGlobal.message) : null);

  const {
    personalInfo: pi = {},
    educationDetails: ed = [],
    professionalExperience: pe = [],
    skill: sk = [],
    references: refs = [],
  } = contextResumeData || {};

  let profileImageSrcForPreview = pi.profilePicture || "/default-profile.png";

  if (isPageLoading) return <div className={styles.loading}>Loading Summary Section...</div>;
  if (displayedError) return <div className={styles.error}><p>Error: {displayedError}</p></div>;

  return (
      <div className={styles.resumeBuilder}>
        <main className={styles.content}>
          <div className={styles.formContainer}>
            <h3 className={styles.header}>Professional Summary</h3>
            <form onSubmit={handleSubmitSummary}>
              <div className={styles.formGroup}>
                <label htmlFor="summary" className={styles.label}>Your Summary:</label>
                <div className={styles.textareaContainer}>
                  <textarea id="summary" name="summary" value={summary} onChange={handleSummaryChange} placeholder="Write a brief overview of your career, skills, and goals..." rows={10} className={styles.textareaField}></textarea>
                  <button type="button" onClick={enhanceSummaryWithAI} disabled={isAiLoading || contextLoading} className={styles.aiButton}>
                    {isAiLoading ? "Enhancing..." : "Enhance with AI"}
                  </button>
                </div>
              </div>
              <button type="submit" className={styles.saveBtn} disabled={contextLoading || isAiLoading}>
                {contextLoading ? "Saving..." : "Save & Next"}
              </button>
            </form>
            <div className={styles.instractionSection}>
              <h3>Instructions</h3>
              <ul>
                <li>Write a compelling summary (2-4 sentences).</li>
                <li>Highlight relevant skills, experiences, and goals.</li>
                <li>Use the "Enhance with AI" for suggestions.</li>
              </ul>
            </div>
          </div>

          <div className={styles.cvPreview}>
            <div className={styles.cvContainer}>
              <div className={styles.cvLeft}>
                <div className={styles.profileSection}>
                  <img src={profileImageSrcForPreview} alt="Profile" className={styles.profileImage}/>
                  <h2>{pi.fullname || "Your Name"}</h2>
                </div>
                <div className={styles.contactInfo}><h4 className={styles.h4Headers}>Contact</h4><p>{pi.phone || "Phone"}</p><p>{pi.email || "Email"}</p><p>{pi.address || "Address"}</p></div>
                
                <div className={styles.education}>
                    <h4 className={styles.h4Headers}>Education</h4>
                    {Array.isArray(ed) && ed.length > 0 ? (
                    ed.map((edu, index) => (
                        edu.institute && (
                        <div key={index} className={styles.educationItem}>
                            <h5>{edu.institute}</h5>
                            {edu.educationLevel === 'A/L' ? (
                            <span>{edu.fieldOfStudy} - {formatDateForDisplay(edu.alYear, 'year')}</span>
                            ) : (
                            <>
                                <span>{formatDateForDisplay(edu.startDate)} - {edu.currentlyStudying ? 'Present' : formatDateForDisplay(edu.endDate)}</span>
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
                <div className={styles.profilePara}><h4 className={styles.h4Headers}>Profile</h4><p>{pi.profileParagraph || "Your profile summary..."}</p></div>
                <div className={styles.experience}><h4 className={styles.h4Headers}>Professional Experience</h4>
                  {/* ✅ FIX: The key prop must be a valid string. Use a template literal. */}
                  {(pe || []).length > 0 ? (pe.map((exp, i) => (<div key={`exp-preview-${i}`} className={styles.experienceItem}><h5>{exp.jobTitle}</h5><p className={styles.companyName}>{exp.companyName}</p><span>{formatDateForDisplay(exp.jstartDate)} - {formatDateForDisplay(exp.jendDate)}</span><p className={styles.jobDescription}>{exp.jobDescription}</p></div>))) : ( <p>Experience details will appear here.</p> )}
                </div>
                <div className={styles.skillsColumns}><h4 className={styles.h4Headers}>Skills</h4>
                  <ul className={styles.skillsDisplayList}>
                    {/* ✅ FIX: The key prop must be a valid string. Use a template literal. */}
                    {(sk || []).length > 0 ? (sk.map((s, index) => (<li key={`skill-preview-${index}`} className={styles.skillDisplayItem}><span className={styles.skillNameDisplay}>{s.skillName}</span><div className={styles.skillStarsDisplay}>
                    {/* ✅ FIX: className must use a template literal wrapped in {} */}
                    {[...Array(5)].map((_, i) => (<span key={i} className={`${styles.star} ${i < (Number(s.skillLevel) || 0) ? styles.checked : ""}`}>★</span>))}</div></li>))) : ( <li>Skills list will appear here.</li> )}
                  </ul>
                </div>
                <div className={styles.summary}><h4 className={styles.h4Headers}>Summary</h4>
                  <p>{summary || "Your professional summary will appear here as you type."}</p>
                </div>
                <div className={styles.references}><h4 className={styles.h4Headers}>References</h4>
                  {/* ✅ FIX: The key prop must be a valid string. Use a template literal. */}
                  {(refs || []).length > 0 ? (refs.map((ref, index) => (<p key={`ref-preview-${index}`}>{ref.referenceName} - {ref.position} at {ref.company} - {ref.contact}</p>))) : ( <p>References will appear here.</p> )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
};

export default Cv4;