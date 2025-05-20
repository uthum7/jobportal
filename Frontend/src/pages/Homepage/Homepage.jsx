import React from "react";
import "../../pages/Homepage/Homepage.css";   
import{useNavigate} from "react-router-dom";        





const JobPortal = () => {
     const navigate = useNavigate();
  return (
    <div className="job-portal">
     
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
         
          <h1>
          Find a Job & Hire <br />
            <span>Top Experts on JobPortal</span>
          </h1>
          <p>
            Getting a new job is never easy. Check what new jobs we have in
            store for you on JobPortal.
          </p>
          <div className="stats">
            <div className="stat">
              <h2>20</h2>
              <h6>Active Jobs</h6>
            </div>
            
          </div>
        </div>

        {/* Job Search Form */}
       
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
            <button className="feature-btn" onClick={() => navigate('/Cv')}>Create Your Resume</button>
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


     

    
    </div>
  );
};


export default JobPortal;
