// utils/rankingUtils.js

export const calculateCandidateScore = (application, jobRequirements = []) => {
    let score = 0;
    const { applicationData } = application;

    // Education score (0-25 points)
    if (applicationData.education && applicationData.education.length > 0) {
        const hasRelevantEducation = applicationData.education.some(edu => 
            edu.degree && edu.degree.toLowerCase() !== 'school'
        );
        score += hasRelevantEducation ? 25 : 10;
    }

    // Skills score (0-30 points)
    if (applicationData.skills && applicationData.skills.length > 0) {
        const skillsCount = applicationData.skills.length;
        score += Math.min(skillsCount * 5, 30);
    }

    // Work experience score (0-25 points)
    if (applicationData.workExperience && applicationData.workExperience.length > 0) {
        const experienceYears = applicationData.workExperience.length;
        score += Math.min(experienceYears * 8, 25);
    }

    // Certifications score (0-20 points)
    if (applicationData.certifications && applicationData.certifications.length > 0) {
        const certificationsCount = applicationData.certifications.length;
        score += Math.min(certificationsCount * 10, 20);
    }

    // Bonus points for cover letter and summary
    if (applicationData.coverLetter && applicationData.coverLetter.trim().length > 0) {
        score += 5;
    }
    if (applicationData.summary && applicationData.summary.trim().length > 0) {
        score += 5;
    }

    return Math.min(score, 100);
};

export const rankCandidates = (applications, jobRequirements = []) => {
    return applications
        .map(app => ({
            ...app,
            score: calculateCandidateScore(app, jobRequirements)
        }))
        .sort((a, b) => b.score - a.score)
        .map((app, index) => ({
            ...app,
            rank: index + 1
        }));
};

export const getScoreColor = (score) => {
    if (score >= 80) return '#28a745'; // Green
    if (score >= 60) return '#ffc107'; // Yellow
    if (score >= 40) return '#fd7e14'; // Orange
    return '#dc3545'; // Red
};

export const getStatusBadgeColor = (status) => {
    switch (status) {
        case 'accepted': return '#28a745';
        case 'rejected': return '#dc3545';
        case 'pending': return '#6c757d';
        default: return '#6c757d';
    }
};