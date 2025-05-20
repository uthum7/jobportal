import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Cv3.module.css';
import { useCVForm } from '../../context/CVFormContext';

const getUserId = () => {
  return localStorage.getItem("userId");
};

const Cv3 = () => {
  const navigate = useNavigate();
  const {
    resumeData,
    fetchResumeData,
    addSkill,
    updateSkill,
    removeSkill,
    saveToDatabase,
  } = useCVForm();

  const [skillName, setSkillName] = useState('');
  const [skillRating, setSkillRating] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);


  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      fetchResumeData(userId);
    }
  }, []);


  const handleAddOrUpdateSkill = () => {
    if (!skillName || skillRating <= 0) return;

    const newSkill = {
      skillName,
      skillLevel: skillRating.toString(),
    };

    if (editingIndex !== null) {
      updateSkill(editingIndex, newSkill);
      setEditingIndex(null);
    } else {
      addSkill(newSkill);
    }

    setSkillName('');
    setSkillRating(0);
  };


  const handleEdit = (index) => {
    const skill = resumeData.skill[index];
    setSkillName(skill.skillName);
    setSkillRating(parseInt(skill.skillLevel));
    setEditingIndex(index);
  };


  const handleDelete = (index) => {
    removeSkill(index);
    setEditingIndex(null);
    setSkillName('');
    setSkillRating(0);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sanitizedSkills = resumeData.skill.map((skill) => ({
        skillName: skill.skillName,
        skillLevel: skill.skillLevel,
      }));

      await saveToDatabase("skill", sanitizedSkills);
      alert("Skills saved successfully");
      navigate("/Cv4");
    } catch (error) {
      alert("Failed to save skills. Please try again.");
      console.error(error);
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
  const education = resumeData.educationDetails || {};
  const personal = resumeData.personalInfo || {};

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

          {/* formContainer */}
          <div className={styles.formContainer}>
            <h3 className={styles.header}>Skills</h3>
            <form onSubmit={handleSubmit}>
              <div className={styles.formColumns}>
                <div className={styles.formLeft}>
                  <input
                    type="text"
                    name="skillName"
                    placeholder="Skill Name"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                  
                  />

                  <select
                    name="skillRating"
                    value={skillRating}
                    onChange={(e) => setSkillRating(parseInt(e.target.value))}
                    required
                    >
                    <option value="0" className={styles.selectInput}>Select Rating</option>
                    {[1, 2, 3, 4, 5].map((val) => (
                      <option key={val} value={val}>
                        {val} Star{val > 1 && "s"}
                      </option>
                    ))}
                  </select>
                  
                  <div className={styles.skillButtonContainer}><button
                    type="button"
                    className={`${styles.skillButton}`}
                    onClick={handleAddOrUpdateSkill}
                  >
                    {editingIndex !== null ? "Update Skill" : "AddMore"}
                  </button>
                    <button type="submit" className={styles.saveBtn}>
                      Save
                    </button></div>
                    
             
                </div>
              </div>
  
              {/* skill list */}
              <div className={styles.skillsList}>
                {Array.isArray(resumeData.skill) &&
                  resumeData.skill.map((skill, index) =>
                    skill && typeof skill.skillName === 'string' ? (
                      <div key={index} className={styles.skillItem}>
                        <span>{skill.skillName}</span>
                        <div className={styles.skillStars}>
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`${styles.star} ${
                                i < parseInt(skill.skillLevel) ? styles.checked : ""
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <div className={styles.skillActions}>
                          <button
                            type="button"
                            className={styles.editBtn}
                            onClick={() => handleEdit(index)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className={styles.deleteBtn}
                            onClick={() => handleDelete(index)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : null
                  )}
              </div>
              
            </form>

         
            {/* Instructions Section */}
            <div className={styles.instractionSection}>
              <h3>Instructions</h3>
              <ul>
                <li>
                  Add your skills with ratings.
                  <div className={styles.instractionDetail}>
                    Enter skill name and select rating from 1 to 5 stars.
                  </div>
                </li>
                <li>
                  Click "Add Skill" to add new skills.
                  <div className={styles.instractionDetail}>
                    You can edit or delete skills anytime before saving.
                  </div>
                </li>
                <li>
                  Click "Save" to save your changes.
                  <div className={styles.instractionDetail}>
                    Make sure to save before moving to the next step.
                  </div>
                </li>
              </ul>
            </div>
          </div>


          {/* Preview Section */}    
          <div className={styles.cvPreview}>
            <div className={styles.cvContainer}>
              <div className={styles.cvLeft}>

                <div className={styles.profileSection}>
                  <img
                    src={resumeData.personalInfo?.profilePicture || "profile.jpg"}
                    alt="Profile"
                    className={styles.profileImage}
                  />
                  <h3>{resumeData.personalInfo?.jobTitle || "Your Profession"}</h3>
                  <h2>{resumeData.personalInfo?.fullname || "Your Name"}</h2>
                </div>

                <div className={styles.contactInfo}>
                  <h4>Contact</h4>
                  <p>{resumeData.personalInfo?.phone || "Phone"}</p>
                  <p>{resumeData.personalInfo?.email || "Email"}</p>
                  <p>{resumeData.personalInfo?.address || "Address"}</p>
                </div>

                <div className={styles.education}>
                  <h4>Education</h4>
                  {education.universitiyName && (
                    <div className={styles.educationItem}>
                      <h5>{education.universitiyName}</h5>
                      <span>
                        {formatDate(education.uniStartDate)} - {formatDate(education.uniEndDate)}
                      </span>
                      <p>{education.uniMoreDetails}</p>
                    </div>
                  )}
                  {education.schoolName && (
                    <div className={styles.educationItem}>
                      <h5>{education.schoolName}</h5>
                      <span>
                        {formatDate(education.startDate)} - {formatDate(education.endDate)}
                      </span>
                      <p>{education.moreDetails}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.verticalLine}></div>

              <div className={styles.cvRight}>

                <div className={styles.profilePara}>
                  <h4>Profile</h4>
                  <p>{personal.profileParagraph || 'Your profile summary goes here.'}</p>
                </div>

                {/* experience section */}
                <div className={styles.experience}>
                  <h4>Professional Experience</h4>
                  {Array.isArray(resumeData.professionalExperience) &&
                  resumeData.professionalExperience.length > 0 ? (
                    resumeData.professionalExperience.map((exp, index) => (
                      <div key={index} className={styles.experienceItem}>
                        <h5>{exp.jobTitle || "Job Title"}</h5>
                        <span>
                          {exp.jstartDate ? new Date(exp.jstartDate).toLocaleDateString() : "Start Date"} -{" "}
                          {exp.jendDate ? new Date(exp.jendDate).toLocaleDateString() : "End Date"}
                        </span>
                        <p>{exp.jobDescription || "Job Description"}</p>
                      </div>
                    ))
                  ) : (
                    <p>No professional experience added yet.</p>
                  )}
                </div>

                {/*  skills section */}
                <div className={styles.skillsColumns}>
                  <h4 className={styles.h4Headers}>Skills</h4>
                  <ul className={styles.skillsList}>
                    {resumeData.skill && resumeData.skill.length > 0 ? (
                      resumeData.skill.map((skill, index) => (
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
                      <li>No skills added yet</li>
                    )}
                  </ul>
                </div>

                {/*  summary and references section */}
                <div className={styles.summary}>
                  <h4>Summary</h4>
                  <p>{resumeData.summary || 'Your personal summary statement.'}</p>
                </div>

                <div className={styles.references}>
                  <h4>References</h4>
                  {Array.isArray(resumeData.references) && resumeData.references.length > 0 ? (
                    resumeData.references.map((ref, index) => (
                      <p key={index}>
                        {ref.referenceName || "Name"} - {ref.position || "Position"} at {ref.company || "Company"} - {ref.contact || "Contact"}
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

export default Cv3;