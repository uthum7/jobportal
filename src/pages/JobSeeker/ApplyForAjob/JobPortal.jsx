import React from 'react';
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
  FiLogOut,
  FiSearch,
  FiChevronDown
} from 'react-icons/fi';
import './JobPortal.css';

const JobSearchPage = () => {
  const jobCategories = [
    {
      title: "Backend Developer",
      count: 52,
      image: "/src/assets/img/JobSeeker/jobseeker.png"
    },
    {
      title: "Frontend Developer",
      count: 47,
      image: "/src/assets/img/JobSeeker/jobseeker.png"
    },
    {
      title: "Full-Stack Developer",
      count: 65,
      image: "/src/assets/img/JobSeeker/jobseeker.png"
    },
    {
      title: "Mobile App Developer",
      count: 38,
      image: "/src/assets/img/JobSeeker/jobseeker.png"
    },
    {
      title: "Database Administrator",
      count: 27,
      image: "/src/assets/img/JobSeeker/jobseeker.png"
    },
    {
      title: "Cloud Engineer",
      count: 55,
      image: "/src/assets/img/JobSeeker/jobseeker.png"
    },
    {
      title: "IT Support Engineer",
      count: 42,
      image: "/src/assets/img/JobSeeker/jobseeker.png"
    },
    {
      title: "Cybersecurity Engineer",
      count: 33,
      image: "/src/assets/img/JobSeeker/jobseeker.png"
    },
    {
      title: "Quality Assurance QA Engineer",
      count: 30,
      image: "/src/assets/img/JobSeeker/jobseeker.png"
    },
    {
      title: "UI/UX Designer",
      count: 32,
      image: "/src/assets/img/JobSeeker/jobseeker.png"
    },
    {
      title: "Software Architect",
      count: 25,
      image: "/src/assets/img/JobSeeker/jobseeker.png"
    },
    {
      title: "Technical Writer",
      count: 20,
      image: "/src/assets/img/JobSeeker/jobseeker.png"
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <div className="profile-section">
          <img 
            src="/src/assets/img/JobSeeker/jobseeker.png" 
            alt="Profile" 
            className="profile-image"
          />
          <h3 className="profile-name">Gimhani Imasha</h3>
          <div className="nav-title">Main Navigation</div>
        </div>
        <nav className="nav-menu">
          <div className="nav-item">
            <FiHome className="nav-icon" />
            <span>User Dashboard</span>
          </div>
          <div className="nav-item">
            <FiUser className="nav-icon" />
            <span>My Profile</span>
          </div>
          <div className="nav-item">
            <FiFileText className="nav-icon" />
            <span>Create a Resume</span>
          </div>
          <div className="nav-item active">
            <FiBriefcase className="nav-icon" />
            <span>Apply for a job</span>
          </div>
          <div className="nav-item">
            <FiBriefcase className="nav-icon" />
            <span>Applied jobs</span>
          </div>
          <div className="nav-item">
            <FiBookmark className="nav-icon" />
            <span>Saved Jobs</span>
          </div>
          <div className="nav-item">
            <FiMessageCircle className="nav-icon" />
            <span>Find a Counselor</span>
          </div>
          <div className="nav-item">
            <FiMail className="nav-icon" />
            <span>Messages</span>
            <span className="notification-badge">3</span>
          </div>
          <div className="nav-item">
            <FiLock className="nav-icon" />
            <span>Change Password</span>
          </div>
          <div className="nav-item">
            <FiTrash2 className="nav-icon" />
            <span>Delete Account</span>
          </div>
          <div className="nav-item">
            <FiLogOut className="nav-icon" />
            <span>Log Out</span>
          </div>
        </nav>
      </div>

      <div className="content-wrapper">
        <div className="header">
          <h1 className="page-title">Apply For a Job</h1>
          <div className="breadcrumb">
            <span>Home</span>
            <span className="breadcrumb-separator">/</span>
            <span>Dashboard</span>
            <span className="breadcrumb-separator">/</span>
            <span>Applied Jobs</span>
          </div>
        </div>
        
        <div className="content-columns">
          {/* Filter Sidebar */}
          <div className="filter-sidebar">
            <div className="filter-header">
              <h2 className="filter-title">Search Filter</h2>
              <button className="clear-button">Clear All</button>
            </div>
            
            <div className="search-field">
              <label className="filter-label">Search By Keyword</label>
              <div className="search-input-wrapper">
                <input 
                  type="text" 
                  placeholder="Search by keywords..." 
                  className="search-input"
                />
                <FiSearch className="search-icon" />
              </div>
            </div>

            <div className="search-field">
              <label className="filter-label">Job Category</label>
              <div className="select-wrapper">
                <select className="filter-select">
                  <option>Choose category</option>
                  <option>Software Development</option>
                  <option>Web Development</option>
                  <option>Mobile Development</option>
                  <option>UI/UX Design</option>
                  <option>Data Science</option>
                </select>
                <FiChevronDown className="select-icon" />
              </div>
            </div>

            <div className="filter-section">
              <h3 className="filter-section-title">Experience Level</h3>
              <div className="checkbox-option">
                <input type="checkbox" id="beginner" className="option-input" />
                <label htmlFor="beginner" className="option-label">Beginner (0-1)</label>
              </div>
              <div className="checkbox-option">
                <input type="checkbox" id="intermediate" className="option-input" />
                <label htmlFor="intermediate" className="option-label">1+ Years (120)</label>
              </div>
              <div className="checkbox-option">
                <input type="checkbox" id="experienced" className="option-input" />
                <label htmlFor="experienced" className="option-label">3+ Years (195)</label>
              </div>
              <div className="checkbox-option">
                <input type="checkbox" id="expert" className="option-input" />
                <label htmlFor="expert" className="option-label">5+ Years (140)</label>
              </div>
            </div>

            <div className="filter-section">
              <h3 className="filter-section-title">Job Type</h3>
              <div className="checkbox-option">
                <input type="checkbox" id="fulltime" className="option-input" />
                <label htmlFor="fulltime" className="option-label">Full Time</label>
              </div>
              <div className="checkbox-option">
                <input type="checkbox" id="parttime" className="option-input" />
                <label htmlFor="parttime" className="option-label">Part Time</label>
              </div>
              <div className="checkbox-option">
                <input type="checkbox" id="contract" className="option-input" defaultChecked />
                <label htmlFor="contract" className="option-label">Project Based</label>
              </div>
              <div className="checkbox-option">
                <input type="checkbox" id="internship" className="option-input" />
                <label htmlFor="internship" className="option-label">Internship</label>
              </div>
            </div>

            <div className="filter-section">
              <h3 className="filter-section-title">Posted Date</h3>
              <div className="radio-option">
                <input type="radio" name="date" id="last24" className="option-input" defaultChecked />
                <label htmlFor="last24" className="option-label">Last 24 hours</label>
              </div>
              <div className="radio-option">
                <input type="radio" name="date" id="last7" className="option-input" />
                <label htmlFor="last7" className="option-label">Last 7 days</label>
              </div>
              <div className="radio-option">
                <input type="radio" name="date" id="last30" className="option-input" />
                <label htmlFor="last30" className="option-label">Last 30 days</label>
              </div>
            </div>

            <button className="search-button">Search Job</button>
          </div>

          {/* Main Content */}
          <div className="main-content">
            <div className="job-listings-header-container">
              <h2 className="job-listings-header">Job portal for seekers</h2>
            </div>
            
            <div className="job-grid">
              {jobCategories.map((job, index) => (
                <div key={index} className="job-card">
                  <img src={job.image} alt={job.title} className="job-card-image" />
                  <div className="job-card-content">
                    <h3 className="job-card-title">{job.title}</h3>
                    <div className="job-openings-badge">
                      {job.count} open positions
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="see-more-button">See more</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;