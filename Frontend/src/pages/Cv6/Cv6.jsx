// pages/Cv6/Cv6.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cv6.module.css";
import { isAuthenticated } from "../../utils/auth";
import { useCVForm } from "../../context/CVFormContext";
<<<<<<< HEAD
import axios from "axios"; // Make sure axios is imported for the AI call

// Helper to format date for <input type="date"> (YYYY-MM-DD)
=======
import axios from "axios";
import { toast } from 'sonner';

>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
const formatDateForInput = (dateStr) => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
<<<<<<< HEAD
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  } catch {
    return "";
  }
};

const initialExperienceItemState = {
  jobTitle: "",
  companyName: "",
  jstartDate: "",
  jendDate: "",
  jobDescription: "",
=======
    return isNaN(date.getTime()) ? "" : date.toISOString().split('T');
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
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
};

const Cv6 = () => {
  const navigate = useNavigate();
  const {
<<<<<<< HEAD
    resumeData: contextResumeData,
    saveToDatabase,
    fetchResumeData: contextFetchResumeData,
    loading: contextLoading,
    error: contextError,
    setError: setContextError,
=======
    resumeData: contextResumeData, saveToDatabase, fetchResumeData: contextFetchResumeData,
    loading: contextLoading, error: contextError,
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
  } = useCVForm();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [pageError, setPageErrorLocal] = useState(null);
  const [localProfessionalExperience, setLocalProfessionalExperience] = useState([{ ...initialExperienceItemState }]);
<<<<<<< HEAD
  
  // --- NEW: State to track AI loading for each description individually ---
  const [aiLoadingState, setAiLoadingState] = useState({});

  // Preview states
  const [personalInfoPreview, setPersonalInfoPreview] = useState({});
  const [educationPreview, setEducationPreview] = useState({});
=======
  const [aiLoadingState, setAiLoadingState] = useState({});

  const [personalInfoPreview, setPersonalInfoPreview] = useState({});
  const [educationPreview, setEducationPreview] = useState([]);
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
  const [skillsPreview, setSkillsPreview] = useState([]);
  const [summaryPreview, setSummaryPreview] = useState("");
  const [referencesPreview, setReferencesPreview] = useState([]);

  const hasAttemptedFetch = useRef(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }
<<<<<<< HEAD

    if (!hasAttemptedFetch.current) {
      hasAttemptedFetch.current = true;
      setIsPageLoading(true);
=======
    if (!hasAttemptedFetch.current) {
      hasAttemptedFetch.current = true;
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
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
<<<<<<< HEAD
      setEducationPreview(contextResumeData.educationDetails || {});
=======
      setEducationPreview(contextResumeData.educationDetails || []);
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
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
<<<<<<< HEAD
    if (updatedExperiences.length === 0) {
      setLocalProfessionalExperience([{ ...initialExperienceItemState }]);
    } else {
      setLocalProfessionalExperience(updatedExperiences);
    }
  };
  
  // --- NEW: Function to handle AI enhancement for job descriptions ---
  const handleEnhanceDescription = async (index) => {
    const currentExperience = localProfessionalExperience[index];
    const currentDescription = currentExperience?.jobDescription;
    const currentJobTitle = currentExperience?.jobTitle || "this role";

    if (!currentDescription || !currentDescription.trim()) {
      alert("Please write a job description before using AI enhancement.");
      return;
    }

    setAiLoadingState(prev => ({ ...prev, [index]: true }));
    setPageErrorLocal(null);

    try {
      // Provide more context to the AI by including the job title.
      // The backend route expects a field named 'summary', so we send the description under that key.
      const promptText = `For a resume, enhance the following job description for a role as a ${currentJobTitle}: "${currentDescription}"`;
      
      const response = await axios.post(
        "http://localhost:5001/api/ai/enhance-summary",
        { summary: promptText }
      );

      if (response.data && response.data.enhancedSummary) {
        const updatedExperiences = [...localProfessionalExperience];
        updatedExperiences[index].jobDescription = response.data.enhancedSummary;
        setLocalProfessionalExperience(updatedExperiences);
      } else {
        throw new Error("AI response was not in the expected format.");
      }
    } catch (error) {
      const errMsg = error.response?.data?.error || error.message || "AI enhancement failed.";
      console.error(`Error enhancing description for index ${index}:`, errMsg);
      setPageErrorLocal(errMsg);
=======
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
      // ✅ FIX: String with variables must use template literals (backticks)
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
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
    } finally {
      setAiLoadingState(prev => ({ ...prev, [index]: false }));
    }
  };

<<<<<<< HEAD
  const handleSubmit = async (e) => {
    e.preventDefault();
    const experiencesToSave = localProfessionalExperience.filter(exp => 
      exp.jobTitle?.trim() || exp.companyName?.trim()
    );
    try {
      await saveToDatabase("professionalExperience", experiencesToSave);
      alert("Professional experience saved successfully!");
      navigate("/cv-builder/skills");
    } catch (err) {
      console.error("Cv6.jsx: Error during handleSubmit:", err);
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

  let profileImageSrcForPreview = personalInfoPreview.profilePicture || "/default-profile.png";
  const displayedError = pageError || (contextError ? (typeof contextError === 'string' ? contextError : contextError.message) : null);

  if (isPageLoading) return <div className={styles.loading}>Loading Professional Experience...</div>;
  if (displayedError) return (
      <div className={styles.error}>
        <p>Error: {displayedError}</p>
        <button onClick={() => {
          if (setContextError) setContextError(null);
          setPageErrorLocal(null);
          // Add your full error handling/retry logic here
          navigate(0); // Simple refresh as a fallback
        }}>
          Try Again
        </button>
      </div>
  );

  return (
    <>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}><span>R</span><span>e</span><span>s</span><span>u</span><span>m</span><span>e</span> <span>B</span><span>u</span><span>i</span><span>l</span><span>d</span><span>e</span><span>r</span></h1>
        <p className={styles.pageSubtitle}>Detail your work history and responsibilities.</p>
      </header>

=======
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
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
      <div className={styles.resumeBuilder}>
        <main className={styles.content}>
          <div className={styles.formContainer}>
            <h3 className={styles.header}>Step 3: Professional Experience</h3>
            <form onSubmit={handleSubmit}>
<<<<<<< HEAD
              {localProfessionalExperience.map((exp, index) => (
                <div key={index} className={styles.experienceForm}>
                  <h4 className={styles.sectionSubTitle}>Experience #{index + 1}</h4>
                  <input
                    type="text" name="jobTitle" placeholder="Job Title (e.g., Software Engineer)"
                    value={exp.jobTitle || ""} onChange={(e) => handleExperienceChange(index, e)}
                    className={styles.inputField}
                  />
                  <input
                    type="text" name="companyName" placeholder="Company Name (e.g., Google)"
                    value={exp.companyName || ""} onChange={(e) => handleExperienceChange(index, e)}
                    className={styles.inputField}
                  />
                  <div className={styles.formColumns}>
                    <div className={styles.formLeft}>
                        <label htmlFor={`jstartDate-${index}`} className={styles.label}>Start Date</label>
                        <input
                            type="date" id={`jstartDate-${index}`} name="jstartDate"
                            value={formatDateForInput(exp.jstartDate)} onChange={(e) => handleExperienceChange(index, e)}
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.formRight}>
                        <label htmlFor={`jendDate-${index}`} className={styles.label}>End Date (Leave blank if current)</label>
                        <input
                            type="date" id={`jendDate-${index}`} name="jendDate"
                            value={formatDateForInput(exp.jendDate)} onChange={(e) => handleExperienceChange(index, e)}
                            className={styles.inputField}
                        />
                    </div>
                  </div>
                  
                  {/* --- CORRECTED JSX STRUCTURE FOR TEXTAREA WITH AI BUTTON --- */}
                  <div className={styles.textareaContainer}>
                    <textarea
                      name="jobDescription" placeholder="Describe your responsibilities and achievements..."
                      value={exp.jobDescription || ""} onChange={(e) => handleExperienceChange(index, e)}
                      rows={6} className={styles.textareaField}
                    />
                    <button
                      type="button"
                      className={styles.aiButton}
                      onClick={() => handleEnhanceDescription(index)}
                      disabled={aiLoadingState[index] || contextLoading}
                    >
                      {aiLoadingState[index] ? 'Enhancing...' : 'Enhance with AI'}
                    </button>
                  </div>

                  {localProfessionalExperience.length > 1 && (
                    <button
                      type="button" className={styles.removeButton}
                      onClick={() => handleRemoveExperience(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <div className={styles.buttonsContainer}>
                <button className={styles.addButton} type="button" onClick={handleAddExperience}>
                  Add 
                </button>
                <button className={styles.saveBtn} type="submit" disabled={contextLoading}>
                  {contextLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
            <div className={styles.instractionSection}>
                <h3>Instructions</h3>
                <ul>
                    <li>Detail your past roles, starting with the most recent.</li>
                    <li>For each role, provide the job title, company name, employment dates, and a description of your key responsibilities and accomplishments.</li>
                    <li>Click "Add Another Experience" to include multiple roles.</li>
                </ul>
            </div>
          </div>

          {/* CV Preview Section */}
=======
              {experiencesToDisplay.map((exp, relativeIndex) => {
                const originalIndex = startIndex + relativeIndex;
                return (
                  <div key={originalIndex} className={styles.experienceForm}>
                    <h4 className={styles.sectionSubTitle}>Experience #{originalIndex + 1}</h4>
                    <input type="text" name="jobTitle" placeholder="Job Title (e.g., Software Engineer)" value={exp.jobTitle || ""} onChange={(e) => handleExperienceChange(originalIndex, e)} className={styles.inputField}/>
                    <input type="text" name="companyName" placeholder="Company Name (e.g., Google)" value={exp.companyName || ""} onChange={(e) => handleExperienceChange(originalIndex, e)} className={styles.inputField}/>
                    <div className={styles.formColumns}>
                      <div className={styles.formLeft}>
                          {/* ✅ FIX: htmlFor and id must be valid strings. Use template literals. */}
                          <label htmlFor={`jstartDate-${originalIndex}`} className={styles.label}>Start Date</label>
                          <input type="date" id={`jstartDate-${originalIndex}`} name="jstartDate" value={formatDateForInput(exp.jstartDate)} onChange={(e) => handleExperienceChange(originalIndex, e)} className={styles.inputField}/>
                      </div>
                      <div className={styles.formRight}>
                          {/* ✅ FIX: htmlFor and id must be valid strings. Use template literals. */}
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
          
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
          <div className={styles.cvPreview}>
            <div className={styles.cvContainer}>
              <div className={styles.cvLeft}>
                <div className={styles.profileSection}>
                  <img src={profileImageSrcForPreview} alt="Profile" className={styles.profileImage} />
<<<<<<< HEAD
                  <h3>{personalInfoPreview.jobTitle || "Your Profession"}</h3>
                  <h2>{personalInfoPreview.fullname || "Your Name"}</h2>
                </div>
                <div className={styles.contactInfo}><h4 className={styles.h4Headers}>Contact</h4><p>{personalInfoPreview.phone || "Phone"}</p><p>{personalInfoPreview.email || "Email"}</p><p>{personalInfoPreview.address || "Address"}</p></div>
                <div className={styles.education}><h4 className={styles.h4Headers}>Education</h4>{(educationPreview.universitiyName || educationPreview.schoolName) ? (<div className={styles.educationItem}>{(educationPreview.universitiyName) && (<><h5>{educationPreview.universitiyName}</h5><span>{formatDateForDisplay(educationPreview.uniStartDate)} - {formatDateForDisplay(educationPreview.uniEndDate)}</span><p className={styles.uniPara}>{educationPreview.uniMoreDetails || ""}</p></>)}{(educationPreview.schoolName) && (<><h5>{educationPreview.schoolName}</h5><span>{formatDateForDisplay(educationPreview.startDate)} - {formatDateForDisplay(educationPreview.endDate)}</span><p>{educationPreview.moreDetails || ""}</p></>)}</div>) : ( <p>Education details appear here.</p> )}</div>
              </div>
              <div className={styles.verticalLine}></div>
              <div className={styles.cvRight}>
                <div className={styles.profilePara}><h4 className={styles.h4Headers}>Profile</h4><p>{personalInfoPreview.profileParagraph || "Your profile summary."}</p></div>
=======
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
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
                <div className={styles.experience}><h4 className={styles.h4Headers}>Professional Experience</h4>
                  {(localProfessionalExperience.filter(exp => exp.jobTitle?.trim()) || []).length > 0 ? (
                    localProfessionalExperience.filter(exp => exp.jobTitle?.trim()).map((exp, i) => (
                      <div key={i} className={styles.experienceItem}>
                        <h5>{exp.jobTitle}</h5>
                        <p className={styles.companyName}>{exp.companyName}</p>
                        <span>
<<<<<<< HEAD
                          {exp.jstartDate ? formatDateForDisplay(exp.jstartDate) : "Start"} - {exp.jendDate ? formatDateForDisplay(exp.jendDate) : "Present"}
=======
                          {formatDateForDisplay(exp.jstartDate)} - {formatDateForDisplay(exp.jendDate)}
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
                        </span>
                        <p className={styles.jobDescription}>{exp.jobDescription}</p>
                      </div>
                    ))
                  ) : ( <p>Your professional experience will appear here as you add it.</p> )}
                </div>
<<<<<<< HEAD
                <div className={styles.skillsColumns}><h4 className={styles.h4Headers}>Skills</h4><ul className={styles.skillsList}>{Array.isArray(skillsPreview) && skillsPreview.length > 0 ? (skillsPreview.map((skill, index) => (<li key={index} className={styles.skillRow}><span className={styles.skillName}>{skill.skillName || "Skill"}</span><span className={styles.skillStars}>{[...Array(5)].map((_, i) => (<span key={i} className={`${styles.star} ${i < (skill.skillLevel || 0) ? styles.checked : ""}`}>★</span>))}</span></li>))) : ( <li>Skills will appear here.</li> )}</ul></div>
                <div className={styles.summary}><h4 className={styles.h4Headers}>Summary</h4><p>{typeof summaryPreview === "string" && summaryPreview ? summaryPreview : "Summary will appear here."}</p></div>
=======
                <div className={styles.skillsColumns}><h4 className={styles.h4Headers}>Skills</h4><ul className={styles.skillsList}>{Array.isArray(skillsPreview) && skillsPreview.length > 0 ? (skillsPreview.map((skill, index) => (<li key={index} className={styles.skillRow}><span className={styles.skillName}>{skill.skillName || "Skill"}</span><span className={styles.skillStars}>
                {/* ✅ FIX: className must use a template literal wrapped in {} */}
                {[...Array(5)].map((_, i) => (<span key={i} className={`${styles.star} ${i < (skill.skillLevel || 0) ? styles.checked : ""}`}>★</span>))}</span></li>))) : ( <li>Skills will appear here.</li> )}</ul></div>
                <div className={styles.summary}><h4 className={styles.h4Headers}>Summary</h4><p>{summaryPreview || "Summary will appear here."}</p></div>
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
                <div className={styles.references}><h4 className={styles.h4Headers}>References</h4>{(referencesPreview || []).length > 0 ? (referencesPreview.map((ref, index) => (<p key={index}>{ref.referenceName || "Name"} - {ref.position || "Position"} at {ref.company || "Company"} - {ref.contact || "Email"}</p>))) : ( <p>References will appear here.</p> )}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
<<<<<<< HEAD
    </>
=======
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
  );
};

export default Cv6;