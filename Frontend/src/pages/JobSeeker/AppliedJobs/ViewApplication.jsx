import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaBirthdayCake, 
  FaGraduationCap, 
  FaBriefcase, 
  FaCode, 
  FaProjectDiagram, 
  FaCertificate, 
  FaLinkedin, 
  FaGithub, 
  FaGlobe, 
  FaEdit, 
  FaTimes,
  FaCalendarAlt
} from 'react-icons/fa';
import { getToken } from '../../../utils/auth';

const ViewApplication = ({ applicationId, jobTitle, onClose, onEdit }) => {
  const [applicationData, setApplicationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch real application data
  useEffect(() => {
    const fetchApplicationData = async () => {
      if (!applicationId) {
        setError('Application ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const token = getToken();
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch(`http://localhost:5001/api/applications/${applicationId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to fetch application: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched application data:', data); // Debug log
        console.log('Application data structure:', {
          hasApplicationData: !!data.applicationData,
          applicationDataKeys: data.applicationData ? Object.keys(data.applicationData) : 'No applicationData',
          personalInfo: data.applicationData?.personalInfo,
          personalInfoKeys: data.applicationData?.personalInfo ? Object.keys(data.applicationData.personalInfo) : 'No personalInfo'
        });
        setApplicationData(data);
      } catch (err) {
        console.error('Error fetching application:', err);
        setError(err.message || 'Failed to load application data');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationData();
  }, [applicationId]);

  const calculateAge = (birthday) => {
    if (!birthday) return '';
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'reviewed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'shortlisted':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProficiencyStars = (level) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < level ? 'text-green-500' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  // Function to capitalize first letter of each word
  const capitalizeWords = (text) => {
    if (!text) return '';
    // Check if the text is all lowercase
    if (text === text.toLowerCase()) {
      // Only capitalize if it's all lowercase
      return text.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    }
    // Preserve original capitalization
    return text;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-lg p-8 flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="text-gray-700 font-medium">Loading application...</span>
        </div>
      </div>
    );
  }

  if (error || !applicationData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-lg p-8 text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error</h3>
          <p className="text-gray-700 mb-4">{error || 'Failed to load application data'}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Extract data from the application structure
  const appData = applicationData.applicationData || {};
  // Personal info fields are at the root level of applicationData
  const personalInfo = {
    fullName: appData.fullName,
    nic: appData.nic,
    email: appData.email,
    phoneNumber: appData.phoneNumber,
    address: appData.address,
    birthday: appData.birthday,
    gender: appData.gender
  };
  const technicalSkills = appData.technicalSkills || [];
  const socialLinks = appData.socialLinks || {};
  const education = appData.education || [];
  const workExperience = appData.workExperience || [];
  const projects = appData.projects || [];
  const certifications = appData.certifications || [];
  const coverLetter = appData.coverLetter || '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[98vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold truncate">Application Details</h1>
              <p className="text-green-100 text-sm sm:text-base truncate">Application for: {jobTitle || 'Job Application'}</p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 ml-4">
              <div className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full border text-xs sm:text-sm font-medium ${getStatusColor(applicationData.status)}`}>
                {(applicationData.status || 'Pending').charAt(0).toUpperCase() + (applicationData.status || 'Pending').slice(1)}
              </div>
              <div className="flex space-x-1 sm:space-x-2">
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
                    title="Edit Application"
                  >
                    <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
                  title="Close"
                >
                  <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-green-100">
            Submitted on {formatDate(applicationData.appliedDate)}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(98vh-140px)] px-3 py-4 sm:px-6 sm:py-6">
          <div className="max-w-none mx-auto">
            
            {/* Personal Information */}
            <div className="bg-white border-2 border-green-100 rounded-lg p-4 sm:p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <FaUser className="mr-2 text-green-600" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="font-bold text-gray-700 sm:w-20 text-sm">Name:</span>
                    <span className="text-gray-900 text-sm sm:text-base">{capitalizeWords(personalInfo.fullName) || 'Not provided'}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="font-bold text-gray-700 sm:w-20 text-sm">NIC:</span>
                    <span className="text-gray-900 text-sm sm:text-base">{personalInfo.nic || 'Not provided'}</span>
                  </div>
                  <div className="flex items-start">
                    <FaEnvelope className="mr-2 text-green-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="text-green-600 hover:underline cursor-pointer text-sm break-all">
                      {personalInfo.email || 'Not provided'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaPhone className="mr-2 text-green-500 w-4 h-4 flex-shrink-0" />
                    <span className="text-gray-900 text-sm">{personalInfo.phoneNumber || 'Not provided'}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="mr-2 text-green-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-900 text-sm">{capitalizeWords(personalInfo.address) || 'Not provided'}</span>
                  </div>
                  <div className="flex items-start">
                    <FaBirthdayCake className="mr-2 text-green-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="text-gray-900 text-sm">
                      {personalInfo.birthday ? formatDate(personalInfo.birthday) : 'Not provided'}
                      {personalInfo.birthday && (
                        <div className="text-gray-600 text-xs mt-1">
                          Age: {calculateAge(personalInfo.birthday)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="font-bold text-gray-700 sm:w-20 text-sm">Gender:</span>
                    <span className="text-gray-900 text-sm">{capitalizeWords(personalInfo.gender) || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            {(socialLinks.linkedIn || socialLinks.github || socialLinks.portfolio) && (
              <div className="bg-white border-2 border-green-100 rounded-lg p-4 sm:p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Social Links</h2>
                <div className="space-y-3">
                  {socialLinks.linkedIn && (
                    <a
                      href={socialLinks.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-green-600 hover:text-green-800 transition-colors text-sm"
                    >
                      <FaLinkedin className="mr-2 flex-shrink-0" />
                      <span className="truncate">LinkedIn</span>
                    </a>
                  )}
                  {socialLinks.github && (
                    <a
                      href={socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-800 hover:text-black transition-colors text-sm"
                    >
                      <FaGithub className="mr-2 flex-shrink-0" />
                      <span className="truncate">GitHub</span>
                    </a>
                  )}
                  {socialLinks.portfolio && (
                    <a
                      href={socialLinks.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-green-600 hover:text-green-800 transition-colors text-sm"
                    >
                      <FaGlobe className="mr-2 flex-shrink-0" />
                      <span className="truncate">Portfolio</span>
                    </a>
                  )}
                </div>
              </div>
            )}
            </div>

            {/* Technical Skills */}
            {technicalSkills.length > 0 && (
              <div className="bg-white border-2 border-green-100 rounded-lg p-4 sm:p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <FaCode className="mr-2 text-green-600" />
                  Technical Skills
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {technicalSkills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                      <span className="font-bold text-gray-700 text-sm">{capitalizeWords(skill.name)}</span>
                      <div className="flex items-center space-x-1">
                        {getProficiencyStars(skill.proficiency)}
                        <span className="text-xs text-gray-600 ml-2">({skill.proficiency}/5)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div className="bg-white border-2 border-green-100 rounded-lg p-4 sm:p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <FaGraduationCap className="mr-2 text-green-600" />
                  Education
                </h2>
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <div key={index} className="border-l-4 border-green-300 pl-4 py-3 bg-green-50 rounded-r-lg">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base">{capitalizeWords(edu.institute)}</h3>
                          <p className="text-green-600 font-bold text-sm">
                            {edu.educationLevel === 'A/L' ? (
                              `${edu.educationLevel} - ${capitalizeWords(edu.fieldOfStudy)} Stream`
                            ) : (
                              `${edu.educationLevel}${edu.fieldOfStudy ? ` in ${capitalizeWords(edu.fieldOfStudy)}` : ''}`
                            )}
                          </p>
                          {edu.gpaOrGrade && (
                            <p className="text-gray-600 text-sm">GPA/Grade: {edu.gpaOrGrade}</p>
                          )}
                          {edu.educationLevel === 'A/L' && edu.alSubjects && edu.alSubjects.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-bold text-gray-700">Subjects & Grades:</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
                                {edu.alSubjects.map((subject, subIndex) => (
                                  <span key={subIndex} className="text-xs text-gray-600">
                                    {capitalizeWords(subject.subject)}: <span className="font-bold">{subject.grade}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-right text-xs text-gray-500 mt-2 sm:mt-0 sm:ml-4">
                          {edu.educationLevel === 'A/L' ? (
                            <span>{edu.alYear}</span>
                          ) : (
                            <span>
                              {edu.startDate ? formatDate(edu.startDate) : 'Not provided'} - {
                                edu.currentlyStudying ? 'Present' : (edu.endDate ? formatDate(edu.endDate) : 'Not provided')
                              }
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {workExperience.length > 0 && (
              <div className="bg-white border-2 border-green-100 rounded-lg p-4 sm:p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <FaBriefcase className="mr-2 text-green-600" />
                  Work Experience
                </h2>
                <div className="space-y-4">
                  {workExperience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-green-400 pl-4 py-3 bg-green-50 rounded-r-lg">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base">{capitalizeWords(exp.jobTitle)}</h3>
                          <p className="text-green-600 font-bold text-sm">{capitalizeWords(exp.company)}</p>
                          {exp.description && (
                            <p className="text-gray-600 mt-2 text-sm">{exp.description}</p>
                          )}
                        </div>
                        <div className="text-right text-xs text-gray-500 mt-2 sm:mt-0 sm:ml-4">
                          {exp.startDate ? formatDate(exp.startDate) : 'Not provided'} - {
                            exp.currentlyWorking ? 'Present' : (exp.endDate ? formatDate(exp.endDate) : 'Not provided')
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div className="bg-white border-2 border-green-100 rounded-lg p-4 sm:p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <FaProjectDiagram className="mr-2 text-green-600" />
                  Projects
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {projects.map((project, index) => (
                    <div key={index} className="border border-green-200 rounded-lg p-3 hover:shadow-md transition-shadow bg-green-50">
                      <h3 className="font-bold text-gray-900 mb-2 text-sm">{capitalizeWords(project.title)}</h3>
                      {project.description && (
                        <p className="text-gray-600 text-xs mb-3">{project.description}</p>
                      )}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full"
                            >
                              {capitalizeWords(tech)}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 text-xs font-bold hover:underline"
                        >
                          View Project →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div className="bg-white border-2 border-green-100 rounded-lg p-4 sm:p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <FaCertificate className="mr-2 text-green-600" />
                  Certifications
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="border border-green-200 rounded-lg p-3 bg-green-50">
                      <h3 className="font-bold text-gray-900 text-sm">{capitalizeWords(cert.name)}</h3>
                      <p className="text-gray-600 text-sm">{capitalizeWords(cert.issuer)}</p>
                      <p className="text-xs text-gray-500">{cert.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cover Letter */}
            {coverLetter && (
              <div className="bg-white border-2 border-green-100 rounded-lg p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Cover Letter</h2>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                    {coverLetter}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  
  );
};

export default ViewApplication;