// pages/Cv7/Cv7.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cv7.module.css";
import { useCVForm } from "../../context/CVFormContext";
import { getUserId, isAuthenticated } from "../../utils/auth";

// Default structure for an empty reference, matching context if possible
const initialReferenceState = { referenceName: "", position: "", company: "", contact: "" };

// Default structure for preview sections if context data is not yet available
const initialPreviewDataFallback = {
  personalInfo: { fullname: "Your Name", jobTitle: "Your Profession", profilePicture: "/default-profile.png", phone: "Phone", email: "Email", address: "Address", profileParagraph: "Profile summary..." },
  educationDetails: { universitiyName: "", schoolName: "" },
  professionalExperience: [],
  skill: [],
  summary: "Summary...",
};


const Cv7 = () => {
  const navigate = useNavigate();
  const {
    resumeData: contextResumeData,
    fetchResumeData,
    // updateReference, // We'll use local state and save all at once
    // addReference,    // We'll use local state
    // removeReference, // We'll use local state
    saveToDatabase,
    loading: contextLoading,
    error: contextError,
    setError: setContextError,
  } = useCVForm();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [pageError, setPageErrorLocal] = useState(null);

  // Local state for managing the references form
  const [localReferences, setLocalReferences] = useState([]);

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

      console.log("Cv7.jsx: Attempting initial fetch via contextFetchResumeData...");
      fetchResumeData()
        .then((fetchResult) => {
          console.log("Cv7.jsx: contextFetchResumeData promise resolved. Result:", fetchResult);
          if (fetchResult && fetchResult.error && !(fetchResult.noDataFound)) {
            setPageErrorLocal(fetchResult.error);
          } else if (fetchResult && fetchResult.noDataFound) {
            console.log("Cv7.jsx: No existing CV data (new user or empty references).");
            // Context resets resumeData, which will trigger the sync effect below.
          }
        })
        .catch((err) => {
          console.error("Cv7.jsx: Critical error from contextFetchResumeData promise:", err);
          setPageErrorLocal(err.message || "Unexpected error loading data.");
        })
        .finally(() => {
          setIsPageLoading(false);
        });
    } else {
      setIsPageLoading(false);
    }
  }, [fetchResumeData, navigate, setContextError]);

  // Effect to synchronize localReferences with contextResumeData.references
  useEffect(() => {
    if (contextResumeData) {
      const refsFromContext = contextResumeData.references || [];
      console.log("Cv7.jsx: Syncing localReferences from context. Context refs:", refsFromContext);
      // Create new array with new objects to avoid direct mutation issues
      const newLocalRefs = refsFromContext.map(ref => ({ ...ref, id: ref._id || `local-${Math.random().toString(36).substr(2, 9)}` }));

      if (newLocalRefs.length === 0 && !isPageLoading && !contextLoading) {
        // If context has no references and we are not loading, add one blank entry for user to start
        setLocalReferences([{ ...initialReferenceState, id: `local-${Date.now()}` }]);
      } else {
        setLocalReferences(newLocalRefs);
      }
    } else {
      // If contextResumeData is null (e.g., during initial load before fetch completes)
      // initialize with one empty reference if not loading.
      if (localReferences.length === 0 && !isPageLoading && !contextLoading) {
        setLocalReferences([{ ...initialReferenceState, id: `local-${Date.now()}` }]);
      }
    }
  }, [contextResumeData?.references, isPageLoading, contextLoading]);


  const handleReferenceChange = (index, field, value) => {
    setLocalReferences(prevRefs => {
      const newRefs = [...prevRefs];
      newRefs[index] = { ...newRefs[index], [field]: value };
      return newRefs;
    });
  };

  const handleAddReference = () => {
    setLocalReferences(prevRefs => [...prevRefs, { ...initialReferenceState, id: `local-${Date.now()}` }]);
  };

  const handleRemoveReference = (index) => {
    setLocalReferences(prevRefs => prevRefs.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!localReferences || localReferences.length === 0) {
      return true; // No references is acceptable
    }
    for (const ref of localReferences) {
      // Only validate non-empty entries. If all fields are blank, it's like an empty slot.
      const isEntryAttempted = Object.values(ref).some(val => typeof val === 'string' && val.trim() !== "");
      if (isEntryAttempted && (!ref.referenceName || !ref.referenceName.trim() || !ref.contact || !ref.contact.trim())) {
        const msg = "Each reference entry must have at least a name and contact information.";
        setPageErrorLocal(msg);
        alert(msg);
        return false;
      }
    }
    setPageErrorLocal(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (setContextError) setContextError(null);
    setPageErrorLocal(null);

    // Filter out completely empty reference objects and remove temporary local 'id'
    const referencesToSave = localReferences
      .filter(ref => Object.values(ref).some(val => typeof val === 'string' && val.trim() !== ""))
      .map(({ id, ...rest }) => rest); // Remove local 'id' before saving

    try {
      console.log("Cv7.jsx: Submitting references:", referencesToSave);
      await saveToDatabase("references", referencesToSave);
      alert("References saved successfully!");
      navigate("/cv-builder/preview"); // Navigate to the final preview page (Cv5.jsx)
    } catch (error) {
      console.error("Error saving references in Cv7.jsx handleSubmit:", error);
      // contextError is set by saveToDatabase. pageErrorLocal can also be set if needed.
      // setPageErrorLocal(error.message || "Failed to save references.");
    }
  };

    // --- CORRECTED AND COMPLETE formatDate FUNCTION ---
  const formatDate = (dateString) => {
    // If the date string is empty or null, return "Present" or an empty string
    if (!dateString) {
      return "Present"; // Or you can return an empty string: return "";
    }
    try {
      // Create a date object from the string
      const date = new Date(dateString);
      // Check if the date is valid. An invalid date's getTime() is NaN.
      if (isNaN(date.getTime())) {
        return "Invalid Date"; // Or return an empty string
      }
      // If valid, format it to "Month Year" (e.g., "Jan 2024")
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      });
    } catch (error) {
      // If any other error occurs during parsing
      console.error("Error formatting date:", dateString, error);
      return "Invalid Date";
    }
  };
  // --- END OF CORRECTION ---

  const displayedError = pageError || (contextError ? (typeof contextError === 'string' ? contextError : contextError.message) : null);

  const {
    personalInfo: pi = initialPreviewDataFallback.personalInfo,
    educationDetails: ed = initialPreviewDataFallback.educationDetails,
    professionalExperience: pe = initialPreviewDataFallback.professionalExperience,
    skill: sk = initialPreviewDataFallback.skill,
    summary: sm = initialPreviewDataFallback.summary,
  } = contextResumeData || initialPreviewDataFallback;

  let profileImageSrcForPreview = pi.profilePicture && typeof pi.profilePicture === 'string'
    ? pi.profilePicture
    : initialPreviewDataFallback.personalInfo.profilePicture;


  if (isPageLoading) {
    return <div className={styles.loading}>Loading References section...</div>;
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
            hasAttemptedFetch.current = false; // Allow re-fetch
            setIsPageLoading(true);
            fetchResumeData().finally(() => setIsPageLoading(false));
          }
        }}>
          {displayedError.toLowerCase().includes("auth") || displayedError.toLowerCase().includes("login") || displayedError.toLowerCase().includes("user id") || displayedError.toLowerCase().includes("token") ? "Go to Login" : "Try Again"}
        </button>
      </div>
    );
  }

  return (
    <>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}><span>R</span><span>e</span><span>s</span><span>u</span><span>m</span><span>e</span> <span>B</span><span>u</span><span>i</span><span>l</span><span>d</span><span>e</span><span>r</span></h1>
        <p className={styles.pageSubtitle}>Step 6: Add Your Professional References (Optional)</p>
      </header>

      <div className={styles.resumeBuilder}>
        <main className={styles.content}>
          <div className={styles.formContainer}>
            <h3 className={styles.header}>Professional References</h3>
            <form onSubmit={handleSubmit}>
              {localReferences.slice(-2).map((ref, indexInSlicedArray) => {
                // We calculate the original index in the full 'localReferences' array.
                const originalIndex = localReferences.length - localReferences.slice(-2).length + indexInSlicedArray;

                return (
                  <div key={ref.id || `ref-${originalIndex}`} className={styles.referenceGroup}>
                    <h4>Reference #{originalIndex + 1}</h4>
                    <input
                      type="text" name="referenceName" placeholder="Full Name of Reference"
                      value={ref.referenceName || ""}
                      onChange={(e) => handleReferenceChange(originalIndex, "referenceName", e.target.value)}
                    />
                    <input
                      type="text" name="position" placeholder="Their Position/Title"
                      value={ref.position || ""}
                      onChange={(e) => handleReferenceChange(originalIndex, "position", e.target.value)}
                    />
                    <input
                      type="text" name="company" placeholder="Their Company/Organization"
                      value={ref.company || ""}
                      onChange={(e) => handleReferenceChange(originalIndex, "company", e.target.value)}
                    />
                    <input
                      type="text" name="contact" placeholder="Contact Info (Email or Phone)"
                      value={ref.contact || ""}
                      onChange={(e) => handleReferenceChange(originalIndex, "contact", e.target.value)}
                    />
                    {localReferences.length > 1 && (
                      <button type="button" onClick={() => handleRemoveReference(originalIndex)} className={styles.removeBtn}>
                        Remove
                      </button>
                    )}
                  </div>
                );
              })}

              <div className={styles.formActions}>
                <button type="button" className={styles.addMoreBtn} onClick={handleAddReference} >
                  AddMore
                </button>
                <button type="submit" className={styles.saveBtn} disabled={contextLoading} >
                  {contextLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>

            <div className={styles.instractionSection}>
              <h3>Instructions</h3>
              <ul>
                <li>Add professional references who can speak to your skills and work ethic.</li>
                <li>Ensure you have their permission before listing them. Providing references is optional.</li>
                <li>Click "Save" to save and proceed to the final resume preview.</li>
              </ul>
            </div>
          </div>

          {/* CV Preview Section */}
          <div className={styles.cvPreview}>
            <div className={styles.cvContainer}>
              <div className={styles.cvLeft}>
                <div className={styles.profileSection}>
                  <img src={profileImageSrcForPreview} alt="Profile" className={styles.profileImage} onError={(e) => { e.target.onerror = null; e.target.src = initialPreviewDataFallback.personalInfo.profilePicture; }} />
                  <h3>{pi.jobTitle}</h3>
                  <h2>{pi.fullname}</h2>
                </div>
                <div className={styles.contactInfo}><h4 className={styles.h4Headers}>Contact</h4><p>{pi.phone}</p><p>{pi.email}</p><p>{pi.address}</p></div>
                <div className={styles.education}><h4 className={styles.h4Headers}>Education</h4>
                  {(ed.universitiyName || ed.schoolName) ? (<div className={styles.educationItem}>
                    {ed.universitiyName && (<><h5>{ed.universitiyName}</h5><span>{formatDate(ed.uniStartDate)} - {formatDate(ed.uniEndDate)}</span><p className={styles.uniPara}>{ed.uniMoreDetails}</p></>)}
                    {ed.schoolName && (<><h5>{ed.schoolName}</h5><span>{formatDate(ed.startDate)} - {formatDate(ed.endDate)}</span><p>{ed.moreDetails}</p></>)}
                  </div>) : (<p>Education details.</p>)}
                </div>
              </div>
              <div className={styles.verticalLine}></div>
              <div className={styles.cvRight}>
                <div className={styles.profilePara}><h4 className={styles.h4Headers}>Profile</h4><p>{pi.profileParagraph}</p></div>
                <div className={styles.experience}><h4 className={styles.h4Headers}>Professional Experience</h4>
                  {(pe).length > 0 ? (pe.map((exp, i) => (<div key={`exp-preview-${i}`} className={styles.experienceItem}><h5>{exp.jobTitle}</h5><p className={styles.companyName}>{exp.companyName}</p><span>{formatDate(exp.jstartDate)} - {formatDate(exp.jendDate)}</span><p className={styles.jobDescription}>{exp.jobDescription}</p></div>))) : (<p>Experience details.</p>)}
                </div>
                <div className={styles.skillsColumns}><h4 className={styles.h4Headers}>Skills</h4>
                  <ul className={styles.skillsDisplayList}>
                    {(sk).length > 0 ? (sk.map((s, index) => (<li key={`skill-preview-${index}`} className={styles.skillDisplayItem}><span className={styles.skillNameDisplay}>{s.skillName}</span><div className={styles.skillStarsDisplay}>{[...Array(5)].map((_, i) => (<span key={i} className={`${styles.star} ${i < (Number(s.skillLevel) || 0) ? styles.checked : ""}`}>★</span>))}</div></li>))) : (<li>Skills list.</li>)}
                  </ul>
                </div>
                <div className={styles.summary}><h4 className={styles.h4Headers}>Summary</h4><p>{sm}</p></div>
                <div className={styles.referencesPreviewSection}> {/* Changed class name for clarity */}
                  <h4 className={styles.h4Headers}>References</h4>
                  {/* Previewing references from `localReferences` for live update */}
                  {localReferences && localReferences.filter(ref => ref.referenceName && ref.referenceName.trim()).length > 0 ? (
                    localReferences.filter(ref => ref.referenceName && ref.referenceName.trim()).map((ref, idx) => (
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
    </>
  );
};

export default Cv7;