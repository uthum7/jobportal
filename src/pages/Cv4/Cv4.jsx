import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; 
import axios from "axios";
import styles from "./Cv4.module.css"; // Import CSS Module

const Cv4 = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    jobTitle: "Software Engineer",
    phone: "123-456-7890",
    email: "john.doe@example.com",
    userInfo: "Experienced software engineer with a passion for developing innovative programs.",
    SchoolName: "High School",
    startDate: "2010",
    endDate: "2014",
    moreDetails: "Graduated with honors.",
    universityName: "State University",
    uniStartDate: "2014",
    uniEndDate: "2018",
    uniMoreDetails: "Bachelor of Science in Computer Science."
  });
  const [skills, setSkills] = useState([
    { name: "JavaScript", rating: 4 },
    { name: "React", rating: 5 },
    { name: "Node.js", rating: 4 }
  ]);

  const enhanceSummary = async () => {
    if (!summary.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post("/api/generate-summary", { text: summary });
      setSummary(response.data.enhancedSummary);
    } catch (error) {
      console.error("Error enhancing summary:", error);
    }
    setLoading(false);
  };

  return (
    <div>
      <nav className={styles.navbar}>
        <h1 className={styles.logo}>JOB PORTAL</h1>
        <div className={styles.navLinks}>
          <button>For Candidates</button>
          <button>For Employers</button>
          <button>Pages</button>
          <button>Help</button>
        </div>
      </nav>

      <div className={styles.resumeBuilder}>
        <aside className={styles.sidebar}>
          <div className={styles.profile}>
            <img src="profile.jpg" alt="User" className={styles.profileImg} />
            <h4>Piyumi Hansamali</h4>
            <span className={styles.rating}>⭐⭐⭐⭐⭐ 4.7</span>
          </div>
          <nav>
            <ul>
              <li>📋 My Profile</li>
              <li className={styles.active}>📄 My Resumes</li>
              <li>✅ Applied Jobs</li>
            </ul>
          </nav>
        </aside>

        <main className={styles.content}>
          <div className={styles.navigationButtons}>
            <button className={styles.navButton} onClick={() => navigate('/Cv3')}>Previous</button>
            <button className={styles.navButton} onClick={() => navigate('/Cv5')}>Next</button>
          </div>

          <div className={styles.summaryContainer}>
            <h3>Summary</h3>
            <div className={styles.labelButtonContainer}>
              <label>Add Summary Your Job Title</label>
              <button
                onClick={enhanceSummary}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate From AI"}
              </button>
            </div>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Add your summary"
            ></textarea>
            <button
              className={styles.saveButton}
              onClick={() => alert("Summary Saved!")}
            >
              Save
            </button>
          </div>

          <div className={styles.cvPreview}>
            <div className={styles.cvHeader}>
              <h2>{formData.fullName}</h2>
              <h3>{formData.jobTitle}</h3>
            </div>
            <p className={styles.contactInfo}>{formData.phone}</p>
            <p>{formData.email}</p>
            <p className={styles.userInfo}>{formData.userInfo}</p>

            <section className={styles.cvSection}>
              <h4>Education Details</h4>
              <div className={styles.education}>
                <div className={styles.school}>
                  <h5>{formData.SchoolName}</h5>
                  <span>{formData.startDate}</span> to <span>{formData.endDate}</span>
                  <p>{formData.moreDetails}</p>
                </div>
                <div className={styles.uni}>
                  <h5>{formData.universityName}</h5>
                  <span>{formData.uniStartDate}</span> to <span>{formData.uniEndDate}</span>
                  <p>{formData.uniMoreDetails}</p>
                </div>
              </div>
            </section>
            <section className={styles.cvSection}>
              <h4>Professional Experience</h4>
              <div className={styles.job}>
                <div className={styles.jobHeader}>
                  <h5>Full Stack Developer</h5>
                  <span>26 December 2024</span>
                </div>
                <p>Lorem Ipsum is simply dummy text of the printing industry...</p>
              </div>
              <div className={styles.job}>
                <div className={styles.jobHeader}>
                  <h5>Software Engineer</h5>
                  <span>26 December 2024</span>
                </div>
                <p>Lorem Ipsum is simply dummy text of the printing industry...</p>
              </div>
            </section>
            <section className={styles.cvSection}>
              <h4>Professional Skills</h4>
              <div className={styles.skillsPreview}>
                {skills.map((skill, index) => (
                  <div key={index} className={styles.skillPreviewItem}>
                    <span className={styles.skillName}>{skill.name}</span>
                    <div className={styles.skillRating}>
                      {'★'.repeat(skill.rating).padEnd(5, '☆')}
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section className={styles.cvSection}>
              <h4>Summary</h4>
              <p>{summary}</p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Cv4;