import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { getUserId, isAuthenticated, isJobSeeker, getToken } from "../../../utils/auth";
import JobseekerSidebar from "../../../components/JobSeeker/JobseekerSidebar/JobseekerSidebar.jsx";
import "./AppliedJobs.css";
import "../Dashboard/Dashboard.css";

const AppliedJobsPage = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();
  
  const userId = getUserId();
  const token = getToken();

  useEffect(() => {
    // Check if user is authenticated and is a job seeker
    if (!isAuthenticated() || !isJobSeeker() || !userId) {
      console.warn("User not authenticated or not authorized as job seeker");
      navigate("/login");
      return;
    }

    fetchAppliedJobs();
  }, [userId, navigate]);

  const fetchAppliedJobs = async () => {
    if (!userId) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log("Frontend - Fetching applied jobs for userId:", userId);
      console.log("Frontend - userId type:", typeof userId);
      
      // Configure axios with authentication header
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      const response = await axios.get(`http://localhost:5001/api/applied-jobs/${userId}`, config);
      console.log("Applied jobs response:", response.data);
      console.log("Frontend - Response data type:", typeof response.data);
      console.log("Frontend - Response data length:", Array.isArray(response.data) ? response.data.length : 'not an array');
      
      setAppliedJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
      console.error("Error details:", error.response?.data || error.message);
      
      // Handle authentication errors
      if (error.response?.status === 401) {
        console.warn("Authentication failed, redirecting to login");
        navigate("/login");
        return;
      }
      
      setError(error.response?.data?.message || "Failed to fetch applied jobs");
      setAppliedJobs([]);
      setLoading(false);
    }
  };

  const refreshAppliedJobs = () => {
    fetchAppliedJobs();
  };

  const filteredJobs = appliedJobs.filter(job => {
    // First filter by status
    const statusMatch = filter === "all" || job.status === filter;
    
    // Then filter by search keyword
    const keywordMatch = !searchKeyword || 
      job.job.JobTitle.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      job.job.JobType.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      job.job.JobMode.toLowerCase().includes(searchKeyword.toLowerCase());
    
    return statusMatch && keywordMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "pending";
      case "accepted": return "accepted";
      case "rejected": return "rejected";
      default: return "pending";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewApplication = (applicationId) => {
    // Navigate to application details page
    navigate(`/JobSeeker/application/${applicationId}`);
  };

  const handleViewFeedback = (applicationId) => {
    // Navigate to feedback insights page
    navigate(`/JobSeeker/application/${applicationId}/feedback`);
  };

  const handleViewDetails = (jobId) => {
    // Navigate to job details page
    navigate(`/JobSeeker/job-details/${jobId}`);
  };

  // Don't render if user is not authenticated or not a job seeker
  if (!isAuthenticated() || !isJobSeeker()) {
    return (
      <div className="AppliedJobsMainContainer">
        <div className="dashboard-container">
          <div className="main-content">
            <div className="error-container">
              <h2>Access Denied</h2>
              <p>You need to be logged in as a Job Seeker to view applied jobs.</p>
              <Link to="/login" className="login-button">
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-containerJS">
      <JobseekerSidebar />
      <div className="main-content-wrapper">
        {/* Page header with title and breadcrumb navigation */}
        <div className="header">
          <h1 className="page-title">Applied Jobs</h1>
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-separator">/</span>
            <Link to="/JobSeeker/applied-jobs" className="breadcrumb-link">Applied Jobs</Link>
          </div>
        </div>
        <div className="applied-jobs-layout">
          {/* Applied Jobs Header Section */}
          <div className="applied-jobs-header">
            <div className="applied-jobs-info">
              <h3>Your Job Applications</h3>
              <p className="applied-jobs-count">
                {loading ? "Loading..." : `${appliedJobs.length} Application${appliedJobs.length !== 1 ? 's' : ''} Submitted`}
              </p>
            </div>
            {appliedJobs.length > 0 && (
              <button 
                className="refresh-applied-jobs-btn"
                onClick={refreshAppliedJobs}
                disabled={loading}
              >
                Refresh
              </button>
            )}
          </div>
          {/* Filter Bar */}
          {/* Search Bar */}
          <div className="search-bar">
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Search by job title, type, or mode..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="search-input"
              />
              <button 
                className="clear-search-btn"
                onClick={() => setSearchKeyword("")}
                style={{ display: searchKeyword ? 'block' : 'none' }}
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="filter-bar">
            {["all", "pending", "accepted", "rejected"].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`filter-btn ${filter === status ? "active" : ""}`}
              >
                {status === "all" ? "All Applications" : status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== "all" && (
                  <span style={{ marginLeft: "8px", fontSize: "12px", opacity: 0.8 }}>
                    ({appliedJobs.filter(job => job.status === status).length})
                  </span>
                )}
              </button>
            ))}
          </div>
          {/* Error Message */}
          {error && (
            <div className="error-message">
              <p>Error: {error}</p>
              <button onClick={refreshAppliedJobs} className="retry-button">
                Try Again
              </button>
            </div>
          )}
          {/* Applied Jobs Container */}
          <div className="applied-jobs-container">
            {loading ? (
              <div className="loading-container">
                <p>Loading your applied jobs...</p>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="applied-jobs-list">
                {filteredJobs.map(({ _id, job, appliedDate, status }) => (
                  <div className="applied-job-card" key={_id}>
                    <div className="applied-job-content">
                      <div className="job-main-info">
                        <h3 className="job-title">{job.JobTitle}</h3>
                        
                        <div className="job-details">
                          <div className="job-detail-item">
                            <span className="job-detail-label">Type:</span>
                            <span className="job-detail-value">{job.JobType}</span>
                          </div>
                          <div className="job-detail-item">
                            <span className="job-detail-label">Mode:</span>
                            <span className="job-detail-value">{job.JobMode}</span>
                          </div>
                          <div className="job-detail-item">
                            <span className="job-detail-label">Experience:</span>
                            <span className="job-detail-value">{job.JobExperienceYears} Years</span>
                          </div>
                        </div>

                        <div className="job-dates">
                          <div className="job-date-item">
                            <span className="job-date-label">Applied:</span>
                            <span>{formatDate(appliedDate)}</span>
                          </div>
                          <div className="job-date-item">
                            <span className="job-date-label">Deadline:</span>
                            <span>{formatDate(job.JobDeadline)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="job-status-section">
                        <div className={`status ${getStatusColor(status)}`}>
                          {status}
                        </div>
                        
                        <div className="job-actions">
                          <button
                            className="action-btn view-application-btn"
                            onClick={() => handleViewApplication(_id)}
                            title="View your submitted application"
                          >
                            View Application
                          </button>
                          
                          <button
                            className="action-btn view-details-btn"
                            onClick={() => handleViewDetails(job._id)}
                            title="View complete job details"
                          >
                            Job Details
                          </button>
                          
                          {status === "rejected" && (
                            <button
                              className="action-btn view-feedback-btn"
                              onClick={() => handleViewFeedback(_id)}
                              title="View feedback and insights for improvement"
                            >
                              View Feedback
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-applied-jobs-found">
                {/* Document icon SVG */}
                <svg
                  className="no-applied-jobs-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>

                <h3 className="no-applied-jobs-title">
                  {filter === "all" 
                    ? (searchKeyword ? "No applications found" : "No job applications yet")
                    : `No ${filter} applications${searchKeyword ? ' found' : ''}`}
                </h3>

                <p className="no-applied-jobs-message">
                  {filter === "all" 
                    ? (searchKeyword 
                        ? "No applications match your search criteria. Try adjusting your search terms or filters."
                        : "You haven't applied to any jobs yet. Start exploring job opportunities and apply to positions that match your skills and interests.")
                    : `You don't have any applications with ${filter} status${searchKeyword ? ' matching your search' : ''} at the moment.`}
                </p>

                {(filter === "all" && !searchKeyword) && (
                  <Link to="/JobSeeker/apply-for-job" className="browse-jobs-button">
                    Browse & Apply for Jobs
                  </Link>
                )}
                
                {(searchKeyword || filter !== "all") && (
                  <button 
                    className="clear-filters-btn"
                    onClick={() => {
                      setSearchKeyword("");
                      setFilter("all");
                    }}
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppliedJobsPage;
