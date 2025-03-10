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
    uniMoreDetails: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.",
    address: "kandy",
    address2: "",
    email: "",
    phone: "",
    profilePicture: null,
    summary: "",
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

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  
    const handleChange = (e) => {
      if (e.target.name === "profilePicture") {
        const file = e.target.files[0];
        if (file) {
          const imageUrl = URL.createObjectURL(file); // Create a URL for the uploaded file
          setFormData({ ...formData, [e.target.name]: imageUrl });
        }
      } else {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      }
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(formData);
    };
  
    const toggleSidebar = () => {
      setIsSidebarVisible(!isSidebarVisible);
    };
  

  return (
    <div>


      <div className={styles.resumeBuilder}>
        
         {!isSidebarVisible && (
                  <button className={styles.toggleButton} onClick={toggleSidebar}>
                    ☰
                  </button>
                )}

        <aside className={`${styles.sidebar} ${isSidebarVisible ? styles.visible : ""}`}>
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
                  <button className={styles.closeButton} onClick={toggleSidebar}>
                    ✕
                  </button>
                </aside>
 <main className={`${styles.content} ${isSidebarVisible ? styles.shifted : ""}`}>
          <div className={styles.navigationButtons}>
            <button className={styles.navButton} onClick={() => navigate('/Cv6')}>Previous</button>
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
                      <div className={styles.cvContainer}>
                        <div className={styles.cvLeft}>
                          <div className={styles.profileSection}>
                            {/* Profile Picture Upload */}
                            <label htmlFor="profilePicture" className={styles.profilePictureLabel}>
                              <img
                                src={formData.profilePicture || "profile.jpg"} // Display uploaded image or default
                                alt="Profile"
                                className={styles.profileImage}
                              />
                              <input
                                type="file"
                                id="profilePicture"
                                name="profilePicture"
                                accept="image/*"
                                onChange={handleChange}
                                style={{ display: "none" }} // Hide the default file input
                              />
                              <span className={styles.uploadIcon}>📷</span> {/* Upload icon */}
                            </label>
                            <h2>{formData.fullName || "Saman Kumara"}</h2>
                            <h3>{formData.jobTitle || "Full Stack Developer"}</h3>
                          </div>
                          <div className={styles.contactInfo}>
                            <h4>Contact</h4>
                            <p>{formData.phone || "0771200506"}</p>
                            <p>{formData.email || "samankumara@gmail.com"}</p>
                            <p>{formData.address || "123 Anywhere St., Any City"}</p>
                          </div>
                          <div className={styles.education}>
                            <h4>Education</h4>
                            <div className={styles.educationItem}>
                              <h5>University of Moratuwa</h5>
                              <span>2022 - 2025</span>
                              <p>Bachelor of Science in Computer Science</p>
                            </div>
                            <div className={styles.educationItem}>
                              <h5>Rahula College Matara</h5>
                              <span>2018 - 2021</span>
                              <p>Advanced Level in Physical Science</p>
                            </div>
                          </div>
                          
                        </div>
                        <div className={styles.verticalLine}></div>
                        <div className={styles.cvRight}>
                        <div className={styles.profilePara}>
                            <h4>Profile</h4>
                            <p>
                              {formData.profilePara ||
                                "Experienced Full Stack Developer with a strong background in developing scalable web applications and managing complex projects. There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonableProficient in JavaScript, React, Node.js, and database management. Passionate about creating efficient and user-friendly solutions."
                              }
                            </p>
                          </div>
                          <div className={styles.experience}>
                            <h4>Professional Experience</h4>
                            <div className={styles.experienceItem}>
                              <h5>Full Stack Developer</h5>
                              <span>2024 - Present</span>
                              <p>
                                Developed and maintained web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality software solutions.
                              </p>
                            </div>
                            <div className={styles.experienceItem}>
                              <h5>Software Engineer</h5>
                              <span>2022 - 2024</span>
                              <p>
                                Designed and implemented backend services and APIs. Conducted code reviews and mentored junior developers.
                              </p>
                            </div>
                            <div className={styles.experienceItem}>
                              <h5>Junior Developer</h5>
                              <span>2020 - 2022</span>
                              <p>
                                Assisted in the development of web applications and learned best practices in software development.
                              </p>
                            </div>
                          </div>
                          <div className={styles.skillsColumns}>
                            <h4>Skills</h4>
                            <div className={styles.skillsColumn}>
                              <ul>
                                <li className={styles.listItem}>JavaScript</li>
                                <li className={styles.listItem}>React</li>
                                <li className={styles.listItem}>Node.js</li>
                                <li className={styles.listItem}>Database Management</li>
                                <li className={styles.listItem}>Project Management</li>
                                <li className={styles.listItem}>HTML/CSS</li>
                                <li className={styles.listItem}>Git</li>
                                <li className={styles.listItem}>REST APIs</li>
                                <li className={styles.listItem}>Agile Methodologies</li>
                                <li className={styles.listItem}>Problem Solving</li>
                              </ul>
                            </div>
                          
                          </div>
                          <div className={styles.summary}>
                            <h4>Summary</h4>
                            <p>
                              {formData.summary ||
                                "Experienced Full Stack Developer with a strong background in developing scalable web applications and managing complex projects.There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable Proficient in JavaScript, React, Node.js, and database management. Passionate about creating efficient and user-friendly solutions."
                              }
                            </p>
                          </div>
                          <div className={styles.references}>
                            <h4>References</h4>
                            <p>John Doe - Senior Developer at Tech Corp - john.doe@techcorp.com</p>
                            <p>Jane Smith - Project Manager at Innovate LLC - jane.smith@innovate.com</p>
                          </div>
                        </div>
                      </div>
                    </div>
       
        </main>
      </div>
    </div>
  );
};

export default Cv3;