import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getUserId, isAuthenticated, isJobSeeker, getToken } from "../../../utils/auth";
import "./JobCard.css";

const JobCard = ({ job, onJobUnsaved }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get current user ID dynamically
  const userId = getUserId();
  const token = getToken();

  // Helper function to capitalize first letter of each word
  const capitalizeWords = (string) => {
    if (!string) return "";
    return string
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Helper function to format salary
  const formatSalary = (salary) => {
    if (!salary) return "Not specified";
    if (typeof salary === 'number') {
      return `$${salary.toLocaleString()}`;
    }
    return salary;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Helper function to truncate long text
  const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  useEffect(() => {
    // Only proceed if user is authenticated and is a job seeker
    if (!isAuthenticated() || !isJobSeeker() || !userId) {
      console.warn("User not authenticated or not a job seeker");
      return;
    }

    // Check if the job is saved in the user's collection
    const checkSavedStatus = async () => {
      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        const response = await axios.get(
          `http://localhost:5001/api/saved-jobs/check/${userId}/${job._id}`,
          config
        );
        
        if (response.data && response.data.isSaved) {
          setIsSaved(true);
        } else {
          setIsSaved(false);
        }
      } catch (err) {
        console.error("Error checking saved job status:", err);
        setIsSaved(false);
      }
    };

    if (job._id) {
      checkSavedStatus();
    }
  }, [job._id, userId, token]);

  const handleSeeMore = () => {
    navigate(`/JobSeeker/job-details/${job._id}`);
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();

    // Check if user is authenticated and is a job seeker
    if (!isAuthenticated() || !isJobSeeker() || !userId) {
      console.warn("User not authenticated or not authorized");
      navigate("/login");
      return;
    }

    if (!job._id) {
      console.error("Job ID is missing");
      return;
    }

    setLoading(true);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      if (isSaved) {
        // Remove from saved jobs - Updated to match JobDetails endpoint
        await axios.delete(`http://localhost:5001/api/saved-jobs/remove`, {
          ...config,
          data: {
            jobId: job._id,
            userId: userId
          }
        });
        setIsSaved(false);
        
        // Notify parent component that job was unsaved (for SavedJobs page)
        if (onJobUnsaved) {
          onJobUnsaved();
        }
      } else {
        // Add to saved jobs - Updated to match JobDetails endpoint
        await axios.post(`http://localhost:5001/api/saved-jobs/save`, {
          userId: userId,
          jobId: job._id
        }, config);
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
      
      // Show user-friendly error message
      const errorMessage = err.response?.data?.message || "Failed to save/unsave job";
      console.error("Bookmark error:", errorMessage);
      
      // Optionally, you can add a toast notification here
    } finally {
      setLoading(false);
    }
  };

  // Don't render if user is not authenticated or not a job seeker
  if (!isAuthenticated() || !isJobSeeker()) {
    return null;
  }

  // Don't render if job data is incomplete
  if (!job || !job._id) {
    return null;
  }

  return (
    <div className="job-card">
      <div className="job-card-header">
        <h3 className="job-title-card" title={job.JobTitle}>
          {capitalizeWords(job.JobTitle) || "Job Title Not Available"}
        </h3>
        <button
          className={`bookmark-btn ${isSaved ? 'bookmarked' : ''} ${loading ? 'loading' : ''}`}
          onClick={handleBookmark}
          disabled={loading}
          title={isSaved ? "Remove from saved jobs" : "Save this job"}
        >
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          )}
        </button>
      </div>

      <div className="job-details-card">
        <div className="job-meta">
          <span className="job-type">
            {capitalizeWords(job.JobType) || "Type N/A"}
          </span>
          <span className="job-mode">
            {capitalizeWords(job.JobMode) || "Mode N/A"}
          </span>
        </div>

        <div className="job-info-card">
          {/* Company Name */}
          {job.CompanyName && (
            <div className="info-item">
              <span className="info-label">Company:</span>
              <span className="info-value" title={job.CompanyName}>
                {truncateText(capitalizeWords(job.CompanyName), 25)}
              </span>
            </div>
          )}

          {/* Location */}
          {job.JobLocation && (
            <div className="info-item">
              <span className="info-label">Location:</span>
              <span className="info-value" title={job.JobLocation}>
                {truncateText(capitalizeWords(job.JobLocation), 25)}
              </span>
            </div>
          )}

          {/* Experience */}
          <div className="info-item">
            <span className="info-label">Experience:</span>
            <span className="info-value">
              {job.JobExperienceYears ? `${job.JobExperienceYears} years` : "Not specified"}
            </span>
          </div>

          {/* Salary */}
          {job.JobSalary && (
            <div className="info-item">
              <span className="info-label">Salary:</span>
              <span className="info-value">
                {formatSalary(job.JobSalary)}
              </span>
            </div>
          )}

          {/* Deadline */}
          <div className="info-item">
            <span className="info-label">Deadline:</span>
            <span className="info-value">
              {formatDate(job.JobDeadline)}
            </span>
          </div>
        </div>
      </div>

      <div className="job-card-footer">
        <button className="see-more-btn" onClick={handleSeeMore}>
          See More
        </button>
      </div>
    </div>
  );
};

export default JobCard;