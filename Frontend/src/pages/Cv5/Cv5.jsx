// pages/Cv5/Cv5.jsx
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

const Cv5 = () => {
  const navigate = useNavigate();
  const {
    resumeData: contextResumeData,
    fetchResumeData: contextFetchResumeData,
    loading: contextLoading,
    error: contextError,
  } = useCVForm();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [pageError, setPageErrorLocal] = useState(null);
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
      contextFetchResumeData().finally(() => setIsPageLoading(false));
    } else {
      setIsPageLoading(false);
    }
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
      // Options for html-to-image to improve reliability
      const options = {
        cacheBust: true,
        pixelRatio: 1.5, // Reduced from 2 for better performance/less memory usage
        style: {
          // Temporarily override styles that might interfere with rendering
          boxShadow: 'none',
        }
      };

      const dataUrl = await toPng(element, options);
      
      const pdf = new jsPDF({
        orientation: 'p', // portrait
        unit: 'mm', // millimeters
        format: 'a4' // A4 size page
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(dataUrl);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let position = 0;
      let heightLeft = imgHeight;

      // Add the first page
      pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdf.internal.pageSize.getHeight();

      // Add new pages if the content is longer than one page
      while (heightLeft > 0) {
        position = -heightLeft;
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
      
      pdf.save('resume.pdf');
      toast.dismiss(); // Dismiss the loading toast
      toast.success("Your CV has been downloaded!");

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.dismiss();
      toast.error('Sorry, there was an error generating the PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

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
      <div className={styles.resumeBuilder}>
        <main className={styles.content}>
          <div className={styles.formContainer}>
            <h3 className={styles.header}>Actions</h3>
            <p>Your CV is ready. Review the preview on the right and download or share it.</p>
            <button type="button" className={styles.downloadBtn} onClick={handleDownloadPdf} disabled={isDownloading}>
              {isDownloading ? 'Generating PDF...' : 'Download CV as PDF'}
            </button>
            <button type="button" className={styles.shareBtn} onClick={toggleShareOptions}>Share CV</button>
            {showShareOptions && (
              <div className={styles.shareOptionsContainer}>
                <button onClick={() => handleShare('whatsapp')} className={`${styles.shareOptionBtn} ${styles.whatsapp}`}>WhatsApp</button>
                <button onClick={() => handleShare('facebook')} className={`${styles.shareOptionBtn} ${styles.facebook}`}>Facebook</button>
                <button onClick={() => handleShare('linkedin')} className={`${styles.shareOptionBtn} ${styles.linkedin}`}>LinkedIn</button>
              </div>
            )}
            <button type="button" className={styles.editBtn} onClick={() => navigate('/cv-builder/personal-details')}>
              Back to Editor
            </button>
          </div>
          
          <div className={styles.cvPreview} ref={cvPreviewRef}>
            <div className={styles.cvContainer}>
              <div className={styles.cvLeft}>
                <div className={styles.profileSection}>
                  <img src={cvPreviewImageSrc} alt="Profile" className={styles.profileImage} />
                  <h3>{personalInfo.jobTitle || "Your Profession"}</h3>
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
              </div>
              <div className={styles.verticalLine}></div>
              <div className={styles.cvRight}>
                <div className={styles.profilePara}><h4 className={styles.h4Headers}>Profile</h4><p>{personalInfo.profileParagraph || "Your profile summary will appear here."}</p></div>
                <div className={styles.experience}><h4 className={styles.h4Headers}>Professional Experience</h4>{(experiencePreview || []).length > 0 ? (experiencePreview.map((exp, index) => (<div key={index} className={styles.experienceItem}><h5>{exp.jobTitle || "Job Title"}</h5><p className={styles.companyName}>{exp.companyName}</p><span>{formatDate(exp.jstartDate)} - {formatDate(exp.jendDate)}</span><p>{exp.jobDescription || "Job description"}</p></div>))) : (<p>Experience details will appear here.</p>)}</div>
                <div className={styles.skillsColumns}><h4 className={styles.h4Headers}>Skills</h4><ul className={styles.skillsList}>{Array.isArray(skillsPreview) && skillsPreview.length > 0 ? (skillsPreview.map((skill, index) => (<li key={index} className={styles.skillRow}><span className={styles.skillName}>{skill.skillName || "Skill"}</span><span className={styles.skillStars}>{[...Array(5)].map((_, i) => (<span key={i} className={`${styles.star} ${i < (skill.skillLevel || 0) ? styles.checked : ""}`}>★</span>))}</span></li>))) : (<li>Skills will appear here.</li>)}</ul></div>
                <div className={styles.summary}><h4 className={styles.h4Headers}>Summary</h4><p>{summaryPreview || "Summary will appear here."}</p></div>
                <div className={styles.references}><h4 className={styles.h4Headers}>References</h4>{(referencesPreview || []).length > 0 ? (referencesPreview.map((ref, index) => (<p key={index}>{ref.referenceName || "Name"} - {ref.position || "Position"} at {ref.company || "Company"} - {ref.contact || "Email"}</p>))) : (<p>References will appear here.</p>)}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Cv5;