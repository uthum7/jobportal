import React, { useRef } from "react";
import { useCVForm } from "../../context/CVFormContext";
import styles from "./Cv5.module.css";
import html2pdf from "html2pdf.js";

const CVPreview = () => {
  const { resumeData = {} } = useCVForm();
  const cvRef = useRef();
  
  // Set default values for all data fields
  const {
    personalInfo = {
      fullname: "Your Name",
      jobTitle: "Your Profession",
      address: "Your Address",
      email: "your.email@example.com",
      phone: "Phone Number",
      profileParagraph: "Your profile summary"
    },
    educationDetails = {},
    professionalExperience = [],
    skill = [],
    summary = "Professional summary",
    references = [],
  } = resumeData;

  const formatDate = (date) => {
    if (!date) return "Present";
    try {
      return new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const handleDownload = () => {
    try {
      const cvElement = cvRef.current;
      if (!cvElement) {
        console.error("CV element not found");
        return;
      }

      // Create a clone for PDF generation
      const element = cvElement.cloneNode(true);
      
      // Apply compact PDF styles
      element.style.width = "210mm";
      element.style.minHeight = "297mm";
      element.style.margin = "0 auto";
      // element.style.padding = "15mm";
      element.style.boxSizing = "border-box";
      element.style.background = "white";
      element.style.fontSize = "16px";

      // Generate safe filename
      const pdfFilename = `${personalInfo.fullname.replace(/\s+/g, '_')}_Resume.pdf`;

      // Hide original element temporarily
      cvElement.style.visibility = "hidden";
      document.body.appendChild(element);

      // Generate PDF
      html2pdf()
        .set({
          margin: 0,
          filename: pdfFilename,
          image: { type: "jpeg", quality: 1.0 },
          html2canvas: { 
            scale: 2,
            letterRendering: true,
            useCORS: true,
            logging: false,
            windowHeight: element.scrollHeight
          },
          jsPDF: { 
            unit: "mm", 
            format: "a4", 
            orientation: "portrait" 
          },
          pagebreak: { mode: 'avoid-all' }
        })
        .from(element)
        .save()
        .then(() => {
          document.body.removeChild(element);
          cvElement.style.visibility = "visible";
        })
        .catch((error) => {
          console.error("PDF generation error:", error);
          document.body.removeChild(element);
          cvElement.style.visibility = "visible";
        });

    } catch (error) {
      console.error("Error in handleDownload:", error);
    }
  };

  // Style constants
  const headingStyle = {
    fontSize: "14px",
    marginBottom: "8px",
    borderBottom: "1px solid #ddd",
    paddingBottom: "4px",
    fontWeight: "bold"
  };

  const paragraphStyle = {
    fontSize: "11px",
    margin: "5px 0",
    lineHeight: "1.4"
  };

  return (
    <div className={styles.resumeBuilder}>

      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <span>R</span><span>e</span><span>s</span><span>u</span><span>m</span><span>e</span>
          <span> </span>
          <span>B</span><span>u</span><span>i</span><span>l</span><span>d</span><span>e</span><span>r</span>
        </h1>
        <p className={styles.pageSubtitle}>Create your professional CV in minutes with AI integrations</p>
      </header>

      {/* downlord and sharebutton */}
      <div className={styles.buttonGroup}>
        <button 
          className={styles.actionButton} 
          onClick={handleDownload}
        >
          Download Resume
        </button>
        <button 
          className={styles.actionButton} 
          onClick={() => {
            const shareUrl = encodeURIComponent(window.location.href);
            const shareText = encodeURIComponent("Check out my professional resume!");
            const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
            window.open(facebookShare, "_blank");
          }}
        >
          Share Resume
        </button>
      </div>

       {/* CvPrivew */}
      <div 
        className={styles.cvPreview} 
        ref={cvRef}
        style={{
          background: "white",
          margin: "0 auto",
          boxSizing: "border-box",
          width: "210mm",
          height: "600px",
          overflow: "hidden",
        }}
      >
        
        <div className={styles.cvContainer} style={{ display: "flex", gap: "10px" }}>
          <div className={styles.cvLeft} style={{ flex: 1, padding: "10px" }}>
            <div className={styles.profileSection}>
              <img
                src="profile.jpg"
                alt="Profile"
                className={styles.profileImage}
                style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
              />
              <h2 style={{ margin: "8px 0 4px", fontSize: "18px" }}>{personalInfo.fullname}</h2>
              <h3 style={{ margin: "0 0 12px", fontSize: "14px", color: "#555" }}>{personalInfo.jobTitle}</h3>
            </div>
            
            <div className={styles.contactInfo}>
              <h4 className={styles.h4Headers} style={headingStyle}>Contact</h4>
              <p style={paragraphStyle}>{personalInfo.phone}</p>
              <p style={paragraphStyle}>{personalInfo.email}</p>
              <p style={paragraphStyle}>{personalInfo.address}</p>
            </div>

            <div className={styles.education}>
              <h4 className={styles.h4Headers} style={headingStyle}>Education</h4>
              {educationDetails.universitiyName || educationDetails.schoolName ? (
                <div className={styles.educationItem}>
                  {educationDetails.universitiyName && (
                    <>
                      <h5 style={{ margin: "6px 0 2px", fontSize: "13px" }}>{educationDetails.universitiyName}</h5>
                      <span style={{ fontSize: "11px", color: "#666" }}>
                        {formatDate(educationDetails.uniStartDate)} -{" "}
                        {formatDate(educationDetails.uniEndDate)}
                      </span>
                      <p style={{ fontSize: "11px", margin: "4px 0" }}>
                        {educationDetails.uniMoreDetails}
                      </p>
                    </>
                  )}
                  {educationDetails.schoolName && (
                    <>
                      <h5 style={{ margin: "6px 0 2px", fontSize: "13px" }}>{educationDetails.schoolName}</h5>
                      <span style={{ fontSize: "11px", color: "#666" }}>
                        {formatDate(educationDetails.startDate)} -{" "}
                        {formatDate(educationDetails.endDate)}
                      </span>
                      <p style={{ fontSize: "11px", margin: "4px 0" }}>
                        {educationDetails.moreDetails}
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <p style={paragraphStyle}>No education details added yet.</p>
              )}
            </div>
          </div>

          <div className={styles.verticalLine} style={{ borderLeft: "1px solid #eee", height: "auto" }}></div>

          <div className={styles.cvRight} style={{ flex: 2, padding: "10px" }}>
            <div className={styles.profilePara}>
              <h4 className={styles.h4Headers} style={headingStyle}>Profile</h4>
              <p style={paragraphStyle}>{personalInfo.profileParagraph}</p>
            </div>
            
            <div className={styles.experience}>
              <h4 className={styles.h4Headers} style={headingStyle}>Professional Experience</h4>
              {professionalExperience.length > 0 ? (
                professionalExperience.map((exp, index) => (
                  <div key={index} style={{ marginBottom: "12px" }}>
                    <h5 style={{ margin: "6px 0 2px", fontSize: "13px" }}>{exp.jobTitle || "Job Title"}</h5>
                    <span style={{ fontSize: "11px", color: "#666" }}>
                      {exp.jstartDate ? formatDate(exp.jstartDate) : "Start Date"} -{" "}
                      {exp.jendDate ? formatDate(exp.jendDate) : "End Date"}
                    </span>
                    <p style={{ fontSize: "11px", margin: "4px 0" }}>
                      {exp.jobDescription || "Job description"}
                    </p>
                  </div>
                ))
              ) : (
                <p style={paragraphStyle}>No professional experience added yet.</p>
              )}
            </div>
            
            <div className={styles.skillsColumns}>
              <h4 className={styles.h4Headers} style={headingStyle}>Skills</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {skill.length > 0 ? (
                  skill.map((skillItem, index) => (
                    <li key={index} style={{ marginBottom: "4px" }}>
                      <span style={{ fontSize: "11px", display: "inline-block", width: "80px" }}>
                        {skillItem.skillName || "Skill"}
                      </span>
                      <span>
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            style={{
                              color: i < (skillItem.skillLevel || 0) ? "#ffc107" : "#ddd",
                              fontSize: "12px"
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </span>
                    </li>
                  ))
                ) : (
                  <li style={paragraphStyle}>No skills added yet.</li>
                )}
              </ul>
            </div>
            
            <div className={styles.summary}>
              <h4 className={styles.h4Headers} style={headingStyle}>Summary</h4>
              <p style={paragraphStyle}>{summary}</p>
            </div>
            
            <div className={styles.references}>
              <h4 className={styles.h4Headers} style={headingStyle}>References</h4>
              {references.length > 0 ? (
                references.map((ref, index) => (
                  <p key={index} style={{ fontSize: "11px", margin: "4px 0" }}>
                    {ref.referenceName || "Name"} - {ref.position || "Position"} at{" "}
                    {ref.company || "Company"} - {ref.contact || "Email"}
                  </p>
                ))
              ) : (
                <p style={paragraphStyle}>No references added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVPreview;