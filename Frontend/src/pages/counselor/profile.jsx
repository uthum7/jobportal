"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import {
  FaHome,
  FaUser,
  FaCalendarAlt,
  FaUsers,
  FaEnvelope,
  FaKey,
  FaTrashAlt,
  FaSignOutAlt,
  FaClock,
  FaSave,
  FaUpload,
  FaPlus,
  FaMinus,
  FaGraduationCap,
  FaBriefcase,
  FaCertificate,
} from "react-icons/fa"
import "./profile.css"

export default function CounselorProfile() {
  const [profileData, setProfileData] = useState({
    name: "James Anderson",
    title: "Career Development Specialist",
    dateOfBirth: "1985-03-22",
    gender: "Male",
    email: "james.anderson@example.com",
    phone: "+1 (555) 987-6543",
    address1: "456 Professional Ave",
    address2: "Suite 302",
    city: "Boston",
    state: "MA",
    zipCode: "02108",
    country: "United States",
    bio: "I am a certified career development specialist with over 10 years of experience helping professionals navigate career transitions, improve their resumes, and prepare for interviews. My approach is personalized to each client's unique needs and goals.",
    expertise: [
      "Career Planning",
      "Resume Building",
      "Interview Preparation",
      "Professional Networking",
      "Salary Negotiation",
    ],
    education: [
      {
        degree: "Ph.D. in Organizational Psychology",
        institution: "Stanford University",
        year: "2010",
      },
      {
        degree: "M.S. in Human Resources Management",
        institution: "Columbia University",
        year: "2006",
      },
      {
        degree: "B.A. in Psychology",
        institution: "University of Michigan",
        year: "2004",
      },
    ],
    certifications: [
      {
        name: "Certified Career Development Professional (CCDP)",
        issuer: "National Career Development Association",
        year: "2012",
      },
      {
        name: "Certified Professional Resume Writer (CPRW)",
        issuer: "Professional Association of Resume Writers & Career Coaches",
        year: "2011",
      },
    ],
    experience: [
      {
        position: "Senior Career Counselor",
        company: "Career Success Partners",
        startYear: "2015",
        endYear: "Present",
        description: "Provide one-on-one career counseling to professionals at all career stages.",
      },
      {
        position: "Career Development Specialist",
        company: "Boston University Career Center",
        startYear: "2010",
        endYear: "2015",
        description: "Assisted students and alumni with career planning and job search strategies.",
      },
    ],
    hourlyRate: 75,
    availability: {
      monday: ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"],
      tuesday: ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"],
      wednesday: ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"],
      thursday: ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"],
      friday: ["9:00 AM - 12:00 PM"],
      saturday: [],
      sunday: [],
    },
    languages: ["English", "Spanish"],
    socialMedia: {
      linkedin: "linkedin.com/in/jamesanderson",
      twitter: "twitter.com/jamesanderson",
      website: "jamesanderson-career.com",
    },
  })

  const [successMessage, setSuccessMessage] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleExpertiseChange = (index, value) => {
    const updatedExpertise = [...profileData.expertise]
    updatedExpertise[index] = value
    setProfileData((prev) => ({
      ...prev,
      expertise: updatedExpertise,
    }))
  }

  const addExpertise = () => {
    setProfileData((prev) => ({
      ...prev,
      expertise: [...prev.expertise, ""],
    }))
  }

  const removeExpertise = (index) => {
    const updatedExpertise = [...profileData.expertise]
    updatedExpertise.splice(index, 1)
    setProfileData((prev) => ({
      ...prev,
      expertise: updatedExpertise,
    }))
  }

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...profileData.education]
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    }
    setProfileData((prev) => ({
      ...prev,
      education: updatedEducation,
    }))
  }

  const addEducation = () => {
    setProfileData((prev) => ({
      ...prev,
      education: [...prev.education, { degree: "", institution: "", year: "" }],
    }))
  }

  const removeEducation = (index) => {
    const updatedEducation = [...profileData.education]
    updatedEducation.splice(index, 1)
    setProfileData((prev) => ({
      ...prev,
      education: updatedEducation,
    }))
  }

  const handleCertificationChange = (index, field, value) => {
    const updatedCertifications = [...profileData.certifications]
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [field]: value,
    }
    setProfileData((prev) => ({
      ...prev,
      certifications: updatedCertifications,
    }))
  }

  const addCertification = () => {
    setProfileData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, { name: "", issuer: "", year: "" }],
    }))
  }

  const removeCertification = (index) => {
    const updatedCertifications = [...profileData.certifications]
    updatedCertifications.splice(index, 1)
    setProfileData((prev) => ({
      ...prev,
      certifications: updatedCertifications,
    }))
  }

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...profileData.experience]
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    }
    setProfileData((prev) => ({
      ...prev,
      experience: updatedExperience,
    }))
  }

  const addExperience = () => {
    setProfileData((prev) => ({
      ...prev,
      experience: [...prev.experience, { position: "", company: "", startYear: "", endYear: "", description: "" }],
    }))
  }

  const removeExperience = (index) => {
    const updatedExperience = [...profileData.experience]
    updatedExperience.splice(index, 1)
    setProfileData((prev) => ({
      ...prev,
      experience: updatedExperience,
    }))
  }

  const handleLanguageChange = (index, value) => {
    const updatedLanguages = [...profileData.languages]
    updatedLanguages[index] = value
    setProfileData((prev) => ({
      ...prev,
      languages: updatedLanguages,
    }))
  }

  const addLanguage = () => {
    setProfileData((prev) => ({
      ...prev,
      languages: [...prev.languages, ""],
    }))
  }

  const removeLanguage = (index) => {
    const updatedLanguages = [...profileData.languages]
    updatedLanguages.splice(index, 1)
    setProfileData((prev) => ({
      ...prev,
      languages: updatedLanguages,
    }))
  }

  const handleSocialMediaChange = (platform, value) => {
    setProfileData((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      },
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Profile data:", profileData)

    // Show success message
    setSuccessMessage("Profile updated successfully!")

    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  return (
    <div className="dashboard-layout">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-profile">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Young-and-confident-male-teacher-1024x683.jpg-R6ysbV9y1tkPVjRz96mm0z4KBc2S62.jpeg"
            alt="James Anderson"
            className="profile-image"
          />
          <h3 className="profile-name">James Anderson</h3>
          <p className="profile-title">Career Development Specialist</p>
        </div>

        <nav className="sidebar-menu">
          <Link to="/counselor/dashboard" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaHome />
              </span>
              <span className="menu-text">Dashboard</span>
            </div>
          </Link>
          <Link to="/counselor/profile" className="menu-item active">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaUser />
              </span>
              <span className="menu-text">My Profile</span>
            </div>
          </Link>
          <Link to="/counselor/bookings" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaCalendarAlt />
              </span>
              <span className="menu-text">Bookings</span>
            </div>
          </Link>
          <Link to="/counselor/schedule" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaClock />
              </span>
              <span className="menu-text">Schedule Timings</span>
            </div>
          </Link>
          <Link to="/counselor/counselees" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaUsers />
              </span>
              <span className="menu-text">My Counselees</span>
            </div>
          </Link>
          <Link to="/counselor/messages" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaEnvelope />
              </span>
              <span className="menu-text">Messages</span>
            </div>
            <span className="menu-badge">3</span>
          </Link>
          <Link to="/counselor/change-password" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaKey />
              </span>
              <span className="menu-text">Change Password</span>
            </div>
          </Link>
          <Link to="/counselor/delete-account" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaTrashAlt />
              </span>
              <span className="menu-text">Delete Account</span>
            </div>
          </Link>
          <Link to="/logout" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaSignOutAlt />
              </span>
              <span className="menu-text">Log Out</span>
            </div>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="profile-header">
          <h1>My Profile</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> / My Profile
          </div>
        </div>

        {successMessage && (
          <div className="success-message">
            <span>{successMessage}</span>
          </div>
        )}

        <div className="profile-content">
          {/* Profile Top Section */}
          <div className="profile-top">
            <div className="profile-info-header">
              <div className="profile-image-section">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Young-and-confident-male-teacher-1024x683.jpg-R6ysbV9y1tkPVjRz96mm0z4KBc2S62.jpeg"
                  alt="James Anderson"
                  className="large-profile-image"
                />
                <button className="change-profile-btn">
                  <FaUpload className="btn-icon" /> Change Profile Picture
                </button>
              </div>
              <div className="profile-info">
                <div className="name-section">
                  <h2>{profileData.name}</h2>
                  <div className="job-title">
                    {profileData.title} <span className="status-badge active">Active</span>
                  </div>
                </div>
                <div className="expertise-tags">
                  {profileData.expertise.map((expertise, index) => (
                    <span key={index} className="expertise-tag">
                      {expertise}
                    </span>
                  ))}
                </div>
                <div className="contact-quick-info">
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{profileData.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone:</span>
                    <span className="info-value">{profileData.phone}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Rate:</span>
                    <span className="info-value">${profileData.hourlyRate}/hour</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Sections */}
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <h3>Basic Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="name" value={profileData.name} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Professional Title</label>
                  <input type="text" name="title" value={profileData.title} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={profileData.dateOfBirth} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" value={profileData.gender} onChange={handleInputChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Hourly Rate ($)</label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={profileData.hourlyRate}
                    onChange={handleInputChange}
                    min="0"
                    step="5"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Contact Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" name="email" value={profileData.email} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" name="phone" value={profileData.phone} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Address Line 1</label>
                  <input type="text" name="address1" value={profileData.address1} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Address Line 2</label>
                  <input type="text" name="address2" value={profileData.address2} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input type="text" name="city" value={profileData.city} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>State/Province</label>
                  <input type="text" name="state" value={profileData.state} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>ZIP/Postal Code</label>
                  <input type="text" name="zipCode" value={profileData.zipCode} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <select name="country" value={profileData.country} onChange={handleInputChange}>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Professional Profile</h3>
              <div className="form-group full-width">
                <label>Bio/About Me</label>
                <textarea name="bio" value={profileData.bio} onChange={handleInputChange} rows={4}></textarea>
              </div>

              <div className="form-group full-width">
                <label>Areas of Expertise</label>
                <div className="dynamic-fields">
                  {profileData.expertise.map((expertise, index) => (
                    <div key={index} className="dynamic-field">
                      <input
                        type="text"
                        value={expertise}
                        onChange={(e) => handleExpertiseChange(index, e.target.value)}
                        placeholder="Enter an area of expertise"
                      />
                      <button type="button" className="remove-field-btn" onClick={() => removeExpertise(index)}>
                        <FaMinus /> Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" className="add-field-btn" onClick={addExpertise}>
                    <FaPlus /> Add Expertise
                  </button>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>
                <FaGraduationCap className="section-icon" /> Education
              </h3>
              <div className="dynamic-sections">
                {profileData.education.map((edu, index) => (
                  <div key={index} className="dynamic-section">
                    <div className="dynamic-section-header">
                      <h4>Education #{index + 1}</h4>
                      <button type="button" className="remove-section-btn" onClick={() => removeEducation(index)}>
                        <FaMinus /> Remove
                      </button>
                    </div>
                    <div className="dynamic-section-content">
                      <div className="form-group">
                        <label>Degree/Qualification</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Year</label>
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) => handleEducationChange(index, "year", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" className="add-section-btn" onClick={addEducation}>
                  <FaPlus /> Add Education
                </button>
              </div>
            </div>

            <div className="form-section">
              <h3>
                <FaCertificate className="section-icon" /> Certifications
              </h3>
              <div className="dynamic-sections">
                {profileData.certifications.map((cert, index) => (
                  <div key={index} className="dynamic-section">
                    <div className="dynamic-section-header">
                      <h4>Certification #{index + 1}</h4>
                      <button type="button" className="remove-section-btn" onClick={() => removeCertification(index)}>
                        <FaMinus /> Remove
                      </button>
                    </div>
                    <div className="dynamic-section-content">
                      <div className="form-group">
                        <label>Certification Name</label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => handleCertificationChange(index, "name", e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Issuing Organization</label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => handleCertificationChange(index, "issuer", e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Year</label>
                        <input
                          type="text"
                          value={cert.year}
                          onChange={(e) => handleCertificationChange(index, "year", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" className="add-section-btn" onClick={addCertification}>
                  <FaPlus /> Add Certification
                </button>
              </div>
            </div>

            <div className="form-section">
              <h3>
                <FaBriefcase className="section-icon" /> Work Experience
              </h3>
              <div className="dynamic-sections">
                {profileData.experience.map((exp, index) => (
                  <div key={index} className="dynamic-section">
                    <div className="dynamic-section-header">
                      <h4>Experience #{index + 1}</h4>
                      <button type="button" className="remove-section-btn" onClick={() => removeExperience(index)}>
                        <FaMinus /> Remove
                      </button>
                    </div>
                    <div className="dynamic-section-content">
                      <div className="form-group">
                        <label>Position/Title</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Company/Organization</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Start Year</label>
                        <input
                          type="text"
                          value={exp.startYear}
                          onChange={(e) => handleExperienceChange(index, "startYear", e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>End Year (or "Present")</label>
                        <input
                          type="text"
                          value={exp.endYear}
                          onChange={(e) => handleExperienceChange(index, "endYear", e.target.value)}
                        />
                      </div>
                      <div className="form-group full-width">
                        <label>Description</label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                          rows={3}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" className="add-section-btn" onClick={addExperience}>
                  <FaPlus /> Add Experience
                </button>
              </div>
            </div>

            <div className="form-section">
              <h3>Additional Information</h3>

              <div className="form-group full-width">
                <label>Languages</label>
                <div className="dynamic-fields">
                  {profileData.languages.map((language, index) => (
                    <div key={index} className="dynamic-field">
                      <input
                        type="text"
                        value={language}
                        onChange={(e) => handleLanguageChange(index, e.target.value)}
                        placeholder="Enter a language"
                      />
                      <button type="button" className="remove-field-btn" onClick={() => removeLanguage(index)}>
                        <FaMinus /> Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" className="add-field-btn" onClick={addLanguage}>
                    <FaPlus /> Add Language
                  </button>
                </div>
              </div>

              <h4 className="subsection-title">Social Media & Professional Links</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>LinkedIn Profile</label>
                  <input
                    type="text"
                    value={profileData.socialMedia.linkedin}
                    onChange={(e) => handleSocialMediaChange("linkedin", e.target.value)}
                    placeholder="e.g., linkedin.com/in/yourname"
                  />
                </div>
                <div className="form-group">
                  <label>Twitter/X Profile</label>
                  <input
                    type="text"
                    value={profileData.socialMedia.twitter}
                    onChange={(e) => handleSocialMediaChange("twitter", e.target.value)}
                    placeholder="e.g., twitter.com/yourhandle"
                  />
                </div>
                <div className="form-group">
                  <label>Personal Website</label>
                  <input
                    type="text"
                    value={profileData.socialMedia.website}
                    onChange={(e) => handleSocialMediaChange("website", e.target.value)}
                    placeholder="e.g., yourwebsite.com"
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                <FaSave className="btn-icon" /> Save Changes
              </button>
              <Link to="/counselor/dashboard" className="cancel-btn">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

