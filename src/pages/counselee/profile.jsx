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
  FaSave,
  FaUpload,
} from "react-icons/fa"
import "./profile.css"

export default function CounseleeProfile() {
  const [profileData, setProfileData] = useState({
    name: "Alexander Mitchell",
    jobTitle: "Web Designer",
    dateOfBirth: "1990-07-15",
    education: "High School",
    experience: "2+ years",
    languages: "HTML, CSS3, Bootstrap, Java, C++",
    gender: "Male",
    membershipPreferences: "Career Development",
    email: "alexander.mitchell@gmail.com",
    phone: "+1 (555) 123-4567",
    address1: "123 Main Street",
    address2: "Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    bio: "Experienced web designer with a passion for creating responsive and user-friendly websites. Looking to advance my career with professional guidance.",
    skills: ["HTML", "CSS", "JavaScript", "React", "UI/UX Design"],
    interests: ["Web Development", "Mobile App Design", "UX Research"],
  })

  const [successMessage, setSuccessMessage] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...profileData.skills]
    updatedSkills[index] = value
    setProfileData((prev) => ({
      ...prev,
      skills: updatedSkills,
    }))
  }

  const addSkill = () => {
    setProfileData((prev) => ({
      ...prev,
      skills: [...prev.skills, ""],
    }))
  }

  const removeSkill = (index) => {
    const updatedSkills = [...profileData.skills]
    updatedSkills.splice(index, 1)
    setProfileData((prev) => ({
      ...prev,
      skills: updatedSkills,
    }))
  }

  const handleInterestChange = (index, value) => {
    const updatedInterests = [...profileData.interests]
    updatedInterests[index] = value
    setProfileData((prev) => ({
      ...prev,
      interests: updatedInterests,
    }))
  }

  const addInterest = () => {
    setProfileData((prev) => ({
      ...prev,
      interests: [...prev.interests, ""],
    }))
  }

  const removeInterest = (index) => {
    const updatedInterests = [...profileData.interests]
    updatedInterests.splice(index, 1)
    setProfileData((prev) => ({
      ...prev,
      interests: updatedInterests,
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
      {/* Left Sidebar with all navigation options */}
      <aside className="sidebar">
        <div className="sidebar-profile">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/depositphotos_65103937-stock-illustration-male-avatar-profile-picture-vector.jpg-sGxy88AMCTZclrYwVI5URVtYVKxafN.jpeg"
            alt="Alexander Mitchell"
            className="profile-image"
          />
          <h3 className="profile-name">Alexander Mitchell</h3>
          <p className="profile-title">Web Designer</p>
        </div>

        <nav className="sidebar-menu">
          <Link to="/counselee/dashboard" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaHome />
              </span>
              <span className="menu-text">Dashboard</span>
            </div>
          </Link>
          <Link to="/counselee/profile" className="menu-item active">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaUser />
              </span>
              <span className="menu-text">My Profile</span>
            </div>
          </Link>
          <Link to="/counselee/bookings" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaCalendarAlt />
              </span>
              <span className="menu-text">Bookings</span>
            </div>
          </Link>
          <Link to="/counselee/find-counselor" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaUsers />
              </span>
              <span className="menu-text">Find a Counselor</span>
            </div>
          </Link>
          <Link to="/counselee/messages" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaEnvelope />
              </span>
              <span className="menu-text">Messages</span>
            </div>
            <span className="menu-badge">2</span>
          </Link>
          <Link to="/counselee/change-password" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaKey />
              </span>
              <span className="menu-text">Change Password</span>
            </div>
          </Link>
          <Link to="/counselee/delete-account" className="menu-item">
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
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/depositphotos_65103937-stock-illustration-male-avatar-profile-picture-vector.jpg-sGxy88AMCTZclrYwVI5URVtYVKxafN.jpeg"
                  alt="Alexander Mitchell"
                  className="large-profile-image"
                />
                <button className="change-profile-btn">
                  <FaUpload className="btn-icon" /> Change Profile Picture
                </button>
              </div>
              <div className="profile-info">
                <div className="name-section">
                  <h2>Alexander Mitchell</h2>
                  <div className="job-title">
                    Web Designer <span className="status-badge active">Active</span>
                  </div>
                </div>
                <div className="skills">
                  <span className="skill-tag">HTML</span>
                  <span className="skill-tag">CSS3</span>
                  <span className="skill-tag">JavaScript</span>
                  <span className="skill-tag">React</span>
                </div>
                <div className="contact-quick-info">
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{profileData.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Call:</span>
                    <span className="info-value">{profileData.phone}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Location:</span>
                    <span className="info-value">
                      {profileData.city}, {profileData.state}
                    </span>
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
                  <label>Your Name</label>
                  <input type="text" name="name" value={profileData.name} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Job Title</label>
                  <input type="text" name="jobTitle" value={profileData.jobTitle} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={profileData.dateOfBirth} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Education</label>
                  <select name="education" value={profileData.education} onChange={handleInputChange}>
                    <option value="High School">High School</option>
                    <option value="Bachelor">Bachelor's Degree</option>
                    <option value="Master">Master's Degree</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Languages</label>
                  <input type="text" name="languages" value={profileData.languages} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Experience</label>
                  <input type="text" name="experience" value={profileData.experience} onChange={handleInputChange} />
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
                  <label>Membership Preferences</label>
                  <select
                    name="membershipPreferences"
                    value={profileData.membershipPreferences}
                    onChange={handleInputChange}
                  >
                    <option value="Career Development">Career Development</option>
                    <option value="Professional Growth">Professional Growth</option>
                    <option value="Skill Development">Skill Development</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Contact Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Your Email</label>
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
                <label>Bio</label>
                <textarea name="bio" value={profileData.bio} onChange={handleInputChange} rows={4}></textarea>
              </div>

              <div className="form-group full-width">
                <label>Skills</label>
                <div className="dynamic-fields">
                  {profileData.skills.map((skill, index) => (
                    <div key={index} className="dynamic-field">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleSkillChange(index, e.target.value)}
                        placeholder="Enter a skill"
                      />
                      <button type="button" className="remove-field-btn" onClick={() => removeSkill(index)}>
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" className="add-field-btn" onClick={addSkill}>
                    + Add Skill
                  </button>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Interests</label>
                <div className="dynamic-fields">
                  {profileData.interests.map((interest, index) => (
                    <div key={index} className="dynamic-field">
                      <input
                        type="text"
                        value={interest}
                        onChange={(e) => handleInterestChange(index, e.target.value)}
                        placeholder="Enter an interest"
                      />
                      <button type="button" className="remove-field-btn" onClick={() => removeInterest(index)}>
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" className="add-field-btn" onClick={addInterest}>
                    + Add Interest
                  </button>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                <FaSave className="btn-icon" /> Save Changes
              </button>
              <Link to="/counselee/dashboard" className="cancel-btn">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

