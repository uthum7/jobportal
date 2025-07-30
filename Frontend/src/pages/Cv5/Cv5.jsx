// pages/Cv5/Cv5.jsx
<<<<<<< HEAD

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cv5.module.css"; // Assuming CSS file is named Cv5.module.css
import { isAuthenticated } from "../../utils/auth";
import { useCVForm } from "../../context/CVFormContext";
import axios from 'axios';

// --- IMPORTS for PDF Download ---
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

const initialFormStateValues = {
  personalInfo: {
    fullname: "", nameWithInitials: "", jobTitle: "", address: "",
    addressOptional: "", email: "", phone: "", profileParagraph: "",
    profilePicture: null,
  },
  educationDetails: {}, skill: [], summary: "",
  professionalExperience: [], references: [],
};

// --- FIX: Component name is now correctly Cv5 ---
=======
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cv5.module.css";
import { isAuthenticated } from "../../utils/auth";
import { useCVForm } from "../../context/CVFormContext";
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner'; // Import toast for better feedback

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

>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
const Cv5 = () => {
  const navigate = useNavigate();
  const {
    resumeData: contextResumeData,
<<<<<<< HEAD
    saveToDatabase,
    fetchResumeData: contextFetchResumeData,
    loading: contextLoading,
    error: contextError,
    setError: setContextError,
=======
    fetchResumeData: contextFetchResumeData,
    loading: contextLoading,
    error: contextError,
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
  } = useCVForm();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [pageError, setPageErrorLocal] = useState(null);
<<<<<<< HEAD
  const [localPreviewImgUrl, setLocalPreviewImgUrl] = useState(null);
  const [personalInfo, setPersonalInfo] = useState(initialFormStateValues.personalInfo);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const cvPreviewRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

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
      if (setContextError) setContextError(null);
=======
  const [showShareOptions, setShowShareOptions] = useState(false);
  const cvPreviewRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const hasAttemptedFetch = useRef(false);

  // All preview states initialized correctly
  const [personalInfo, setPersonalInfo] = useState({});
  const [educationPreview, setEducationPreview] = useState([]);
  const [experiencePreview, setExperiencePreview] = useState([]);
  const [skillsPreview, setSkillsPreview] = useState([]);
  const [summaryPreview, setSummaryPreview] = useState("");
  const [referencesPreview, setReferencesPreview] = useState([]);
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }
    if (!hasAttemptedFetch.current) {
      hasAttemptedFetch.current = true;
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
      contextFetchResumeData().finally(() => setIsPageLoading(false));
    } else {
      setIsPageLoading(false);
    }
<<<<<<< HEAD
  }, [contextFetchResumeData, navigate, setContextError]);

  useEffect(() => {
    if (contextResumeData) {
      const newContextPI = contextResumeData.personalInfo || initialFormStateValues.personalInfo;
      setPersonalInfo(prevLocalPI => ({ ...prevLocalPI, ...newContextPI, profilePicture: prevLocalPI.profilePicture instanceof File ? prevLocalPI.profilePicture : newContextPI.profilePicture }));
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
      setPersonalInfo(prev => ({ ...prev, profilePicture: files[0] }));
    } else {
      setPersonalInfo(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEnhanceProfile = async () => {
    const profileText = personalInfo.profileParagraph;
    if (!profileText?.trim()) {
      alert("Please write something in your profile before enhancing with AI.");
      return;
    }
    setIsAiLoading(true);
    setPageErrorLocal(null);
    try {
      const response = await axios.post("http://localhost:5001/api/ai/enhance-summary", { summary: profileText });
      if (response.data?.enhancedSummary) {
        setPersonalInfo(prev => ({ ...prev, profileParagraph: response.data.enhancedSummary }));
      } else {
        throw new Error("AI response was not in the expected format.");
      }
    } catch (error) {
      const errMsg = error.response?.data?.error || error.message || "AI enhancement failed.";
      setPageErrorLocal(errMsg);
    } finally {
      setIsAiLoading(false);
    }
  };

  // This function will toggle the visibility of the share buttons
  const toggleShareOptions = () => {
    setShowShareOptions(prev => !prev);
  };

  const handleShare = (platform) => {
    // IMPORTANT: For sharing to work, your app needs to be deployed online
    // so it has a public URL. For testing, we'll use a placeholder.
    const cvUrl = window.location.href; // This gets the current page URL
    const shareText = "Check out my new resume created with this awesome CV Builder!";
    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + cvUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cvUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(cvUrl)}&title=My%20Professional%20Resume&summary=${encodeURIComponent(shareText)}`;
        break;
      default:
        return;
    }

    // Open the share link in a new browser tab/window
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };


  const handleDownloadPdf = async () => {
    const element = cvPreviewRef.current;
    if (!element) {
      console.error("CV preview element not found!");
      alert("Could not find the CV to download. Please try refreshing the page.");
      return;
    }
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(element, { cacheBust: true, pixelRatio: 2 });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(dataUrl);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }
      pdf.save('your-resume.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Sorry, there was an error generating the PDF.');
=======
  }, [contextFetchResumeData, navigate]);

  useEffect(() => {
    if (contextResumeData) {
      setPersonalInfo(contextResumeData.personalInfo || {});
      setEducationPreview(contextResumeData.educationDetails || []);
      setExperiencePreview(contextResumeData.professionalExperience || []);
      setSkillsPreview(contextResumeData.skill || []);
      setSummaryPreview(contextResumeData.summary || "");
      setReferencesPreview(contextResumeData.references || []);
    }
  }, [contextResumeData]);

  const toggleShareOptions = () => setShowShareOptions(prev => !prev);

  const handleShare = (platform) => {
    const cvUrl = window.location.href;
    const shareText = "Check out my resume!";
    let shareUrl = '';
    // ✅ FIX: URLs with variables must use template literals (backticks)
    switch (platform) {
      case 'whatsapp': shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + cvUrl)}`; break;
      case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cvUrl)}`; break;
      case 'linkedin': shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(cvUrl)}&title=My%20Professional%20Resume&summary=${encodeURIComponent(shareText)}`; break;
      default: return;
    }
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  // ===============================================
  // ===        UPDATED DOWNLOAD FUNCTION        ===
  // ===============================================
  const handleDownloadPdf = async () => {
    const element = cvPreviewRef.current;
    if (!element) {
      toast.error("CV preview element not found. Please refresh the page.");
      return;
    }
    
    setIsDownloading(true);
    toast.loading("Generating your PDF...");

    try {
      const options = {
        cacheBust: true,
        pixelRatio: 1.5,
        style: {
          boxShadow: 'none',
        }
      };

      const dataUrl = await toPng(element, options);
      
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(dataUrl);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let position = 0;
      let heightLeft = imgHeight;

      pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position = -heightLeft;
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
      
      pdf.save('resume.pdf');
      toast.dismiss();
      toast.success("Your CV has been downloaded!");

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.dismiss();
      toast.error('Sorry, there was an error generating the PDF. Please try again.');
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
    } finally {
      setIsDownloading(false);
    }
  };

<<<<<<< HEAD
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (setContextError) setContextError(null);
    setPageErrorLocal(null);
    try {
      await saveToDatabase("personalInfo", personalInfo);
      alert("Personal details saved successfully!");
      navigate("/cv-builder/education");
    } catch (err) {
      console.error("Error during handleSubmit:", err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Present";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString(undefined, { year: "numeric", month: "short" });
  };

  const displayedError = pageError || (contextError ? (typeof contextError === 'string' ? contextError : contextError.message) : null);

  if (isPageLoading) return <div className={styles.loading}>Loading CV Builder...</div>;
  if (displayedError) return (
    <div className={styles.error}>
      <p>Error: {displayedError}</p>
      <button onClick={() => {/* Your error handling logic */ }}>Try Again</button>
    </div>
  );

  let cvPreviewImageSrc = localPreviewImgUrl || "/default-profile.png";

  return (
    <>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Final Preview & Download</h1>
        <p className={styles.pageSubtitle}>Review your completed CV and download it as a PDF.</p>
      </header>
=======
  const displayedError = pageError || (contextError ? contextError.message : null);

  if (isPageLoading) return <div className={styles.loading}>Finalizing your CV...</div>;
  if (displayedError) return <div className={styles.error}><p>Error: {displayedError}</p></div>;

  let cvPreviewImageSrc = personalInfo.profilePicture || "/default-profile.png";

  return (
    <>
       <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Final Preview & Download</h1>
        <p className={styles.pageSubtitle}>Review your completed CV and download it as a PDF.</p>
      </header> 
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
      <div className={styles.resumeBuilder}>
        <main className={styles.content}>
          <div className={styles.formContainer}>
            <h3 className={styles.header}>Actions</h3>
<<<<<<< HEAD
            <p>Your CV is ready. Review the preview on the right and download it when you're satisfied.</p>

            <button
              type="button"
              className={styles.downloadBtn}
              onClick={handleDownloadPdf}
              disabled={isDownloading}
            >
              {isDownloading ? 'Generating PDF...' : 'Download CV as PDF'}
            </button>


            {/* --- ADD THE NEW SHARE BUTTON AND OPTIONS HERE --- */}
            <button
              type="button"
              className={styles.shareBtn} // New style for the main share button
              onClick={toggleShareOptions}
            >
              Share CV
            </button>

            {/* This block will only show up when you click the "Share CV" button */}
            {showShareOptions && (
              <div className={styles.shareOptionsContainer}>
                <button onClick={() => handleShare('whatsapp')} className={`${styles.shareOptionBtn} ${styles.whatsapp}`}>Share on WhatsApp</button>
                <button onClick={() => handleShare('facebook')} className={`${styles.shareOptionBtn} ${styles.facebook}`}>Share on Facebook</button>
                <button onClick={() => handleShare('linkedin')} className={`${styles.shareOptionBtn} ${styles.linkedin}`}>Share on LinkedIn</button>
              </div>
            )}

            <button
              type="button"
              className={styles.editBtn} // You would need to style this button
              onClick={() => navigate('/cv-builder/personal-details')} // Or your first step route
            >
              Back to Editor
            </button>
          </div>

          {/* CV Preview Section with attached ref */}
=======
            <p>Your CV is ready. Review the preview on the right and download or share it.</p>
            <button type="button" className={styles.downloadBtn} onClick={handleDownloadPdf} disabled={isDownloading}>
              {isDownloading ? 'Generating PDF...' : 'Download CV as PDF'}
            </button>
            <button type="button" className={styles.shareBtn} onClick={toggleShareOptions}>Share CV</button>
            {showShareOptions && (
              <div className={styles.shareOptionsContainer}>
                {/* ✅ FIX: className must use a template literal wrapped in {} */}
                <button onClick={() => handleShare('whatsapp')} className={`${styles.shareOptionBtn} ${styles.whatsapp}`}>WhatsApp</button>
                <button onClick={() => handleShare('facebook')} className={`${styles.shareOptionBtn} ${styles.facebook}`}>Facebook</button>
                <button onClick={() => handleShare('linkedin')} className={`${styles.shareOptionBtn} ${styles.linkedin}`}>LinkedIn</button>
              </div>
            )}
            <button type="button" className={styles.editBtn} onClick={() => navigate('/cv-builder/personal-details')}>
              Back to Editor
            </button>
          </div>
          
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
          <div className={styles.cvPreview} ref={cvPreviewRef}>
            <div className={styles.cvContainer}>
              <div className={styles.cvLeft}>
                <div className={styles.profileSection}>
                  <img src={cvPreviewImageSrc} alt="Profile" className={styles.profileImage} />
                  <h3>{personalInfo.jobTitle || "Your Profession"}</h3>
                  <h2>{personalInfo.fullname || "Your Name"}</h2>
                </div>
                <div className={styles.contactInfo}><h4 className={styles.h4Headers}>Contact</h4><p>{personalInfo.phone || "Phone"}</p><p>{personalInfo.email || "Email"}</p><p>{personalInfo.address || "Address"}</p></div>
<<<<<<< HEAD
                <div className={styles.education}><h4 className={styles.h4Headers}>Education</h4>{(educationPreview.universitiyName || educationPreview.schoolName) ? (<div className={styles.educationItem}>{(educationPreview.universitiyName) && (<><h5>{educationPreview.universitiyName || "University Name"}</h5><span>{formatDate(educationPreview.uniStartDate)} - {formatDate(educationPreview.uniEndDate)}</span><p className={styles.uniPara}>{educationPreview.uniMoreDetails || "Degree details"}</p></>)}{(educationPreview.schoolName) && (<><h5>{educationPreview.schoolName || "School Name"}</h5><span>{formatDate(educationPreview.startDate)} - {formatDate(educationPreview.endDate)}</span><p>{educationPreview.moreDetails || "Additional details"}</p></>)}</div>) : (<p>Education details will appear here.</p>)}</div>
=======
                
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
                                <p>{edu.gpaOrGrade}</p>
                            </>
                            )}
                        </div>
                        )
                    ))
                    ) : (
                    <p>Education details will appear here.</p>
                    )}
                </div>
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
              </div>
              <div className={styles.verticalLine}></div>
              <div className={styles.cvRight}>
                <div className={styles.profilePara}><h4 className={styles.h4Headers}>Profile</h4><p>{personalInfo.profileParagraph || "Your profile summary will appear here."}</p></div>
<<<<<<< HEAD
                <div className={styles.experience}><h4 className={styles.h4Headers}>Professional Experience</h4>{(experiencePreview || []).length > 0 ? (experiencePreview.map((exp, index) => (<div key={index} className={styles.experienceItem}><h5>{exp.jobTitle || "Job Title"}</h5><p className={styles.companyName}>{exp.companyName}</p><span>{exp.jstartDate ? formatDate(exp.jstartDate) : "Start Date"} - {exp.jendDate ? formatDate(exp.jendDate) : "End Date"}</span><p>{exp.jobDescription || "Job description"}</p></div>))) : (<p>Experience details will appear here.</p>)}</div>
                <div className={styles.skillsColumns}><h4 className={styles.h4Headers}>Skills</h4><ul className={styles.skillsList}>{Array.isArray(skillsPreview) && skillsPreview.length > 0 ? (skillsPreview.map((skill, index) => (<li key={index} className={styles.skillRow}><span className={styles.skillName}>{skill.skillName || "Skill"}</span><span className={styles.skillStars}>{[...Array(5)].map((_, i) => (<span key={i} className={`${styles.star} ${i < (skill.skillLevel || 0) ? styles.checked : ""}`}>★</span>))}</span></li>))) : (<li>Skills will appear here.</li>)}</ul></div>
                <div className={styles.summary}><h4 className={styles.h4Headers}>Summary</h4><p>{typeof summaryPreview === "string" && summaryPreview ? summaryPreview : "Summary will appear here."}</p></div>
                {/* --- FIX: Corrected typo from > O to > 0 --- */}
=======
                <div className={styles.experience}><h4 className={styles.h4Headers}>Professional Experience</h4>{(experiencePreview || []).length > 0 ? (experiencePreview.map((exp, index) => (<div key={index} className={styles.experienceItem}><h5>{exp.jobTitle || "Job Title"}</h5><p className={styles.companyName}>{exp.companyName}</p><span>{formatDate(exp.jstartDate)} - {formatDate(exp.jendDate)}</span><p>{exp.jobDescription || "Job description"}</p></div>))) : (<p>Experience details will appear here.</p>)}</div>
                <div className={styles.skillsColumns}><h4 className={styles.h4Headers}>Skills</h4><ul className={styles.skillsList}>{Array.isArray(skillsPreview) && skillsPreview.length > 0 ? (skillsPreview.map((skill, index) => (<li key={index} className={styles.skillRow}><span className={styles.skillName}>{skill.skillName || "Skill"}</span><span className={styles.skillStars}>
                {/* ✅ FIX: className must use a template literal wrapped in {} */}
                {[...Array(5)].map((_, i) => (<span key={i} className={`${styles.star} ${i < (skill.skillLevel || 0) ? styles.checked : ""}`}>★</span>))}</span></li>))) : (<li>Skills will appear here.</li>)}</ul></div>
                <div className={styles.summary}><h4 className={styles.h4Headers}>Summary</h4><p>{summaryPreview || "Summary will appear here."}</p></div>
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
                <div className={styles.references}><h4 className={styles.h4Headers}>References</h4>{(referencesPreview || []).length > 0 ? (referencesPreview.map((ref, index) => (<p key={index}>{ref.referenceName || "Name"} - {ref.position || "Position"} at {ref.company || "Company"} - {ref.contact || "Email"}</p>))) : (<p>References will appear here.</p>)}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

<<<<<<< HEAD
// --- FIX: Renamed export to match component name ---
=======
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
export default Cv5;