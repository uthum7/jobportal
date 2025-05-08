import React, { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../../../components/JobCard/JobCard.jsx";
import JobseekerSidebar from "../../../components/JobseekerSidebar/JobseekerSidebar.jsx";
import "./ApplyForAjob.css";
import "../Dashboard/Dashboard.css";
import { Link } from "react-router-dom";


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
  { label: "Older", value: "older" },
  { label: "Last 30 Days", value: "last_30_days" },
];


const ApplyForAjob = () => {
  const [jobs, setJobs] = useState([]);
  const [displayJobs, setDisplayJobs] = useState(jobs);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [selectedPostedDate, setSelectedPostedDate] = useState(null);


  useEffect(() => {
    setLoading(true);

    const params = {};
    if (keyword) params.keyword = keyword;
    /*if (selectedExperience.length > 0) {
      params.experience = selectedExperience.join(",");
    }*/
    if (selectedExperience !== null) {
      params.experience = selectedExperience;
    }

    axios
      .get("http://localhost:5001/api/jobs", { params })
      .then((response) => {
        setJobs(response.data);
        filterJobs(selectedPostedDate, selectedExperience);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      });
  }, [keyword, selectedExperience]);

  useEffect(() => {
    // Reapply filters every time jobs or selected filters change
    filterJobs(selectedPostedDate, selectedExperience);
  }, [selectedPostedDate, selectedExperience, jobs]);  // Trigger whenever jobs or filters change


  const handleExperienceChange = (value) => {

    // Toggle selection: deselect if clicked again
    const newValue = selectedExperience === value ? null : value;
    setSelectedExperience(newValue);

    // Filter or show all
    if (newValue === null) {
      setDisplayJobs(jobs);
    } else {
      const filtered = jobs.filter((job) => job.JobExperienceYears === newValue);
      setDisplayJobs(filtered);
    }
  };



  const handlePostedDateChange = (value) => {
    const newValue = selectedPostedDate === value ? null : value;
    setSelectedPostedDate(newValue);
  };


  const filterJobs = (postedDateFilter, experienceFilter) => {
    let filteredJobs = jobs;

    // Filter by experience
    if (experienceFilter !== null) {
      filteredJobs = filteredJobs.filter((job) => job.JobExperienceYears === experienceFilter);
    }

    // Filter by posted date
    if (postedDateFilter !== null) {
      const now = new Date();
      filteredJobs = filteredJobs.filter((job) => {
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

    setDisplayJobs(filteredJobs);
  };


  return (
    <div className="dashboard-container">
      <JobseekerSidebar />

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1 className="page-title">Apply For A Job</h1>
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-separator">/</span>
            <Link to="/apply-for-a-job" className="breadcrumb-link">Apply For A Job</Link>
          </div>

        </div>

        <div className="job-layout">
          {/* Left filter panel */}
          <div className="filter-panel">
            <h3>Search For Jobs</h3>

            <h5 style={{ color: "#808080" }}>Search by keywords</h5>
            <input
              type="text"
              placeholder="Search jobs..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            {/*Experience Filter */}
            <div className="experience-filter">
              <h5 style={{ color: "#808080", marginTop: "20px" }}>Experience Level</h5>
              <div className="experience-options">
                {experienceOptions.map((option) => (
                  <div key={option.value} className="experience-option">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={selectedExperience === option.value}
                        onChange={() => handleExperienceChange(option.value)}
                      />
                      <span className="checkmark"></span>
                      <span className="option-label">{option.label}</span>
                    </label>
                  </div>
                ))}
              </div>

            </div>


            {/* {Posted Date Filter} */}
            <div className="posted-date-filter">
              <h5 style={{ color: "#808080", marginTop: "20px" }}>Posted Date</h5>
              <div className="posted-date-options">
                {postedDateOptions.map((option) => (
                  <div key={option.value} className="posted-date-option">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={selectedPostedDate === option.value}
                        onChange={() => handlePostedDateChange(option.value)}
                      />

                      <span className="checkmark"></span>
                      <span className="option-label">{option.label}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right job cards */}
          <div className="job-cards-container">
            {loading ? (
              <p>Loading jobs...</p>
            ) : displayJobs.length > 0 ? (
              displayJobs.map((job) => <JobCard key={job._id} job={job} />)
            ) : (
              jobs.map((job) => <JobCard key={job._id} job={job} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyForAjob;
