// pages/Cv4/Cv4.jsx

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import styles from "./Cv4.module.css";
import { isAuthenticated } from "../../utils/auth";
import { useCVForm } from "../../context/CVFormContext";
import { toast } from 'sonner';

const initialPreviewStates = {
    personalInfo: { fullname: "Your Name", jobTitle: "Your Profession", profilePicture: "/default-profile.png", phone: "Phone", email: "Email", address: "Address", profileParagraph: "Your profile summary..." },
    educationDetails: { universitiyName: "University Name", schoolName: "School Name", uniStartDate: "", uniEndDate: "", uniMoreDetails: "Degree details", startDate: "", endDate: "", moreDetails: "School details" },
    professionalExperience: [],
    skill: [],
    references: [],
};

const Cv4 = () => {
  const navigate = useNavigate();
  const {
    resumeData: contextResumeData,
    fetchResumeData: contextFetchResumeData,
    saveToDatabase,
    loading: contextLoading,
    error: contextErrorGlobal,
    setError: setContextErrorGlobal,
  } = useCVForm();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [pageError, setPageErrorLocal] = useState(null);
  const [summary, setSummary] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      setPageErrorLocal("User not authenticated. Redirecting to login...");
      setIsPageLoading(false);
      navigate("/login", { replace: true });
      return;
    }

    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      setIsPageLoading(true);
      setPageErrorLocal(null);
      if (setContextErrorGlobal) setContextErrorGlobal(null);

      contextFetchResumeData()
        .catch((err) => {
          console.error("Cv4.jsx: Uncaught error from contextFetchResumeData:", err);
          setPageErrorLocal(err.message || "Failed to load CV data.");
        })
        .finally(() => {
          setIsPageLoading(false);
        });
    } else {
      setIsPageLoading(false);
    }
  }, [contextFetchResumeData, navigate, setContextErrorGlobal]);

  useEffect(() => {
    if (contextResumeData && contextResumeData.summary !== undefined) {
      setSummary(contextResumeData.summary);
    } else if (contextResumeData && contextResumeData.summary === undefined) {
      setSummary("");
    }
  }, [contextResumeData]);

  const handleSummaryChange = (e) => {
    setSummary(e.target.value);
  };

  const validateForm = () => {
    if (!summary || summary.trim() === "") {
      const msg = "Summary cannot be empty.";
      setPageErrorLocal(msg);
      alert(msg);
      return false;
    }
    setPageErrorLocal(null);
    return true;
  };
  
  const enhanceSummaryWithAI = async () => {
    if (!summary.trim()) {
        alert("Please write some summary text before using AI enhancement.");
        return;
    }
    setIsAiLoading(true);
    setPageErrorLocal(null);
    if (setContextErrorGlobal) setContextErrorGlobal(null);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/ai/enhance-summary",
        { summary: summary }
      );

      if (response.data && response.data.enhancedSummary) {
        setSummary(response.data.enhancedSummary);
      } else {
        throw new Error("AI enhancement response was not in the expected format.");
      }
    } catch (error) {
      const errMsg = error.response?.data?.error || error.message || "AI summary enhancement failed.";
      console.error("Error enhancing summary with AI:", errMsg, error);
      setPageErrorLocal(errMsg);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmitSummary = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setPageErrorLocal(null);
    if (setContextErrorGlobal) setContextErrorGlobal(null);

    try {
      await saveToDatabase("summary", summary.trim());
      // alert("Summary saved successfully!");
      navigate("/cv-builder/references");
    } catch (err) {
      console.error("Cv4.jsx: Error during handleSubmitSummary:", err);
    }
  };
  
  const formatDateForDisplay = useCallback((dateStr) => {
    if (!dateStr) return "Present";
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return "Invalid Date";
        return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
    } catch {
        return "Invalid Date";
    }
  }, []);

  const displayedError = pageError || (contextErrorGlobal ? (typeof contextErrorGlobal === 'string' ? contextErrorGlobal : contextErrorGlobal.message) : null);

  const {
    personalInfo: pi = initialPreviewStates.personalInfo,
    educationDetails: ed = initialPreviewStates.educationDetails,
    professionalExperience: pe = initialPreviewStates.professionalExperience,
    skill: sk = initialPreviewStates.skill,
    references: refs = initialPreviewStates.references,
  } = contextResumeData || initialPreviewStates;

  let profileImageSrcForPreview = typeof pi.profilePicture === 'string'
    ? pi.profilePicture
    : (pi.profilePicture instanceof File ? URL.createObjectURL(pi.profilePicture) : initialPreviewStates.personalInfo.profilePicture);

  if (isPageLoading) {
    return <div className={styles.loading}>Loading Summary Section...</div>;
  }

  return (
    <>
      {/* <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}><span>R</span><span>e</span><span>s</span><span>u</span><span>m</span><span>e</span> <span>B</span><span>u</span><span>i</span><span>l</span><span>d</span><span>e</span><span>r</span></h1>
        <p className={styles.pageSubtitle}>Step 5: Craft Your Professional Summary</p>
      </header> */}
      
      <div className={styles.resumeBuilder}>
        <main className={styles.content}>
          <div className={styles.formContainer}>
            <h3 className={styles.header}>Professional Summary</h3>
            {displayedError && <div className={styles.errorMessageActive}>{displayedError}</div>}
            
            <form onSubmit={handleSubmitSummary}>
              <div className={styles.formGroup}>
                <label htmlFor="summary" className={styles.label}>Your Summary:</label>
                <div className={styles.textareaContainer}>
                  <textarea
                    id="summary"
                    name="summary"
                    value={summary}
                    onChange={handleSummaryChange}
                    placeholder="Write a brief overview of your career, highlighting key skills, experiences, and goals..."
                    rows={10}
                    className={styles.textareaField}
                  ></textarea>
                  <button
                    type="button"
                    onClick={enhanceSummaryWithAI}
                    disabled={isAiLoading || contextLoading}
                    className={styles.aiButton}
                  >
                    {isAiLoading ? "Enhancing..." : "Enhance with AI"}
                  </button>
                </div>
              </div>
              <button type="submit" className={styles.saveBtn} disabled={contextLoading || isAiLoading}>
                {contextLoading ? "Saving..." : "Save"}
              </button>
            </form>

            <div className={styles.instractionSection}>
              <h3>Instructions</h3>
              <ul>
                <li>Write a compelling summary (2-4 sentences) that captures your professional essence.</li>
                <li>Highlight your most relevant skills, years of experience, and career achievements or goals.</li>
                <li>Tailor this summary to the types of roles you are targeting.</li>
                <li>Use the "Enhance with AI" button for suggestions, but always review and personalize the output.</li>
              </ul>
            </div>
          </div>

          {/* CV Preview Section */}
          <div className={styles.cvPreview}>
            <div className={styles.cvContainer}>
              <div className={styles.cvLeft}>
                <div className={styles.profileSection}>
                  <img 
                    src={profileImageSrcForPreview} 
                    alt="Profile" 
                    className={styles.profileImage} 
                    onError={(e) => { e.target.onerror = null; e.target.src = initialPreviewStates.personalInfo.profilePicture; }}
                  />
                  <h3>{pi.jobTitle || initialPreviewStates.personalInfo.jobTitle}</h3>
                  <h2>{pi.fullname || initialPreviewStates.personalInfo.fullname}</h2>
                </div>
                <div className={styles.contactInfo}><h4 className={styles.h4Headers}>Contact</h4><p>{pi.phone || "Phone"}</p><p>{pi.email || "Email"}</p><p>{pi.address || "Address"}</p></div>
                <div className={styles.education}><h4 className={styles.h4Headers}>Education</h4>
                  {/* --- FIX: Corrected a typo from className. to className={} --- */}
                  {(ed.universitiyName || ed.schoolName) ? (<div className={styles.educationItem}>
                    {ed.universitiyName && (<><h5>{ed.universitiyName}</h5><span>{formatDateForDisplay(ed.uniStartDate)} - {formatDateForDisplay(ed.uniEndDate)}</span><p className={styles.uniPara}>{ed.uniMoreDetails}</p></>)}
                    {ed.schoolName && (<><h5>{ed.schoolName}</h5><span>{formatDateForDisplay(ed.startDate)} - {formatDateForDisplay(ed.endDate)}</span><p>{ed.moreDetails}</p></>)}
                  </div>) : ( <p>Education details.</p> )}
                </div>
              </div>
              <div className={styles.verticalLine}></div>
              <div className={styles.cvRight}>
                <div className={styles.profilePara}><h4 className={styles.h4Headers}>Profile</h4><p>{pi.profileParagraph || initialPreviewStates.personalInfo.profileParagraph}</p></div>
                <div className={styles.experience}><h4 className={styles.h4Headers}>Professional Experience</h4>
                  {(pe || []).length > 0 ? (pe.map((exp, i) => (
                    <div key={`exp-preview-${i}`} className={styles.experienceItem}>
                      <h5>{exp.jobTitle}</h5><p className={styles.companyName}>{exp.companyName}</p>
                      <span>{formatDateForDisplay(exp.jstartDate)} - {formatDateForDisplay(exp.jendDate)}</span>
                      <p className={styles.jobDescription}>{exp.jobDescription}</p>
                    </div>))
                  ) : ( <p>Experience details.</p> )}
                </div>
                <div className={styles.skillsColumns}><h4 className={styles.h4Headers}>Skills</h4>
                  <ul className={styles.skillsDisplayList}>
                    {(sk || []).length > 0 ? (sk.map((s, index) => (
                      <li key={`skill-preview-${index}`} className={styles.skillDisplayItem}>
                        <span className={styles.skillNameDisplay}>{s.skillName}</span>
                        <div className={styles.skillStarsDisplay}>
                          {[...Array(5)].map((_, i) => (<span key={i} className={`${styles.star} ${i < (Number(s.skillLevel) || 0) ? styles.checked : ""}`}>★</span>))}
                        </div>
                      </li>))) : ( <li>Skills list.</li> )}
                  </ul>
                </div>
                <div className={styles.summary}><h4 className={styles.h4Headers}>Summary</h4>
                  <p>{summary || "Your professional summary will appear here as you type."}</p>
                </div>
                <div className={styles.references}><h4 className={styles.h4Headers}>References</h4>
                  {(refs || []).length > 0 ? (refs.map((ref, index) => (
                    <p key={`ref-preview-${index}`}>{ref.referenceName} - {ref.position} at {ref.company} - {ref.contact}</p>))
                  ) : ( <p>References list.</p> )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Cv4;