// ApplyForAjob.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../../../components/JobCard/JobCard.jsx";
import JobseekerSidebar from "../../../components/JobseekerSidebar/JobseekerSidebar.jsx";
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

const ApplyForAjob = () => {
  const [jobs, setJobs] = useState([]);
  const [displayJobs, setDisplayJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [selectedPostedDate, setSelectedPostedDate] = useState(null);
  const [selectedJobType, setSelectedJobType] = useState(null);

  useEffect(() => {
    setLoading(true);

    const params = {};
    if (keyword) params.keyword = keyword;
    if (selectedExperience !== null) params.experience = selectedExperience;
    if (selectedPostedDate !== null) params.postedDate = selectedPostedDate;
    if (selectedJobType !== null) params.jobType = selectedJobType;

    axios
      .get("http://localhost:5001/api/jobs", { params })
      .then((response) => {
        setJobs(response.data);
        setDisplayJobs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      });
  }, [keyword, selectedExperience, selectedPostedDate, selectedJobType]);

  useEffect(() => {
    filterJobs(selectedPostedDate, selectedExperience, selectedJobType);
  }, [jobs, selectedPostedDate, selectedExperience, selectedJobType]);

  const handleExperienceChange = (value) => {
    setSelectedExperience(selectedExperience === value ? null : value);
  };

  const handlePostedDateChange = (value) => {
    setSelectedPostedDate(selectedPostedDate === value ? null : value);
  };

  const handleJobTypeChange = (value) => {
    setSelectedJobType(selectedJobType === value ? null : value);
  };

  const filterJobs = (postedDateFilter, experienceFilter, jobTypeFilter) => {
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

    setDisplayJobs(filtered);
  };

  return (
    <div className="ApplyJobMainContainer">
      <div className="dashboard-container">
        
        <div className="main-content">
          
        <JobseekerSidebar/>
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
            </div>

            {/* Job Cards Section */}
            <div className="job-cards-container">
              {loading ? (
                <p>Loading jobs...</p>
              ) : displayJobs.length > 0 ? (
                displayJobs.map((job) => <JobCard key={job._id} job={job} />)
              ) : (
                <p>No jobs found.</p>
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