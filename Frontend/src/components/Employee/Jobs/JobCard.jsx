// components/JobCard.jsx
import React from 'react';
import '../styles/JobCard-Candidates.css';

const JobCard = ({ job, onViewCandidates }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const isDeadlineSoon = (deadline) => {
        const deadlineDate = new Date(deadline);
        const today = new Date();
        const timeDiff = deadlineDate.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysDiff <= 7 && daysDiff >= 0;
    };

    return (
        <div className="job-card">
            <div className="job-card-header">
                <h3 className="job-title">{job.JobTitle}</h3>
                <div className="job-badges">
                    <span className={`badge badge-${job.JobType?.toLowerCase()}`}>
                        {job.JobType}
                    </span>
                    <span className={`badge badge-${job.JobMode?.toLowerCase()}`}>
                        {job.JobMode}
                    </span>
                </div>
            </div>

            <div className="job-card-body">
                <div className="job-info">
                    <div className="job-detail">
                        <span className="label">Experience:</span>
                        <span className="value">{job.JobExperienceYears} years</span>
                    </div>
                    <div className="job-detail">
                        <span className="label">Posted:</span>
                        <span className="value">{formatDate(job.postedDate)}</span>
                    </div>
                    <div className="job-detail">
                        <span className="label">Deadline:</span>
                        <span className={`value ${isDeadlineSoon(job.JobDeadline) ? 'deadline-soon' : ''}`}>
                            {formatDate(job.JobDeadline)}
                        </span>
                    </div>
                </div>

                <div className="job-description">
                    <p>{job.JobDescription}</p>
                </div>

                {job.Tags && job.Tags.length > 0 && (
                    <div className="job-tags">
                        {job.Tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="tag">{tag}</span>
                        ))}
                        {job.Tags.length > 3 && (
                            <span className="tag tag-more">+{job.Tags.length - 3} more</span>
                        )}
                    </div>
                )}
            </div>

            <div className="job-card-footer">
                <div className="application-stats">
                    <div className="stat">
                        <span className="stat-number">{job.applicationCount || 0}</span>
                        <span className="stat-label">Total Applications</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number pending">{job.pendingCount || 0}</span>
                        <span className="stat-label">Pending</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number accepted">{job.acceptedCount || 0}</span>
                        <span className="stat-label">Accepted</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number rejected">{job.rejectedCount || 0}</span>
                        <span className="stat-label">Rejected</span>
                    </div>
                </div>

            </div>
            <button
                className="view-candidates-btn"
                onClick={() => onViewCandidates(job)}
                disabled={job.applicationCount === 0}
            >
                View Candidates
            </button>
        </div>
    );
};

export default JobCard;