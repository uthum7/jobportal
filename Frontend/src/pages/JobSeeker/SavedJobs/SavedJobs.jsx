// SavedJobs.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import JobCard from "../../../components/JobSeeker/JobCard/JobCard.jsx";
import JobseekerSidebar from "../../../components/JobSeeker/JobseekerSidebar/JobseekerSidebar.jsx";
import { getUserId, isAuthenticated, isJobSeeker, getToken } from "../../../utils/auth"; // Import auth utilities
import { Link } from "react-router-dom";
import { Search, RefreshCw, Bookmark } from "lucide-react";

const SavedJobs = () => {
  // State variables for managing saved jobs data
  const [savedJobs, setSavedJobs] = useState([]);           // Stores all saved job details
  const [loading, setLoading] = useState(true);             // Tracks loading state for API requests
  const [error, setError] = useState(null);                 // Tracks error state
  const [searchKeyword, setSearchKeyword] = useState("");   // Search keyword state
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(9); // 3x3 grid on desktop
  
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

  const refreshSavedJobs = () => {
    fetchSavedJobs();
  };

  const filteredSavedJobs = savedJobs.filter(job => {
    if (!searchKeyword) return true;
    
    return (
      job.JobTitle.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      job.JobType.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      job.JobMode.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  });

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredSavedJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredSavedJobs.length / jobsPerPage);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword]);

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

  // Don't render if user is not authenticated or not a job seeker
  if (!isAuthenticated() || !isJobSeeker()) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-4">You need to be logged in as a Job Seeker to view saved jobs.</p>
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Saved Jobs</h1>
            <nav className="text-sm text-gray-600">
              <Link to="/" className="text-blue-600 hover:text-blue-700">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/JobSeeker/saved-jobs" className="text-blue-600 hover:text-blue-700">Saved Jobs</Link>
            </nav>
          </header>

          {/* Saved Jobs Header Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Your Saved Jobs</h3>
                <p className="text-sm text-gray-600">
                  {loading ? "Loading..." : `${filteredSavedJobs.length} Job${filteredSavedJobs.length !== 1 ? 's' : ''} Saved`}
                </p>
              </div>
              {savedJobs.length > 0 && (
                <button 
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  onClick={refreshSavedJobs}
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Search Bar */}
          {savedJobs.length > 0 && (
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
          )}
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">Error: {error}</p>
              <button onClick={refreshSavedJobs} className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                Try Again
              </button>
            </div>
          )}

          {/* Saved Job Cards Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your saved jobs...</p>
                </div>
              </div>
            ) : filteredSavedJobs.length > 0 ? (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentJobs.map((job) => (
                    <JobCard 
                      key={job._id} 
                      job={job} 
                      onJobUnsaved={refreshSavedJobs} // Pass refresh function to update list when job is unsaved
                    />
                  ))}
                </div>
                
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
              // Enhanced "No saved jobs found" section
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bookmark className="w-8 h-8 text-gray-400" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {savedJobs.length === 0 
                    ? "No saved jobs yet" 
                    : "No saved jobs found"}
                </h3>
                
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {savedJobs.length === 0 
                    ? "You haven't saved any jobs yet. Start exploring job opportunities and save the ones that match your interests."
                    : "No saved jobs match your search criteria. Try adjusting your search terms."}
                </p>
                
                {savedJobs.length === 0 ? (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                      <strong className="text-blue-800">Get started:</strong>
                      <ul className="text-blue-700 text-sm mt-2 space-y-1">
                        <li>• Browse available job listings</li>
                        <li>• Click the "Save Job" button on jobs you're interested in</li>
                        <li>• Come back here to view all your saved jobs</li>
                        <li>• Apply to your saved jobs when you're ready</li>
                      </ul>
                    </div>
                    <Link to="/JobSeeker/apply-for-job" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Browse Jobs
                    </Link>
                  </>
                ) : (
                  <button 
                    className="inline-block bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
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