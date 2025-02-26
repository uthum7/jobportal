import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Cv3.module.css'; // Import CSS Module

const Cv3 = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [skillName, setSkillName] = useState('');
  const [skillRating, setSkillRating] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "Saman Kumara",
    jobTitle: "Full Stack Developer",
    phone: "0771200506",
    email: "samankumara@gmail.com",
    userInfo: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.",
    SchoolName: "Rahula Collage Matara",
    startDate: "2018.01.5",
    endDate: "2021.12.1",
    moreDetails: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
    universityName: "University of Moratuwa",
    uniStartDate: "2022.01.5",
    uniEndDate: "2025.12.1",
    uniMoreDetails: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old."
  });

  const handleAddSkill = () => {
    if (skillName && skillRating > 0) {
      if (editingIndex !== null) {
        const updatedSkills = skills.map((skill, index) =>
          index === editingIndex ? { name: skillName, rating: skillRating } : skill
        );
        setSkills(updatedSkills);
        setEditingIndex(null);
      } else {
        setSkills([...skills, { name: skillName, rating: skillRating }]);
      }
      setSkillName('');
      setSkillRating(0);
    }
  };

  const handleEditSkill = (index) => {
    const skill = skills[index];
    setSkillName(skill.name);
    setSkillRating(skill.rating);
    setEditingIndex(index);
  };

  const handleDeleteSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
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
            <button className={styles.navButton} onClick={() => navigate('/Cv2')}>Previous</button>
            <button className={styles.navButton} onClick={() => navigate('/Cv4')}>Next</button>
          </div>

          <div className={styles.skillForm}>
            <h2>Skills</h2>
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
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
              <button onClick={handleAddSkill}>
                {editingIndex !== null ? 'Update Skill' : 'Add Skill'}
              </button>
            </div>
            <div className={styles.skillsList}>
              {skills.map((skill, index) => (
                <div key={index} className={styles.skillItem}>
                  <span>{skill.name}</span>
                  <div className={styles.stars}>
                    {'★'.repeat(skill.rating).padEnd(5, '☆')}
                  </div>
                  <div className={styles.skillActions}>
                    <button onClick={() => handleEditSkill(index)}>Edit</button>
                    <button onClick={() => handleDeleteSkill(index)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default Cv3;