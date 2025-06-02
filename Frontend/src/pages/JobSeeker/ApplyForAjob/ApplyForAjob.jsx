// ApplyForAjob.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../../../components/JobSeeker/JobCard/JobCard.jsx";
import JobseekerSidebar from "../../../components/JobSeeker/JobseekerSidebar/JobseekerSidebar.jsx";
import "./ApplyForAjob.css";
import "../Dashboard/Dashboard.css";
import { Link } from "react-router-dom";
import Footer from "../../../components/Footer/Footer.jsx";

// Define options for experience
const experienceOptions = [
  { label: "Beginner", value: 0 },
  { label: "1 Year", value: 1 },
  { label: "2 Years", value: 2 },
  { label: "3 Years", value: 3 },
  { label: "4 Years", value: 4 },
  { label: "5 Years", value: 5 },
  { label: "10+ Years", value: 10 },
];

// Define options for posted date
const postedDateOptions = [
  { label: "Last Hour", value: "last_hour" },
  { label: "Last 24 Hours", value: "last_24_hours" },
  { label: "Last Week", value: "last_week" },
  { label: "Last 30 Days", value: "last_30_days" },
  { label: "Older", value: "older" },
];

// Define options for job type
const jobTypeOptions = [
  { label: "Full-time", value: "Full-time" },
  { label: "Part-time", value: "Part-time" },
  { label: "Internship", value: "Internship" },
  { label: "Project Base", value: "Project Base" },
];

// Define options for job mode
const jobModeOptions = [
  { label: "Onsite", value: "Onsite" },
  { label: "Remote", value: "Remote" },
  { label: "Hybrid", value: "Hybrid" },
];


const ApplyForAjob = () => {

  // State variables for managing jobs data and filter selections
  const [jobs, setJobs] = useState([]);                               // Stores all fetched jobs
  const [displayJobs, setDisplayJobs] = useState([]);                 // Stores filtered jobs to display
  const [loading, setLoading] = useState(true);                       // Tracks loading state for API requests
  const [keyword, setKeyword] = useState("");                         // Stores search keyword input
  const [selectedExperience, setSelectedExperience] = useState(null); // Stores selected experience filter
  const [selectedPostedDate, setSelectedPostedDate] = useState(null); // Stores selected posted date filter
  const [selectedJobType, setSelectedJobType] = useState(null);       // Stores selected job type filter
  const [selectedJobMode, setSelectedJobMode] = useState(null);       // Stores selected job mode filter


  useEffect(() => {
    setLoading(true);

    // Fetch jobs from backend  
    const params = {};
    if (keyword) params.keyword = keyword;
    if (selectedExperience !== null) params.experience = selectedExperience;
    if (selectedPostedDate !== null) params.postedDate = selectedPostedDate;
    if (selectedJobType !== null) params.jobType = selectedJobType;
    if (selectedJobMode !== null) params.jobMode = selectedJobMode;

    // Make the API request fetch jobs with the filter parameters
    axios
      .get("http://localhost:5001/api/jobs", { params })
      .then((response) => {
        setJobs(response.data);         // Update jobs state with fetched data
        setDisplayJobs(response.data);  // Initialize displayJobs with all fetched jobs
        setLoading(false);              // Set loading to false after successful fetch
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setLoading(false);              // Set loading to false even if there's an error
      });
  }, [keyword, selectedExperience, selectedPostedDate, selectedJobType, selectedJobMode]); // Run effect when any filter changes

  useEffect(() => {

    // Apply client-side filtering when filter states change
    filterJobs(selectedPostedDate, selectedExperience, selectedJobType, selectedJobMode);
  }, [jobs, selectedPostedDate, selectedExperience, selectedJobType, selectedJobMode]);

  // Handler for experience filter changes - toggles selection
  const handleExperienceChange = (value) => {
    setSelectedExperience(selectedExperience === value ? null : value);
  };

  // Handler for posted date filter changes - toggles selection
  const handlePostedDateChange = (value) => {
    setSelectedPostedDate(selectedPostedDate === value ? null : value);
  };

  // Handler for job type filter changes - toggles selection
  const handleJobTypeChange = (value) => {
    setSelectedJobType(selectedJobType === value ? null : value);
  };

  // Handler for job mode filter changes - toggles selection
  const handleJobModeChange = (value) => {
    setSelectedJobMode(selectedJobMode === value ? null : value);
  };

  // Function to filter jobs based on selected filters (client-side filtering)
  const filterJobs = (postedDateFilter, experienceFilter, jobTypeFilter, jobModeFilter) => {
    let filtered = [...jobs];  // Create a copy of all jobs

    // Filter by experience if selected
    if (experienceFilter !== null) {
      filtered = filtered.filter((job) => job.JobExperienceYears === experienceFilter);
    }

    // Filter by posted date if selected
    if (postedDateFilter !== null) {
      const now = new Date();
      filtered = filtered.filter((job) => {
        const postDate = new Date(job.postedDate);
        switch (postedDateFilter) {
          case "last_hour":
            return now - postDate <= 60 * 60 * 1000;
          case "last_24_hours":
            return now - postDate <= 24 * 60 * 60 * 1000;
          case "last_week":
            return now - postDate <= 7 * 24 * 60 * 60 * 1000;
          case "last_30_days":
            return now - postDate <= 30 * 24 * 60 * 60 * 1000;
          case "older":
            return now - postDate > 30 * 24 * 60 * 60 * 1000;
          default:
            return true;  // Default case: include all jobs
        }
      });
    }

    // Filter by job type if selected
    if (jobTypeFilter !== null) {
      filtered = filtered.filter((job) => job.JobType === jobTypeFilter);
    }

    // Filter by job mode if selected
    if (jobModeFilter !== null) {
      filtered = filtered.filter((job) => job.JobMode === jobModeFilter);
    }

    setDisplayJobs(filtered);  // Update the displayJobs state with filtered results
  };

  return (
    <div className="ApplyJobMainContainer">
      <div className="dashboard-container">

        <div className="main-content">

          {/* Sidebar navigation for job seeker */}
          <JobseekerSidebar />

          {/* Page header with title and breadcrumb navigation */}
          <div className="header">
            <h1 className="page-title">Apply For A Job</h1>
            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <Link to="/apply-for-a-job" className="breadcrumb-link">Apply For A Job</Link>
            </div>
          </div>

          <div className="job-layout">
            {/* Filter Column */}
            <div className="filter-panel">
              <h3>Search For Jobs</h3>
              {/* Keyword search */}
              <h5 style={{ color: "#808080" }}>Search by keywords</h5>
              <input
                type="text"
                placeholder="Search jobs..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />

              {/* Experience Filter */}
              <div className="experience-filter">
                <h5 style={{ color: "#808080", marginTop: "20px" }}>Experience Level</h5>
                <div className="experience-options">
                  {experienceOptions.map((option) => (
                    <label key={option.value} className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={selectedExperience === option.value}
                        onChange={() => handleExperienceChange(option.value)}
                      />
                      <span className="checkmark"></span>
                      <span className="option-label">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Posted Date Filter */}
              <div className="posted-date-filter">
                <h5 style={{ color: "#808080", marginTop: "20px" }}>Posted Date</h5>
                <div className="posted-date-options">
                  {postedDateOptions.map((option) => (
                    <label key={option.value} className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={selectedPostedDate === option.value}
                        onChange={() => handlePostedDateChange(option.value)}
                      />
                      <span className="checkmark"></span>
                      <span className="option-label">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Job Type Filter */}
              <div className="job-type-filter">
                <h5 style={{ color: "#808080", marginTop: "20px" }}>Job Type</h5>
                <div className="posted-date-options">
                  {jobTypeOptions.map((option) => (
                    <label key={option.value} className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={selectedJobType === option.value}
                        onChange={() => handleJobTypeChange(option.value)}
                      />
                      <span className="checkmark"></span>
                      <span className="option-label">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>


              {/* Job Mode Filter */}
              <div className="job-mode-filter">
                <h5 style={{ color: "#808080", marginTop: "20px" }}>Job Mode</h5>
                <div className="posted-date-options">
                  {jobModeOptions.map((option) => (
                    <label key={option.value} className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={selectedJobMode === option.value}
                        onChange={() => handleJobModeChange(option.value)}
                      />
                      <span className="checkmark"></span>
                      <span className="option-label">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Job Cards Section */}
            <div className="job-cards-container">
              {loading ? (
                <p>Loading jobs...</p>
              ) : displayJobs.length > 0 ? (
                displayJobs.map((job) => <JobCard key={job._id} job={job} />)
              ) : (
                // Enhanced "No jobs found" section
                <div className="no-jobs-found">
                  {/* Search icon SVG */}
                  <svg
                    className="no-jobs-found-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>

                  <h3 className="no-jobs-found-title">No jobs found</h3>

                  <p className="no-jobs-found-message">
                    We couldn't find any jobs matching your search criteria.
                    Try adjusting your filters or search terms to find more opportunities.
                  </p>

                  <div className="no-jobs-found-suggestions">
                    <strong>Try these suggestions:</strong>
                    <ul>
                      <li>Remove some filters</li>
                      <li>Use different keywords</li>
                      <li>Check spelling and try synonyms</li>
                      <li>Expand your search criteria</li>
                    </ul>
                  </div>

                  <button
                    className="refresh-button"
                    onClick={() => {
                      setKeyword("");
                      setSelectedExperience(null);
                      setSelectedPostedDate(null);
                      setSelectedJobType(null);
                      setSelectedJobMode(null);
                    }}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
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

export default ApplyForAjob;
