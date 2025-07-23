import React, { useEffect } from 'react';
import './JobDetailsModal.css';

const JobDetailsModal = ({ job, isOpen, onClose }) => {
  // Close modal on ESC key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !job) return null;

  const getJobStatus = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate - now;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return { status: 'expired', label: 'Expired', color: 'danger' };
    if (daysDiff <= 3) return { status: 'urgent', label: `${daysDiff} days left`, color: 'warning' };
    return { status: 'active', label: `${daysDiff} days left`, color: 'success' };
  };

  const getJobTypeColor = (type) => {
    const colors = {
      'Full-time': 'success',
      'Part-time': 'warning',
      'Contract': 'info',
      'Internship': 'purple',
      'Remote': 'primary'
    };
    return colors[type] || 'default';
  };

  const jobStatus = getJobStatus(job.JobDeadline);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">{job.JobTitle}</h2>
            <div className="modal-badges">
              <span className={`job-type-badge ${getJobTypeColor(job.JobType)}`}>
                {job.JobType}
              </span>
              <span className={`job-status-badge ${jobStatus.color}`}>
                ⏰ {jobStatus.label}
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Job Overview */}
          <div className="job-overview">
            <h3 className="section-title">📋 Job Overview</h3>
            <div className="overview-grid">
              <div className="overview-item">
                <span className="overview-label">📅 Posted Date:</span>
                <span className="overview-value">{new Date(job.postedDate).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="overview-item">
                <span className="overview-label">⏳ Deadline:</span>
                <span className="overview-value">{new Date(job.JobDeadline).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              {job.JobMode && (
                <div className="overview-item">
                  <span className="overview-label">📍 Work Mode:</span>
                  <span className="overview-value">{job.JobMode}</span>
                </div>
              )}
              {job.JobExperienceYears !== undefined && (
                <div className="overview-item">
                  <span className="overview-label">👨‍💼 Experience Required:</span>
                  <span className="overview-value">{job.JobExperienceYears} years</span>
                </div>
              )}
            </div>
          </div>

          {/* Job Description */}
          {job.JobDescription && (
            <div className="job-section">
              <h3 className="section-title">📝 Job Description</h3>
              <div className="description-content">
                <p>{job.JobDescription}</p>
              </div>
            </div>
          )}

          {/* Requirements */}
          {job.Requirements && job.Requirements.length > 0 && (
            <div className="job-section">
              <h3 className="section-title">✅ Requirements</h3>
              <ul className="requirements-list">
                {job.Requirements.map((requirement, index) => (
                  <li key={index} className="requirement-item">
                    <span className="requirement-bullet">•</span>
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Qualifications */}
          {job.Qualifications && job.Qualifications.length > 0 && (
            <div className="job-section">
              <h3 className="section-title">🎓 Qualifications</h3>
              <ul className="qualifications-list">
                {job.Qualifications.map((qualification, index) => (
                  <li key={index} className="qualification-item">
                    <span className="qualification-bullet">•</span>
                    {qualification}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Responsibilities */}
          {job.Responsibilities && job.Responsibilities.length > 0 && (
            <div className="job-section">
              <h3 className="section-title">🎯 Responsibilities</h3>
              <ul className="responsibilities-list">
                {job.Responsibilities.map((responsibility, index) => (
                  <li key={index} className="responsibility-item">
                    <span className="responsibility-bullet">•</span>
                    {responsibility}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {job.Tags && job.Tags.length > 0 && (
            <div className="job-section">
              <h3 className="section-title">🏷️ Tags</h3>
              <div className="tags-container">
                {job.Tags.map((tag, index) => (
                  <span key={index} className="tag-item">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <div className="footer-actions">
            <button className="action-button secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;