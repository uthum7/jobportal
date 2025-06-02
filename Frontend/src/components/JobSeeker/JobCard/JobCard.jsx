import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./JobCard.css";

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const userId = "Usr1"; // Hardcoded user ID to match with JobDetails.jsx

  useEffect(() => {
    // Check if the job is saved in the user's collection
    const checkSavedStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/saved-jobs/check/${userId}/${job._id}`
        );

        if (response.data && response.data.isSaved) {
          setIsSaved(true);
        }
      } catch (err) {
        console.error("Error checking saved job status:", err);
      }
    };

    checkSavedStatus();
  }, [job._id, userId]);

  const handleSeeMore = () => {
    navigate(`/JobSeeker/job-details/${job._id}`);
  };

  return (
    <div className="job-card">
      {isSaved && <div className="saved-star">★</div>}
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