import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import JobseekerSidebar from "../../../components/JobSeeker/JobseekerSidebar/JobseekerSidebar.jsx";
import { getUserId, isAuthenticated, isJobSeeker, getToken } from "../../../utils/auth.js";
import ApplyNow from "../ApplyNow/ApplyNow.jsx";
import { Bookmark, BookmarkCheck, Calendar, Clock, MapPin, Briefcase, User, ArrowLeft } from "lucide-react";

//Displays detailed information about a specific job listing with save functionality
const JobDetails = () => {
  const { jobId } = useParams(); // Extract jobId from URL parameters
  const navigate = useNavigate();
  const [job, setJob] = useState(null); // Store job details
  const [loading, setLoading] = useState(true); // Loading state flag
  const [error, setError] = useState(null); // Error handling state
  const [activeTab, setActiveTab] = useState("description"); // Track active tab (description/requirements)

  // User-related states
  const [userId, setUserId] = useState(null); // Store user ID
  const [isJobSaved, setIsJobSaved] = useState(false); // Track if job is saved by user
  const [animating, setAnimating] = useState(false); // Animation state for save button
  const [savedJobId, setSavedJobId] = useState(null); // ID of the saved job document in database

  
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationData, setApplicationData] = useState({
    fullName: '',
    nic: '',
    email: '',
    phoneNumber: '',
    address: '',
    skills: [],
    education: [],
    summary: '',
    workExperience: [],
    certifications: [],
    coverLetter: ''
  });

  // Check if job has expired
  const isJobExpired = () => {
    if (!job?.JobDeadline) return false;
    const deadline = new Date(job.JobDeadline);
    const now = new Date();
    // Set deadline to end of day (23:59:59) and compare with current time
    deadline.setHours(23, 59, 59, 999);
    return now > deadline;
  };

  useEffect(() => {
  if (!isAuthenticated() || !isJobSeeker()) {
    navigate("/login");
    return;
  }

  const uid = getUserId();
  if (uid) {
    setUserId(uid);
  }
}, [navigate]);

useEffect(() => {
  if (!userId) return;
    // Fetch job details from API based on URL parameter
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/job/${jobId}`);
        setJob(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to load job details. Please try again later.");
        setLoading(false);
      }
    };

    fetchJobDetails();

    
    // Check if user has already applied
    const checkApplicationStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/applications/status/${userId}/${jobId}`);
        setHasApplied(response.data.hasApplied);
      } catch (err) {
        console.error("Error checking application status:", err);
      }
    };

    checkApplicationStatus();

    // Check if job is already saved
    const checkSavedStatus = async () => {
      try {
        // API call to check if job is saved
        const response = await axios.get(`http://localhost:5001/api/saved-jobs/check/${userId}/${jobId}`);

        if (response.data && response.data.isSaved) {
          setIsJobSaved(true);
          // Store the saved job document ID for deletion
          if (response.data._id) {
            setSavedJobId(response.data._id);
          }
        } else {
          setIsJobSaved(false);
          setSavedJobId(null);
        }
      } catch (err) {
        console.error("Error checking saved job status:", err);
      }
    };

    checkSavedStatus();
  }, [userId, jobId]);

  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const postedDate = new Date(dateString);
    const diffInMs = now - postedDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      return postedDate.toLocaleDateString();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to capitalize first letter of each word
  const capitalizeWords = (str) => {
    if (!str) return "Not specified";
    return str.replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleSaveJob = async () => {
    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    setAnimating(true);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      };

      if (isJobSaved) {
        // Remove from saved jobs - Updated to match JobCard endpoint
        await axios.delete(`http://localhost:5001/api/saved-jobs/remove`, {
          ...config,
          data: {
            jobId: jobId,
            userId: userId
          }
        });
        setIsJobSaved(false);
        setSavedJobId(null);
      } else {
        // Add to saved jobs - Updated to match JobCard endpoint
        const response = await axios.post(`http://localhost:5001/api/saved-jobs/save`, {
          userId: userId,
          jobId: jobId
        }, config);
        setIsJobSaved(true);
        setSavedJobId(response.data._id);
      }
    } catch (err) {
      console.error("Error saving/unsaving job:", err);
    } finally {
      setAnimating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <JobseekerSidebar />
        <div className="flex-1 lg:ml-0">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading job details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <JobseekerSidebar />
        <div className="flex-1 lg:ml-0">
          <div className="flex items-center justify-center h-full">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
              <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Job</h2>
              <p className="text-red-600">{error || "Job not found"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <JobseekerSidebar />
      <div className="flex-1 lg:ml-0">
        <div className="p-6">
          {/* Page header with title and breadcrumb navigation */}
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Job Details</h1>
            <nav className="text-sm text-gray-600">
              <Link to="/" className="text-blue-600 hover:text-blue-700">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/JobSeeker/apply-for-job" className="text-blue-600 hover:text-blue-700">Apply For A Job</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-500">Job Details</span>
            </nav>
          </header>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Job Header Section with title and action buttons */}
            <div className="p-6 border-b border-gray-200 bg-green-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-3xl font-extrabold text-gray-800 mb-8">{job.JobTitle}</h2>
                  
                  {/* Job Summary Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm font-semibold text-green-700">Job Type</p>
                        <p className="font-medium text-gray-800">{capitalizeWords(job.JobType)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm font-semibold text-green-700">Experience</p>
                        <p className="font-medium text-gray-800">{job.JobExperienceYears || 0} Years</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm font-semibold text-green-700">Job Mode</p>
                        <p className="font-medium text-gray-800">{capitalizeWords(job.JobMode)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm font-semibold text-green-700">Posted</p>
                        <p className="font-medium text-gray-800">{formatRelativeTime(job.postedDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-3 ml-6">
                  {isJobExpired() ? (
                    <div className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium bg-red-100 text-red-700">
                      <Clock className="w-4 h-4" />
                      <span>Job Expired</span>
                    </div>
                  ) : (
                    <>
                      <button
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                          hasApplied 
                            ? 'bg-blue-100 text-blue-700 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                        onClick={() => setShowApplyForm(true)}
                        disabled={hasApplied}
                      >
                        {hasApplied ? 'Already Applied' : 'Apply Now'}
                      </button>
                      
                      <button
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                          isJobSaved 
                            ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                        onClick={handleSaveJob}
                      >
                        {isJobSaved ? (
                          <>
                            <BookmarkCheck className="w-4 h-4" />
                            <span>Saved Job</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-4 h-4" />
                            <span>Save Job</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Job Description Tab Section */}
            <div className="p-6">
              <div className="border-b border-gray-300 mb-6 bg-gray-50 p-4 rounded-t-lg">
                <div className="flex space-x-8">
                  <button
                    className={`py-3 px-4 border-b-2 font-semibold text-sm transition-colors rounded-t-lg ${
                      activeTab === "description" 
                        ? 'border-blue-600 text-blue-700 bg-white' 
                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab("description")}
                  >
                    Job Description
                  </button>
                  <button
                    className={`py-3 px-4 border-b-2 font-semibold text-sm transition-colors rounded-t-lg ${
                      activeTab === "requirements" 
                        ? 'border-blue-600 text-blue-700 bg-white' 
                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab("requirements")}
                  >
                    Job Requirements & Qualifications
                  </button>
                </div>
              </div>

              {/* Description Tab content*/}
              {activeTab === "description" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Job Description</h3>
                    <p className="text-gray-700 leading-relaxed">{job.JobDescription || "No description provided."}</p>
                  </div>

                  {/* Conditional rendering of responsibilities section */}
                  {job.Responsibilities && job.Responsibilities.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Responsibilities</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {job.Responsibilities.map((responsibility, index) => (
                          <li key={index}>{responsibility}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Application Deadline</h3>
                    <p className="text-red-700">{formatDate(job.JobDeadline)}</p>
                  </div>
                </div>
              )}

              {/* Requirements & Qualifications Tab content*/}
              {activeTab === "requirements" && (
                <div className="space-y-6">
                  {/* Conditional rendering of requirements section */}
                  {job.Requirements && job.Requirements.length > 0 ? (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Requirements</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {job.Requirements.map((requirement, index) => (
                          <li key={index}>{requirement}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-600">No specific requirements listed for this position.</p>
                  )}
                  
                  {/* Conditional rendering of qualifications section */}
                  {job.Qualifications && job.Qualifications.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Qualifications</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {job.Qualifications.map((qualification, index) => (
                          <li key={index}>{qualification}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Application Deadline</h3>
                    <p className="text-red-700">{formatDate(job.JobDeadline)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {showApplyForm && (
        <ApplyNow
          jobId={jobId}
          userId={userId}
          JobTitle={job.JobTitle}
          onClose={() => setShowApplyForm(false)}
          onSuccess={() => {
            setHasApplied(true);
            setShowApplyForm(false);
          }}
        />
      )}
    </div>
  );
};

export default JobDetails;