// pages/Cv/Cv.jsx

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cv.module.css";
import { isAuthenticated } from "../../utils/auth";
import { useCVForm } from "../../context/CVFormContext";
import axios from 'axios';
import { toast } from 'sonner';

// educationDetails is now an array
const initialFormStateValues = {
    personalInfo: {
      fullname: "", nameWithInitials: "", gender: "", birthday: "", address: "",
      email: "", phone: "", profileParagraph: "",
      profilePicture: null,
    },
    educationDetails: [],
    skill: [],
    summary: "",
    professionalExperience: [],
    references: [],
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

const Cv = () => {
  const navigate = useNavigate();
  const {
    resumeData: contextResumeData,
    saveToDatabase,
    fetchResumeData: contextFetchResumeData,
    loading: contextLoading,
    error: contextError,
  } = useCVForm();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [pageError, setPageErrorLocal] = useState(null);
  const [localPreviewImgUrl, setLocalPreviewImgUrl] = useState(null);
  const [personalInfo, setPersonalInfo] = useState(initialFormStateValues.personalInfo);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Preview states initialized correctly
  const [educationPreview, setEducationPreview] = useState([]);
  const [experiencePreview, setExperiencePreview] = useState([]);
  const [skillsPreview, setSkillsPreview] = useState([]);
  const [summaryPreview, setSummaryPreview] = useState("");
  const [referencesPreview, setReferencesPreview] = useState([]);

  const hasAttemptedFetch = useRef(false);
  const lastObjectUrl = useRef(null);

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
      const newContextPI = contextResumeData.personalInfo || initialFormStateValues.personalInfo;
      if (newContextPI.birthday) {
        newContextPI.birthday = new Date(newContextPI.birthday).toISOString().split('T')[0];
      }
      setPersonalInfo(prev => ({ ...prev, ...newContextPI }));
      
      setEducationPreview(contextResumeData.educationDetails || []);
      setExperiencePreview(contextResumeData.professionalExperience || []);
      setSkillsPreview(contextResumeData.skill || []);
      setSummaryPreview(contextResumeData.summary || "");
      setReferencesPreview(contextResumeData.references || []);

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

  const handleEnhanceProfile = async () => {
    const profileText = personalInfo.profileParagraph;
    if (!profileText || !profileText.trim()) {
      toast.warning("Please write something in your profile before enhancing with AI.");
      return;
    }
    setIsAiLoading(true);
    try {
      const response = await axios.post("http://localhost:5001/api/ai/enhance-summary", { summary: profileText });
      if (response.data && response.data.enhancedSummary) {
        setPersonalInfo(prev => ({ ...prev, profileParagraph: response.data.enhancedSummary }));
        toast.success("Profile enhanced with AI!");
      } else { throw new Error("AI response was not in the expected format."); }
    } catch (error) {
      const errMsg = error.response?.data?.error || error.message || "AI enhancement failed.";
      toast.error(errMsg);
      setPageErrorLocal(errMsg);
    } finally {
      setIsAiLoading(false);
    }
  };

  // ===============================================
  // ===        UPDATED SUBMIT FUNCTION        ===
  // ===============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const promise = saveToDatabase("personalInfo", personalInfo);

    toast.promise(promise, {
      loading: 'Saving personal details...',
      success: () => {
        setTimeout(() => navigate("/cv-builder/education"), 500); // Navigate AFTER success
        return "Personal details saved successfully!";
      },
      error: (err) => {
        console.error("Cv.jsx: Error during handleSubmit:", err);
        return err.message || "Failed to save details.";
      },
    });
  };

  const displayedError = pageError || (contextError ? (typeof contextError === 'string' ? contextError : contextError.message) : null);

  if (isPageLoading) return <div className={styles.loading}>Loading CV Builder...</div>;
  if (displayedError) return (
    <div className={styles.error}>
      <p>Error: {displayedError}</p>
      <button onClick={() => window.location.reload()}>Try Again</button>
    </div>
  );
  
  let cvPreviewImageSrc = localPreviewImgUrl || "/default-profile.png";

  return (
    <div className={styles.resumeBuilder}>
      <main className={styles.content}>
        <div className={styles.formContainer}>
            <h3 className={styles.header}>Step 1: Personal Details</h3>
            <form onSubmit={handleSubmit}>
              <div className={styles.formColumns}>
                <div className={styles.formLeft}>
                  <input type="text" name="fullname" placeholder="Full Name" value={personalInfo.fullname || ""} onChange={handleChange} required />
                  <input type="text" name="nameWithInitials" placeholder="Name with Initials" value={personalInfo.nameWithInitials || ""} onChange={handleChange} />
                  <select name="gender" value={personalInfo.gender || ""} onChange={handleChange} required>
                    <option value="" disabled>Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className={styles.formRight}>
                   <input type="text" name="address" placeholder="Address" value={personalInfo.address || ""} onChange={handleChange} required autoComplete="street-address" />
                   <input type="date" name="birthday" value={personalInfo.birthday || ""} onChange={handleChange} required data-placeholder="Birthday" />
                    <input type="email" name="email" placeholder="Email" value={personalInfo.email || ""} onChange={handleChange} required autoComplete="email" />
                    <input type="tel" name="phone" placeholder="Phone Number" value={personalInfo.phone || ""} onChange={handleChange} required autoComplete="tel" />
                </div>
              </div>
              <div className={styles.textareaContainer}>
                <textarea name="profileParagraph" placeholder="Add Your Profile Details (Short Bio)" value={personalInfo.profileParagraph || ""} onChange={handleChange} autoComplete="off" className={styles.profileParagraph} rows={6} />
                <button type="button" className={styles.aiButton} onClick={handleEnhanceProfile} disabled={isAiLoading || contextLoading}>
                  {isAiLoading ? 'Enhancing...' : 'Enhance with AI'}
                </button>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="profilePictureFile">Profile Picture:</label>
                <input type="file" id="profilePictureFile" name="profilePicture" accept="image/*" onChange={handleChange} />
                {localPreviewImgUrl && localPreviewImgUrl.startsWith("blob:") && <img src={localPreviewImgUrl} alt="Selected Preview" style={{width: "100px", height: "100px", marginTop:"10px", objectFit:"cover"}} />}
              </div>
              <button type="submit" className={styles.saveBtn} disabled={contextLoading || isAiLoading}>
                {contextLoading || isAiLoading ? "Saving..." : "Save & Next"}
              </button>
            </form>
            <div className={styles.instractionSection}>
                <h3>Instructions</h3>
                <ul>
                    <li>Fill in your personal details accurately.</li>
                    <li>Click "Save & Next" to proceed to the next step.</li>
                </ul>
            </div>
        </div>

        <div className={styles.cvPreview}>
          <div className={styles.cvContainer}>
            <div className={styles.cvLeft}>
                 <div className={styles.profileSection}>
                  <label htmlFor="profilePictureFileTrigger" className={styles.profilePictureLabel}>
                    <img src={cvPreviewImageSrc} alt="Profile" className={styles.profileImage} />
                    <span className={styles.uploadIcon} onClick={() => document.getElementById('profilePictureFile')?.click()} role="button" tabIndex={0}>📷</span>
                  </label>
                  <h2>{personalInfo.fullname || "Your Name"}</h2>
                </div>
                <div className={styles.contactInfo}><h4 className={styles.h4Headers}>Contact</h4><p>{personalInfo.phone || "Phone"}</p><p>{personalInfo.email || "Email"}</p><p>{personalInfo.address || "Address"}</p></div>
                
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
                                <p className={styles.uniPara}><strong>{edu.fieldOfStudy}</strong></p>
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
                <div className={styles.profilePara}><h4 className={styles.h4Headers}>Profile</h4><p>{personalInfo.profileParagraph || "Your profile summary will appear here."}</p></div>
                <div className={styles.experience}><h4 className={styles.h4Headers}>Professional Experience</h4>{(experiencePreview || []).length > 0 ? (experiencePreview.map((exp, index) => (<div key={index} className={styles.experienceItem}><h5>{exp.jobTitle || "Job Title"}</h5><p className={styles.companyName}>{exp.companyName}</p><span>{formatDate(exp.jstartDate)} - {formatDate(exp.jendDate)}</span><p>{exp.jobDescription || "Job description"}</p></div>))) : ( <p>Experience details will appear here.</p> )}</div>
                <div className={styles.skillsColumns}><h4 className={styles.h4Headers}>Skills</h4><ul className={styles.skillsList}>{(skillsPreview || []).length > 0 ? (skillsPreview.map((skill, index) => (<li key={index} className={styles.skillRow}><span className={styles.skillName}>{skill.skillName || "Skill"}</span><span className={styles.skillStars}>{[...Array(5)].map((_, i) => (<span key={i} className={`${styles.star} ${i < (skill.skillLevel || 0) ? styles.checked : ""}`}>★</span>))}</span></li>))) : ( <li>Skills will appear here.</li> )}</ul></div>
                <div className={styles.summary}><h4 className={styles.h4Headers}>Summary</h4><p>{summaryPreview || "Summary will appear here."}</p></div>
                <div className={styles.references}><h4 className={styles.h4Headers}>References</h4>{(referencesPreview || []).length > 0 ? (referencesPreview.map((ref, index) => (<p key={index}>{ref.referenceName || "Name"} - {ref.position || "Position"} at {ref.company || "Company"} - {ref.contact || "Email"}</p>))) : ( <p>References will appear here.</p> )}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cv;