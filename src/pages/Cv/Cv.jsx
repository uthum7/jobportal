import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // Step 1: Import useNavigate
import styles from "./Cv.module.css"; // Import CSS Module

const Cv = () => {
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
            <button className={styles.navButton}>Previous</button>
            <button className={styles.navButton} onClick={() => navigate('/Cv2')}>Next</button>
          </div>
          <div className={styles.formContainer}>
            <h3>Personal Details</h3>
            <form onSubmit={handleSubmit}>
              <div className={styles.formColumns}>
                <div className={styles.formLeft}>
                  <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
                  <input type="text" name="initials" placeholder="Name with Initials" value={formData.initials} onChange={handleChange} required />
                  <input type="text" name="jobTitle" placeholder="Job Title" value={formData.jobTitle} onChange={handleChange} required />
                  <input type="textarea" name="user-info" placeholder="User Info" value={formData["user-info"]} onChange={handleChange} required />
                </div>
                <div className={styles.formRight}>
                  <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
                  <input type="text" name="address2" placeholder="Address 2" value={formData.address2} onChange={handleChange} />
                  <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                  <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                </div>
              </div>
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
                  <h5>Rahula Collage Matara</h5>
                  <span>2018.01.5 to 2021.12.1</span>
                  <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.</p>
                </div>
                <div className={styles.uni}>
                  <h5>University of Moratuwa</h5>
                  <span>2022.01.5 to 2025.12.1</span>
                  <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.</p>
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

export default Cv;