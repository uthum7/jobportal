// components/AllJobs.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JobCard from './JobCard';
import CandidateModal from './CandidateModal';
import '../styles/AllJobs.css';

const AllJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5001/api/job/with-applications');
            
            if (response.status === 200) {
                setJobs(response.data.Jobs || []);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewCandidates = (job) => {
        setSelectedJob(job);
        setIsCandidateModalOpen(true);
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.JobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.JobDescription.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filterStatus === 'all' || 
                            (filterStatus === 'with-applications' && job.applicationCount > 0) ||
                            (filterStatus === 'no-applications' && job.applicationCount === 0);
        
        return matchesSearch && matchesFilter;
    });

    // Custom grid style for 3 columns
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.5rem',
        width: '100%'
    };

    return (
        <div className="all-jobs-container">
            <div className="jobs-header">
                <h1>Job Postings & Applications</h1>
                <p>Manage your job postings and review candidate applications</p>
            </div>

            <div className="jobs-controls">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-container">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Jobs</option>
                        <option value="with-applications">With Applications</option>
                        <option value="no-applications">No Applications</option>
                    </select>
                </div>

                <div className="jobs-stats">
                    <div className="stat-item">
                        <span className="stat-number">{jobs.length}</span>
                        <span className="stat-label">Total Jobs</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">
                            {jobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0)}
                        </span>
                        <span className="stat-label">Total Applications</span>
                    </div>
                </div>
            </div>

            <div className="jobs-content">
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading jobs...</p>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="no-jobs">
                        <h3>No jobs found</h3>
                        <p>
                            {searchTerm || filterStatus !== 'all' 
                                ? 'Try adjusting your search or filter criteria.' 
                                : 'No job postings available at the moment.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="jobs-grid" style={gridStyle}>
                        {filteredJobs.map(job => (
                            <JobCard
                                key={job._id}
                                job={job}
                                onViewCandidates={handleViewCandidates}
                            />
                        ))}
                    </div>
                )}
            </div>

            <CandidateModal
                isOpen={isCandidateModalOpen}
                onClose={() => {
                    setIsCandidateModalOpen(false);
                    setSelectedJob(null);
                }}
                job={selectedJob}
            />
        </div>
    );
};

export default AllJobs;