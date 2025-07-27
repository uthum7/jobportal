// components/CandidateRankingModal.jsx
import React from 'react';
import { calculateCandidateScore, getScoreColor, getStatusBadgeColor, getScoreBreakdownText } from '../../../utils/rankingUtils';
import '../styles/CandidateRankingModal.css';

const CandidateRankingModal = ({ isOpen, onClose, candidate, job }) => {
    if (!isOpen || !candidate) return null;

    const { applicationData } = candidate;
    const scoreResult = calculateCandidateScore(candidate, job?.Requirements, job?.Qualifications);
    const score = scoreResult.score;

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

                        {/* Technical Skills */}
                        <div className="detail-section">
                            <h3>Technical Skills</h3>
                            {applicationData.technicalSkills && applicationData.technicalSkills.length > 0 ? (
                                <div className="skills-container">
                                    {applicationData.technicalSkills.map((skill, index) => {
                                        // Handle both string and object skills
                                        const skillText = typeof skill === 'string' ? skill : 
                                                         (skill?.name || skill?.skill || 'Unknown Skill');
                                        return (
                                            <span key={index} className="skill-badge">{skillText}</span>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="no-data">No technical skills listed</p>
                            )}
                        </div>

                        {/* Education */}
                        <div className="detail-section">
                            <h3>Education</h3>
                            {applicationData.education && applicationData.education.length > 0 ? (
                                <div className="education-list">
                                    {applicationData.education.map((edu, index) => (
                                        <div key={index} className="education-item">
                                            <h4>{edu.educationLevel || 'Unknown Level'} - {edu.fieldOfStudy || 'Unknown Field'}</h4>
                                            <p>{edu.institute || 'Unknown Institute'}</p>
                                            {edu.alYear && (
                                                <p className="education-dates">
                                                    A/L Year: {edu.alYear}
                                                </p>
                                            )}
                                            {edu.gpaOrGrade && (
                                                <p className="education-grade">Grade: {edu.gpaOrGrade}</p>
                                            )}
                                            {edu.alSubjects && edu.alSubjects.length > 0 && (
                                                <div className="al-subjects">
                                                    <p>A/L Subjects:</p>
                                                    <div className="subjects-list">
                                                        {edu.alSubjects.map((subject, idx) => {
                                                            // Handle both string and object subjects
                                                            const subjectText = typeof subject === 'string' ? subject : 
                                                                               (subject?.subject || subject?.name || 'Unknown Subject');
                                                            return (
                                                                <span key={idx} className="subject-tag">{subjectText}</span>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                            {edu.results && edu.results.length > 0 && (
                                                <div className="education-results">
                                                    <p>Results:</p>
                                                    <div className="results-list">
                                                        {edu.results.map((result, idx) => {
                                                            const subject = typeof result === 'string' ? result :
                                                                           (result?.subject || 'Unknown');
                                                            const grade = typeof result === 'object' && result?.grade ? 
                                                                         ` - ${result.grade}` : '';
                                                            return (
                                                                <span key={idx} className="result-tag">
                                                                    {subject}{grade}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
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
                                            <h4>{exp.jobTitle}</h4>
                                            <p>{exp.company}</p>
                                            {exp.industry && <p className="experience-industry">Industry: {exp.industry}</p>}
                                            <p className="experience-dates">
                                                {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                                                {exp.currentlyWorking && <span className="studying-badge">Currently Working</span>}
                                            </p>
                                            {exp.description && <p className="experience-desc">{exp.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-data">No work experience listed</p>
                            )}
                        </div>

                        {/* Projects */}
                        <div className="detail-section">
                            <h3>Projects</h3>
                            {applicationData.projects && applicationData.projects.length > 0 ? (
                                <div className="projects-list">
                                    {applicationData.projects.map((project, index) => (
                                        <div key={index} className="project-item">
                                            <h4>{project.title}</h4>
                                            {project.description && <p className="project-desc">{project.description}</p>}
                                            {project.technologies && project.technologies.length > 0 && (
                                                <div className="project-technologies">
                                                    <p>Technologies:</p>
                                                    <div className="tech-list">
                                                        {project.technologies.map((tech, idx) => (
                                                            <span key={idx} className="tech-tag">{tech}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {project.link && (
                                                <p className="project-link">
                                                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                                                        View Project
                                                    </a>
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-data">No projects listed</p>
                            )}
                        </div>

                        {/* Certifications */}
                        <div className="detail-section">
                            <h3>Certifications</h3>
                            {applicationData.certifications && applicationData.certifications.length > 0 ? (
                                <div className="certifications-list">
                                    {applicationData.certifications.map((cert, index) => (
                                        <div key={index} className="certification-item">
                                            <h4>{cert.name}</h4>
                                            <p>Issued by: {cert.issuer}</p>
                                            <p>Year: {cert.year}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-data">No certifications listed</p>
                            )}
                        </div>

                        {/* Social Links */}
                        {applicationData.socialLinks && Object.keys(applicationData.socialLinks).length > 0 && (
                            <div className="detail-section">
                                <h3>Social Links</h3>
                                <div className="social-links">
                                    {Object.entries(applicationData.socialLinks).map(([platform, link], index) => (
                                        <div key={index} className="social-link">
                                            <span className="platform">{platform}:</span>
                                            <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Languages */}
                        {applicationData.languages && applicationData.languages.length > 0 && (
                            <div className="detail-section">
                                <h3>Languages</h3>
                                <div className="languages-container">
                                    {applicationData.languages.map((language, index) => (
                                        <span key={index} className="language-badge">{language}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Cover Letter */}
                        {applicationData.coverLetter && (
                            <div className="detail-section full-width">
                                <h3>Cover Letter</h3>
                                <p className="cover-letter-text">{applicationData.coverLetter}</p>
                            </div>
                        )}

                        {/* Score Breakdown */}
                        <div className="detail-section full-width">
                            <h3>Ranking Score Breakdown</h3>
                            <div className="score-breakdown-detailed">
                                {scoreResult.breakdown ? Object.entries(getScoreBreakdownText(scoreResult.breakdown)).map(([category, score], index) => (
                                    <div key={index} className="score-breakdown-item">
                                        <span className="category">{String(category)}:</span>
                                        <span className="score-value">{String(score)}</span>
                                    </div>
                                )) : (
                                    <div className="score-breakdown-item">
                                        <span className="category">No breakdown available</span>
                                        <span className="score-value">-</span>
                                    </div>
                                )}
                                <div className="score-breakdown-item total">
                                    <span className="category">Total Score:</span>
                                    <span className="score-value total-score">{score}/100</span>
                                </div>
                            </div>
                        </div>

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