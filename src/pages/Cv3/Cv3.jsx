import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Cv3.module.css';
import { useCVForm } from '../../context/CVFormContext';

const Cv3 = () => {
  const navigate = useNavigate();
  const { resumeData, addSkill, updateSkill, removeSkill, saveToDatabase } = useCVForm();
  const [skillName, setSkillName] = useState('');
  const [skillRating, setSkillRating] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    if (resumeData.skill.length > 0 && editingIndex !== null) {
      const skill = resumeData.skill[editingIndex];
      setSkillName(skill.skillName);
      setSkillRating(parseInt(skill.skillLevel));
    }
  }, [editingIndex, resumeData.skill]);

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
    await saveToDatabase("skill", resumeData.skill);
    alert("Skills saved successfully");
  };

  return (
    <div className={styles.resumeBuilder}>
      <main className={styles.content}>
        <div className={styles.navigationButtons}>
          <button className={styles.navButton} onClick={() => navigate('/Cv2')}>Previous</button>
          <button className={styles.navButton} onClick={() => navigate('/Cv4')}>Next</button>
        </div>

        <div className={styles.formContainer}>
          <h2>Skills</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.skillForm}>
              <div className={styles.skillInput}>
                <input
                  type="text"
                  placeholder="Skill Name"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                />
                <select
                  value={skillRating}
                  onChange={(e) => setSkillRating(parseInt(e.target.value))}
                >
                  <option value="0">Select Rating</option>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <option key={val} value={val}>{val} Star{val > 1 && 's'}</option>
                  ))}
                </select>
                <button type="button" onClick={handleAddOrUpdateSkill}>
                  {editingIndex !== null ? 'Update Skill' : 'Add Skill'}
                </button>
              </div>

              <div className={styles.skillsList}>
                {resumeData.skill.map((skill, index) => (
                  <div key={index} className={styles.skillItem}>
                    <span>{skill.skillName}</span>
                    <div className={styles.stars}>
                      {'★'.repeat(parseInt(skill.skillLevel)).padEnd(5, '☆')}
                    </div>
                    <div className={styles.skillActions}>
                      <button type="button" onClick={() => handleEdit(index)}>Edit</button>
                      <button type="button" onClick={() => handleDelete(index)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button type="submit">Save</button>
          </form>
        </div>

        {/* 🧾 CV Preview */}
        <div className={styles.cvPreview}>
          <div className={styles.cvContainer}>
            <div className={styles.cvLeft}>
              {/* Profile */}
              <div className={styles.profileSection}>
                <img
                  src={resumeData.personalInfo?.profilePicture || "profile.jpg"}
                  alt="Profile"
                  className={styles.profileImage}
                />
                <h3>{resumeData.personalInfo?.jobTitle || "Your Profession"}</h3>
                <h2>{resumeData.personalInfo?.fullName || "Your Name"}</h2>
              </div>

              {/* Contact Info */}
              <div className={styles.contactInfo}>
                <h4>Contact</h4>
                <p>{resumeData.personalInfo?.phone || "Phone"}</p>
                <p>{resumeData.personalInfo?.email || "Email"}</p>
                <p>{resumeData.personalInfo?.address || "Address"}</p>
              </div>

              {/* Education */}
              <div className={styles.education}>
                <h4>Education</h4>
                {Array.isArray(resumeData.educationDetails) &&
                  resumeData.educationDetails.map((edu, index) => (
                    <div key={index} className={styles.educationItem}>
                      <h5>{edu.universitiyName || edu.SchoolName}</h5>
                      <span>{edu.uniStartDate || edu.startDate} - {edu.uniEndDate || edu.endDate}</span>
                      <p>{edu.uniMoreDetails || edu.moreDetails}</p>
                    </div>
                  ))}
              </div>
            </div>

            <div className={styles.verticalLine}></div>

            <div className={styles.cvRight}>
              {/* Profile Paragraph */}
              <div className={styles.profilePara}>
                <h4>Profile</h4>
                <p>{resumeData.personalInfo?.profileParagraph || "Profile paragraph..."}</p>
              </div>

              {/* Experience */}
              <div className={styles.experience}>
                <h4>Professional Experience</h4>
                {resumeData.professionalExperience.map((exp, index) => (
                  <div key={index} className={styles.experienceItem}>
                    <h5>{exp.pjobTitle}</h5>
                    <span>{exp.jstartDate} - {exp.jendDate}</span>
                    <p>{exp.jobDescription}</p>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className={styles.skillsColumns}>
                <h4>Skills</h4>
                <ul>
                  {resumeData.skill.map((skill, index) => (
                    <li key={index} className={styles.listItem}>
                      {skill.skillName} - {'★'.repeat(skill.skillLevel)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Summary */}
              <div className={styles.summary}>
                <h4>Summary</h4>
                <p>{resumeData.summary || "Your personal summary statement."}</p>
              </div>

              {/* References */}
              <div className={styles.references}>
                <h4>References</h4>
                {resumeData.references?.map((ref, index) => (
                  <p key={index}>
                    {ref.name} - {ref.position} at {ref.company} - {ref.contact}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cv3;
