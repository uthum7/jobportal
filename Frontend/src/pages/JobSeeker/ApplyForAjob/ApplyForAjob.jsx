import React, { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../../../components/JobSeeker/JobCard/JobCard.jsx";
import JobseekerSidebar from "../../../components/JobSeeker/JobseekerSidebar/JobseekerSidebar.jsx";
import { Link } from "react-router-dom";
import { Search, Filter, Briefcase, Calendar, Clock, MapPin, ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from "lucide-react";
import { getUserId, getToken } from "../../../utils/auth";

const experienceOptions = [
  { label: "Beginner", value: 0 },
  { label: "1 Year", value: 1 },
  { label: "2 Years", value: 2 },
  { label: "3 Years", value: 3 },
  { label: "4 Years", value: 4 },
  { label: "5 Years", value: 5 },
  { label: "10+ Years", value: 10 },
];

const postedDateOptions = [
  { label: "Last Hour", value: "last_hour" },
  { label: "Last 24 Hours", value: "last_24_hours" },
  { label: "Last Week", value: "last_week" },
  { label: "Last 30 Days", value: "last_30_days" },
  { label: "Older", value: "older" },
];

const jobTypeOptions = [
  { label: "Full-time", value: "Full-time" },
  { label: "Part-time", value: "Part-time" },
  { label: "Internship", value: "Internship" },
  { label: "Project Base", value: "Project Base" },
];

const jobModeOptions = [
  { label: "Onsite", value: "Onsite" },
  { label: "Remote", value: "Remote" },
  { label: "Hybrid", value: "Hybrid" },
];

const applicationStatusOptions = [
  { label: "Applied Jobs", value: "applied" },
  { label: "Expired Jobs", value: "expired" },
];

const ApplyForAjob = () => {
  const [jobs, setJobs] = useState([]);
  const [displayJobs, setDisplayJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [selectedPostedDate, setSelectedPostedDate] = useState(null);
  const [selectedJobType, setSelectedJobType] = useState(null);
  const [selectedJobMode, setSelectedJobMode] = useState(null);
  const [selectedApplicationStatus, setSelectedApplicationStatus] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [userId, setUserId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (keyword) params.keyword = keyword;
    if (selectedExperience !== null) params.experience = selectedExperience;
    if (selectedPostedDate !== null) params.postedDate = selectedPostedDate;
    if (selectedJobType !== null) params.jobType = selectedJobType;
    if (selectedJobMode !== null) params.jobMode = selectedJobMode;

    axios
      .get("http://localhost:5001/api/job", { params })
      .then((response) => {
        setJobs(response.data);
        setDisplayJobs(response.data);
        setLoading(false);
        setCurrentPage(1); // Reset to first page
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      });
  }, [keyword, selectedExperience, selectedPostedDate, selectedJobType, selectedJobMode]);

  useEffect(() => {
    filterJobs(selectedPostedDate, selectedExperience, selectedJobType, selectedJobMode, selectedApplicationStatus);
  }, [jobs, selectedPostedDate, selectedExperience, selectedJobType, selectedJobMode, selectedApplicationStatus]);

  // Get user ID and fetch applied jobs on component mount
  useEffect(() => {
    const uid = getUserId();
    if (uid) {
      setUserId(uid);
      fetchAppliedJobs(uid);
    }
  }, []);

  // Fetch applied jobs for the user
  const fetchAppliedJobs = async (uid) => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      };
      const response = await axios.get(`http://localhost:5001/api/applied-jobs/${uid}`, config);
      setAppliedJobs(response.data || []);
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
      setAppliedJobs([]);
    }
  };

  const handleExperienceChange = (value) => {
    setSelectedExperience(selectedExperience === value ? null : value);
  };

  const handlePostedDateChange = (value) => {
    setSelectedPostedDate(selectedPostedDate === value ? null : value);
  };

  const handleJobTypeChange = (value) => {
    setSelectedJobType(selectedJobType === value ? null : value);
  };

  const handleJobModeChange = (value) => {
    setSelectedJobMode(selectedJobMode === value ? null : value);
  };

  const handleApplicationStatusChange = (value) => {
    setSelectedApplicationStatus(selectedApplicationStatus === value ? null : value);
  };

  const filterJobs = (postedDateFilter, experienceFilter, jobTypeFilter, jobModeFilter, applicationStatusFilter) => {
    let filtered = [...jobs];

    if (postedDateFilter) {
      const now = new Date();
      const filterDate = new Date();
      
      switch (postedDateFilter) {
        case "last_hour":
          filterDate.setHours(now.getHours() - 1);
          break;
        case "last_24_hours":
          filterDate.setDate(now.getDate() - 1);
          break;
        case "last_week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "last_30_days":
          filterDate.setDate(now.getDate() - 30);
          break;
        case "older":
          filterDate.setDate(now.getDate() - 30);
          filtered = filtered.filter(job => new Date(job.postedDate) < filterDate);
          break;
        default:
          filtered = filtered.filter(job => new Date(job.postedDate) >= filterDate);
      }
      
      if (postedDateFilter !== "older") {
        filtered = filtered.filter(job => new Date(job.postedDate) >= filterDate);
      }
    }

    if (experienceFilter !== null) {
      filtered = filtered.filter(job => job.JobExperienceYears === experienceFilter);
    }

    if (jobTypeFilter) {
      filtered = filtered.filter(job => job.JobType === jobTypeFilter);
    }

    if (jobModeFilter) {
      filtered = filtered.filter(job => job.JobMode === jobModeFilter);
    }

    // Filter by application status
    if (applicationStatusFilter) {
      if (applicationStatusFilter === "applied") {
        // Show only jobs that the user has applied to
        const appliedJobIds = appliedJobs.map(app => app.job._id);
        filtered = filtered.filter(job => appliedJobIds.includes(job._id));
      } else if (applicationStatusFilter === "expired") {
        // Show only expired jobs
        filtered = filtered.filter(job => {
          if (!job.JobDeadline) return false;
          const deadline = new Date(job.JobDeadline);
          const now = new Date();
          deadline.setHours(23, 59, 59, 999);
          return now > deadline;
        });
      }
    }

    setDisplayJobs(filtered);
  };

  // Calculate pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = displayJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(displayJobs.length / jobsPerPage);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const clearAllFilters = () => {
    setKeyword("");
    setSelectedExperience(null);
    setSelectedPostedDate(null);
    setSelectedJobType(null);
    setSelectedJobMode(null);
    setSelectedApplicationStatus(null);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <JobseekerSidebar />
      <div className="flex-1 lg:ml-0">
        <div className="p-6">
          {/* Page header with title and breadcrumb navigation */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Apply For A Job</h1>
            <nav className="text-sm text-gray-600">
              <Link to="/" className="text-blue-600 hover:text-blue-700">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/JobSeeker/apply-for-job" className="text-blue-600 hover:text-blue-700">Apply For A Job</Link>
            </nav>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <Filter className="w-5 h-5 mr-2 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Search For Jobs</h3>
                </div>

                {/* Search Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search by keywords</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Experience Level Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Experience Level
                  </label>
                  <div className="space-y-2">
                    {experienceOptions.map((option) => (
                      <label key={option.value} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedExperience === option.value}
                          onChange={() => handleExperienceChange(option.value)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Posted Date Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Posted Date
                  </label>
                  <div className="space-y-2">
                    {postedDateOptions.map((option) => (
                      <label key={option.value} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPostedDate === option.value}
                          onChange={() => handlePostedDateChange(option.value)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Job Type Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Job Type
                  </label>
                  <div className="space-y-2">
                    {jobTypeOptions.map((option) => (
                      <label key={option.value} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedJobType === option.value}
                          onChange={() => handleJobTypeChange(option.value)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Job Mode Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Job Mode
                  </label>
                  <div className="space-y-2">
                    {jobModeOptions.map((option) => (
                      <label key={option.value} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedJobMode === option.value}
                          onChange={() => handleJobModeChange(option.value)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Application Status Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Application Status
                  </label>
                  <div className="space-y-2">
                    {applicationStatusOptions.map((option) => (
                      <label key={option.value} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedApplicationStatus === option.value}
                          onChange={() => handleApplicationStatusChange(option.value)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters Button */}
                <button
                  onClick={clearAllFilters}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Clear All Filters
                </button>
              </div>
            </div>

            {/* Job Cards Container */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading jobs...</p>
                    </div>
                  </div>
                </div>
              ) : currentJobs.length > 0 ? (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Available Jobs</h3>
                      <span className="text-sm text-gray-600">
                        Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, displayJobs.length)} of {displayJobs.length} jobs
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {currentJobs.map((job) => (
                        <JobCard key={job._id} job={job} />
                      ))}
                    </div>
                  </div>

                  {/* Pagination Controls */}
                  {displayJobs.length > jobsPerPage && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Page {currentPage} of {totalPages}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Previous</span>
                          </button>
                          <span className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                            {currentPage}
                          </span>
                          <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <span>Next</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No jobs found</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      We couldn't find any jobs matching your search criteria.
                      Try adjusting your filters or search terms to find more opportunities.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                      <strong className="text-blue-800">Try these suggestions:</strong>
                      <ul className="text-blue-700 text-sm mt-2 space-y-1">
                        <li>• Remove some filters</li>
                        <li>• Use different keywords</li>
                        <li>• Check spelling and try synonyms</li>
                        <li>• Expand your search criteria</li>
                      </ul>
                    </div>
                    <button
                      onClick={clearAllFilters}
                      className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyForAjob;