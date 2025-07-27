// Helper function to normalize education levels
function normalizeEducationLevel(educationLevel) {
    if (!educationLevel) return '';
    
    const level = educationLevel.toLowerCase().trim();
    
    // Normalize common variations to standard forms
    const normalizations = {
        // PhD variations
        'phd': 'phd',
        'ph.d': 'phd',
        'ph.d.': 'phd',
        'doctorate': 'phd',
        'doctoral': 'phd',
        
        // Masters variations
        'masters': 'masters',
        'master': 'masters',
        'masters degree': 'masters',
        'master degree': 'masters',
        'master\'s': 'masters',
        'master\'s degree': 'masters',
        'msc': 'masters',
        'msc.': 'masters',
        'm.sc': 'masters',
        'm.sc.': 'masters',
        'mba': 'masters',
        'mba.': 'masters',
        'm.b.a': 'masters',
        'm.b.a.': 'masters',
        'ma': 'masters',
        'm.a': 'masters',
        'm.a.': 'masters',
        
        // Bachelor variations
        'bachelor': 'bachelor',
        'bachelors': 'bachelor',
        'bachelor degree': 'bachelor',
        'bachelors degree': 'bachelor',
        'bachelor\'s': 'bachelor',
        'bachelor\'s degree': 'bachelor',
        'bsc': 'bachelor',
        'bsc.': 'bachelor',
        'b.sc': 'bachelor',
        'b.sc.': 'bachelor',
        'ba': 'bachelor',
        'ba.': 'bachelor',
        'b.a': 'bachelor',
        'b.a.': 'bachelor',
        'be': 'bachelor',
        'b.e': 'bachelor',
        'b.e.': 'bachelor',
        'btech': 'bachelor',
        'b.tech': 'bachelor',
        'b.tech.': 'bachelor',
        'degree': 'bachelor',
        
        // Diploma variations
        'diploma': 'diploma',
        'higher diploma': 'higher diploma',
        'higher national diploma': 'higher diploma',
        'hnd': 'higher diploma',
        'h.n.d': 'higher diploma',
        'h.n.d.': 'higher diploma',
        'national diploma': 'diploma',
        
        // Certificate variations
        'certificate': 'certificate',
        'certification': 'certificate',
        'professional certificate': 'certificate',
        'CISA': 'certificate',
        'CISM': 'certificate',
        'CCNA': 'certificate',
        'CCNP': 'certificate',
        'AWS Certified': 'certificate',
        'Azure Certified': 'certificate',
        'Google Certified': 'certificate',

        // A/L variations (Advanced Level)
        'a/l': 'advanced level',
        'al': 'advanced level',
        'a-l': 'advanced level',
        'a level': 'advanced level',
        'a-level': 'advanced level',
        'a levels': 'advanced level',
        'a-levels': 'advanced level',
        'advanced level': 'advanced level',
        'advanced levels': 'advanced level',
        'gce a/l': 'advanced level',
        'gce al': 'advanced level',
        'gce a level': 'advanced level',
        'gce a-level': 'advanced level',
        
        // O/L variations (Ordinary Level)
        'o/l': 'ordinary level',
        'ol': 'ordinary level',
        'o-l': 'ordinary level',
        'o level': 'ordinary level',
        'o-level': 'ordinary level',
        'o levels': 'ordinary level',
        'o-levels': 'ordinary level',
        'ordinary level': 'ordinary level',
        'ordinary levels': 'ordinary level',
        'gce o/l': 'ordinary level',
        'gce ol': 'ordinary level',
        'gce o level': 'ordinary level',
        'gce o-level': 'ordinary level',
        
        // School variations
        'school': 'ordinary level', // Treat school as O/L equivalent
        'high school': 'ordinary level',
        'secondary school': 'ordinary level',
        'grade 12': 'ordinary level',
        'grade 13': 'advanced level'
    };
    
    // Check for exact match first
    if (normalizations[level]) {
        return normalizations[level];
    }
    
    // Check for partial matches
    for (const [variation, normalized] of Object.entries(normalizations)) {
        if (level.includes(variation) || variation.includes(level)) {
            return normalized;
        }
    }
    
    // If no match found, return original
    return level;
}

// Helper function to normalize technical skills
function normalizeTechnicalSkill(skill) {
    if (!skill) return '';
    
    const normalizedSkill = skill.toLowerCase().trim();
    
    // Common skill normalizations
    const skillNormalizations = {
        'javascript': 'javascript',
        'js': 'javascript',
        'node.js': 'javascript',
        'nodejs': 'javascript',
        'react.js': 'react',
        'reactjs': 'react',
        'vue.js': 'vue',
        'vuejs': 'vue',
        'angular.js': 'angular',
        'angularjs': 'angular',
        'c#': 'csharp',
        'csharp': 'csharp',
        'c sharp': 'csharp',
        '.net': 'dotnet',
        'dotnet': 'dotnet',
        'asp.net': 'dotnet',
        'c++': 'cpp',
        'cpp': 'cpp',
        'c plus plus': 'cpp',
        'mysql': 'sql',
        'postgresql': 'sql',
        'postgres': 'sql',
        'sql server': 'sql',
        'oracle': 'sql',
        'mongodb': 'mongodb',
        'mongo': 'mongodb',
        'html5': 'html',
        'css3': 'css',
        'python3': 'python',
        'java': 'java',
        'php': 'php'
    };
    
    return skillNormalizations[normalizedSkill] || normalizedSkill;
}// utils/rankingUtils.js - Custom Ranking System for Job Applications

// Configuration for the ranking system
export const RANKING_CONFIG = {
    // Maximum points for each category (Total = 100)
    MAX_POINTS: {
        TECHNICAL_SKILLS: 30,    // Technical skills matching with job requirements
        EDUCATION: 30,           // Education level (PHD = 30, O/L = minimum)
        WORK_EXPERIENCE: 20,     // Professional work experience
        PROJECTS: 10,            // Personal/professional projects
        CERTIFICATIONS: 5,       // Professional certifications
        PROFILE_COMPLETENESS: 5  // How complete the profile is
    },
    
    // Education level scoring (normalized standard forms)
    EDUCATION_LEVELS: {
        'phd': 30,
        'masters': 25,
        'bachelor': 20,
        'higher diploma': 18,
        'diploma': 15,
        'certificate': 12,
        'advanced level': 10,  // A/L equivalent
        'ordinary level': 5    // O/L equivalent
    },
    
    // Technical skills keywords for matching
    TECHNICAL_KEYWORDS: {
        // Programming Languages
        'javascript': ['javascript', 'js', 'node.js', 'nodejs', 'react', 'vue', 'angular'],
        'python': ['python', 'django', 'flask', 'pandas', 'numpy', 'tensorflow'],
        'java': ['java', 'spring', 'hibernate', 'maven', 'gradle'],
        'c#': ['c#', 'csharp', '.net', 'dotnet', 'asp.net'],
        'php': ['php', 'laravel', 'symfony', 'codeigniter'],
        'c++': ['c++', 'cpp'],
        'c': ['c programming', 'c language'],
        'go': ['golang', 'go'],
        'rust': ['rust'],
        'kotlin': ['kotlin'],
        'swift': ['swift'],
        'typescript': ['typescript', 'ts'],
        
        // Databases
        'sql': ['sql', 'mysql', 'postgresql', 'oracle', 'sql server', 'database'],
        'mongodb': ['mongodb', 'mongo', 'nosql'],
        'redis': ['redis'],
        'elasticsearch': ['elasticsearch', 'elastic'],
        
        // Cloud & DevOps
        'aws': ['aws', 'amazon web services', 'ec2', 's3', 'lambda'],
        'azure': ['azure', 'microsoft azure'],
        'gcp': ['google cloud', 'gcp'],
        'docker': ['docker', 'containerization'],
        'kubernetes': ['kubernetes', 'k8s'],
        'jenkins': ['jenkins', 'ci/cd'],
        
        // Frontend
        'react': ['react', 'reactjs', 'react.js'],
        'angular': ['angular', 'angularjs'],
        'vue': ['vue', 'vuejs', 'vue.js'],
        'html': ['html', 'html5'],
        'css': ['css', 'css3', 'sass', 'scss', 'less'],
        
        // Mobile
        'android': ['android', 'kotlin', 'java mobile'],
        'ios': ['ios', 'swift', 'objective-c'],
        'flutter': ['flutter', 'dart'],
        'react native': ['react native', 'react-native'],
        
        // Others
        'machine learning': ['ml', 'machine learning', 'ai', 'artificial intelligence'],
        'data science': ['data science', 'data analysis', 'analytics'],
        'blockchain': ['blockchain', 'cryptocurrency', 'smart contracts'],
        'cybersecurity': ['cybersecurity', 'security', 'penetration testing']
    }
};

// Main scoring function
export const calculateCandidateScore = (application, jobRequirements = [], jobQualifications = []) => {
    const { applicationData } = application;
    let totalScore = 0;
    let scoreBreakdown = {};
    
    // 1. Technical Skills Score (30 points)
    const technicalScore = calculateTechnicalSkillsScore(
        applicationData.technicalSkills || [], 
        jobRequirements
    );
    scoreBreakdown.technicalSkills = technicalScore;
    totalScore += technicalScore;
    
    // 2. Education Score (30 points)
    const educationScore = calculateEducationScore(applicationData.education || []);
    scoreBreakdown.education = educationScore;
    totalScore += educationScore;
    
    // 3. Work Experience Score (20 points)
    const experienceScore = calculateWorkExperienceScore(
        applicationData.workExperience || [],
        jobRequirements
    );
    scoreBreakdown.workExperience = experienceScore;
    totalScore += experienceScore;
    
    // 4. Projects Score (10 points)
    const projectsScore = calculateProjectsScore(
        applicationData.projects || [],
        jobRequirements
    );
    scoreBreakdown.projects = projectsScore;
    totalScore += projectsScore;
    
    // 5. Certifications Score (5 points)
    const certificationsScore = calculateCertificationsScore(
        applicationData.certifications || []
    );
    scoreBreakdown.certifications = certificationsScore;
    totalScore += certificationsScore;
    
    // 6. Profile Completeness Score (5 points)
    const completenessScore = calculateProfileCompletenessScore(applicationData);
    scoreBreakdown.profileCompleteness = completenessScore;
    totalScore += completenessScore;
    
    return {
        score: Math.min(Math.round(totalScore), 100),
        breakdown: scoreBreakdown,
        rawScore: totalScore
    };
};

// 1. Technical Skills Scoring (30 points) - Enhanced with normalization
function calculateTechnicalSkillsScore(technicalSkills, jobRequirements) {
    if (!technicalSkills || technicalSkills.length === 0) return 0;
    if (!jobRequirements || jobRequirements.length === 0) return Math.min(technicalSkills.length * 2, 15);
    
    let score = 0;
    let matchedSkills = new Set();
    
    // Normalize technical skills - handle both strings and objects
    const normalizedSkills = technicalSkills.map(skill => {
        let skillText;
        if (typeof skill === 'string') {
            skillText = skill;
        } else if (skill && typeof skill === 'object') {
            // Handle object skills - try different property names
            skillText = skill.name || skill.skill || skill.technology || skill.value || String(skill);
        } else {
            skillText = String(skill);
        }
        
        return {
            original: skillText,
            normalized: normalizeTechnicalSkill(skillText)
        };
    }).filter(skill => skill.original && skill.original !== 'undefined');
    
    // console.log("Normalized skills:", normalizedSkills);
    
    // Check each job requirement
    jobRequirements.forEach(requirement => {
        const reqText = requirement.toLowerCase();
        let requirementMatched = false;
        
        // Check against each technical skill
        normalizedSkills.forEach(skillObj => {
            const { original, normalized } = skillObj;
            
            // Direct match with original skill name
            if (reqText.includes(original.toLowerCase()) || original.toLowerCase().includes(reqText)) {
                if (!matchedSkills.has(original)) {
                    score += 8; // High score for direct match
                    matchedSkills.add(original);
                    requirementMatched = true;
                    // console.log("Direct skill match:", original, "+8");
                }
            }
            
            // Match with normalized skill
            if (reqText.includes(normalized) || normalized.includes(reqText)) {
                if (!matchedSkills.has(original)) {
                    score += 6; // Good score for normalized match
                    matchedSkills.add(original);
                    requirementMatched = true;
                    // console.log("Normalized skill match:", normalized, "+6");
                }
            }
            
            // Check against keyword mappings
            Object.entries(RANKING_CONFIG.TECHNICAL_KEYWORDS).forEach(([category, keywords]) => {
                keywords.forEach(keyword => {
                    if ((original.toLowerCase().includes(keyword) && reqText.includes(keyword)) ||
                        (normalized.includes(keyword) && reqText.includes(keyword))) {
                        if (!matchedSkills.has(original)) {
                            score += 5; // Moderate score for keyword match
                            matchedSkills.add(original);
                            requirementMatched = true;
                            // console.log("Keyword match:", keyword, "+5");
                        }
                    }
                    
                    // Advanced matching: if requirement mentions technology and skill has it
                    if (reqText.includes(keyword) && (normalized.includes(category) || original.toLowerCase().includes(category))) {
                        if (!matchedSkills.has(original)) {
                            score += 4; // Lower score for category match
                            matchedSkills.add(original);
                            requirementMatched = true;
                            // console.log("Category match:", category, "+4");
                        }
                    }
                });
            });
        });
        
        // Bonus for matching requirement
        if (requirementMatched) {
            score += 2;
            // console.log("Requirement matched bonus: +2");
        }
    });
    
    // Base score for having technical skills
    score += Math.min(technicalSkills.length * 1, 5);
    // console.log("Base skills count bonus:", Math.min(technicalSkills.length * 1, 5));
    
    // console.log("Final technical skills score:", Math.min(score, RANKING_CONFIG.MAX_POINTS.TECHNICAL_SKILLS));
    return Math.min(score, RANKING_CONFIG.MAX_POINTS.TECHNICAL_SKILLS);
}

// 2. Education Scoring (30 points) - Only highest level counts
function calculateEducationScore(education) {
    if (!education || education.length === 0) return 0;
    
    let maxScore = 0;
    
    education.forEach(edu => {
        let score = 0;
        
        // Check education level using normalization
        if (edu.educationLevel) {
            const normalizedLevel = normalizeEducationLevel(edu.educationLevel);
            // console.log("Original level:", edu.educationLevel, "-> Normalized:", normalizedLevel);
            
            // Get score from normalized level
            if (RANKING_CONFIG.EDUCATION_LEVELS[normalizedLevel]) {
                score = RANKING_CONFIG.EDUCATION_LEVELS[normalizedLevel];
                // console.log("Score for", normalizedLevel, ":", score);
            }
        }
        
        // Bonus for relevant field of study
        if (edu.fieldOfStudy) {
            const field = edu.fieldOfStudy.toLowerCase();
            const techFields = ['computer', 'software', 'information technology', 'engineering', 'science', 'technology', 'it', 'physical', 'mathematics', 'physics', 'chemistry', 'biology'];
            
            if (techFields.some(techField => field.includes(techField))) {
                score += 2;
                console.log("Field of study bonus:", field, "+2");
            }
        }
        
        // Bonus for good grades (if available)
        if (edu.gpaOrGrade && edu.gpaOrGrade.trim()) {
            const grade = edu.gpaOrGrade.toLowerCase();
            if (grade.includes('first class') || grade.includes('distinction') || grade.includes('a')) {
                score += 2;
            } else if (grade.includes('second class') || grade.includes('b')) {
                score += 1;
            }
        }
        
        // Bonus for recent education
        if (edu.alYear) {
            const year = parseInt(edu.alYear);
            const currentYear = new Date().getFullYear();
            if (currentYear - year <= 5) {
                score += 1;
                console.log("Recent education bonus: +1");
            }
        }
        
        // Bonus for having A/L subjects listed
        if (edu.alSubjects && edu.alSubjects.length > 0) {
            score += 1;
            console.log("A/L subjects bonus: +1");
        }
        
        console.log("Total score for this education:", score);
        
        // Take the maximum education score
        maxScore = Math.max(maxScore, score);
    });
    
    console.log("Final education score:", Math.min(maxScore, RANKING_CONFIG.MAX_POINTS.EDUCATION));
    return Math.min(maxScore, RANKING_CONFIG.MAX_POINTS.EDUCATION);
}

// 3. Work Experience Scoring (20 points)
function calculateWorkExperienceScore(workExperience, jobRequirements) {
    if (!workExperience || workExperience.length === 0) return 0;
    
    let score = 0;
    let totalYears = 0;
    let hasRelevantExperience = false;
    
    workExperience.forEach(exp => {
        // Calculate years of experience
        const startDate = new Date(exp.startDate);
        const endDate = exp.endDate ? new Date(exp.endDate) : new Date();
        const years = Math.max(0, (endDate - startDate) / (1000 * 60 * 60 * 24 * 365));
        
        totalYears += years;
        
        // Check for relevant job title
        if (exp.jobTitle) {
            const jobTitle = exp.jobTitle.toLowerCase();
            const relevantTitles = ['software', 'developer', 'engineer', 'programmer', 'analyst', 'architect', 'consultant'];
            
            if (relevantTitles.some(title => jobTitle.includes(title))) {
                hasRelevantExperience = true;
                score += 3; // Bonus for relevant title
            }
        }
        
        // Bonus for current employment
        if (exp.currentlyWorking) {
            score += 2;
        }
        
        // Check if experience matches job requirements
        if (jobRequirements && jobRequirements.length > 0) {
            const expText = `${exp.jobTitle} ${exp.company} ${exp.description}`.toLowerCase();
            let matches = 0;
            
            jobRequirements.forEach(req => {
                const reqText = req.toLowerCase();
                if (expText.includes(reqText) || 
                    Object.values(RANKING_CONFIG.TECHNICAL_KEYWORDS).flat().some(keyword => 
                        reqText.includes(keyword) && expText.includes(keyword)
                    )) {
                    matches++;
                }
            });
            
            score += matches * 1.5;
        }
    });
    
    // Base score from years of experience
    score += Math.min(totalYears * 2, 10);
    
    // Bonus for having relevant experience
    if (hasRelevantExperience) {
        score += 3;
    }
    
    return Math.min(score, RANKING_CONFIG.MAX_POINTS.WORK_EXPERIENCE);
}

// 4. Projects Scoring (10 points)
function calculateProjectsScore(projects, jobRequirements) {
    if (!projects || projects.length === 0) return 0;
    
    let score = 0;
    
    projects.forEach(project => {
        // Base score for having projects
        score += 2;
        
        // Bonus for project with technologies
        if (project.technologies && project.technologies.length > 0) {
            score += Math.min(project.technologies.length * 0.5, 2);
            
            // Check if technologies match job requirements
            if (jobRequirements && jobRequirements.length > 0) {
                const projectTech = project.technologies.join(' ').toLowerCase();
                
                jobRequirements.forEach(req => {
                    const reqText = req.toLowerCase();
                    if (projectTech.includes(reqText) ||
                        Object.values(RANKING_CONFIG.TECHNICAL_KEYWORDS).flat().some(keyword =>
                            reqText.includes(keyword) && projectTech.includes(keyword)
                        )) {
                        score += 1;
                    }
                });
            }
        }
        
        // Bonus for having project link (shows completion)
        if (project.link && project.link.trim()) {
            score += 1;
        }
        
        // Bonus for detailed description
        if (project.description && project.description.length > 20) {
            score += 0.5;
        }
    });
    
    return Math.min(score, RANKING_CONFIG.MAX_POINTS.PROJECTS);
}

// 5. Certifications Scoring (5 points)
function calculateCertificationsScore(certifications) {
    if (!certifications || certifications.length === 0) return 0;
    
    let score = 0;
    
    certifications.forEach(cert => {
        score += 1; // Base score per certification
        
        // Bonus for recognized issuers
        if (cert.issuer) {
            const issuer = cert.issuer.toLowerCase();
            console.log("Checking issuer:", issuer);
            const recognizedIssuers = ['google', 'microsoft', 'amazon', 'oracle', 'cisco', 'ibm', 'coursera', 'udacity'];
            
            if (recognizedIssuers.some(recognized => issuer.includes(recognized))) {
                score += 0.5;
                console.log("Recognized issuer bonus for:", cert.issuer,"Score:",score);
            }
        }
        
        // Bonus for recent certifications
        if (cert.year) {
            const year = parseInt(cert.year);
            const currentYear = new Date().getFullYear();
            if (currentYear - year <= 3) {
                score += 0.5;
            }
        }
    });
    
    return Math.min(score, RANKING_CONFIG.MAX_POINTS.CERTIFICATIONS);
}

// 6. Profile Completeness Scoring (5 points)
function calculateProfileCompletenessScore(applicationData) {
    let score = 0;
    let totalFields = 12;
    let filledFields = 0;
    
    // Check essential fields
    if (applicationData.fullName && applicationData.fullName.trim()) filledFields++;
    if (applicationData.email && applicationData.email.includes('@')) filledFields++;
    if (applicationData.phoneNumber && applicationData.phoneNumber.trim()) filledFields++;
    if (applicationData.address && applicationData.address.trim()) filledFields++;
    if (applicationData.birthday) filledFields++;
    if (applicationData.technicalSkills && applicationData.technicalSkills.length > 0) filledFields++;
    if (applicationData.education && applicationData.education.length > 0) filledFields++;
    if (applicationData.workExperience && applicationData.workExperience.length > 0) filledFields++;
    if (applicationData.projects && applicationData.projects.length > 0) filledFields++;
    if (applicationData.certifications && applicationData.certifications.length > 0) filledFields++;
    if (applicationData.socialLinks && Object.keys(applicationData.socialLinks).length > 0) filledFields++;
    if (applicationData.languages && applicationData.languages.length > 0) filledFields++;
    
    // Calculate completeness percentage
    const completeness = (filledFields / totalFields) * 100;
    score = (completeness / 100) * RANKING_CONFIG.MAX_POINTS.PROFILE_COMPLETENESS;
    
    return Math.round(score * 10) / 10; // Round to 1 decimal place
}

// Enhanced ranking function
export const rankCandidates = (applications, jobRequirements = [], jobQualifications = []) => {
    return applications
        .map(app => {
            const scoreResult = calculateCandidateScore(app, jobRequirements, jobQualifications);
            return {
                ...app,
                score: scoreResult.score,
                scoreBreakdown: scoreResult.breakdown,
                rawScore: scoreResult.rawScore
            };
        })
        .sort((a, b) => {
            // Primary sort by score
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            // Secondary sort by application date (earlier applications get preference)
            return new Date(a.appliedDate) - new Date(b.appliedDate);
        })
        .map((app, index) => ({
            ...app,
            rank: index + 1
        }));
};

// Enhanced color coding based on score ranges
export const getScoreColor = (score) => {
    if (score >= 85) return '#198754'; // Excellent - Dark Green
    if (score >= 70) return '#28a745'; // Very Good - Green  
    if (score >= 55) return '#20c997'; // Good - Teal
    if (score >= 40) return '#ffc107'; // Fair - Yellow
    if (score >= 25) return '#fd7e14'; // Poor - Orange
    return '#dc3545'; // Very Poor - Red
};

export const getScoreLabel = (score) => {
    if (score >= 85) return 'Excellent Match';
    if (score >= 70) return 'Very Good Match';
    if (score >= 55) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    if (score >= 25) return 'Poor Match';
    return 'Very Poor Match';
};

export const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
        case 'accepted': return '#28a745';
        case 'rejected': return '#dc3545';
        case 'pending': return '#6c757d';
        case 'shortlisted': return '#17a2b8';
        case 'interviewed': return '#ffc107';
        case 'under review': return '#6f42c1';
        default: return '#6c757d';
    }
};

// Helper function to get detailed score breakdown for display
export const getScoreBreakdownText = (breakdown) => {
    if (!breakdown || typeof breakdown !== 'object') {
        return {
            'Technical Skills': '0/30',
            'Education': '0/30',
            'Work Experience': '0/20',
            'Projects': '0/10',
            'Certifications': '0/5',
            'Profile Completeness': '0/5'
        };
    }

    return {
        'Technical Skills': `${Math.round((breakdown.technicalSkills || 0) * 10) / 10}/30`,
        'Education': `${Math.round((breakdown.education || 0) * 10) / 10}/30`,
        'Work Experience': `${Math.round((breakdown.workExperience || 0) * 10) / 10}/20`,
        'Projects': `${Math.round((breakdown.projects || 0) * 10) / 10}/10`,
        'Certifications': `${Math.round((breakdown.certifications || 0) * 10) / 10}/5`,
        'Profile Completeness': `${Math.round((breakdown.profileCompleteness || 0) * 10) / 10}/5`
    };
};