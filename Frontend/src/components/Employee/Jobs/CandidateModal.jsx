// components/CandidateModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CandidateRankingModal from './CandidateRankingModal';
import { rankCandidates, getScoreColor, getStatusBadgeColor, getScoreLabel, getScoreBreakdownText } from '../../../utils/rankingUtils';
import '../styles/CandidateModal.css';

const CandidateModal = ({ isOpen, onClose, job, onApplicationStatusUpdate }) => {
    const [applications, setApplications] = useState([]);
    const [rankedApplications, setRankedApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);

    useEffect(() => {
        if (isOpen && job) {
            fetchApplications();
        }
    }, [isOpen, job]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5001/api/job/${job._id}/applications`);
            
            if (response.status === 200) {
                const apps = response.data.Applications || [];
                setApplications(apps);
                
                // Rank candidates with job requirements
                const ranked = rankCandidates(apps, job.Requirements, job.Qualifications);
                setRankedApplications(ranked);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    // Enhanced callback that refreshes both local and parent data
    const handleStatusUpdateComplete = async () => {
        // Refresh local applications data
        await fetchApplications();
        
        // Notify parent component to refresh job statistics
        if (onApplicationStatusUpdate) {
            await onApplicationStatusUpdate();
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleRankClick = (candidate) => {
        setSelectedCandidate(candidate);
        setIsRankingModalOpen(true);
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className="candidate-modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <div className="modal-title-section">
                            <h2>{job?.JobTitle}</h2>
                            <p className="job-subtitle">{job?.JobType} • {job?.JobMode}</p>
                        </div>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>

                    <div className="modal-body">
                        {loading ? (
                            <div className="loading">Loading candidates...</div>
                        ) : rankedApplications.length === 0 ? (
                            <div className="no-candidates">
                                <p>No applications found for this job.</p>
                            </div>
                        ) : (
                            <div className="candidates-list">
                                <div className="candidates-header">
                                    <h3>Candidates ({rankedApplications.length})</h3>
                                    <p>Ranked by compatibility score</p>
                                </div>
                                
                                {rankedApplications.map((application, index) => {
                                    // Safety check
                                    if (!application || !application.applicationData) {
                                        console.warn('Invalid application data at index:', index, application);
                                        return (
                                            <div key={index} className="candidate-item">
                                                <p>Invalid candidate data</p>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={application._id || index} className="candidate-item">
                                            <div className="candidate-rank">
                                                <span className="rank-number">#{application.rank || index + 1}</span>
                                                <div 
                                                    className="score-circle"
                                                    style={{ backgroundColor: getScoreColor(application.score || 0) }}
                                                >
                                                    {application.score || 0}
                                                </div>
                                            </div>

                                            <div className="candidate-info">
                                                <div className="candidate-main-info">
                                                    <h4>{application.applicationData?.fullName || 'Unknown'}</h4>
                                                    <p className="candidate-email">{application.applicationData?.email || 'No email'}</p>
                                                    <p className="candidate-location">{application.applicationData?.address || 'No address'}</p>
                                                </div>

                                                <div className="candidate-skills">
                                                    {application.applicationData?.technicalSkills?.slice(0, 3).map((skill, idx) => {
                                                        // Handle both string and object skills
                                                        const skillText = typeof skill === 'string' ? skill : 
                                                                         (skill?.name || skill?.skill || JSON.stringify(skill));
                                                        return (
                                                            <span key={idx} className="skill-tag">{skillText}</span>
                                                        );
                                                    }) || []}
                                                    {(application.applicationData?.technicalSkills?.length || 0) > 3 && (
                                                        <span className="skill-tag skill-more">
                                                            +{(application.applicationData?.technicalSkills?.length || 0) - 3}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="candidate-meta">
                                                    <span className="applied-date">
                                                        Applied: {formatDate(application.appliedDate)}
                                                    </span>
                                                    <span 
                                                        className="status-badge"
                                                        style={{ backgroundColor: getStatusBadgeColor(application.status || 'pending') }}
                                                    >
                                                        {String(application.status || 'pending').charAt(0).toUpperCase() + String(application.status || 'pending').slice(1)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="candidate-actions">
                                                <button 
                                                    className="rank-btn"
                                                    onClick={() => handleRankClick(application)}
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CandidateRankingModal
                isOpen={isRankingModalOpen}
                onClose={() => {
                    setIsRankingModalOpen(false);
                    setSelectedCandidate(null);
                }}
                candidate={selectedCandidate}
                job={job}
                onStatusUpdate={handleStatusUpdateComplete}
            />
        </>
    );
};

export default CandidateModal;