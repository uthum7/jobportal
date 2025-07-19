import axios from 'axios';
import React, { useEffect, useState } from 'react';
import JobDetailsModal from '../Components/JobDetailsModal';
import "../jobs.css";

const EmployeeDashboardJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [jobsPerPage] = useState(6);

    // Modal state
    const [selectedJob, setSelectedJob] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:5001/api/job/all");
                setJobs(response.data.Jobs || []);
            } catch (error) {
                console.error("Error fetching jobs:", error);
                setError("Failed to load jobs");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Reset to first page when filter or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, searchTerm]);

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

    const getJobStatus = (deadline) => {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const timeDiff = deadlineDate - now;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysDiff < 0) return { status: 'expired', label: 'Expired', color: 'danger' };
        if (daysDiff <= 3) return { status: 'urgent', label: `${daysDiff} days left`, color: 'warning' };
        return { status: 'active', label: `${daysDiff} days left`, color: 'success' };
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.JobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.JobType.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'all') return matchesSearch;

        const jobStatus = getJobStatus(job.JobDeadline);
        return matchesSearch && jobStatus.status === filter;
    });

    // Pagination logic
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Scroll to top of jobs section
        document.querySelector('.jobs-container').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    // Delete job function - FIXED SCOPE
    const handleDeleteJob = async (jobId) => {
        if (window.confirm("Are you sure you want to delete this job?")) {
            try {
                setLoading(true);
                const response = await axios.delete(`http://localhost:5001/api/job/delete/${jobId}`);
                if (response.data.success) {
                    // Update the jobs state by removing the deleted job
                    setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
                    alert("Job deleted successfully");
                } else {
                    alert("Failed to delete job");
                }
            } catch (error) {
                console.error("Error deleting job:", error);
                alert("Failed to delete job");
            } finally {
                setLoading(false);
            }
        } else {
            console.log("Delete Canceled");
        }
    };

    // Modal handlers - MOVED TO CORRECT SCOPE
    const handleViewDetails = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedJob(null);
    };

    // Job Card Component - MOVED TO CORRECT SCOPE
    const JobCard = ({ job }) => {
        const jobStatus = getJobStatus(job.JobDeadline);

        return (
            <div className={`job-card-modern ${jobStatus.status}`}>
                <div className="job-card-header">
                    <div className="job-title-section">
                        <h3 className="job-title">{job.JobTitle}</h3>
                        <div className="job-meta">
                            <span className={`job-type-badge ${getJobTypeColor(job.JobType)}`}>
                                {job.JobType}
                            </span>
                            <span className={`job-status-badge ${jobStatus.color}`}>
                                ⏰ {jobStatus.label}
                            </span>
                        </div>
                    </div>
                    <div className="job-actions">
                        <button 
                            className="action-btn view" 
                            title="View Details"
                            onClick={() => handleViewDetails(job)}
                        >
                            👁️
                        </button>
                        <button className="action-btn edit" title="Edit Job">
                            ✏️
                        </button>
                        <button 
                            className="action-btn delete" 
                            title="Delete Job" 
                            onClick={() => handleDeleteJob(job._id)}
                        >
                            🗑️
                        </button>
                    </div>
                </div>

                <div className="job-card-body">
                    <div className="job-details">
                        <div className="job-detail-item">
                            📅 <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                        </div>

                        <div className="job-detail-item">
                            📅 <span>Deadline: {new Date(job.JobDeadline).toLocaleDateString()}</span>
                        </div>

                        {job.JobMode && (
                            <div className="job-detail-item">
                                📍 <span>{job.JobMode}</span>
                            </div>
                        )}

                        {job.JobExperienceYears !== undefined && (
                            <div className="job-detail-item">
                                👥 <span>{job.JobExperienceYears} years experience</span>
                            </div>
                        )}
                    </div>

                    {job.JobDescription && (
                        <p className="job-description">
                            {job.JobDescription.length > 120
                                ? job.JobDescription.substring(0, 120) + '...'
                                : job.JobDescription}
                        </p>
                    )}

                    {job.Tags && job.Tags.length > 0 && (
                        <div className="job-tags">
                            {job.Tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="job-tag">
                                    {tag}
                                </span>
                            ))}
                            {job.Tags.length > 3 && (
                                <span className="job-tag-more">
                                    +{job.Tags.length - 3} more
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className="job-card-footer">
                    <div className="job-stats">
                        <span className="stat-item">
                            📅 Posted {new Date(job.postedDate).toLocaleDateString()}
                        </span>
                        {job.JobExperienceYears !== undefined && (
                            <span className="stat-item">
                                👥 {job.JobExperienceYears}+ years exp
                            </span>
                        )}
                    </div>
                    <button
                        className="view-details-btn"
                        onClick={() => handleViewDetails(job)}
                    >
                        View Full Details
                    </button>
                </div>
            </div>
        );
    };

    // Pagination Component - MOVED TO CORRECT SCOPE
    const PaginationComponent = () => {
        if (totalPages <= 1) return null;

        return (
            <div className="pagination-container">
                <div className="pagination-info">
                    <span>
                        Showing {indexOfFirstJob + 1} to {Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} jobs
                    </span>
                </div>

                <div className="pagination-controls">
                    <button
                        className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        ← Previous
                    </button>

                    <div className="pagination-numbers">
                        {getPageNumbers().map((number, index) => (
                            <button
                                key={index}
                                className={`pagination-number ${number === currentPage ? 'active' : ''
                                    } ${number === '...' ? 'dots' : ''}`}
                                onClick={() => number !== '...' && paginate(number)}
                                disabled={number === '...'}
                            >
                                {number}
                            </button>
                        ))}
                    </div>

                    <button
                        className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next →
                    </button>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="jobs-container">
                <div className="jobs-header">
                    <div className="jobs-title-section">
                        <h2>Posted Jobs</h2>
                        <p>Manage and track your job postings</p>
                    </div>
                </div>
                <div className="jobs-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading jobs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="jobs-container">
                <div className="jobs-header">
                    <div className="jobs-title-section">
                        <h2>Posted Jobs</h2>
                        <p>Manage and track your job postings</p>
                    </div>
                </div>
                <div className="jobs-error">
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="jobs-container">

            <div className="jobs-stats">
                <div className="stat-item">
                    <span className="stat-label">Total Jobs:</span>
                    <span className="stat-value">{jobs.length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Filtered Results:</span>
                    <span className="stat-value">{filteredJobs.length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Active:</span>
                    <span className="stat-value success">
                        {jobs.filter(job => getJobStatus(job.JobDeadline).status === 'active').length}
                    </span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Urgent:</span>
                    <span className="stat-value warning">
                        {jobs.filter(job => getJobStatus(job.JobDeadline).status === 'urgent').length}
                    </span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Expired:</span>
                    <span className="stat-value danger">
                        {jobs.filter(job => getJobStatus(job.JobDeadline).status === 'expired').length}
                    </span>
                </div>
            </div>

            <div className="jobs-grid">
                {currentJobs.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📝</div>
                        <h3>No jobs found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    currentJobs.map((job) => (
                        <JobCard key={job._id} job={job} />
                    ))
                )}
            </div>

            <PaginationComponent />

            {/* Job Details Modal */}
            <JobDetailsModal
                job={selectedJob}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default EmployeeDashboardJobs;