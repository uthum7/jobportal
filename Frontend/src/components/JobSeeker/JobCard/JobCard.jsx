// src/components/JobCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./JobCard.css";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const handleSeeMore = () => {
    navigate(`/JobSeeker/job-details/${job._id}`);
  };

  return (
    <div className="job-card">
      <h3>{job.JobTitle}</h3>
      <p><strong>Type:</strong> {job.JobType}</p>
      <p><strong>Mode:</strong> {job.JobMode}</p>
      <p><strong>Experience:</strong> {job.JobExperienceYears} years</p>
      <p><strong>Deadline:</strong> {new Date(job.JobDeadline).toLocaleDateString()}</p>
      <button className="see-more-btn" onClick={handleSeeMore}>
        See More
      </button>
    </div>
  );
};

export default JobCard;
