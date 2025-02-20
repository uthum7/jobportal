import React from 'react';
import Navbar from './Navbar/Navbar'; 
import './HomePage.css'; // Import external CSS for HomePage

//background-image: url('../assets/img/herobg.jpg');


const JobPortal = () => {
  return (
    <div className="job-portal">
     
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h6 className="tagline">🔥 Get Hot & Trending Jobs</h6>
          <h1>
            Find & Hire <br />
            <span>Top Experts on Job Stock</span>
          </h1>
          <p>
            Getting a new job is never easy. Check what new jobs we have in
            store for you on Job Stock.
          </p>
          <div className="stats">
            <div className="stat">
              <h2>200M</h2>
              <h6>Active Jobs</h6>
            </div>
            <div className="stat">
              <h2>40K</h2>
              <h6>Startups</h6>
            </div>
            <div className="stat">
              <h2>340K</h2>
              <h6>Talents</h6>
            </div>
          </div>
        </div>

        {/* Job Search Form */}
        <div className="search-box">
          <h1>
            Grow Your Career with <span className="highlight">Job Stock</span>
          </h1>
          <input type="text" placeholder="Search Job Keywords..." />
          <select>
            <option>Software & Application</option>
            <option>Banking</option>
            <option>Health & Medical</option>
            <option>Mobile & App</option>
            <option>Education</option>
          </select>
          <select>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Contractor</option>
            <option>Freelance</option>
          </select>
          <button className="search-btn">Search Jobs</button>
        </div>
      </section>

        {/* Features & Process Section */}
      <section className="features">
        <h2 className="features-title">Features & Process</h2>
        <p className="features-description">
          Our CV Creation & Ranking Web Application is designed to streamline the job-seeking and hiring process by integrating AI-powered resume generation, mentorship, job search, and an advanced candidate ranking system.
        </p>

        <div className="features-list">
          <div className="feature-item">
            <i className="icon">📄</i>
            <h3>AI-Powered CV Builder</h3>
            <p>Effortlessly create professional resumes using AI. Update, download, and share your CVs anytime.</p>
            <button className="feature-btn">Create Your Resume</button>
          </div>

          <div className="feature-item">
            <i className="icon">💼</i>
            <h3>Job Search & Application</h3>
            <p>Browse job vacancies, view descriptions, and apply directly using our integrated portal.</p>
            <button className="feature-btn">Search Jobs</button>
          </div>

          <div className="feature-item">
            <i className="icon">👨‍🏫</i>
            <h3>Find & Hire a Mentor</h3>
            <p>Connect with industry experts for guidance and skill development through the mentorship program.</p>
            <button className="feature-btn">Hire a Mentor</button>
          </div>

          <div className="feature-item">
            <i className="icon">💬</i>
            <h3>Commenting & Feedback System</h3>
            <p>Employers can provide constructive feedback to help you improve your resume and chances.</p>
          </div>

          <div className="feature-item">
            <i className="icon">🔐</i>
            <h3>Secure Account Management</h3>
            <p>Manage your account, update profiles, reset passwords, and securely handle your data.</p>
          </div>
        </div>
      </section>


      {/* Partner Companies */}
      <section className="partners">
        <h5>
          Join over 2,000 companies around the world that trust the{" "}
          <span className="highlight">Job Stock</span> platforms
        </h5>
        <div className="partners-grid">
          <img src="assets/img/brand/layar-primary.svg" alt="Brand 1" />
          <img src="assets/img/brand/mailchimp-primary.svg" alt="Brand 2" />
          <img src="assets/img/brand/fitbit-primary.svg" alt="Brand 3" />
          <img src="assets/img/brand/capsule-primary.svg" alt="Brand 4" />
          <img src="assets/img/brand/vidados-primary.svg" alt="Brand 5" />
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="featured-jobs">
        <h2>Featured Jobs</h2>
        <p>
          Browse top jobs from trusted companies and boost your career today.
        </p>
        <div className="job-list">
          <div className="job-card">
            <span className="featured-badge">Featured</span>
            <img src="assets/img/l-1.png" alt="Job Logo" />
            <h4>Jr. PHP Developer</h4>
            <p>CSS3, HTML5, Javascript, Bootstrap, jQuery</p>
            <h5 className="salary">$5K - $8K</h5>
            <button className="apply-btn">Apply Now</button>
          </div>

          <div className="job-card">
            <span className="featured-badge">Urgent</span>
            <img src="assets/img/l-2.png" alt="Job Logo" />
            <h4>React.js Developer</h4>
            <p>React, Redux, Tailwind, API Integration</p>
            <h5 className="salary">$7K - $10K</h5>
            <button className="apply-btn">Apply Now</button>
          </div>
        </div>
      </section>
    </div>
  );
};


export default JobPortal;
