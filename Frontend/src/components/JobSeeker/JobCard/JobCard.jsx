import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getUserId, isAuthenticated, isJobSeeker, getToken } from "../../../utils/auth";
import { Clock } from "lucide-react";

const JobCard = ({ job, onJobUnsaved }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // Get current user ID dynamically
  const userId = getUserId();
  const token = getToken();

  // Check if job has expired
  const isJobExpired = () => {
    if (!job?.JobDeadline) return false;
    const deadline = new Date(job.JobDeadline);
    const now = new Date();
    // Set deadline to end of day (23:59:59) and compare with current time
    deadline.setHours(23, 59, 59, 999);
    return now > deadline;
  };

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

    // Check if the user has applied to this job
    const checkApplicationStatus = async () => {
      if (!userId || !job._id) return;
      
      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        // Fetch all applied jobs for the user
        const response = await axios.get(`http://localhost:5001/api/applied-jobs/${userId}`, config);
        const appliedJobs = response.data || [];
        
        // Check if current job is in the applied jobs list
        const hasAppliedToThisJob = appliedJobs.some(appliedJob => appliedJob.job._id === job._id);
        setHasApplied(hasAppliedToThisJob);
      } catch (err) {
        console.error("Error checking application status:", err);
        setHasApplied(false);
      }
    };

    if (job._id) {
      checkSavedStatus();
      checkApplicationStatus();
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex-1 mr-4" title={job.JobTitle}>
          {capitalizeWords(job.JobTitle) || "Job Title Not Available"}
        </h3>
        <div className="flex flex-col items-end space-y-2">
          {isJobExpired() ? (
            <div className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
              <Clock className="w-4 h-4" />
              <span>Expired</span>
            </div>
          ) : (
            <button
              className={`p-2 rounded-lg transition-colors ${
                isSaved 
                  ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleBookmark}
              disabled={loading}
              title={isSaved ? "Remove from saved jobs" : "Save this job"}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
              )}
            </button>
          )}
          
          {hasApplied && (
            <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium" title="Already Applied">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
            {capitalizeWords(job.JobType) || "Type N/A"}
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
            {capitalizeWords(job.JobMode) || "Mode N/A"}
          </span>
        </div>

        <div className="space-y-2">
          {/* Company Name */}
          {job.CompanyName && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Company:</span>
              <span className="text-sm font-medium text-gray-700" title={job.CompanyName}>
                {truncateText(capitalizeWords(job.CompanyName), 25)}
              </span>
            </div>
          )}

          {/* Location */}
          {job.JobLocation && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Location:</span>
              <span className="text-sm font-medium text-gray-700" title={job.JobLocation}>
                {truncateText(capitalizeWords(job.JobLocation), 25)}
              </span>
            </div>
          )}

          {/* Experience */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Experience:</span>
            <span className="text-sm font-medium text-gray-700">
              {job.JobExperienceYears ? `${job.JobExperienceYears} years` : "Not specified"}
            </span>
          </div>

          {/* Salary */}
          {job.JobSalary && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Salary:</span>
              <span className="text-sm font-medium text-gray-700">
                {formatSalary(job.JobSalary)}
              </span>
            </div>
          )}

          {/* Deadline */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Deadline:</span>
            <span className="text-sm font-medium text-gray-700">
              {formatDate(job.JobDeadline)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button 
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          onClick={handleSeeMore}
        >
          See More
        </button>
      </div>
    </div>
  );
};

export default JobCard;