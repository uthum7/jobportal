import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { getUserId, isAuthenticated, isJobSeeker, getToken } from "../../../utils/auth";
import JobseekerSidebar from "../../../components/JobSeeker/JobseekerSidebar/JobseekerSidebar.jsx";
import ViewApplication from "./ViewApplication.jsx";
import { Search, RefreshCw, Eye, FileText, AlertCircle, CheckCircle, Clock, X } from "lucide-react";

const AppliedJobsPage = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showViewApplication, setShowViewApplication] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(6); // Show 6 applications per page
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const userId = getUserId();
  const token = getToken();

  useEffect(() => {
    // Check if user is authenticated and is a job seeker
    if (!isAuthenticated() || !isJobSeeker() || !userId) {
      console.warn("User not authenticated or not authorized as job seeker");
      navigate("/login");
      return;
    }

    // Check for URL parameters to set initial filter
    const urlFilter = searchParams.get('filter');
    if (urlFilter && ['all', 'pending', 'accepted', 'rejected'].includes(urlFilter)) {
      setFilter(urlFilter);
    }

    fetchAppliedJobs();
  }, [userId, navigate, searchParams]);

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

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, filter]);

  // Pagination functions
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "accepted": return "text-green-600 bg-green-50 border-green-200";
      case "rejected": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "accepted": return <CheckCircle className="w-4 h-4" />;
      case "rejected": return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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
    const application = appliedJobs.find(app => app._id === applicationId);
    if (application) {
      setSelectedApplication({
        id: applicationId,
        jobTitle: application.job.JobTitle
      });
      setShowViewApplication(true);
    }
  };

  const handleViewFeedback = (applicationId) => {
    navigate(`/JobSeeker/feedback-insights/${applicationId}`);
  };

  const handleViewDetails = (jobId) => {
    // Navigate to job details page
    navigate(`/JobSeeker/job-details/${jobId}`);
  };

  // Don't render if user is not authenticated or not a job seeker
  if (!isAuthenticated() || !isJobSeeker()) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-4">You need to be logged in as a Job Seeker to view applied jobs.</p>
            <Link to="/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Go to Login
            </Link>
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Applied Jobs</h1>
            <nav className="text-sm text-gray-600">
              <Link to="/" className="text-blue-600 hover:text-blue-700">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/JobSeeker/applied-jobs" className="text-blue-600 hover:text-blue-700">Applied Jobs</Link>
            </nav>
          </header>

          {/* Applied Jobs Header Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Your Job Applications</h3>
                <p className="text-sm text-gray-600">
                  {loading ? "Loading..." : `${appliedJobs.length} Application${appliedJobs.length !== 1 ? 's' : ''} Submitted`}
                </p>
              </div>
              {appliedJobs.length > 0 && (
                <button 
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  onClick={refreshAppliedJobs}
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by job title, type, or mode..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchKeyword && (
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchKeyword("")}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-wrap gap-2">
              {["all", "pending", "accepted", "rejected"].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === "all" ? "All Applications" : status.charAt(0).toUpperCase() + status.slice(1)}
                  {status !== "all" && (
                    <span className="ml-2 text-xs opacity-80">
                      ({appliedJobs.filter(job => job.status === status).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">Error: {error}</p>
              <button onClick={refreshAppliedJobs} className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                Try Again
              </button>
            </div>
          )}

          {/* Applied Jobs Container */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your applied jobs...</p>
                </div>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="space-y-4 p-6">
                {currentJobs.map(({ _id, job, appliedDate, status }) => (
                  <div className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors" key={_id}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-800">{job.JobTitle}</h3>
                          <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
                            {getStatusIcon(status)}
                            <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Type:</span>
                            <span className="text-sm font-medium text-gray-700">{job.JobType}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Mode:</span>
                            <span className="text-sm font-medium text-gray-700">{job.JobMode}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Experience:</span>
                            <span className="text-sm font-medium text-gray-700">{job.JobExperienceYears} Years</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Applied:</span>
                            <span className="text-sm font-medium text-gray-700">{formatDate(appliedDate)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Deadline:</span>
                            <span className="text-sm font-medium text-gray-700">{formatDate(job.JobDeadline)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-6">
                        <button
                          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          onClick={() => handleViewApplication(_id)}
                          title="View your submitted application"
                        >
                          <FileText className="w-4 h-4" />
                          <span>View Application</span>
                        </button>
                        
                        <button
                          className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                          onClick={() => handleViewDetails(job._id)}
                          title="View complete job details"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Job Details</span>
                        </button>
                        
                        {status === "rejected" && (
                          <button
                            className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm"
                            onClick={() => handleViewFeedback(_id)}
                            title="View feedback and insights for improvement"
                          >
                            <AlertCircle className="w-4 h-4" />
                            <span>View Feedback</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                      {/* Previous button */}
                      <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      {/* Page numbers */}
                      {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                        <button
                          key={pageNumber}
                          onClick={() => goToPage(pageNumber)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            currentPage === pageNumber
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      ))}
                      
                      {/* Next button */}
                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {filter === "all" 
                    ? (searchKeyword ? "No applications found" : "No job applications yet")
                    : `No ${filter} applications${searchKeyword ? ' found' : ''}`}
                </h3>

                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {filter === "all" 
                    ? (searchKeyword 
                        ? "No applications match your search criteria. Try adjusting your search terms or filters."
                        : "You haven't applied to any jobs yet. Start exploring job opportunities and apply to positions that match your skills and interests.")
                    : `You don't have any applications with ${filter} status${searchKeyword ? ' matching your search' : ''} at the moment.`}
                </p>

                {(filter === "all" && !searchKeyword) && (
                  <Link to="/JobSeeker/apply-for-job" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Browse & Apply for Jobs
                  </Link>
                )}
                
                {(searchKeyword || filter !== "all") && (
                  <button 
                    className="inline-block bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
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

      {/* View Application Modal */}
      {showViewApplication && selectedApplication && (
        <ViewApplication
          applicationId={selectedApplication.id}
          jobTitle={selectedApplication.jobTitle}
          onClose={() => setShowViewApplication(false)}
        />
      )}
    </div>
  );
};

export default AppliedJobsPage;