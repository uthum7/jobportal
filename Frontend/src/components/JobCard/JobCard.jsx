// src/components/JobCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./JobCard.css";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const handleSeeMore = () => {
    navigate(`/job-details/${job._id}`);
  };

  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p><strong>Type:</strong> {job.jobType}</p>
      <p><strong>Role:</strong> {job.role}</p>
      <p><strong>Experience:</strong> {job.experienceYears} years</p>
      <button className="see-more-btn" onClick={handleSeeMore}>
        See More
      </button>
    </div>
  );
};

export default JobCard;
