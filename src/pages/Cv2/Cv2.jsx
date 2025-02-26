import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./Cv2.module.css"; // Import CSS Module

const Cv2 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    initials: "",
    jobTitle: "",
    address: "",
    address2: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div>


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
            <button className={styles.navButton} onClick={() => navigate('/')}>Previous</button>
            <button className={styles.navButton} onClick={() => navigate('/Cv3')}>Next</button>
          </div>
          <div className={styles.formContainer}>
            <h3>Education Details</h3>
            <form onSubmit={handleSubmit}>
              <h4>School Details</h4>
              <input type="text" name="SchoolName" placeholder="School Name" value={formData.SchoolName} onChange={handleChange} required />
              <div className={styles.formColumns}>
                <div className={styles.formLeft}>
                  <input type="date" name="startDate" placeholder="Entry Date" value={formData.startDate} onChange={handleChange} required />
                </div>
                <div className={styles.formRight}>
                  <input type="date" name="endDate" placeholder="Leaving Date" value={formData.endDate} onChange={handleChange} required />
                </div>
              </div>
              <input type="textarea" name="more-details" placeholder="More Details" value={formData["more-details"]} onChange={handleChange} required />

              <h4>University Details</h4>
              <input type="text" name="universityName" placeholder="University Name" value={formData.universityName} onChange={handleChange} required />
              <div className={styles.formColumns}>
                <div className={styles.formLeft}>
                  <input type="date" name="uniStartDate" placeholder="Entry Date" value={formData.uniStartDate} onChange={handleChange} required />
                </div>
                <div className={styles.formRight}>
                  <input type="date" name="uniEndDate" placeholder="Leaving Date" value={formData.uniEndDate} onChange={handleChange} required />
                </div>
              </div>
              <input type="textarea" name="uniMore-details" placeholder="About Your Degree Program & Degree" value={formData["uniMore-detail"]} onChange={handleChange} required />
              <button type="submit" className={styles.saveBtn}>Save</button>
            </form>
          </div>

          <div className={styles.cvPreview}>
            <div className={styles.cvHeader}>
              <h2>{formData.fullName || "Saman Kumara"}</h2>
              <h3>{formData.jobTitle || "Full Stack Developer"}</h3>
            </div>
            <p className={styles.contactInfo}>{formData.phone || "0771200506"} </p>
            <p>{formData.email || "samankumara@gmail.com"}</p>
            <p className={styles.userInfo}>
              {formData["user-info"] ||
                "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. " +
                "The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. " +
                "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy."
              }
            </p>
            <section className={styles.cvSection}>
              <h4>Education Details</h4>
              <div className={styles.education}>
                <div className={styles.school}>
                  <h5>{formData.SchoolName || "Rahula Collage Matara"}</h5>
                  <span>{formData.startDate || "2018.01.5"}</span> to <span>{formData.endDate || "2021.12.1"} </span>
                  <p>{formData["more-details"] || "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old."}</p>
                </div>
                <div className={styles.uni}>
                  <h5>{formData.universityName || "University of Moratuwa"}</h5>
                  <span>{formData.uniStartDate || "2022.01.5"} </span> to <span>{formData.uniEndDate || "2025.12.1"}</span>
                  <p>{formData["uniMore-details"] || "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old."}</p>
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default Cv2;