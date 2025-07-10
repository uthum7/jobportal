// pages/Cv/Cv.jsx

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cv.module.css";
import { isAuthenticated } from "../../utils/auth";
import { useCVForm } from "../../context/CVFormContext";
import axios from 'axios'; // Import axios for the AI call

const initialFormStateValues = {
    personalInfo: {
      fullname: "", nameWithInitials: "", jobTitle: "", address: "",
      addressOptional: "", email: "", phone: "", profileParagraph: "",
      profilePicture: null,
    },
    educationDetails: {}, skill: [], summary: "",
    professionalExperience: [], references: [],
};

const Cv = () => {
  const navigate = useNavigate();
  const {
    resumeData: contextResumeData,
    saveToDatabase,
    fetchResumeData: contextFetchResumeData,
    loading: contextLoading,
    error: contextError,
    setError: setContextError,
  } = useCVForm();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [pageError, setPageErrorLocal] = useState(null);
  const [localPreviewImgUrl, setLocalPreviewImgUrl] = useState(null);
  const [personalInfo, setPersonalInfo] = useState(initialFormStateValues.personalInfo);
  
  // --- NEW STATE FOR AI FEATURE ---
  const [isAiLoading, setIsAiLoading] = useState(false);

  // States for other section previews
  const [educationPreview, setEducationPreview] = useState(initialFormStateValues.educationDetails);
  const [experiencePreview, setExperiencePreview] = useState(initialFormStateValues.professionalExperience);
  const [skillsPreview, setSkillsPreview] = useState(initialFormStateValues.skill);
  const [summaryPreview, setSummaryPreview] = useState(initialFormStateValues.summary);
  const [referencesPreview, setReferencesPreview] = useState(initialFormStateValues.references);

  const hasAttemptedFetch = useRef(false);
  const lastObjectUrl = useRef(null);

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
        .catch((err) => {
          console.error("Cv.jsx: Critical error from contextFetchResumeData promise:", err);
          setPageErrorLocal(err.message || "Unexpected error loading CV data.");
        })
        .finally(() => {
          setIsPageLoading(false);
        });
    } else {
      setIsPageLoading(false);
    }
  }, [contextFetchResumeData, navigate, setContextError]);

  useEffect(() => {
    if (contextResumeData) {
      const newContextPI = contextResumeData.personalInfo || initialFormStateValues.personalInfo;
      setPersonalInfo(prevLocalPI => {
        if (prevLocalPI.profilePicture instanceof File) {
          return { ...newContextPI, profilePicture: prevLocalPI.profilePicture };
        }
        return { ...prevLocalPI, ...newContextPI };
      });

      setEducationPreview(contextResumeData.educationDetails || initialFormStateValues.educationDetails);
      setExperiencePreview(contextResumeData.professionalExperience || initialFormStateValues.professionalExperience);
      setSkillsPreview(contextResumeData.skill || initialFormStateValues.skill);
      setSummaryPreview(contextResumeData.summary !== undefined ? contextResumeData.summary : initialFormStateValues.summary);
      setReferencesPreview(contextResumeData.references || initialFormStateValues.references);

      if (personalInfo.profilePicture instanceof File) {
        if (lastObjectUrl.current) URL.revokeObjectURL(lastObjectUrl.current);
        const newObjectUrl = URL.createObjectURL(personalInfo.profilePicture);
        setLocalPreviewImgUrl(newObjectUrl);
        lastObjectUrl.current = newObjectUrl;
      } else if (typeof newContextPI.profilePicture === 'string' && newContextPI.profilePicture) {
        if (lastObjectUrl.current) URL.revokeObjectURL(lastObjectUrl.current);
        lastObjectUrl.current = null;
        setLocalPreviewImgUrl(newContextPI.profilePicture);
      } else {
        if (lastObjectUrl.current) URL.revokeObjectURL(lastObjectUrl.current);
        lastObjectUrl.current = null;
        setLocalPreviewImgUrl(null);
      }
    }
    return () => { if (lastObjectUrl.current) URL.revokeObjectURL(lastObjectUrl.current); };
  }, [contextResumeData, personalInfo.profilePicture]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (name === "profilePicture" && type === "file" && files?.[0]) {
      if (lastObjectUrl.current?.startsWith("blob:")) URL.revokeObjectURL(lastObjectUrl.current);
      setPersonalInfo((prev) => ({ ...prev, profilePicture: files[0] }));
    } else {
      setPersonalInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  // --- NEW FUNCTION TO HANDLE AI ENHANCEMENT FOR PROFILE PARAGRAPH ---
  const handleEnhanceProfile = async () => {
    const profileText = personalInfo.profileParagraph;
    if (!profileText || !profileText.trim()) {
      alert("Please write something in your profile before enhancing with AI.");
      return;
    }
    setIsAiLoading(true);
    setPageErrorLocal(null);

    try {
      // We send the text as 'summary' because the backend route expects a 'summary' field.
      // It's generic enough to be used for both profile and summary paragraphs.
      const response = await axios.post(
        "http://localhost:5001/api/ai/enhance-summary",
        { summary: profileText }
      );
      if (response.data && response.data.enhancedSummary) {
        // Update the local state directly
        setPersonalInfo(prev => ({ ...prev, profileParagraph: response.data.enhancedSummary }));
      } else {
        throw new Error("AI response was not in the expected format.");
      }
    } catch (error) {
      const errMsg = error.response?.data?.error || error.message || "AI enhancement failed.";
      console.error("Error enhancing profile:", errMsg);
      setPageErrorLocal(errMsg);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (setContextError) setContextError(null);
    setPageErrorLocal(null);
    try {
      await saveToDatabase("personalInfo", personalInfo);
      alert("Personal details saved successfully!");
      navigate("/cv-builder/education");
    } catch (err) {
      console.error("Cv.jsx: Error during handleSubmit:", err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Present";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short" });
  };

  const displayedError = pageError || (contextError ? (typeof contextError === 'string' ? contextError : contextError.message) : null);

  if (isPageLoading) return <div className={styles.loading}>Loading CV Builder...</div>;
  if (displayedError) return (
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
  
  let cvPreviewImageSrc = localPreviewImgUrl || "/default-profile.png";

  return (
    <>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}><span>R</span><span>e</span><span>s</span><span>u</span><span>m</span><span>e</span> <span>B</span><span>u</span><span>i</span><span>l</span><span>d</span><span>e</span><span>r</span></h1>
        <p className={styles.pageSubtitle}>Create your professional CV in minutes with AI integrations</p>
      </header>
      <div className={styles.resumeBuilder}>
        <main className={styles.content}>
          <div className={styles.formContainer}>
            <h3 className={styles.header}>Step 1: Personal Details</h3>
            <form onSubmit={handleSubmit}>
              <div className={styles.formColumns}>
                <div className={styles.formLeft}>
                  <input type="text" name="fullname" placeholder="Full Name" value={personalInfo.fullname || ""} onChange={handleChange} required />
                  <input type="text" name="nameWithInitials" placeholder="Name with Initials" value={personalInfo.nameWithInitials || ""} onChange={handleChange} />
                  <input type="text" name="jobTitle" placeholder="Job Title" value={personalInfo.jobTitle || ""} onChange={handleChange} required />
                </div>
                <div className={styles.formRight}>
                  <input type="text" name="address" placeholder="Address" value={personalInfo.address || ""} onChange={handleChange} required autoComplete="street-address" />
                  <input type="text" name="addressOptional" placeholder="Address Optional" value={personalInfo.addressOptional || ""} onChange={handleChange} autoComplete="address-line2" />
                  <input type="email" name="email" placeholder="Email" value={personalInfo.email || ""} onChange={handleChange} required autoComplete="email" />
                  <input type="tel" name="phone" placeholder="Phone Number" value={personalInfo.phone || ""} onChange={handleChange} required autoComplete="tel" />
                </div>
              </div>
              
              {/* --- NEW JSX STRUCTURE FOR PROFILE PARAGRAPH WITH AI BUTTON --- */}
              <div className={styles.textareaContainer}>
                <textarea
                  name="profileParagraph"
                  placeholder="Add Your Profile Details (Short Bio)"
                  value={personalInfo.profileParagraph || ""}
                  onChange={handleChange}
                  autoComplete="off"
                  className={styles.profileParagraph}
                  rows={6}
                />
                <button
                  type="button"
                  className={styles.aiButton}
                  onClick={handleEnhanceProfile}
                  disabled={isAiLoading || contextLoading}
                >
                  {isAiLoading ? 'Enhancing...' : 'Enhance with AI'}
                </button>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="profilePictureFile">Profile Picture:</label>
                <input type="file" id="profilePictureFile" name="profilePicture" accept="image/*" onChange={handleChange} />
                {localPreviewImgUrl && localPreviewImgUrl.startsWith("blob:") && <img src={localPreviewImgUrl} alt="Selected Preview" style={{width: "100px", height: "100px", marginTop:"10px", objectFit:"cover"}} />}
              </div>
              <button type="submit" className={styles.saveBtn} disabled={contextLoading || isAiLoading}>
                {contextLoading || isAiLoading ? "Saving..." : "Save"}
              </button>
            </form>
            <div className={styles.instractionSection}>
                <h3>Instructions</h3>
                <ul>
                    <li>Fill in your personal details. <div className={styles.instractionDetail}>Enter your full name, contact information, and address accurately.</div></li>
                    <li>Click "Save & Next" to save your changes and proceed. <div className={styles.instractionDetail}>Make sure to save each section before moving to the next step.</div></li>
                </ul>
            </div>
          </div>

          {/* CV Preview Section */}
          <div className={styles.cvPreview}>
            <div className={styles.cvContainer}>
              <div className={styles.cvLeft}>
                 <div className={styles.profileSection}>
                  <label htmlFor="profilePictureFileTrigger" className={styles.profilePictureLabel}>
                    <img src={cvPreviewImageSrc} alt="Profile" className={styles.profileImage} />
                    <span className={styles.uploadIcon} onClick={() => document.getElementById('profilePictureFile')?.click()} role="button" tabIndex={0}>📷</span>
                  </label>
                  <h3>{personalInfo.jobTitle || "Your Profession"}</h3>
                  <h2>{personalInfo.fullname || "Your Name"}</h2>
                </div>
                <div className={styles.contactInfo}><h4 className={styles.h4Headers}>Contact</h4><p>{personalInfo.phone || "Phone"}</p><p>{personalInfo.email || "Email"}</p><p>{personalInfo.address || "Address"}</p></div>
                <div className={styles.education}><h4 className={styles.h4Headers}>Education</h4>{(educationPreview.universitiyName || educationPreview.schoolName) ? (<div className={styles.educationItem}>{(educationPreview.universitiyName) && (<><h5>{educationPreview.universitiyName || "University Name"}</h5><span>{formatDate(educationPreview.uniStartDate)} - {formatDate(educationPreview.uniEndDate)}</span><p className={styles.uniPara}>{educationPreview.uniMoreDetails || "Degree details"}</p></>)}{(educationPreview.schoolName) && (<><h5>{educationPreview.schoolName || "School Name"}</h5><span>{formatDate(educationPreview.startDate)} - {formatDate(educationPreview.endDate)}</span><p>{educationPreview.moreDetails || "Additional details"}</p></>)}</div>) : ( <p>Education details will appear here.</p> )}</div>
              </div>
              <div className={styles.verticalLine}></div>
              <div className={styles.cvRight}>
                <div className={styles.profilePara}><h4 className={styles.h4Headers}>Profile</h4><p>{personalInfo.profileParagraph || "Your profile summary will appear here."}</p></div>
                <div className={styles.experience}><h4 className={styles.h4Headers}>Professional Experience</h4>{(experiencePreview || []).length > 0 ? (experiencePreview.map((exp, index) => (<div key={index} className={styles.experienceItem}><h5>{exp.jobTitle || "Job Title"}</h5><span>{exp.jstartDate ? formatDate(exp.jstartDate) : "Start Date"} - {exp.jendDate ? formatDate(exp.jendDate) : "End Date"}</span><p>{exp.jobDescription || "Job description"}</p></div>))) : ( <p>Experience details will appear here.</p> )}</div>
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

export default Cv;