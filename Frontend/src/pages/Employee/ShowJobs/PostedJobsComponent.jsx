import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './jobsPageStyle.css';

// Custom Alert System (same as form component)
const showAlert = (type, title, message, duration = 4000) => {
  const existingAlerts = document.querySelectorAll('.custom-alert');
  existingAlerts.forEach(alert => alert.remove());

  const alertDiv = document.createElement('div');
  alertDiv.className = `custom-alert custom-alert-${type}`;
  
  const alertContent = `
    <div class="alert-icon">
      ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
    </div>
    <div class="alert-content">
      <div class="alert-title">${title}</div>
      <div class="alert-message">${message}</div>
    </div>
    <button class="alert-close" onclick="this.parentElement.remove()">×</button>
  `;
  
  alertDiv.innerHTML = alertContent;
  document.body.appendChild(alertDiv);
  
  setTimeout(() => alertDiv.classList.add('show'), 100);
  setTimeout(() => {
    alertDiv.classList.remove('show');
    setTimeout(() => alertDiv.remove(), 300);
  }, duration);
};

const PostedJobsComponent = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterMode, setFilterMode] = useState('all');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/job/all');
      
      if (response.status === 200) {
        // Debug logging to see what we're getting
        console.log('Full API Response:', response);
        console.log('Response Data:', response.data);
        console.log('Response Data Type:', typeof response.data);
        console.log('Is Array:', Array.isArray(response.data));
        
        // Try different possible data structures
        let jobsData = [];
        
        // if (Array.isArray(response.data)) {
        //   jobsData = response.data;
        // } else if (response.data?.jobs && Array.isArray(response.data.jobs)) {
        //   jobsData = response.data.jobs;
        // } else if (response.data?.data && Array.isArray(response.data.data)) {
        //   jobsData = response.data.data;
        // } else if (response.data?.result && Array.isArray(response.data.result)) {
        //   jobsData = response.data.result;
        // }
        
        console.log('Final jobs data:', response.data.Jobs);
        setJobs(response.data.Jobs);
        
        // Only show success alert if we actually have jobs
        if (jobsData.length > 0) {
          showAlert('success', 'Jobs Loaded Successfully', `Found ${jobsData.length} job posting${jobsData.length !== 1 ? 's' : ''}`);
        }
        // Don't show any alert if database is empty - let the UI handle it
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Set empty array on error to prevent filter issues
      setJobs([]);
      showAlert('error', 'Loading Failed', 'Failed to load job postings. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedJob(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (deadline) => {
    const daysRemaining = calculateDaysRemaining(deadline);
    if (daysRemaining < 0) {
      return { text: 'Expired', class: 'status-expired' };
    } else if (daysRemaining <= 3) {
      return { text: `${daysRemaining} days left`, class: 'status-urgent' };
    } else if (daysRemaining <= 7) {
      return { text: `${daysRemaining} days left`, class: 'status-warning' };
    } else {
      return { text: `${daysRemaining} days left`, class: 'status-active' };
    }
  };

  // Filter jobs based on search and filters
  const filteredJobs = Array.isArray(jobs) ? jobs.filter(job => {
    if (!job || typeof job !== 'object') {
      console.log('Invalid job object:', job);
      return false;
    }
    
    const matchesSearch = (job.JobTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (job.JobDescription || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (job.Tags || []).some(tag => (tag || '').toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Normalize job type and mode for comparison (handle case sensitivity and variations)
    const normalizeJobType = (type) => {
      if (!type) return '';
      return type.toLowerCase().replace(/-/g, ' ').trim();
    };
    
    const normalizeJobMode = (mode) => {
      if (!mode) return '';
      return mode.toLowerCase().trim();
    };
    
    const jobType = normalizeJobType(job.JobType);
    const jobMode = normalizeJobMode(job.JobMode);
    
    const matchesType = filterType === 'all' || jobType === filterType;
    const matchesMode = filterMode === 'all' || jobMode === filterMode;
    
    return matchesSearch && matchesType && matchesMode;
  }) : [];

  console.log('Jobs state:', jobs.length);
  console.log('Filtered jobs:', filteredJobs.length);
  console.log('Search term:', searchTerm);
  console.log('Filter type:', filterType);
  console.log('Filter mode:', filterMode);

  if (loading) {
    return (
      <div className="jobs-page-wrapper">
        <div className="loading-container">
          <div className="loading-spinner-large"></div>
          <h2>Loading Job Postings...</h2>
          <p>Please wait while we fetch the latest job opportunities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="jobs-page-wrapper">
      {/* Header Section */}
      <div className="jobs-header">
        <div className="header-content">
          <h1 className="page-title">Posted Jobs</h1>
          <p className="page-subtitle">
            Manage and view all your job postings • {jobs.length || 0} {(jobs.length || 0) === 1 ? 'Job' : 'Jobs'} Available
          </p>
        </div>
        <button className="refresh-btn" onClick={fetchJobs}>
          🔄 Refresh
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="filters-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search jobs by title, description, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="filter-container">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="full time">Full Time</option>
            <option value="part time">Part Time</option>
            <option value="internship">Internship</option>
            <option value="project base">Project Based</option>
          </select>
          
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Modes</option>
            <option value="onsite">On-site</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <span className="results-count">
          {filteredJobs.length === jobs.length 
            ? `Showing all ${jobs.length || 0} job${jobs.length !== 1 ? 's' : ''}`
            : `Showing ${filteredJobs.length} of ${jobs.length || 0} job${jobs.length !== 1 ? 's' : ''}`
          }
        </span>
      </div>

      {/* Jobs Grid */}
      <div className="jobs-container">
        {/* Debug info - remove this in production */}

        
        {filteredJobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Jobs Found</h3>
            <p>
              {(jobs.length || 0) === 0 
                ? "No job postings available. Create your first job posting to get started."
                : "No jobs match your current filters. Try adjusting your search criteria."
              }
            </p>
            {(jobs.length || 0) === 0 && (
              <button className="create-job-btn" onClick={() => window.location.href = '/create-job'}>
                ➕ Create First Job
              </button>
            )}
          </div>
        ) : (
          <div className="jobs-grid">
            {filteredJobs.map((job) => {
              // Add safety checks for job object
              if (!job || !job._id) return null;
              
              const status = getStatusBadge(job.JobDeadline);
              return (
                <div key={job._id} className="job-card" onClick={() => handleJobClick(job)}>
                  <div className="job-card-header">
                    <div className="job-title-section">
                      <h3 className="job-title">{job.JobTitle || 'Untitled Job'}</h3>
                      <div className="job-meta">
                        <span className="job-type">{job.JobType || 'Not specified'}</span>
                        <span className="job-mode">{job.JobMode || 'Not specified'}</span>
                      </div>
                    </div>
                    <div className={`status-badge ${status.class}`}>
                      {status.text}
                    </div>
                  </div>
                  
                  <div className="job-card-body">
                    <div className="job-info">
                      <div className="info-item">
                        <span className="info-label">Experience:</span>
                        <span className="info-value">
                          {job.JobExperienceYears ? `${job.JobExperienceYears} years` : 'Not specified'}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Posted:</span>
                        <span className="info-value">{formatDate(job.postedDate)}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Deadline:</span>
                        <span className="info-value">{formatDate(job.JobDeadline)}</span>
                      </div>
                    </div>
                    
                    {job.JobDescription && (
                      <p className="job-description">
                        {job.JobDescription.length > 120 
                          ? `${job.JobDescription.substring(0, 120)}...` 
                          : job.JobDescription
                        }
                      </p>
                    )}
                    
                    {job.Tags && Array.isArray(job.Tags) && job.Tags.length > 0 && (
                      <div className="tags-container">
                        {job.Tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                        {job.Tags.length > 3 && (
                          <span className="tag-more">+{job.Tags.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="job-card-footer">
                    <div className="stats">
                      <span className="stat-item">
                        📋 {(job.Requirements && Array.isArray(job.Requirements) ? job.Requirements.length : 0)} Requirements
                      </span>
                      <span className="stat-item">
                        🎓 {(job.Qualifications && Array.isArray(job.Qualifications) ? job.Qualifications.length : 0)} Qualifications
                      </span>
                      <span className="stat-item">
                        🎯 {(job.Responsibilities && Array.isArray(job.Responsibilities) ? job.Responsibilities.length : 0)} Responsibilities
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      {showModal && selectedJob && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="job-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <h2 className="modal-job-title">{selectedJob.JobTitle}</h2>
                <div className="modal-job-meta">
                  <span className="meta-item">📍 {selectedJob.JobMode}</span>
                  <span className="meta-item">💼 {selectedJob.JobType}</span>
                  <span className="meta-item">⏰ {selectedJob.JobExperienceYears || 0} years exp</span>
                </div>
              </div>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            
            <div className="modal-content">
              <div className="modal-section">
                <div className="section-info">
                  <div className="info-grid">
                    <div className="info-card">
                      <span className="info-card-label">Posted Date</span>
                      <span className="info-card-value">{formatDate(selectedJob.postedDate)}</span>
                    </div>
                    <div className="info-card">
                      <span className="info-card-label">Application Deadline</span>
                      <span className="info-card-value">{formatDate(selectedJob.JobDeadline)}</span>
                    </div>
                    <div className="info-card">
                      <span className="info-card-label">Experience Required</span>
                      <span className="info-card-value">
                        {selectedJob.JobExperienceYears ? `${selectedJob.JobExperienceYears} years` : 'Not specified'}
                      </span>
                    </div>
                    <div className="info-card">
                      <span className="info-card-label">Work Mode</span>
                      <span className="info-card-value">{selectedJob.JobMode}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedJob.JobDescription && (
                <div className="modal-section">
                  <h3 className="section-title">📄 Job Description</h3>
                  <p className="job-description-full">{selectedJob.JobDescription}</p>
                </div>
              )}

              {selectedJob.Requirements && selectedJob.Requirements.length > 0 && (
                <div className="modal-section">
                  <h3 className="section-title">✅ Requirements ({selectedJob.Requirements.length})</h3>
                  <div className="list-container">
                    {selectedJob.Requirements.map((req, index) => (
                      <div key={index} className="list-item requirement-item">
                        <span className="list-bullet">•</span>
                        <span className="list-text">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedJob.Qualifications && selectedJob.Qualifications.length > 0 && (
                <div className="modal-section">
                  <h3 className="section-title">🎓 Qualifications ({selectedJob.Qualifications.length})</h3>
                  <div className="list-container">
                    {selectedJob.Qualifications.map((qual, index) => (
                      <div key={index} className="list-item qualification-item">
                        <span className="list-bullet">•</span>
                        <span className="list-text">{qual}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedJob.Responsibilities && selectedJob.Responsibilities.length > 0 && (
                <div className="modal-section">
                  <h3 className="section-title">🎯 Responsibilities ({selectedJob.Responsibilities.length})</h3>
                  <div className="list-container">
                    {selectedJob.Responsibilities.map((resp, index) => (
                      <div key={index} className="list-item responsibility-item">
                        <span className="list-bullet">•</span>
                        <span className="list-text">{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedJob.Tags && selectedJob.Tags.length > 0 && (
                <div className="modal-section">
                  <h3 className="section-title">🏷️ Tags ({selectedJob.Tags.length})</h3>
                  <div className="modal-tags-container">
                    {selectedJob.Tags.map((tag, index) => (
                      <span key={index} className="modal-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Close
              </button>
              <button className="btn-primary" onClick={() => {
                showAlert('info', 'Feature Coming Soon', 'Job editing functionality will be available in the next update');
              }}>
                ✏️ Edit Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostedJobsComponent;