import React, { useState } from 'react';
import './MyProfile.css';
import { 
  FiHome, 
  FiUser, 
  FiFileText, 
  FiBriefcase, 
  FiBookmark, 
  FiMessageCircle, 
  FiMail, 
  FiLock, 
  FiTrash2, 
  FiLogOut 
} from 'react-icons/fi';

const MyProfile = () => {
  const [activeMenu, setActiveMenu] = useState('My Profile');
  const [userData, setUserData] = useState({
    name: '',
    jobTitle: '',
    age: '',
    education: 'High School',
    experience: '',
    position: '',
    language: 'English',
    email: 'hannah@mail.com',
    phone: '+1 555 555 5555',
    secondaryAddress: '',
    address: '',
    state: 'California',
    country: 'India',
    city: '',
    zipCode: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    tiktok: '',
    googlePlus: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile data submitted:', userData);
    // Here you would typically send the data to your backend
  };

  const menuItems = [
    { icon: <FiHome className="nav-icon" size={20} />, label: 'User Dashboard' },
    { icon: <FiUser className="nav-icon" size={20} />, label: 'My Profile', active: true },
    { icon: <FiFileText className="nav-icon" size={20} />, label: 'Create a Resume' },
    { icon: <FiBriefcase className="nav-icon" size={20} />, label: 'Apply for a job' },
    { icon: <FiBriefcase className="nav-icon" size={20} />, label: 'Applied jobs' },
    { icon: <FiBookmark className="nav-icon" size={20} />, label: 'Saved Jobs' },
    { icon: <FiMessageCircle className="nav-icon" size={20} />, label: 'Find a Counselor' },
    { icon: <FiMail className="nav-icon" size={20} />, label: 'Messages', notifications: 3 },
    { icon: <FiLock className="nav-icon" size={20} />, label: 'Change Password' },
    { icon: <FiTrash2 className="nav-icon" size={20} />, label: 'Delete Account' },
    { icon: <FiLogOut className="nav-icon" size={20} />, label: 'Log Out' }
  ];

  return (
    <div className="profile-container">
      <div className="sidebar">
        <div className="profile-section">
          <img 
            src="/api/placeholder/80/80" 
            alt="Profile" 
            className="profile-image"
          />
          <h3 className="profile-name">Gimhani Imasha</h3>
          <div className="nav-title">Main Navigation</div>
        </div>
        <nav className="nav-menu">
          {menuItems.map((item, index) => (
            <div 
              key={index} 
              className={`nav-item ${item.active ? 'active' : ''}`}
              onClick={() => setActiveMenu(item.label)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.notifications && <span className="notification-badge">{item.notifications}</span>}
            </div>
          ))}
        </nav>
      </div>

      <div className="content">
        <div className="profile-header">
          <h1>My Profile</h1>
          <div className="breadcrumb">
            <span>Candidate</span> / <span>Dashboard</span> / <span className="current">My Profile</span>
          </div>
        </div>

        <div className="profile-section user-info">
          <div className="user-image">
            <img src="/api/placeholder/80/80" alt="User" />
          </div>
          <div className="user-details">
            <h2>Hannah Smith</h2>
            <div className="location">Canada</div>
          </div>
          <div className="contact-info">
            <div className="info-item">
              <span className="label">Email</span>
              <span className="value">{userData.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Call</span>
              <span className="value">{userData.phone}</span>
            </div>
            <div className="info-item">
              <span className="label">Bio</span>
              <span className="value">5+ Years</span>
            </div>
          </div>
          <button className="change-profile-btn">Change Profile</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="profile-section">
            <h2>Basic Detail</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Your Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label>Job Title</label>
                <input 
                  type="text" 
                  name="jobTitle"
                  value={userData.jobTitle}
                  onChange={handleChange}
                  placeholder="Enter job title"
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input 
                  type="text" 
                  name="age"
                  value={userData.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                />
              </div>
              <div className="form-group">
                <label>Education</label>
                <select 
                  name="education"
                  value={userData.education}
                  onChange={handleChange}
                >
                  <option value="High School">High School</option>
                  <option value="Bachelor">Bachelor's Degree</option>
                  <option value="Master">Master's Degree</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>
              <div className="form-group">
                <label>Experience</label>
                <input 
                  type="text" 
                  name="experience"
                  value={userData.experience}
                  onChange={handleChange}
                  placeholder="Years of experience"
                />
              </div>
              <div className="form-group">
                <label>Position</label>
                <input 
                  type="text" 
                  name="position"
                  value={userData.position}
                  onChange={handleChange}
                  placeholder="Current position"
                />
              </div>
              <div className="form-group">
                <label>About Life</label>
                <textarea 
                  name="aboutLife"
                  value={userData.aboutLife}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                />
              </div>
              <div className="form-group">
                <label>Language</label>
                <select 
                  name="language"
                  value={userData.language}
                  onChange={handleChange}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Contact Detail</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Your Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label>Phone no</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={userData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="form-group">
                <label>Secondary Address</label>
                <input 
                  type="text" 
                  name="secondaryAddress"
                  value={userData.secondaryAddress}
                  onChange={handleChange}
                  placeholder="Enter secondary address"
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input 
                  type="text" 
                  name="address"
                  value={userData.address}
                  onChange={handleChange}
                  placeholder="Enter primary address"
                />
              </div>
              <div className="form-group">
                <label>Address 2</label>
                <input 
                  type="text" 
                  name="address2"
                  value={userData.address2}
                  onChange={handleChange}
                  placeholder="Enter address line 2"
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <select 
                  name="country"
                  value={userData.country}
                  onChange={handleChange}
                >
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="Canada">Canada</option>
                  <option value="UK">UK</option>
                </select>
              </div>
              <div className="form-group">
                <label>State/City</label>
                <select 
                  name="state"
                  value={userData.state}
                  onChange={handleChange}
                >
                  <option value="California">California</option>
                  <option value="New York">New York</option>
                  <option value="Texas">Texas</option>
                  <option value="Florida">Florida</option>
                </select>
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input 
                  type="text" 
                  name="zipCode"
                  value={userData.zipCode}
                  onChange={handleChange}
                  placeholder="Enter zip code"
                />
              </div>
              <div className="form-group">
                <label>Locale</label>
                <input 
                  type="text" 
                  name="locale"
                  value={userData.locale}
                  onChange={handleChange}
                  placeholder="Enter locale"
                />
              </div>
              <div className="form-group">
                <label>Language</label>
                <input 
                  type="text" 
                  name="language"
                  value={userData.language}
                  onChange={handleChange}
                  placeholder="Enter language"
                />
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Social Login</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Facebook</label>
                <input 
                  type="text" 
                  name="facebook"
                  value={userData.facebook}
                  onChange={handleChange}
                  placeholder="Facebook profile URL"
                />
              </div>
              <div className="form-group">
                <label>Twitter</label>
                <input 
                  type="text" 
                  name="twitter"
                  value={userData.twitter}
                  onChange={handleChange}
                  placeholder="Twitter profile URL"
                />
              </div>
              <div className="form-group">
                <label>Instagram</label>
                <input 
                  type="text" 
                  name="instagram"
                  value={userData.instagram}
                  onChange={handleChange}
                  placeholder="Instagram profile URL"
                />
              </div>
              <div className="form-group">
                <label>LinkedIn</label>
                <input 
                  type="text" 
                  name="linkedin"
                  value={userData.linkedin}
                  onChange={handleChange}
                  placeholder="LinkedIn profile URL"
                />
              </div>
              <div className="form-group">
                <label>TikTok</label>
                <input 
                  type="text" 
                  name="tiktok"
                  value={userData.tiktok}
                  onChange={handleChange}
                  placeholder="TikTok profile URL"
                />
              </div>
              <div className="form-group">
                <label>Google Plus</label>
                <input 
                  type="text" 
                  name="googlePlus"
                  value={userData.googlePlus}
                  onChange={handleChange}
                  placeholder="Google Plus profile URL"
                />
              </div>
            </div>
          </div>

          <div className="submit-section">
            <button type="submit" className="save-profile-btn">Save Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;