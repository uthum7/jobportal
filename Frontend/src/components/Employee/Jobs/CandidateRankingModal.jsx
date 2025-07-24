// components/CandidateRankingModal.jsx
import React from 'react';
import { calculateCandidateScore, getScoreColor, getStatusBadgeColor } from '../../../utils/rankingUtils';
import '../styles/CandidateRankingModal.css';

const CandidateRankingModal = ({ isOpen, onClose, candidate, job }) => {
    if (!isOpen || !candidate) return null;

    const { applicationData } = candidate;
    const score = calculateCandidateScore(candidate, job?.Requirements);

    const formatDate = (date) => {
        if (!date) return 'Not specified';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calculateAge = (birthday) => {
        if (!birthday) return 'Not specified';
        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return `${age} years old`;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ranking-modal" onClick={e => e.stopPropagation()}>
                <div className="ranking-modal-header">
                    <div className="candidate-header-info">
                        <h2>{applicationData.fullName}</h2>
                        <div className="candidate-header-meta">
                            <span 
                                className="status-badge"
                                style={{ backgroundColor: getStatusBadgeColor(candidate.status) }}
                            >
                                {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                            </span>
                            <div 
                                className="score-display"
                                style={{ backgroundColor: getScoreColor(score) }}
                            >
                                Score: {score}/100
                            </div>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="ranking-modal-body">
                    <div className="candidate-details-grid">
                        {/* Personal Information */}
                        <div className="detail-section">
                            <h3>Personal Information</h3>
                            <div className="detail-item">
                                <span className="label">Full Name:</span>
                                <span className="value">{applicationData.fullName}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Email:</span>
                                <span className="value">{applicationData.email}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Phone:</span>
                                <span className="value">{applicationData.phoneNumber}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Address:</span>
                                <span className="value">{applicationData.address}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">NIC:</span>
                                <span className="value">{applicationData.nic}</span>
                            </div>
                            {applicationData.birthday && (
                                <div className="detail-item">
                                    <span className="label">Age:</span>
                                    <span className="value">{calculateAge(applicationData.birthday)}</span>
                                </div>
                            )}
                            {applicationData.gender && (
                                <div className="detail-item">
                                    <span className="label">Gender:</span>
                                    <span className="value">{applicationData.gender.charAt(0).toUpperCase() + applicationData.gender.slice(1)}</span>
                                </div>
                            )}
                        </div>

                        {/* Skills */}
                        <div className="detail-section">
                            <h3>Skills</h3>
                            {applicationData.skills && applicationData.skills.length > 0 ? (
                                <div className="skills-container">
                                    {applicationData.skills.map((skill, index) => (
                                        <span key={index} className="skill-badge">{skill}</span>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-data">No skills listed</p>
                            )}
                        </div>

                        {/* Education */}
                        <div className="detail-section">
                            <h3>Education</h3>
                            {applicationData.education && applicationData.education.length > 0 ? (
                                <div className="education-list">
                                    {applicationData.education.map((edu, index) => (
                                        <div key={index} className="education-item">
                                            <h4>{edu.degree}</h4>
                                            <p>{edu.institute}</p>
                                            {edu.startDate && (
                                                <p className="education-dates">
                                                    {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                                                    {edu.currentlyStudying && <span className="studying-badge">Currently Studying</span>}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-data">No education information</p>
                            )}
                        </div>

                        {/* Work Experience */}
                        <div className="detail-section">
                            <h3>Work Experience</h3>
                            {applicationData.workExperience && applicationData.workExperience.length > 0 ? (
                                <div className="experience-list">
                                    {applicationData.workExperience.map((exp, index) => (
                                        <div key={index} className="experience-item">
                                            <h4>{exp.position}</h4>
                                            <p>{exp.company}</p>
                                            <p className="experience-dates">
                                                {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                                            </p>
                                            {exp.description && <p className="experience-desc">{exp.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-data">No work experience listed</p>
                            )}
                        </div>

                        {/* Certifications */}
                        <div className="detail-section">
                            <h3>Certifications</h3>
                            {applicationData.certifications && applicationData.certifications.length > 0 ? (
                                <div className="certifications-container">
                                    {applicationData.certifications.map((cert, index) => (
                                        <span key={index} className="certification-badge">{cert}</span>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-data">No certifications listed</p>
                            )}
                        </div>

                        {/* Summary */}
                        {applicationData.summary && (
                            <div className="detail-section full-width">
                                <h3>Summary</h3>
                                <p className="summary-text">{applicationData.summary}</p>
                            </div>
                        )}

                        {/* Cover Letter */}
                        {applicationData.coverLetter && (
                            <div className="detail-section full-width">
                                <h3>Cover Letter</h3>
                                <p className="cover-letter-text">{applicationData.coverLetter}</p>
                            </div>
                        )}

                        {/* Application Details */}
                        <div className="detail-section full-width">
                            <h3>Application Details</h3>
                            <div className="application-meta">
                                <div className="detail-item">
                                    <span className="label">Applied Date:</span>
                                    <span className="value">{formatDate(candidate.appliedDate)}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Status:</span>
                                    <span 
                                        className="value status-value"
                                        style={{ color: getStatusBadgeColor(candidate.status) }}
                                    >
                                        {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Ranking Score:</span>
                                    <span 
                                        className="value score-value"
                                        style={{ color: getScoreColor(score) }}
                                    >
                                        {score}/100
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateRankingModal;
