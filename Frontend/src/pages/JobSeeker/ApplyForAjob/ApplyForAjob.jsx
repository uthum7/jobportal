import React, { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../../../components/JobCard/JobCard.jsx";
import JobseekerSidebar from "../../../components/JobseekerSidebar/JobseekerSidebar.jsx";
import "./ApplyForAjob.css";
import "../Dashboard/Dashboard.css";
import { Link } from "react-router-dom";


const experienceOptions = [
  { label: "Beginner", value: "Beginner" },
  { label: "1+ Year", value: "1+ Year" },
  { label: "2 Year", value: "2 Year" },
  { label: "3+ Year", value: "3+ Year" },
  { label: "4+ Year", value: "4+ Year" },
  { label: "5+ Year", value: "5+ Year" },
  { label: "10+ Year", value: "10+ Year" },
];

const ApplyForAjob = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [selectedExperience, setSelectedExperience] = useState([]);

  useEffect(() => {
    setLoading(true);

    const params = {};
    if (keyword) params.keyword = keyword;
    if (selectedExperience.length > 0) {
      params.experience = selectedExperience.join(",");
    }

    axios
      .get("http://localhost:5001/api/jobs", { params })
      .then((response) => {
        setJobs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      });
  }, [keyword, selectedExperience]);

  const handleExperienceChange = (value) => {
    setSelectedExperience((prev) =>
      prev.includes(value)
        ? prev.filter((exp) => exp !== value)
        : [...prev, value]
    );
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

            <div className="experience-filter">
              <h5 style={{ color: "#808080", marginTop: "20px" }}>Experience Level</h5>
              <div className="experience-options">
                {experienceOptions.map((option) => (
                  <div key={option.value} className="experience-option">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={selectedExperience.includes(option.value)}
                        onChange={() => handleExperienceChange(option.value)}
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
            ) : jobs.length > 0 ? (
              jobs.map((job) => <JobCard key={job._id} job={job} />)
            ) : (
              <p>No jobs found matching your criteria.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyForAjob;
