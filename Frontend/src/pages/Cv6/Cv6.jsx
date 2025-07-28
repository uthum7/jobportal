// pages/Cv6/Cv6.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cv6.module.css";
import { isAuthenticated } from "../../utils/auth";
import { useCVForm } from "../../context/CVFormContext";
import axios from "axios";
import { toast } from 'sonner';

const formatDateForInput = (dateStr) => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "" : date.toISOString().split('T')[0];
  } catch { return ""; }
};

const initialExperienceItemState = {
  jobTitle: "", companyName: "", jstartDate: "", jendDate: "", jobDescription: "",
};

const MAX_VISIBLE_FORMS = 2;

const formatDateForDisplay = (dateStr, formatType = 'date') => {
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

const Cv6 = () => {
  const navigate = useNavigate();
  const {
    resumeData: contextResumeData, saveToDatabase, fetchResumeData: contextFetchResumeData,
    loading: contextLoading, error: contextError,
  } = useCVForm();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [pageError, setPageErrorLocal] = useState(null);
  const [localProfessionalExperience, setLocalProfessionalExperience] = useState([{ ...initialExperienceItemState }]);
  const [aiLoadingState, setAiLoadingState] = useState({});

  const [personalInfoPreview, setPersonalInfoPreview] = useState({});
  const [educationPreview, setEducationPreview] = useState([]);
  const [skillsPreview, setSkillsPreview] = useState([]);
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
      setLocalProfessionalExperience(
        contextResumeData.professionalExperience?.length > 0
          ? contextResumeData.professionalExperience
          : [{ ...initialExperienceItemState }]
      );
      setPersonalInfoPreview(contextResumeData.personalInfo || {});
      setEducationPreview(contextResumeData.educationDetails || []);
      setSkillsPreview(contextResumeData.skill || []);
      setSummaryPreview(contextResumeData.summary || "");
      setReferencesPreview(contextResumeData.references || []);
    }
  }, [contextResumeData]);

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedExperiences = [...localProfessionalExperience];
    updatedExperiences[index] = { ...updatedExperiences[index], [name]: value };
    setLocalProfessionalExperience(updatedExperiences);
  };

  const handleAddExperience = () => {
    setLocalProfessionalExperience([...localProfessionalExperience, { ...initialExperienceItemState }]);
  };

  const handleRemoveExperience = (index) => {
    const updatedExperiences = localProfessionalExperience.filter((_, i) => i !== index);
    setLocalProfessionalExperience(updatedExperiences.length === 0 ? [{ ...initialExperienceItemState }] : updatedExperiences);
  };

  const handleEnhanceDescription = async (index) => {
    const { jobDescription, jobTitle } = localProfessionalExperience[index];
    if (!jobDescription?.trim()) {
      toast.warning("Please write a job description before using AI enhancement.");
      return;
    }
    setAiLoadingState(prev => ({ ...prev, [index]: true }));
    try {
      const promptText = `For a resume, enhance the following job description for a role as a ${jobTitle || "this role"}: "${jobDescription}"`;
      const response = await axios.post("http://localhost:5001/api/ai/enhance-summary", { summary: promptText });
      if (response.data?.enhancedSummary) {
        const updatedExperiences = [...localProfessionalExperience];
        updatedExperiences[index].jobDescription = response.data.enhancedSummary;
        setLocalProfessionalExperience(updatedExperiences);
        toast.success("Description enhanced!");
      } else { throw new Error("AI response was not in the expected format."); }
    } catch (error) {
      toast.error(error.response?.data?.error || "AI enhancement failed.");
    } finally {
      setAiLoadingState(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const experiencesToSave = localProfessionalExperience.filter(exp => exp.jobTitle?.trim() || exp.companyName?.trim());
    const promise = saveToDatabase("professionalExperience", experiencesToSave);
    toast.promise(promise, {
        loading: 'Saving professional experience...',
        success: () => {
            setTimeout(() => navigate("/cv-builder/skills"), 500);
            return "Professional experience saved successfully!";
        },
        error: (err) => err.message || "Failed to save experience."
    });
  };

  const totalExperiences = localProfessionalExperience.length;
  const startIndex = totalExperiences > MAX_VISIBLE_FORMS ? totalExperiences - MAX_VISIBLE_FORMS : 0;
  const experiencesToDisplay = localProfessionalExperience.slice(startIndex);

  let profileImageSrcForPreview = personalInfoPreview.profilePicture || "/default-profile.png";
  const displayedError = pageError || (contextError ? contextError.message : null);

  if (isPageLoading) return <div className={styles.loading}>Loading Professional Experience...</div>;
  if (displayedError) return <div className={styles.error}><p>Error: {displayedError}</p><button onClick={() => navigate(0)}>Try Again</button></div>;

  return (
      <div className={styles.resumeBuilder}>
        <main className={styles.content}>
          <div className={styles.formContainer}>
            <h3 className={styles.header}>Step 3: Professional Experience</h3>
            <form onSubmit={handleSubmit}>
              {experiencesToDisplay.map((exp, relativeIndex) => {
                const originalIndex = startIndex + relativeIndex;
                return (
                  <div key={originalIndex} className={styles.experienceForm}>
                    <h4 className={styles.sectionSubTitle}>Experience #{originalIndex + 1}</h4>
                    <input type="text" name="jobTitle" placeholder="Job Title (e.g., Software Engineer)" value={exp.jobTitle || ""} onChange={(e) => handleExperienceChange(originalIndex, e)} className={styles.inputField}/>
                    <input type="text" name="companyName" placeholder="Company Name (e.g., Google)" value={exp.companyName || ""} onChange={(e) => handleExperienceChange(originalIndex, e)} className={styles.inputField}/>
                    <div className={styles.formColumns}>
                      <div className={styles.formLeft}>
                          <label htmlFor={`jstartDate-${originalIndex}`} className={styles.label}>Start Date</label>
                          <input type="date" id={`jstartDate-${originalIndex}`} name="jstartDate" value={formatDateForInput(exp.jstartDate)} onChange={(e) => handleExperienceChange(originalIndex, e)} className={styles.inputField}/>
                      </div>
                      <div className={styles.formRight}>
                          <label htmlFor={`jendDate-${originalIndex}`} className={styles.label}>End Date (Leave blank if current)</label>
                          <input type="date" id={`jendDate-${originalIndex}`} name="jendDate" value={formatDateForInput(exp.jendDate)} onChange={(e) => handleExperienceChange(originalIndex, e)} className={styles.inputField}/>
                      </div>
                    </div>
                    <div className={styles.textareaContainer}>
                      <textarea name="jobDescription" placeholder="Describe your responsibilities and achievements..." value={exp.jobDescription || ""} onChange={(e) => handleExperienceChange(originalIndex, e)} rows={6} className={styles.textareaField}/>
                      <button type="button" className={styles.aiButton} onClick={() => handleEnhanceDescription(originalIndex)} disabled={aiLoadingState[originalIndex] || contextLoading}>
                        {aiLoadingState[originalIndex] ? 'Enhancing...' : 'Enhance with AI'}
                      </button>
                    </div>
                    {localProfessionalExperience.length > 1 && (<button type="button" className={styles.removeButton} onClick={() => handleRemoveExperience(originalIndex)}>Remove This Experience</button>)}
                  </div>
                )
              })}
              <div className={styles.buttonsContainer}>
                <button className={styles.saveBtn} type="submit" disabled={contextLoading}>
                  {contextLoading ? "Saving..." : "Save & Next"}
                </button>
                <button className={styles.addButton} type="button" onClick={handleAddExperience}>
                  + Add Another Experience
                </button>
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
                <div className={styles.profilePara}><h4 className={styles.h4Headers}>Profile</h4><p>{personalInfoPreview.profileParagraph || "Your profile summary will appear here."}</p></div>
                <div className={styles.experience}><h4 className={styles.h4Headers}>Professional Experience</h4>
                  {(localProfessionalExperience.filter(exp => exp.jobTitle?.trim()) || []).length > 0 ? (
                    localProfessionalExperience.filter(exp => exp.jobTitle?.trim()).map((exp, i) => (
                      <div key={i} className={styles.experienceItem}>
                        <h5>{exp.jobTitle}</h5>
                        <p className={styles.companyName}>{exp.companyName}</p>
                        <span>
                          {formatDateForDisplay(exp.jstartDate)} - {formatDateForDisplay(exp.jendDate)}
                        </span>
                        <p className={styles.jobDescription}>{exp.jobDescription}</p>
                      </div>
                    ))
                  ) : ( <p>Your professional experience will appear here as you add it.</p> )}
                </div>
                <div className={styles.skillsColumns}><h4 className={styles.h4Headers}>Skills</h4><ul className={styles.skillsList}>{Array.isArray(skillsPreview) && skillsPreview.length > 0 ? (skillsPreview.map((skill, index) => (<li key={index} className={styles.skillRow}><span className={styles.skillName}>{skill.skillName || "Skill"}</span><span className={styles.skillStars}>{[...Array(5)].map((_, i) => (<span key={i} className={`${styles.star} ${i < (skill.skillLevel || 0) ? styles.checked : ""}`}>★</span>))}</span></li>))) : ( <li>Skills will appear here.</li> )}</ul></div>
                <div className={styles.summary}><h4 className={styles.h4Headers}>Summary</h4><p>{summaryPreview || "Summary will appear here."}</p></div>
                <div className={styles.references}><h4 className={styles.h4Headers}>References</h4>{(referencesPreview || []).length > 0 ? (referencesPreview.map((ref, index) => (<p key={index}>{ref.referenceName || "Name"} - {ref.position || "Position"} at {ref.company || "Company"} - {ref.contact || "Email"}</p>))) : ( <p>References will appear here.</p> )}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
};

export default Cv6;