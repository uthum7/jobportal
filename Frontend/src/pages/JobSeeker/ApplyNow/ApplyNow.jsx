import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ApplyNow.css';

const ApplyJobForm = ({ jobId, userId, onClose, onSuccess }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    nic: '',
    email: '',
    phoneNumber: '',
    address: '',
    skills: [''],
    education: [{ institute: '', degree: '', startDate: '', endDate: '', currentlyStudying: false }],
    summary: '',
    workExperience: [{ jobTitle: '', company: '', startDate: '', endDate: '', description: '', currentlyWorking: false }],
    certifications: [''],
    coverLetter: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load job details and user profile data on component mount
  useEffect(() => {
    const loadJobAndProfile = async () => {
      try {
        // Load job details
        const jobResponse = await axios.get(`http://localhost:5001/api/jobs/${jobId}`);
        setJobTitle(jobResponse.data.title);

        // Load user profile
        const profileResponse = await axios.get(`http://localhost:5001/api/users/profile/${userId}`);
        const profile = profileResponse.data;
        
        // Auto-fill form with existing profile data
        setFormData(prev => ({
          ...prev,
          fullName: profile.fullName || '',
          nic: profile.nic || '',
          email: profile.email || '',
          phoneNumber: profile.phoneNumber || '',
          address: profile.address || '',
          skills: profile.skills && profile.skills.length > 0 ? profile.skills : [''],
          education: profile.education && profile.education.length > 0 ? profile.education : [{ institute: '', degree: '', startDate: '', endDate: '', currentlyStudying: false }],
          summary: profile.summary || '',
          workExperience: profile.workExperience && profile.workExperience.length > 0 ? profile.workExperience : [{ jobTitle: '', company: '', startDate: '', endDate: '', description: '', currentlyWorking: false }],
          certifications: profile.certifications && profile.certifications.length > 0 ? profile.certifications : [''],
          coverLetter: ''
        }));
      } catch (error) {
        console.error('Error loading job details or user profile:', error);
      }
    };

    loadJobAndProfile();
  }, [userId, jobId]);

  // Validation functions
  const validateFullName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name) && name.trim().length > 0;
  };

  const validateNIC = (nic) => {
    const nicRegex = /^(\d{12}|\d{9}[VXvx])$/;
    return nicRegex.test(nic);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(0\d{9}|\+94\d{9})$/;
    return phoneRegex.test(phone);
  };

  // Real-time validation on blur
  const handleBlur = (field, value) => {
    let error = '';
    
    switch (field) {
      case 'fullName':
        if (!validateFullName(value)) {
          error = 'Full name is required and should contain only letters';
        }
        break;
      case 'nic':
        if (!validateNIC(value)) {
          error = 'Invalid NIC format (12 digits or 9 digits followed by V/X)';
        }
        break;
      case 'email':
        if (!validateEmail(value)) {
          error = 'Invalid email format';
        }
        break;
      case 'phoneNumber':
        if (!validatePhoneNumber(value)) {
          error = 'Invalid phone number format (10 digits starting with 0 or +94)';
        }
        break;
      case 'address':
        if (!value.trim()) {
          error = 'Address is required';
        }
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsFormDirty(true);

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle skills array changes
  const handleSkillChange = (index, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = value;
    setFormData(prev => ({
      ...prev,
      skills: updatedSkills
    }));
    setIsFormDirty(true);
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: ['', ...prev.skills]
    }));
    setIsFormDirty(true);
  };

  const removeSkill = (index) => {
    if (formData.skills.length > 1) {
      setFormData(prev => ({
        ...prev,
        skills: prev.skills.filter((_, i) => i !== index)
      }));
      setIsFormDirty(true);
    }
  };

  // Handle certifications array changes
  const handleCertificationChange = (index, value) => {
    const updatedCertifications = [...formData.certifications];
    updatedCertifications[index] = value;
    setFormData(prev => ({
      ...prev,
      certifications: updatedCertifications
    }));
    setIsFormDirty(true);
  };

  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: ['', ...prev.certifications]
    }));
    setIsFormDirty(true);
  };

  const removeCertification = (index) => {
    if (formData.certifications.length > 1) {
      setFormData(prev => ({
        ...prev,
        certifications: prev.certifications.filter((_, i) => i !== index)
      }));
      setIsFormDirty(true);
    }
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index][field] = value;
    setFormData(prev => ({
      ...prev,
      education: updatedEducation
    }));
    setIsFormDirty(true);
  };

  const handleWorkExperienceChange = (index, field, value) => {
    const updatedExperience = [...formData.workExperience];
    updatedExperience[index][field] = value;
    setFormData(prev => ({
      ...prev,
      workExperience: updatedExperience
    }));
    setIsFormDirty(true);
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [{ institute: '', degree: '', startDate: '', endDate: '', currentlyStudying: false }, ...prev.education]
    }));
    setIsFormDirty(true);
  };

  const addWorkExperience = () => {
    setFormData(prev => ({
      ...prev,
      workExperience: [{ jobTitle: '', company: '', startDate: '', endDate: '', description: '', currentlyWorking: false }, ...prev.workExperience]
    }));
    setIsFormDirty(true);
  };

  const removeEducation = (index) => {
    if (formData.education.length > 1) {
      setFormData(prev => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index)
      }));
      setIsFormDirty(true);
    }
  };

  const removeWorkExperience = (index) => {
    if (formData.workExperience.length > 1) {
      setFormData(prev => ({
        ...prev,
        workExperience: prev.workExperience.filter((_, i) => i !== index)
      }));
      setIsFormDirty(true);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateFullName(formData.fullName)) {
      newErrors.fullName = 'Full name is required and should contain only letters';
    }

    if (!validateNIC(formData.nic)) {
      newErrors.nic = 'Invalid NIC format (12 digits or 9 digits followed by V/X)';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format (10 digits starting with 0 or +94)';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    const validSkills = formData.skills.filter(skill => skill.trim() !== '');
    if (validSkills.length === 0) {
      newErrors.skills = 'At least one skill is required';
    }

    const validEducation = formData.education.filter(edu => edu.institute.trim() !== '' && edu.degree.trim() !== '');
    if (validEducation.length === 0) {
      newErrors.education = 'At least one education entry is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Filter out empty skills and certifications
      const sanitizedData = {
        ...formData,
        skills: formData.skills.filter(skill => skill.trim() !== ''),
        certifications: formData.certifications.filter(cert => cert.trim() !== ''),
        education: formData.education.filter(edu => edu.institute.trim() !== '' || edu.degree.trim() !== ''),
        workExperience: formData.workExperience.filter(exp => exp.jobTitle.trim() !== '' || exp.company.trim() !== '')
      };

      const response = await axios.post('http://localhost:5001/api/applications/submit', {
        jobId,
        userId,
        applicationData: sanitizedData
      });

      console.log('Application submitted successfully:', response.data);
      
      // Show success message
      setSubmitSuccess(true);
      setShowSuccess(true);
      setIsFormDirty(false);

      // Auto-close after 3 seconds or wait for user action
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
        }
      }, 3000);

    } catch (error) {
      console.error('Error submitting application:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Unknown error occurred';
      alert(`Error submitting application: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (isFormDirty && !submitSuccess) {
      setShowWarning(true);
    } else {
      onClose();
    }
  };

  const confirmClose = () => {
    setShowWarning(false);
    onClose();
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    if (onSuccess) {
      onSuccess();
    } else {
      onClose();
    }
  };

  // Success Modal
  if (showSuccess) {
    return (
      <div className="apply-form-overlay">
        <div className="success-modal">
          <div className="success-content">
            <div className="success-icon">✅</div>
            <h2>Application Submitted Successfully!</h2>
            <p>Your application for <strong>{jobTitle}</strong> has been submitted successfully.</p>
            <div className="success-actions">
              <button onClick={handleSuccessClose} className="success-btn">
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="apply-form-overlay">
      <div className="apply-form-container">
        <div className="apply-form-header">
          <h2>Apply for: {jobTitle}</h2>
          <button className="close-btn" onClick={handleClose}>❌</button>
        </div>

        <form className="apply-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Personal Information</h3>
            
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                onBlur={(e) => handleBlur('fullName', e.target.value)}
                className={errors.fullName ? 'error' : ''}
                required
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="nic">NIC *</label>
              <input
                type="text"
                id="nic"
                name="nic"
                value={formData.nic}
                onChange={handleInputChange}
                onBlur={(e) => handleBlur('nic', e.target.value)}
                className={errors.nic ? 'error' : ''}
                required
              />
              {errors.nic && <span className="error-message">{errors.nic}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={(e) => handleBlur('email', e.target.value)}
                className={errors.email ? 'error' : ''}
                required
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number *</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                onBlur={(e) => handleBlur('phoneNumber', e.target.value)}
                className={errors.phoneNumber ? 'error' : ''}
                required
              />
              {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                onBlur={(e) => handleBlur('address', e.target.value)}
                className={errors.address ? 'error' : ''}
                required
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3>Skills & Qualifications</h3>
            
            <div className="form-group">
              <label>Skills *</label>
              {formData.skills.map((skill, index) => (
                <div key={index} className="input-with-add">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    placeholder="Enter a skill"
                    required={index === 0}
                  />
                  {index === 0 && (
                    <button 
                      type="button" 
                      onClick={addSkill} 
                      className="add-icon-btn"
                      disabled={!skill.trim()}
                    >
                      +
                    </button>
                  )}
                  {index > 0 && (
                    <button 
                      type="button" 
                      onClick={() => removeSkill(index)}
                      className="remove-btn"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {errors.skills && <span className="error-message">{errors.skills}</span>}
            </div>

            <div className="form-group">
              <label>Education *</label>
              {formData.education.map((edu, index) => (
                <div key={index} className="education-entry">
                  <div className="education-row">
                    <input
                      type="text"
                      placeholder="Institute"
                      value={edu.institute || ''}
                      onChange={(e) => handleEducationChange(index, 'institute', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Degree"
                      value={edu.degree || ''}
                      onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                      required
                    />
                    {index === 0 && (
                      <button 
                        type="button" 
                        onClick={addEducation} 
                        className="add-icon-btn"
                        disabled={!edu.institute.trim() || !edu.degree.trim()}
                      >
                        +
                      </button>
                    )}
                    {index > 0 && (
                      <button 
                        type="button" 
                        onClick={() => removeEducation(index)}
                        className="remove-btn"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <div className="education-dates">
                    <input
                      type="date"
                      placeholder="Start Date"
                      value={edu.startDate || ''}
                      onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                      required
                    />
                    <input
                      type="date"
                      placeholder="End Date"
                      value={edu.endDate || ''}
                      onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                      disabled={edu.currentlyStudying}
                    />
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={edu.currentlyStudying || false}
                        onChange={(e) => handleEducationChange(index, 'currentlyStudying', e.target.checked)}
                      />
                      Currently studying
                    </label>
                  </div>
                </div>
              ))}
              {errors.education && <span className="error-message">{errors.education}</span>}
            </div>

            <div className="form-group">
              <label>Certifications</label>
              {formData.certifications.map((cert, index) => (
                <div key={index} className="input-with-add">
                  <input
                    type="text"
                    value={cert}
                    onChange={(e) => handleCertificationChange(index, e.target.value)}
                    placeholder="Enter certification"
                  />
                  {index === 0 && (
                    <button 
                      type="button" 
                      onClick={addCertification} 
                      className="add-icon-btn"
                      disabled={!cert.trim()}
                    >
                      +
                    </button>
                  )}
                  {index > 0 && (
                    <button 
                      type="button" 
                      onClick={() => removeCertification(index)}
                      className="remove-btn"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>Professional Experience</h3>
            
            <div className="form-group">
              <label htmlFor="summary">Professional Summary</label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                placeholder="Brief summary of your professional background..."
              />
            </div>

            <div className="form-group">
              <label>Work Experience</label>
              {formData.workExperience.map((exp, index) => (
                <div key={index} className="work-experience-entry">
                  <div className="work-experience-row">
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={exp.jobTitle || ''}
                      onChange={(e) => handleWorkExperienceChange(index, 'jobTitle', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company || ''}
                      onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)}
                    />
                    {index === 0 && (
                      <button 
                        type="button" 
                        onClick={addWorkExperience} 
                        className="add-icon-btn"
                        disabled={!exp.jobTitle.trim() || !exp.company.trim()}
                      >
                        +
                      </button>
                    )}
                    {index > 0 && (
                      <button 
                        type="button" 
                        onClick={() => removeWorkExperience(index)}
                        className="remove-btn"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <div className="work-experience-dates">
                    <input
                      type="date"
                      placeholder="Start Date"
                      value={exp.startDate || ''}
                      onChange={(e) => handleWorkExperienceChange(index, 'startDate', e.target.value)}
                    />
                    <input
                      type="date"
                      placeholder="End Date"
                      value={exp.endDate || ''}
                      onChange={(e) => handleWorkExperienceChange(index, 'endDate', e.target.value)}
                      disabled={exp.currentlyWorking}
                    />
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={exp.currentlyWorking || false}
                        onChange={(e) => handleWorkExperienceChange(index, 'currentlyWorking', e.target.checked)}
                      />
                      Currently working
                    </label>
                  </div>
                  <textarea
                    placeholder="Job Description"
                    value={exp.description || ''}
                    onChange={(e) => handleWorkExperienceChange(index, 'description', e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="form-group">
              <label htmlFor="coverLetter">Cover Letter</label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                placeholder="Write your cover letter here..."
                rows="6"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleClose} className="cancel-btn">Cancel</button>
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>

      {showWarning && (
        <div className="warning-overlay">
          <div className="warning-dialog">
            <h3>Are you sure?</h3>
            <p>All filled data will be lost.</p>
            <div className="warning-actions">
              <button onClick={() => setShowWarning(false)}>Cancel</button>
              <button onClick={confirmClose} className="confirm-btn">Yes, Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyJobForm;