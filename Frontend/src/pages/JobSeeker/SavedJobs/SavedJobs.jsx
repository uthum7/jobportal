// SavedJobs.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import JobCard from "../../../components/JobSeeker/JobCard/JobCard.jsx";
import JobseekerSidebar from "../../../components/JobSeeker/JobseekerSidebar/JobseekerSidebar.jsx";
import { getUserId, isAuthenticated, isJobSeeker, getToken } from "../../../utils/auth"; // Import auth utilities
import "./SavedJobs.css";
import "../Dashboard/Dashboard.css";
import { Link } from "react-router-dom";

const SavedJobs = () => {
  // State variables for managing saved jobs data
  const [savedJobs, setSavedJobs] = useState([]);           // Stores all saved job details
  const [loading, setLoading] = useState(true);             // Tracks loading state for API requests
  const [error, setError] = useState(null);                 // Tracks error state
  const [searchKeyword, setSearchKeyword] = useState("");   // Search keyword state
  
  const navigate = useNavigate();
  
  // Get current user ID dynamically
  const userId = getUserId();
  const token = getToken();

  useEffect(() => {
    // Check if user is authenticated and is a job seeker
    if (!isAuthenticated() || !isJobSeeker() || !userId) {
      console.warn("User not authenticated or not authorized as job seeker");
      navigate("/login");
      return;
    }

    fetchSavedJobs();
  }, [userId, navigate]);

  // Function to fetch saved jobs for the user
  const fetchSavedJobs = async () => {
    if (!userId) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Configure axios with authentication header
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      // First, get the list of saved job IDs for the user
      const savedJobsResponse = await axios.get(`http://localhost:5001/api/saved-jobs/user/${userId}`, config);
      console.log("Saved jobs response:", savedJobsResponse.data); // Debug log
      
      // Handle different response structures
      let savedJobIds = [];
if (savedJobsResponse.data && Array.isArray(savedJobsResponse.data.data)) {
  savedJobIds = savedJobsResponse.data.data.map(savedJob => savedJob.jobId);
}

      
      console.log("Saved job IDs:", savedJobIds); // Debug log
      
      if (savedJobIds.length === 0) {
        console.log("No saved job IDs found"); // Debug log
        setSavedJobs([]);
        setLoading(false);
        return;
      }
      
      // Then, fetch the actual job details for each saved job ID
      const jobDetailsPromises = savedJobIds.map(async (jobId) => {
        try {
          console.log(`Fetching job details for ID: ${jobId}`); // Debug log
          const response = await axios.get(`http://localhost:5001/api/job/${jobId}`, config);
          console.log(`Job details for ${jobId}:`, response.data); // Debug log
          return response.data;
        } catch (error) {
          console.error(`Error fetching job ${jobId}:`, error);
          return null; // Return null for failed requests
        }
      });
      
      const jobDetailsResponses = await Promise.all(jobDetailsPromises);
      // Filter out null responses (failed requests)
      const jobDetails = jobDetailsResponses.filter(job => job !== null);
      
      console.log("Final job details:", jobDetails); // Debug log
      setSavedJobs(jobDetails);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      console.error("Error details:", error.response?.data || error.message);
      
      // Handle authentication errors
      if (error.response?.status === 401) {
        console.warn("Authentication failed, redirecting to login");
        navigate("/login");
        return;
      }
      
      setError(error.response?.data?.message || "Failed to fetch saved jobs");
      setSavedJobs([]);
      setLoading(false);
    }
  };

  // Function to refresh saved jobs (can be called when a job is unsaved)
  const refreshSavedJobs = () => {
    fetchSavedJobs();
  };

  // Filter saved jobs based on search keyword
  const filteredSavedJobs = savedJobs.filter(job => {
    if (!searchKeyword) return true;
    
    return (
      job.JobTitle.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      job.JobType.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      job.JobMode.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  });

  // Don't render if user is not authenticated or not a job seeker
  if (!isAuthenticated() || !isJobSeeker()) {
    return (
      <div className="SavedJobsMainContainer">
        <div className="dashboard-container">
          <div className="main-content">
            <div className="error-container">
              <h2>Access Denied</h2>
              <p>You need to be logged in as a Job Seeker to view saved jobs.</p>
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
          <h1 className="page-title">Saved Jobs</h1>
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-separator">/</span>
            <Link to="/JobSeeker/saved-jobs" className="breadcrumb-link">Saved Jobs</Link>
          </div>
        </div>
        <div className="saved-jobs-layout">
          {/* Saved Jobs Header Section */}
          <div className="saved-jobs-header">
            <div className="saved-jobs-info">
              <h3>Your Saved Jobs</h3>
              <p className="saved-jobs-count">
                {loading ? "Loading..." : `${filteredSavedJobs.length} Job${filteredSavedJobs.length !== 1 ? 's' : ''} Saved`}
              </p>
            </div>
            {savedJobs.length > 0 && (
              <button 
                className="refresh-saved-jobs-btn"
                onClick={refreshSavedJobs}
                disabled={loading}
              >
                Refresh
              </button>
            )}
          </div>
          
          {/* Search Bar */}
          {savedJobs.length > 0 && (
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
          )}
          
          {/* Error Message */}
          {error && (
            <div className="error-message">
              <p>Error: {error}</p>
              <button onClick={refreshSavedJobs} className="retry-button">
                Try Again
              </button>
            </div>
          )}
          {/* Saved Job Cards Section */}
          <div className="saved-job-cards-container">
            {loading ? (
              <div className="loading-container">
                <p>Loading your saved jobs...</p>
              </div>
            ) : filteredSavedJobs.length > 0 ? (
              <div className="job-cards-grid">
                {filteredSavedJobs.map((job) => (
                  <JobCard 
                    key={job._id} 
                    job={job} 
                    onJobUnsaved={refreshSavedJobs} // Pass refresh function to update list when job is unsaved
                  />
                ))}
              </div>
            ) : (
              // Enhanced "No saved jobs found" section
              <div className="no-saved-jobs-found">
                {/* Bookmark icon SVG */}
                <svg
                  className="no-saved-jobs-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                <h3 className="no-saved-jobs-title">
                  {savedJobs.length === 0 
                    ? "No saved jobs yet" 
                    : "No saved jobs found"}
                </h3>
                <p className="no-saved-jobs-message">
                  {savedJobs.length === 0 
                    ? "You haven't saved any jobs yet. Start exploring job opportunities and save the ones that match your interests."
                    : "No saved jobs match your search criteria. Try adjusting your search terms."}
                </p>
                {savedJobs.length === 0 ? (
                  <>
                    <div className="no-saved-jobs-suggestions">
                      <strong>Get started:</strong>
                      <ul>
                        <li>Browse available job listings</li>
                        <li>Click the "Save Job" button on jobs you're interested in</li>
                        <li>Come back here to view all your saved jobs</li>
                        <li>Apply to your saved jobs when you're ready</li>
                      </ul>
                    </div>
                    <Link to="/JobSeeker/apply-for-job" className="browse-jobs-button">
                      Browse Jobs
                    </Link>
                  </>
                ) : (
                  <button 
                    className="clear-filters-btn"
                    onClick={() => setSearchKeyword("")}
                  >
                    Clear Search
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

export default SavedJobs;


