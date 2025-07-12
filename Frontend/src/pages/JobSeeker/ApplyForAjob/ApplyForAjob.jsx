import React, { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../../../components/JobSeeker/JobCard/JobCard.jsx";
import JobseekerSidebar from "../../../components/JobSeeker/JobseekerSidebar/JobseekerSidebar.jsx";
import "./ApplyForAjob.css";
import "../Dashboard/Dashboard.css";
import { Link } from "react-router-dom";
import Footer from "../../../components/Footer/Footer.jsx";

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

const ApplyForAjob = () => {
  const [jobs, setJobs] = useState([]);
  const [displayJobs, setDisplayJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [selectedPostedDate, setSelectedPostedDate] = useState(null);
  const [selectedJobType, setSelectedJobType] = useState(null);
  const [selectedJobMode, setSelectedJobMode] = useState(null);

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
      .get("http://localhost:5001/api/jobs", { params })
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
    filterJobs(selectedPostedDate, selectedExperience, selectedJobType, selectedJobMode);
  }, [jobs, selectedPostedDate, selectedExperience, selectedJobType, selectedJobMode]);

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

  const filterJobs = (postedDateFilter, experienceFilter, jobTypeFilter, jobModeFilter) => {
    let filtered = [...jobs];

    if (experienceFilter !== null) {
      filtered = filtered.filter((job) => job.JobExperienceYears === experienceFilter);
    }

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
            return true;
        }
      });
    }

    if (jobTypeFilter !== null) {
      filtered = filtered.filter((job) => job.JobType === jobTypeFilter);
    }

    if (jobModeFilter !== null) {
      filtered = filtered.filter((job) => job.JobMode === jobModeFilter);
    }

    setDisplayJobs(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Pagination calculations
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = displayJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(displayJobs.length / jobsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="ApplyJobMainContainer">
      <div className="dashboard-container">
        <div className="main-content">
          <JobseekerSidebar />

          <div className="header">
            <h1 className="page-title">Apply For A Job</h1>
            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <Link to="/apply-for-a-job" className="breadcrumb-link">Apply For A Job</Link>
            </div>
          </div>

          <div className="job-layout">
            <div className="filter-panel">
              <h3>Search For Jobs</h3>
              <h5 style={{ color: "#808080" }}>Search by keywords</h5>
              <input
                type="text"
                placeholder="Search jobs..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />

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

            <div className="job-cards-container">
              {loading ? (
                <p>Loading jobs...</p>
              ) : currentJobs.length > 0 ? (
                currentJobs.map((job) => <JobCard key={job._id} job={job} />)
              ) : (
                <div className="no-jobs-found">
                  <svg className="no-jobs-found-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
                  <button className="refresh-button" onClick={() => {
                    setKeyword("");
                    setSelectedExperience(null);
                    setSelectedPostedDate(null);
                    setSelectedJobType(null);
                    setSelectedJobMode(null);
                  }}>
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Pagination Controls */}
{displayJobs.length > jobsPerPage && (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "30px", gap: "10px" }}>
    <span style={{ fontWeight: "500", color: "#374151" }}>
      Page {currentPage} of {totalPages}
    </span>
    <div style={{ display: "flex", gap: "8px" }}>
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        style={{
          padding: "8px 16px",
          borderRadius: "6px",
          border: "1.5px solid #4CAF50",
          backgroundColor: "#ffffff",
          color: "#4CAF50",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
          opacity: currentPage === 1 ? 0.5 : 1,
          fontWeight: "bold",
        }}
      >
        &lt;
      </button>

      <span
        style={{
          padding: "8px 16px",
          borderRadius: "6px",
          border: "1.5px solid #4CAF50",
          backgroundColor: "#ffffff",
          color: "#4CAF50",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {currentPage}
      </span>

      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        style={{
          padding: "8px 16px",
          borderRadius: "6px",
          border: "1.5px solid #4CAF50",
          backgroundColor: "#ffffff",
          color: "#4CAF50",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          opacity: currentPage === totalPages ? 0.5 : 1,
          fontWeight: "bold",
        }}
      >
        &gt;
      </button>
    </div>
  </div>
)}

        </div>
      </div>
      <div className="footer1">
        <Footer />
      </div>
    </div>
  );
};

export default ApplyForAjob;
