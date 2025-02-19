import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Cv5.module.css"; // Importing the CSS Module
import { FaFilePdf, FaPlus } from "react-icons/fa";

function Cv5() {
  const navigate = useNavigate();
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
      <div className={styles.resumeDashboard}>
        {/* My Resume Section */}
        <h2 className={styles.sectionTitle}>My Resume</h2>
        <div className={styles.resumeCards}>
          <Link to="/Cv" className={styles.resumeCard}>
            <FaPlus className={styles.resumeIcon} />
            <div>
              <p>Create New Resume</p>
              <span>PDF</span>
            </div>
          </Link>
          <Link to="/resume/software-engineer" className={styles.resumeCard}>
            <FaFilePdf className={styles.resumeIcon} />
            <div>
              <p>Software Engineer</p>
              <span>PDF</span>
            </div>
          </Link>
          <Link to="/resume/project-manager" className={styles.resumeCard}>
            <FaFilePdf className={styles.resumeIcon} />
            <div>
              <p>Project Manager</p>
              <span>PDF</span>
            </div>
          </Link>
        </div>

        {/* CV Preview Section */}
        <div className={styles.cvPreview}>
          <div className={styles.cvHeader}>
            <h2>Saman Kumara</h2>
            <p>Full Stack Developer</p>
          </div>
          <div className={styles.cvContact}>
            <span>0771200506</span>
            <span>saman.kumara@gmail.com</span>
          </div>
          <p className={styles.cvSummary}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
            been the industry's standard dummy text ever since the 1500s...
          </p>

          <h3 className={styles.cvSubtitle}>Professional Experience</h3>

          <div className={styles.cvExperience}>
            <h4>Full Stack Developer</h4>
            <span>26 December 2024</span>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
              has been the industry's standard dummy text ever since the 1500s...
            </p>
          </div>

          <div className={styles.cvExperience}>
            <h4>Software Engineer</h4>
            <span>26 December 2024</span>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
              has been the industry's standard dummy text ever since the 1500s...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cv5;
