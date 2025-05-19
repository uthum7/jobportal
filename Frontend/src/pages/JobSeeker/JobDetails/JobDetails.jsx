import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import JobseekerSidebar from "../../../components/JobSeeker/JobseekerSidebar/JobseekerSidebar.jsx";
import Footer from "../../../components/Footer/Footer.jsx";
import "./JobDetails.css";
import "../Dashboard/Dashboard.css";

const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/jobs/${jobId}`);
        setJob(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to load job details. Please try again later.");
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const formatRelativeTime = (dateString) => {
    if (!dateString) return "Not specified";

    const posted = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now - posted;

    // Convert to minutes, hours, days
    const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return posted.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <div className="loading-container">Loading job details...</div>;
  if (error) return <div className="error-container">{error}</div>;
  if (!job) return <div className="error-container">Job not found</div>;

  return (
    <div className="job-details-main-container">
      <div className="dashboard-container">
        <div className="main-content">
          <JobseekerSidebar />
          
          <div className="header">
            <h1 className="page-title">Job Details</h1>
            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <Link to="/JobSeeker/apply-for-job" className="breadcrumb-link">Apply For A Job</Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">Job Details</span>
            </div>
          </div>
          
          <div className="job-details-container">
            {/* Job Header Section */}
            <div className="job-header">
              <div className="job-header-content">
                <div className="job-header-info">
                  <h2 className="job-title">{job.JobTitle}</h2>
                </div>
                <div className="job-apply-button">
                  <button className="apply-now-btn">Apply Now</button>
                  <button className="save-job-btn">Save Job</button>
                </div>
              </div>
            </div>

            {/* Job Details Section */}
            <div className="job-details-content">
              <div className="job-details-summary">
                <div className="job-summary-item">
                  <h4>Job Type</h4>
                  <p>{job.JobType || "Not specified"}</p>
                </div>
                <div className="job-summary-item">
                  <h4>Experience</h4>
                  <p>{job.JobExperienceYears || 0} Years</p>
                </div>
                <div className="job-summary-item">
                  <h4>Job Mode</h4>
                  <p>{job.JobMode || "Not specified"}</p>
                </div>
                <div className="job-summary-item">
                  <h4>Posted</h4>
                  <p>{formatRelativeTime(job.postedDate)}</p>
                </div>
              </div>

              {/* Job Description Tab Section */}
              <div className="job-tabs">
                <div className="tab-navigation">
                  <button 
                    className={`tab-btn ${activeTab === "description" ? "active" : ""}`}
                    onClick={() => setActiveTab("description")}
                  >
                    Job Description
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === "requirements" ? "active" : ""}`}
                    onClick={() => setActiveTab("requirements")}
                  >
                    Job Requirements & Qualifications
                  </button>
                </div>
                
                {/* Description Tab */}
                <div className={`tab-content ${activeTab === "description" ? "active" : ""}`}>
                  <div className="job-description">
                    <h3>Job Description</h3>
                    <p>{job.JobDescription || "No description provided."}</p>
                    
                    {job.Responsibilities && job.Responsibilities.length > 0 && (
                      <>
                        <h3>Responsibilities</h3>
                        <ul>
                          {job.Responsibilities.map((responsibility, index) => (
                            <li key={index}>{responsibility}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    
                    <div className="application-deadline">
                      <h3>Application Deadline</h3>
                      <p>{formatDate(job.JobDeadline)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Requirements & Qualifications Tab */}
                <div className={`tab-content ${activeTab === "requirements" ? "active" : ""}`}>
                  <div className="job-description">
                    {job.Requirements && job.Requirements.length > 0 ? (
                      <>
                        <h3>Requirements</h3>
                        <ul>
                          {job.Requirements.map((requirement, index) => (
                            <li key={index}>{requirement}</li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <p>No specific requirements listed for this position.</p>
                    )}
                    
                    {job.Qualifications && job.Qualifications.length > 0 && (
                      <>
                        <h3>Qualifications</h3>
                        <ul>
                          {job.Qualifications.map((qualification, index) => (
                            <li key={index}>{qualification}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer1">
        <Footer />
      </div>
    </div>
  );
};

export default JobDetails;