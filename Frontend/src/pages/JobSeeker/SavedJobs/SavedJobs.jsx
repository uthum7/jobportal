// SavedJobs.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../../../components/JobSeeker/JobCard/JobCard.jsx";
import JobseekerSidebar from "../../../components/JobSeeker/JobseekerSidebar/JobseekerSidebar.jsx";
import "./SavedJobs.css";
import "../Dashboard/Dashboard.css";
import { Link } from "react-router-dom";
import Footer from "../../../components/Footer/Footer.jsx";

const SavedJobs = () => {
  // State variables for managing saved jobs data
  const [savedJobs, setSavedJobs] = useState([]);           // Stores all saved job details
  const [loading, setLoading] = useState(true);             // Tracks loading state for API requests
  const userId = "Usr1";                                    // Hardcoded user ID to match other components

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  // Function to fetch saved jobs for the user
  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      
      // First, get the list of saved job IDs for the user
      const savedJobsResponse = await axios.get(`http://localhost:5001/api/saved-jobs/${userId}`);
      console.log("Saved jobs response:", savedJobsResponse.data); // Debug log
      
      // Handle different response structures
      let savedJobIds = [];
      if (Array.isArray(savedJobsResponse.data)) {
        savedJobIds = savedJobsResponse.data.map(savedJob => savedJob.jobId);
      } else if (savedJobsResponse.data.savedJobs) {
        savedJobIds = savedJobsResponse.data.savedJobs.map(savedJob => savedJob.jobId);
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
          const response = await axios.get(`http://localhost:5001/api/jobs/${jobId}`);
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
      setSavedJobs([]);
      setLoading(false);
    }
  };

  // Function to refresh saved jobs (can be called when a job is unsaved)
  const refreshSavedJobs = () => {
    fetchSavedJobs();
  };

  return (
    <div className="SavedJobsMainContainer">
      <div className="dashboard-container">
        <div className="main-content">
          
          {/* Sidebar navigation for job seeker */}
          <JobseekerSidebar />

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
                  {loading ? "Loading..." : `${savedJobs.length} job${savedJobs.length !== 1 ? 's' : ''} saved`}
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

            {/* Saved Job Cards Section */}
            <div className="saved-job-cards-container">
              {loading ? (
                <div className="loading-container">
                  <p>Loading your saved jobs...</p>
                </div>
              ) : savedJobs.length > 0 ? (
                <div className="job-cards-grid">
                  {savedJobs.map((job) => (
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

                  <h3 className="no-saved-jobs-title">No saved jobs yet</h3>

                  <p className="no-saved-jobs-message">
                    You haven't saved any jobs yet. Start exploring job opportunities 
                    and save the ones that match your interests.
                  </p>

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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer component */}
      <div className="footer1">
        <Footer />
      </div>
    </div>
  );
};

export default SavedJobs;