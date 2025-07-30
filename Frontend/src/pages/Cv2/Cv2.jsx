// pages/Cv2/Cv2.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import styles from "./Cv2.module.css"; // Assuming this path is correct
import { isAuthenticated, getUserId } from "../../utils/auth";
import { useCVForm } from "../../context/CVFormContext";

// Re-usable initial state for education (if needed for reset or default)
const initialEducationState = {
  schoolName: "",
  startDate: "",
  endDate: "",
  moreDetails: "",
  universitiyName: "", // Corrected typo from universitiyName
  uniStartDate: "",
  uniEndDate: "",
  uniMoreDetails: "",
};

// Helper to format date for display (e.g., "Jan 2023")
const formatDateForDisplay = (dateStr) => {
  if (!dateStr) return "Present"; // Or "" if you prefer empty for ongoing
=======
import styles from "./Cv2.module.css";
import { isAuthenticated } from "../../utils/auth";
import { useCVForm } from "../../context/CVFormContext";
import { FaCalendarAlt } from "react-icons/fa";
import { toast } from 'sonner';

const createInitialEducation = () => ({
  institute: '',
  educationLevel: '',
  fieldOfStudy: '',
  gpaOrGrade: '',
  startDate: '',
  endDate: '',
  currentlyStudying: false,
  alYear: '',
  alSubjects: [{ subject: '', grade: '' }]
});

const getTodayString = () => new Date().toISOString().split('T')[0];

const formatDateForDisplay = (dateStr, formatType = 'date') => {
  if (!dateStr) return "Present";
  if (formatType === 'year') return dateStr;
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short" });
  } catch {
    return "Invalid Date";
  }
};

<<<<<<< HEAD
// Helper to format date for <input type="date"> (YYYY-MM-DD)
const formatDateForInput = (dateStr) => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
};

=======
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
const Cv2 = () => {
  const navigate = useNavigate();
  const {
    resumeData: contextResumeData,
<<<<<<< HEAD
    saveToDatabase, // Use this from context for saving
    fetchResumeData: contextFetchResumeData,
    loading: contextLoading,
    error: contextError,
    setError: setContextError,
    updateEducationDetails: contextUpdateEducationDetails, // Can be used for optimistic UI in context
  } = useCVForm();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [pageError, setPageErrorLocal] = useState(null);

  // Local state for the education form data
  const [educationForm, setEducationForm] = useState(
    contextResumeData?.educationDetails || initialEducationState
  );

  // Data for CV Preview (synced from context)
  const [personalInfoPreview, setPersonalInfoPreview] = useState(contextResumeData?.personalInfo || {});
  // other preview states if needed for this page's preview
  const [experiencePreview, setExperiencePreview] = useState(contextResumeData?.professionalExperience || []);
  const [skillsPreview, setSkillsPreview] = useState(contextResumeData?.skill || []);
  const [summaryPreview, setSummaryPreview] = useState(contextResumeData?.summary || "");
  const [referencesPreview, setReferencesPreview] = useState(contextResumeData?.references || []);


  const hasAttemptedFetch = useRef(false);

  // Effect for initial data fetching
  useEffect(() => {
    if (!isAuthenticated()) {
      setPageErrorLocal("User not authenticated. Redirecting to login...");
      setIsPageLoading(false);
      navigate("/login", { replace: true });
      return;
    }
    // No need to pass userId, contextFetchResumeData gets it
    if (!hasAttemptedFetch.current) {
      hasAttemptedFetch.current = true;
      setIsPageLoading(true);
      setPageErrorLocal(null);
      if (setContextError) setContextError(null);

      console.log("Cv2.jsx: Attempting initial fetch via contextFetchResumeData...");
      contextFetchResumeData()
        .then((fetchResult) => {
          console.log("Cv2.jsx: contextFetchResumeData promise resolved. Result:", fetchResult);
          // Logic to handle fetchResult similar to Cv.jsx
          if (fetchResult && fetchResult.noDataFound) {
            console.log("Cv2.jsx: No existing CV data. Form will use initial state from context.");
          } else if (fetchResult && fetchResult.error) {
            console.warn("Cv2.jsx: Context reported an error during fetch:", fetchResult.error);
          }
        })
        .catch((err) => {
          console.error("Cv2.jsx: Critical error from contextFetchResumeData promise:", err);
          setPageErrorLocal(err.message || "Unexpected error loading CV data.");
        })
        .finally(() => {
          setIsPageLoading(false);
        });
    } else {
      setIsPageLoading(false);
    }
  }, [contextFetchResumeData, navigate, setContextError]);

  // Effect to synchronize local form state and preview data with contextResumeData
  useEffect(() => {
    if (contextResumeData) {
      console.log("Cv2.jsx: Syncing local state with contextResumeData", contextResumeData);
      setEducationForm(contextResumeData.educationDetails || initialEducationState);
      setPersonalInfoPreview(contextResumeData.personalInfo || {});
      // Sync other preview states if they are part of this page's preview
=======
    saveToDatabase,
    fetchResumeData: contextFetchResumeData,
    loading: contextLoading,
    error: contextError,
  } = useCVForm();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [educationForm, setEducationForm] = useState([createInitialEducation()]);
  const [errors, setErrors] = useState({});

  const [personalInfoPreview, setPersonalInfoPreview] = useState({});
  const [experiencePreview, setExperiencePreview] = useState([]);
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
      setPersonalInfoPreview(contextResumeData.personalInfo || {});
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
      setExperiencePreview(contextResumeData.professionalExperience || []);
      setSkillsPreview(contextResumeData.skill || []);
      setSummaryPreview(contextResumeData.summary || "");
      setReferencesPreview(contextResumeData.references || []);
<<<<<<< HEAD
    }
  }, [contextResumeData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEducationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // If you want optimistic updates reflected in the context immediately (e.g., for a global preview)
    // you can call contextUpdateEducationDetails here, but it's often better to wait for save.
    // if (contextUpdateEducationDetails) {
    //   contextUpdateEducationDetails({ [name]: value });
    // }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (setContextError) setContextError(null);
    setPageErrorLocal(null);

    // Validate educationForm if needed before submitting
    // e.g., if (!educationForm.schoolName && !educationForm.universitiyName) { ... }

    try {
      console.log("Cv2.jsx: Submitting educationDetails:", educationForm);
      // Use saveToDatabase from context
      await saveToDatabase("educationDetails", educationForm);
      alert("Education details saved successfully!");
      navigate("/cv-builder/experience"); // Navigate to the next step
    } catch (err) {
      console.error("Cv2.jsx: Error during handleSubmit (saveToDatabase failed):", err);
      // contextError will be set by saveToDatabase from context.
      // Optionally set pageErrorLocal for more specific messages:
      // setPageErrorLocal(err.message || "Failed to save education details.");
    }
  };

  const displayedError = pageError || (contextError ? (typeof contextError === 'string' ? contextError : contextError.message) : null);

  if (isPageLoading) {
    return <div className={styles.loading}>Loading Education Details...</div>;
  }

  if (displayedError) {
    return (
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
  }
  
  // For CV Preview, use data synced from context
  let profileImageSrcForPreview = "/default-profile.png"; // Ensure you have this asset
  if (typeof personalInfoPreview.profilePicture === 'string' && personalInfoPreview.profilePicture) {
    profileImageSrcForPreview = personalInfoPreview.profilePicture;
  }


  return (
    <>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}><span>R</span><span>e</span><span>s</span><span>u</span><span>m</span><span>e</span> <span>B</span><span>u</span><span>i</span><span>l</span><span>d</span><span>e</span><span>r</span></h1>
        <p className={styles.pageSubtitle}>Showcase your academic achievements.</p>
      </header>

      <div className={styles.resumeBuilder}>
        <main className={styles.content}> {/* Removed isSidebarVisible logic unless needed */}
          <div className={styles.formContainer}>
            <h3 className={styles.header}>Step 2: Education Details</h3>
            <form onSubmit={handleSubmit}>
              <h4 className={styles.sectionTitle}>School Details (Optional)</h4>
              <input
                type="text"
                name="schoolName"
                placeholder="School Name (e.g., City High School)"
                value={educationForm.schoolName || ""}
                onChange={handleChange}
                className={styles.inputField}
              />
              <div className={styles.formColumns}>
                <div className={styles.formLeft}>
                  <label htmlFor="schoolStartDate" className={styles.label}>Start Date</label>
                  <input
                    type="date"
                    id="schoolStartDate"
                    name="startDate" // Matches educationForm key
                    value={formatDateForInput(educationForm.startDate)}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                </div>
                <div className={styles.formRight}>
                  <label htmlFor="schoolEndDate" className={styles.label}>End Date (or expected)</label>
                  <input
                    type="date"
                    id="schoolEndDate"
                    name="endDate" // Matches educationForm key
                    value={formatDateForInput(educationForm.endDate)}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                </div>
              </div>
              <textarea
                name="moreDetails" // Matches educationForm key
                placeholder="Additional details (e.g., major subjects, achievements)"
                value={educationForm.moreDetails || ""}
                onChange={handleChange}
                rows={3}
                className={styles.textareaField}
              />

              <h4 className={styles.sectionTitle}>University/College Details (Optional)</h4>
              <input
                type="text"
                name="universitiyName" // Corrected: should be universityName in state/backend
                placeholder="University/College Name (e.g., State University)"
                value={educationForm.universitiyName || ""} // Keep typo if backend expects it, otherwise correct
                onChange={handleChange}
                className={styles.inputField}
              />
              <div className={styles.formColumns}>
                <div className={styles.formLeft}>
                  <label htmlFor="uniStartDate" className={styles.label}>Start Date</label>
                  <input
                    type="date"
                    id="uniStartDate"
                    name="uniStartDate" // Matches educationForm key
                    value={formatDateForInput(educationForm.uniStartDate)}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                </div>
                <div className={styles.formRight}>
                  <label htmlFor="uniEndDate" className={styles.label}>End Date (or expected)</label>
                  <input
                    type="date"
                    id="uniEndDate"
                    name="uniEndDate" // Matches educationForm key
                    value={formatDateForInput(educationForm.uniEndDate)}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                </div>
              </div>
              <textarea
                name="uniMoreDetails" // Matches educationForm key
                placeholder="Degree Program, Major, Minor, Thesis, GPA, Honors, etc."
                value={educationForm.uniMoreDetails || ""}
                onChange={handleChange}
                rows={4}
                className={styles.textareaField}
              />

              <div className={styles.saveButtonContainer}>
                <button type="submit" className={styles.saveBtn} disabled={contextLoading}>
                  {contextLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
            
          </div>

          {/* CV Preview Section - shows data from synced preview states */}
          <div className={styles.cvPreview}>
            <div className={styles.cvContainer}>
              <div className={styles.cvLeft}>
                <div className={styles.profileSection}>
                  <img src={profileImageSrcForPreview} alt="Profile" className={styles.profileImage} />
                  <h3>{personalInfoPreview.jobTitle || "Your Profession"}</h3>
                  <h2>{personalInfoPreview.fullname || "Your Name"}</h2>
                </div>
                <div className={styles.contactInfo}>
                  <h4 className={styles.h4Headers}>Contact</h4>
                  <p>{personalInfoPreview.phone || "Phone"}</p>
                  <p>{personalInfoPreview.email || "Email"}</p>
                  <p>{personalInfoPreview.address || "Address"}</p>
                </div>
                <div className={styles.education}>
                  <h4 className={styles.h4Headers}>Education</h4>
                  {/* Use educationForm for live preview of current edits, or contextResumeData.educationDetails for saved state */}
                  {(educationForm.universitiyName || educationForm.schoolName) ? (
                    <div className={styles.educationItem}>
                      {educationForm.universitiyName && (
                        <>
                          <h5>{educationForm.universitiyName}</h5>
                          <span>{formatDateForDisplay(educationForm.uniStartDate)} - {formatDateForDisplay(educationForm.uniEndDate)}</span>
                          <p className={styles.uniPara}>{educationForm.uniMoreDetails || "Degree details"}</p>
                        </>
                      )}
                      {educationForm.schoolName && (
                        <>
                          <h5>{educationForm.schoolName}</h5>
                          <span>{formatDateForDisplay(educationForm.startDate)} - {formatDateForDisplay(educationForm.endDate)}</span>
                          <p>{educationForm.moreDetails || "Additional details"}</p>
                        </>
                      )}
                    </div>
                  ) : (
                    <p>Your education details will appear here as you fill them.</p>
                  )}
=======

      if (contextResumeData.educationDetails && contextResumeData.educationDetails.length > 0) {
        setEducationForm(contextResumeData.educationDetails.map(edu => ({
          ...createInitialEducation(),
          ...edu,
          alSubjects: (edu.alSubjects && edu.alSubjects.length > 0)
            ? [...edu.alSubjects, { subject: '', grade: '' }]
            : [{ subject: '', grade: '' }],
          startDate: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : '',
          endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : '',
        })));
      } else {
        setEducationForm([createInitialEducation()]);
      }
    }
  }, [contextResumeData]);

  const handleNestedChange = (index, field, value) => {
    const updatedForm = [...educationForm];
    updatedForm[index][field] = value;
    if (field === 'currentlyStudying' && value === true) {
      updatedForm[index]['endDate'] = '';
    }
    setEducationForm(updatedForm);
  };

  const handleALSubjectChange = (eduIndex, subIndex, field, value) => {
    const updatedForm = [...educationForm];
    updatedForm[eduIndex].alSubjects[subIndex][field] = value;
    setEducationForm(updatedForm);
  };

  const addALSubject = (eduIndex) => {
    const updatedForm = [...educationForm];
    const currentSubjects = updatedForm[eduIndex].alSubjects;
    if (currentSubjects[currentSubjects.length - 1].subject && currentSubjects[currentSubjects.length - 1].grade) {
        updatedForm[eduIndex].alSubjects.push({ subject: '', grade: '' });
        setEducationForm(updatedForm);
    }
  };

  const removeALSubject = (eduIndex, subIndex) => {
    const updatedForm = [...educationForm];
    updatedForm[eduIndex].alSubjects.splice(subIndex, 1);
    setEducationForm(updatedForm);
  };

  const addItem = () => {
    setEducationForm([...educationForm, createInitialEducation()]);
  };

  const removeItem = (index) => {
    const updatedForm = educationForm.filter((_, i) => i !== index);
    setEducationForm(updatedForm.length > 0 ? updatedForm : [createInitialEducation()]);
  };
  
  const canAddEducation = () => {
    const lastEdu = educationForm[educationForm.length - 1];
    return lastEdu && lastEdu.institute && lastEdu.educationLevel;
  };

  const validateForm = () => {
    const newErrors = {};
    educationForm.forEach((edu, i) => {
      // ✅ FIX: Use template literals (backticks) for dynamic keys
      if (!edu.institute.trim()) newErrors[`education_${i}_institute`] = "Institute name is required.";
      if (!edu.educationLevel) newErrors[`education_${i}_educationLevel`] = "Education level is required.";
      if (edu.educationLevel === 'A/L') {
        if (!edu.fieldOfStudy.trim()) newErrors[`education_${i}_fieldOfStudy`] = "Subject stream is required.";
        if (!edu.alYear.trim()) newErrors[`education_${i}_alYear`] = "A/L Year is required.";
      } else if (edu.educationLevel) {
        if (!edu.fieldOfStudy.trim()) newErrors[`education_${i}_fieldOfStudy`] = "Field of study is required.";
        if (!edu.gpaOrGrade.trim()) newErrors[`education_${i}_gpaOrGrade`] = "GPA or Grade is required.";
        if (!edu.startDate) newErrors[`education_${i}_startDate`] = "Start date is required.";
        if (!edu.endDate && !edu.currentlyStudying) newErrors[`education_${i}_endDate`] = "End date is required.";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===============================================
  // ===        UPDATED SUBMIT FUNCTION        ===
  // ===============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }
    const dataToSave = educationForm.map(edu => {
      const cleanSubjects = edu.alSubjects.filter(sub => sub.subject && sub.grade);
      return { ...edu, alSubjects: cleanSubjects };
    });

    const promise = saveToDatabase("educationDetails", dataToSave);

    toast.promise(promise, {
        loading: 'Saving education details...',
        success: () => {
            setTimeout(() => navigate("/cv-builder/experience"), 500);
            return "Education details saved successfully!";
        },
        error: (err) => err.message || "Failed to save education details."
    });
  };

  if (isPageLoading) return <div className={styles.loading}>Loading Education...</div>;
  if (contextError) return <div className={styles.error}><p>{contextError.message}</p></div>;

  return (
    <div className={styles.resumeBuilder}>
      <main className={styles.content}>
        <div className={styles.formContainer}>
          <h3 className={styles.header}>Step 2: Education Details</h3>
          <form onSubmit={handleSubmit}>
            {educationForm.map((edu, i) => (
              <div key={i} className={styles.educationEntry}>
                {/* ✅ FIX: Use template literals (backticks) for dynamic error keys */}
                <div className={styles.formGroup}>
                  <input placeholder="Institute Name" value={edu.institute || ''} onChange={e => handleNestedChange(i, 'institute', e.target.value)} className={errors[`education_${i}_institute`] ? styles.errorInput : ''} />
                  {errors[`education_${i}_institute`] && <span className={styles.errorMessage}>{errors[`education_${i}_institute`]}</span>}
                </div>
                <div className={styles.formGroup}>
                  <select value={edu.educationLevel || ''} onChange={e => handleNestedChange(i, 'educationLevel', e.target.value)} className={errors[`education_${i}_educationLevel`] ? styles.errorInput : ''}>
                    <option value="" disabled>Select Education Level</option>
                    <option value="A/L">A/L</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Bachelor's">Bachelor's</option>
                    <option value="Master's">Master's</option>
                    <option value="PhD">PhD</option>
                  </select>
                  {errors[`education_${i}_educationLevel`] && <span className={styles.errorMessage}>{errors[`education_${i}_educationLevel`]}</span>}
                </div>
                {edu.educationLevel === 'A/L' && (
                  <>
                    <div className={styles.formGroup}>
                      <input placeholder="Subject Stream (e.g., Arts, Commerce, Science)" value={edu.fieldOfStudy || ''} onChange={e => handleNestedChange(i, 'fieldOfStudy', e.target.value)} className={errors[`education_${i}_fieldOfStudy`] ? styles.errorInput : ''}/>
                      {errors[`education_${i}_fieldOfStudy`] && <span className={styles.errorMessage}>{errors[`education_${i}_fieldOfStudy`]}</span>}
                    </div>
                    <div className={styles.formGroup}>
                      <input placeholder="Year (e.g., 2020)" value={edu.alYear || ''} onChange={e => handleNestedChange(i, 'alYear', e.target.value)} className={errors[`education_${i}_alYear`] ? styles.errorInput : ''}/>
                      {errors[`education_${i}_alYear`] && <span className={styles.errorMessage}>{errors[`education_${i}_alYear`]}</span>}
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.subLabel}>A/L Subjects and Grades</label>
                      {(edu.alSubjects || []).slice(0, -1).map((subjectGrade, subIndex) => (
                        <div key={subIndex} className={styles.skillInputContainer}>
                          <div className={styles.skillInputRow}>
                            <input value={subjectGrade.subject || ''} readOnly className={styles.skillNameInput} />
                            <div className={styles.proficiencyContainer}>
                              <label className={styles.proficiencyLabel}>Grade:</label>
                              <select value={subjectGrade.grade || ''} className={styles.proficiencySelect} disabled><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="S">S</option><option value="F">F</option></select>
                            </div>
                            <div className={styles.skillActions}><button type="button" className={styles.removeSkillBtn} onClick={() => removeALSubject(i, subIndex)} title="Remove subject">×</button></div>
                          </div>
                        </div>
                      ))}
                      <div className={styles.skillInputContainer}>
                        <div className={styles.skillInputRow}>
                          <input placeholder="Subject" value={edu.alSubjects[edu.alSubjects.length - 1]?.subject || ''} onChange={e => handleALSubjectChange(i, edu.alSubjects.length - 1, 'subject', e.target.value)} className={styles.skillNameInput}/>
                          <div className={styles.proficiencyContainer}>
                            <label className={styles.proficiencyLabel}>Grade:</label>
                            <select value={edu.alSubjects[edu.alSubjects.length - 1]?.grade || ''} onChange={e => handleALSubjectChange(i, edu.alSubjects.length - 1, 'grade', e.target.value)} className={styles.proficiencySelect}><option value="" disabled>Grade</option><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="S">S</option><option value="F">F</option></select>
                          </div>
                          <div className={styles.skillActions}><button type="button" className={styles.addSkillBtn} onClick={() => addALSubject(i)} disabled={!edu.alSubjects[edu.alSubjects.length - 1]?.subject?.trim() || !edu.alSubjects[edu.alSubjects.length - 1]?.grade} title="Add new subject">+</button></div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {edu.educationLevel && edu.educationLevel !== 'A/L' && (
                  <>
                    <div className={styles.formGroup}>
                      <input placeholder="Field of Study (e.g., Computer Science)" value={edu.fieldOfStudy || ''} onChange={e => handleNestedChange(i, 'fieldOfStudy', e.target.value)} className={errors[`education_${i}_fieldOfStudy`] ? styles.errorInput : ''}/>
                       {errors[`education_${i}_fieldOfStudy`] && <span className={styles.errorMessage}>{errors[`education_${i}_fieldOfStudy`]}</span>}
                    </div>
                    <div className={styles.formGroup}>
                      <input placeholder="GPA / Grade (e.g., 3.8/4.0 or First Class)" value={edu.gpaOrGrade || ''} onChange={e => handleNestedChange(i, 'gpaOrGrade', e.target.value)} className={errors[`education_${i}_gpaOrGrade`] ? styles.errorInput : ''}/>
                       {errors[`education_${i}_gpaOrGrade`] && <span className={styles.errorMessage}>{errors[`education_${i}_gpaOrGrade`]}</span>}
                    </div>
                    <div className={styles.educationDatesSimple}>
                      <div className={styles.dateInputGroup}>
                        <label>Start Date</label>
                        <div className={styles.simpleDatePicker}><input type="date" value={edu.startDate || ''} onChange={e => handleNestedChange(i, 'startDate', e.target.value)} max={getTodayString()} className={errors[`education_${i}_startDate`] ? styles.errorInput : ''}/><FaCalendarAlt className={styles.calendarIconSimple} /></div>
                         {errors[`education_${i}_startDate`] && <span className={styles.errorMessage}>{errors[`education_${i}_startDate`]}</span>}
                      </div>
                      <div className={styles.dateInputGroup}>
                        <label>End Date</label>
                        <div className={styles.simpleDatePicker}><input type="date" value={edu.endDate || ''} onChange={e => handleNestedChange(i, 'endDate', e.target.value)} disabled={edu.currentlyStudying} min={edu.startDate || ''} max={getTodayString()} className={errors[`education_${i}_endDate`] ? styles.errorInput : ''}/><FaCalendarAlt className={styles.calendarIconSimple} /></div>
                         {errors[`education_${i}_endDate`] && <span className={styles.errorMessage}>{errors[`education_${i}_endDate`]}</span>}
                      </div>
                      <label className={styles.checkboxLabel}><input type="checkbox" checked={!!edu.currentlyStudying} onChange={e => handleNestedChange(i, 'currentlyStudying', e.target.checked)} />Currently Studying</label>
                    </div>
                  </>
                )}
                {educationForm.length > 1 && <button className={styles.removeBtn} type="button" onClick={() => removeItem(i)}>Remove Education</button>}
              </div>
            ))}
            <button type="button" className={styles.addBtn} onClick={addItem} disabled={!canAddEducation()}>+ Add Another Education</button>
            <div className={styles.saveButtonContainer}>
              <button type="submit" className={styles.saveBtn} disabled={contextLoading}>{contextLoading ? "Saving..." : "Save & Next"}</button>
            </div>
          </form>
        </div>

        <div className={styles.cvPreview}>
          <div className={styles.cvContainer}>
            <div className={styles.cvLeft}>
                <div className={styles.profileSection}>
                  <img src={personalInfoPreview.profilePicture || "/default-profile.png"} alt="Profile" className={styles.profileImage} />
                  <h2>{personalInfoPreview.fullname || "Your Name"}</h2>
                </div>
                <div className={styles.contactInfo}><h4 className={styles.h4Headers}>Contact</h4><p>{personalInfoPreview.phone || "Phone"}</p><p>{personalInfoPreview.email || "Email"}</p><p>{personalInfoPreview.address || "Address"}</p></div>
                <div className={styles.education}>
                  <h4 className={styles.h4Headers}>Education</h4>
                    {educationForm.length > 0 && educationForm.some(e => e.institute) ? (
                      educationForm.map((edu, index) => (
                        edu.institute && (
                          <div key={index} className={styles.educationItem}>
                            <h5>{edu.institute}</h5>
                            {edu.educationLevel === 'A/L' ? (
                              <>
                                <span>{edu.fieldOfStudy} - {formatDateForDisplay(edu.alYear, 'year')}</span>
                                <ul className={styles.alSubjectsPreview}>
                                  {edu.alSubjects.slice(0, -1).map((sub, subIndex) => (
                                    <li key={subIndex}><strong>{sub.subject}:</strong> {sub.grade}</li>
                                  ))}
                                </ul>
                              </>
                            ) : (
                              <>
                                <span>{formatDateForDisplay(edu.startDate)} - {edu.currentlyStudying ? 'Present' : formatDateForDisplay(edu.endDate)}</span>
                                <p className={styles.uniPara}><strong>{edu.fieldOfStudy}</strong></p>
                                <p>GPA Value-{edu.gpaOrGrade}</p>
                              </>
                            )}
                          </div>
                        )
                      ))
                    ) : (
                      <p>Your education details will appear here.</p>
                    )}
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
                </div>
              </div>
              <div className={styles.verticalLine}></div>
              <div className={styles.cvRight}>
<<<<<<< HEAD
                <div className={styles.profilePara}><h4 className={styles.h4Headers}>Profile</h4><p>{personalInfoPreview.profileParagraph || "Your profile summary"}</p></div>
                <div className={styles.experience}><h4 className={styles.h4Headers}>Professional Experience</h4>{(experiencePreview || []).length > 0 ? (experiencePreview.map((exp, index) => (<div key={index} className={styles.experienceItem}><h5>{exp.jobTitle || "Job Title"}</h5><span>{exp.jstartDate ? formatDateForDisplay(exp.jstartDate) : "Start"} - {exp.jendDate ? formatDateForDisplay(exp.jendDate) : "End"}</span><p>{exp.jobDescription || "Job description"}</p></div>))) : ( <p>Experience details will appear here.</p> )}</div>
                <div className={styles.skillsColumns}><h4 className={styles.h4Headers}>Skills</h4><ul className={styles.skillsList}>{Array.isArray(skillsPreview) && skillsPreview.length > 0 ? (skillsPreview.map((skill, index) => (<li key={index} className={styles.skillRow}><span className={styles.skillName}>{skill.skillName || "Skill"}</span><span className={styles.skillStars}>{[...Array(5)].map((_, i) => (<span key={i} className={`${styles.star} ${i < (skill.skillLevel || 0) ? styles.checked : ""}`}>★</span>))}</span></li>))) : ( <li>Skills will appear here.</li> )}</ul></div>
                <div className={styles.summary}><h4 className={styles.h4Headers}>Summary</h4><p>{typeof summaryPreview === "string" && summaryPreview ? summaryPreview : "Summary will appear here."}</p></div>
                <div className={styles.references}><h4 className={styles.h4Headers}>References</h4>{(referencesPreview || []).length > 0 ? (referencesPreview.map((ref, index) => (<p key={index}>{ref.referenceName || "Name"} - {ref.position || "Position"} at {ref.company || "Company"} - {ref.contact || "Email"}</p>))) : ( <p>References will appear here.</p> )}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
=======
                  <div className={styles.profilePara}><h4 className={styles.h4Headers}>Profile</h4><p>{personalInfoPreview.profileParagraph || "Your profile summary"}</p></div>
                  <div className={styles.experience}><h4 className={styles.h4Headers}>Professional Experience</h4>{(experiencePreview || []).map((exp, index) => (<div key={index} className={styles.experienceItem}><h5>{exp.jobTitle || "Job Title"}</h5><p className={styles.companyName}>{exp.companyName}</p><span>{formatDateForDisplay(exp.jstartDate)} - {formatDateForDisplay(exp.jendDate)}</span><p>{exp.jobDescription || "Job description"}</p></div>))}</div>
                  {/* ✅ FIX: className must use a template literal wrapped in {} */}
                  <div className={styles.skillsColumns}><h4 className={styles.h4Headers}>Skills</h4><ul className={styles.skillsList}>{(skillsPreview || []).map((skill, index) => (<li key={index} className={styles.skillRow}><span className={styles.skillName}>{skill.skillName || "Skill"}</span><span className={styles.skillStars}>{[...Array(5)].map((_, i) => (<span key={i} className={`${styles.star} ${i < (skill.skillLevel || 0) ? styles.checked : ""}`}>★</span>))}</span></li>))}</ul></div>
                  <div className={styles.summary}><h4 className={styles.h4Headers}>Summary</h4><p>{summaryPreview || "Summary will appear here."}</p></div>
                  <div className={styles.references}><h4 className={styles.h4Headers}>References</h4>{(referencesPreview || []).map((ref, index) => (<p key={index}>{ref.referenceName || "Name"} - {ref.position || "Position"} at {ref.company || "Company"} - {ref.contact || "Email"}</p>))}</div>
              </div>
          </div>
        </div>
      </main>
    </div>
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
  );
};

export default Cv2;