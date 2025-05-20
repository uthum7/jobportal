import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cv.module.css";
import { getUserId, isAuthenticated } from "../../utils/auth";
import { useCVForm } from "../../context/CVFormContext";

const Cv = () => {
  const navigate = useNavigate();
  const {
    resumeData,
    updateResumeSection,
    updateEducationDetails,
    loading: contextLoading,
    error: contextError,
  } = useCVForm();

  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [resumeDataState, setResumeData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const personalInfo = resumeDataState.personalInfo || {};
  const educationDetails = resumeDataState.educationDetails || {};

  const hasLoaded = useRef(false);



  const fetchResumeData = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/cv/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch resume data");
      }

      const data = await response.json();
      setResumeData((prev) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, ...(data.personalInfo || {}) },
        educationDetails: data.educationDetails || {},
        skill: Array.isArray(data.skill) ? data.skill : [],
        summary: data.summary || "",
        professionalExperience: Array.isArray(data.professionalExperience)
          ? data.professionalExperience
          : [],
        references: Array.isArray(data.references) ? data.references : [],
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  const loadResume = useCallback(async () => {
    try {
      setIsLoading(true);
      const userId = getUserId();
      if (!userId) throw new Error("User not authenticated");
      await fetchResumeData(userId);
    } catch (err) {
      setLocalError(err.message);
      if (err.message.includes("authenticated")) navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated() && !hasLoaded.current) {
      hasLoaded.current = true;
      loadResume();
    } else if (!isAuthenticated()) {
      setLocalError("User not authenticated");
    }
  }, [loadResume]);



  const handleChange = (e) => {
    const { name, value } = e.target;


    if (
      [
        "fullname",
        "nameWithInitials",
        "jobTitle",
        "address",
        "addressOptional",
        "email",
        "phone",
        "profileParagraph"
      ].includes(name)
    ) {
      setResumeData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [name]: value,
        },
      }));
    }

    else {
      updateEducationDetails({
        [name]: value,
      });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = getUserId();
    const token = localStorage.getItem("authToken");

    if (!userId) {
      setLocalError("User not authenticated. Please login.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:5001/api/cv/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          step: "personalInfo",
          data: personalInfo,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save data");
      }

      alert("Personal details saved successfully");
      navigate("/Cv2");
    } catch (err) {
      setLocalError(err.message || "An error occurred while saving your CV.");
    } finally {
      setIsLoading(false);
    }
  };


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


  if (isLoading || contextLoading || loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (localError || contextError || error) {
    return (
      <div className={styles.error}>
        <p>Error: {localError || contextError || error}</p>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  return (
    <>

      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <span>R</span><span>e</span><span>s</span><span>u</span><span>m</span><span>e</span>
          <span> </span>
          <span>B</span><span>u</span><span>i</span><span>l</span><span>d</span><span>e</span><span>r</span>
        </h1>


        <p className={styles.pageSubtitle}>Create your professional CV in minutes with AI integrations</p>
      </header>

      <div className={styles.resumeBuilder}>

        <main className={styles.content}>
          <div className={styles.formContainer}>
            <h3 className={styles.header}>Personal Details</h3>
            <form onSubmit={handleSubmit}>
              <div className={styles.formColumns}>
                <div className={styles.formLeft}>
                  <input
                    type="text"
                    name="fullname"
                    placeholder="Full Name"
                    value={personalInfo.fullname || ""}
                    onChange={handleChange}
                    required

                  />
                  <input
                    type="text"
                    name="nameWithInitials"
                    placeholder="Name with Initials"
                    value={personalInfo.nameWithInitials || ""}
                    onChange={handleChange}
                    required

                  />
                  <input
                    type="text"
                    name="jobTitle"
                    placeholder="Job Title"
                    value={personalInfo.jobTitle || ""}
                    onChange={handleChange}
                    required

                  />
                </div>
                <div className={styles.formRight}>
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={personalInfo.address || ""}
                    onChange={handleChange}
                    required
                    autoComplete="street-address"
                  />
                  <input
                    type="text"
                    name="addressOptional"
                    placeholder="Address Optional"
                    value={personalInfo.addressOptional || ""}
                    onChange={handleChange}
                    autoComplete="street-address"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={personalInfo.email || ""}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={personalInfo.phone || ""}
                    onChange={handleChange}
                    required
                    autoComplete="tel"
                  />
                </div>
              </div>
              <textarea
                name="profileParagraph"
                placeholder="Add Your Profile Details"
                value={personalInfo.profileParagraph || ""}
                onChange={handleChange}
                autoComplete="off"
                className={styles.profileParagraph}
              />
              <button type="submit" className={styles.saveBtn} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </button>
            </form>

            <div className={styles.instractionSection}>
              <h3>Instructions</h3>
              <ul>
                <li>
                  Fill in your personal details.
                  <div className={styles.instractionDetail}>
                    Enter your full name, contact information, and address accurately.
                  </div>
                </li>
                <li>
                  Click "Save" to save your changes.
                  <div className={styles.instractionDetail}>
                    Make sure to save each section before moving to the next step.
                  </div>
                </li>
                <li>
                  Proceed to the next step.
                  <div className={styles.instractionDetail}>
                    Use the navigation to move through the form sections sequentially.
                  </div>
                </li>
                <li>
                  You can edit your details later.
                  <div className={styles.instractionDetail}>
                    All information can be updated at any time before final submission.
                  </div>
                </li>
              </ul>
            </div>

          </div>

          <div className={styles.cvPreview}>
            <div className={styles.cvContainer}>
              <div className={styles.cvLeft}>
                <div className={styles.profileSection}>
                  <label htmlFor="profilePicture" className={styles.profilePictureLabel}>
                    <img
                      src={
                        previewImg ||
                        (personalInfo.profilePicture
                          ? URL.createObjectURL(personalInfo.profilePicture)
                          : "profile.jpg")
                      }
                      alt="Profile"
                      className={styles.profileImage}
                    />
                    <input
                      type="file"
                      id="profilePicture"
                      name="profilePicture"
                      accept="image/*"
                      onChange={handleChange}
                      style={{ display: "none" }}
                    />
                    <span className={styles.uploadIcon}>📷</span>
                  </label>
                  <h3>{personalInfo.jobTitle || "Your Profession"}</h3>
                  <h2>{personalInfo.fullname || "Your Name"}</h2>
                </div>


                <div className={styles.contactInfo}>
                  <h4 className={styles.h4Headers}>Contact</h4>
                  <p>{personalInfo.phone || "Phone"}</p>
                  <p>{personalInfo.email || "Email"}</p>
                  <p>{personalInfo.address || "Address"}</p>
                </div>

                <div className={styles.education}>
                  <h4 className={styles.h4Headers}>Education</h4>
                  {educationDetails.universitiyName || educationDetails.schoolName ? (
                    <div className={styles.educationItem}>
                      {educationDetails.universitiyName && (
                        <>
                          <h5>{educationDetails.universitiyName || "University Name"}</h5>
                          <span>
                            {formatDate(educationDetails.uniStartDate)} -{" "}
                            {formatDate(educationDetails.uniEndDate)}
                          </span>
                          <p className={styles.uniPara}>
                            {educationDetails.uniMoreDetails || "Degree details"}
                          </p>
                        </>
                      )}
                      {educationDetails.schoolName && (
                        <>
                          <h5>{educationDetails.schoolName || "School Name"}</h5>
                          <span>
                            {formatDate(educationDetails.startDate)} -{" "}
                            {formatDate(educationDetails.endDate)}
                          </span>
                          <p>{educationDetails.moreDetails || "Additional details"}</p>
                        </>
                      )}
                    </div>
                  ) : (
                    <p>No education details added yet.</p>
                  )}
                </div>
              </div>

              <div className={styles.verticalLine}></div>

              <div className={styles.cvRight}>

                <div className={styles.profilePara}>
                  <h4 className={styles.h4Headers}>Profile</h4>
                  <p>{personalInfo.profileParagraph || "Your profile summary"}</p>
                </div>


                <div className={styles.experience}>
                  <h4>Professional Experience</h4>
                  {(resumeDataState.professionalExperience || []).length > 0 ? (
                    resumeDataState.professionalExperience.map((exp, index) => (
                      <div key={index} className={styles.experienceItem}>
                        <h5>{exp.jobTitle || "Job Title"}</h5>
                        <span>
                          {exp.jstartDate ? new Date(exp.jstartDate).toLocaleDateString() : "Start Date"} -{" "}
                          {exp.jendDate ? new Date(exp.jendDate).toLocaleDateString() : "End Date"}
                        </span>
                        <p>{exp.jobDescription || "Job description"}</p>
                      </div>
                    ))
                  ) : (
                    <p>No professional experience added yet.</p>
                  )}
                </div>


                <div className={styles.skillsColumns}>
                  <h4 className={styles.h4Headers}>Skills</h4>
                  <ul className={styles.skillsList}>
                    {Array.isArray(resumeDataState.skill) && resumeDataState.skill.length > 0 ? (
                      resumeDataState.skill.map((skill, index) => (
                        <li key={index} className={styles.skillRow}>
                          <span className={styles.skillName}>{skill.skillName || "Skill"}</span>
                          <span className={styles.skillStars}>
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`${styles.star} ${i < (skill.skillLevel || 0) ? styles.checked : ""
                                  }`}
                              >
                                &#9733;
                              </span>
                            ))}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li>No skills added yet.</li>
                    )}
                  </ul>
                </div>

                <div className={styles.summary}>
                  <h4 className={styles.h4Headers}>Summary</h4>
                  <p>
                    {typeof resumeDataState.summary === "string"
                      ? resumeDataState.summary
                      : "Professional summary"}
                  </p>
                </div>


                <div className={styles.references}>
                  <h4 className={styles.h4Headers}>References</h4>
                  {(resumeDataState.references || []).length > 0 ? (
                    resumeDataState.references.map((ref, index) => (
                      <p key={index}>
                        {ref.referenceName || "Name"} - {ref.position || "Position"} at{" "}
                        {ref.company || "Company"} - {ref.contact || "Email"}
                      </p>
                    ))
                  ) : (
                    <p>No references added yet.</p>
                  )}
                </div>
                
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Cv;