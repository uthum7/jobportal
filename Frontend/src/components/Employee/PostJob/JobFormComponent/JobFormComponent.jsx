import axios from "axios";
import "./formstyle.css";
import { useRef, useState } from "react";

// Custom Alert System
const showAlert = (type, title, message, duration = 4000) => {
  // Remove existing alerts
  const existingAlerts = document.querySelectorAll('.custom-alert');
  existingAlerts.forEach(alert => alert.remove());

  // Create alert element
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
  
  // Add to document
  document.body.appendChild(alertDiv);
  
  // Animate in
  setTimeout(() => alertDiv.classList.add('show'), 100);
  
  // Auto remove
  setTimeout(() => {
    alertDiv.classList.remove('show');
    setTimeout(() => alertDiv.remove(), 300);
  }, duration);
};

// Fallback toast function
const customToast = {
  success: (title, options = {}) => {
    if (typeof toast !== 'undefined' && toast.success) {
      toast.success(title, options);
    } else {
      showAlert('success', 'Success', title, options.duration || 4000);
    }
  },
  error: (title, options = {}) => {
    if (typeof toast !== 'undefined' && toast.error) {
      toast.error(title, options);
    } else {
      showAlert('error', 'Error', title, options.duration || 4000);
    }
  },
  warning: (title, options = {}) => {
    if (typeof toast !== 'undefined' && toast.warning) {
      toast.warning(title, options);
    } else {
      showAlert('warning', 'Warning', title, options.duration || 4000);
    }
  },
  info: (title, options = {}) => {
    if (typeof toast !== 'undefined' && toast.info) {
      toast.info(title, options);
    } else {
      showAlert('info', 'Info', title, options.duration || 4000);
    }
  }
};

const JobFormComponent = () => {
  const [requirements, setRequirements] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [responsibilities, setResponsibilities] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const title = useRef("");
  const exp = useRef("");
  const deadline = useRef("");
  const jobType = useRef("");
  const mode = useRef("");
  const jobDescription = useRef("");
  const requirement = useRef("");
  const qualification = useRef("");
  const responsibility = useRef("");
  const tag = useRef("");

  // Validation functions
  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };
    
    switch (fieldName) {
      case 'title':
        if (!value?.trim()) {
          newErrors.title = "Job title is required";
        } else if (value.trim().length < 3) {
          newErrors.title = "Job title must be at least 3 characters long";
        } else if (value.trim().length > 100) {
          newErrors.title = "Job title must not exceed 100 characters";
        } else {
          delete newErrors.title;
        }
        break;
        
      case 'exp':
        if (value && (isNaN(value) || value < 0 || value > 50)) {
          newErrors.exp = "Experience must be between 0 and 50 years";
        } else {
          delete newErrors.exp;
        }
        break;
        
      case 'deadline':
        if (!value) {
          newErrors.deadline = "Application deadline is required";
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (selectedDate < today) {
            newErrors.deadline = "Deadline cannot be in the past";
          } else {
            delete newErrors.deadline;
          }
        }
        break;
        
      case 'jobDescription':
        if (value && value.length > 2000) {
          newErrors.jobDescription = "Job description must not exceed 2000 characters";
        } else {
          delete newErrors.jobDescription;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (fieldName, value) => {
    setTouched({ ...touched, [fieldName]: true });
    validateField(fieldName, value);
  };

  const validateForm = () => {
    const titleValue = title.current.value;
    const expValue = exp.current.value;
    const deadlineValue = deadline.current.value;
    const jobDescValue = jobDescription.current.value;

    let isValid = true;
    isValid = validateField('title', titleValue) && isValid;
    isValid = validateField('exp', expValue) && isValid;
    isValid = validateField('deadline', deadlineValue) && isValid;
    isValid = validateField('jobDescription', jobDescValue) && isValid;

    // Mark all fields as touched for error display
    setTouched({
      title: true,
      exp: true,
      deadline: true,
      jobDescription: true
    });

    return isValid;
  };

  const clearAll = () => {
    title.current.value = "";
    exp.current.value = "";
    mode.current.value = "";
    jobType.current.value = "";
    deadline.current.value = "";
    jobDescription.current.value = "";
    requirement.current.value = "";
    qualification.current.value = "";
    responsibility.current.value = "";
    tag.current.value = "";
    setRequirements([]);
    setQualifications([]);
    setResponsibilities([]);
    setTags([]);
    setErrors({});
    setTouched({});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      customToast.error("Validation Failed", {
        description: "Please fix all validation errors before submitting the form",
        duration: 5000
      });
      return;
    }

    setLoading(true);

    const job = {
      JobTitle: title.current.value,
      JobExperienceYears: exp.current.value || 0,
      JobMode: mode.current.value,
      JobType: jobType.current.value,
      JobDeadline: deadline.current.value ? new Date(deadline.current.value) : null,
      JobDescription: jobDescription.current.value,
      Requirements: requirements,
      Qualifications: qualifications,
      Responsibilities: responsibilities,
      Tags: tags,
    }

    try {
      const response = await axios.post("http://localhost:5001/api/job/create", job);
      
      if (response.status === 200 || response.status === 201) {
        customToast.success("🎉 Job Posted Successfully!", {
          description: "Your job posting is now live and visible to potential candidates. You can manage it from your dashboard.",
          duration: 6000
        });
        
        // Additional success feedback
        setTimeout(() => {
          showAlert('success', 
            'Job Posted Successfully!', 
            `Job "${title.current.value}" has been published and is now accepting applications.`, 
            8000
          );
        }, 1000);
        
        clearAll();
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Failed to post job. Please check your connection and try again.";
      
      customToast.error("❌ Job Posting Failed", {
        description: errorMessage,
        duration: 8000
      });
      
      // Additional error feedback
      setTimeout(() => {
        showAlert('error', 
          'Job Posting Failed', 
          `Error: ${errorMessage}. Please verify all information and try again.`, 
          10000
        );
      }, 1000);
    } finally {
      setLoading(false);
    }
  }

  const handleAddRequirement = (e) => {
    e.preventDefault();
    const value = requirement.current.value.trim();
    if (!value) {
      customToast.error("Empty Requirement", {
        description: "Please enter a valid requirement before adding",
        duration: 3000
      });
      return;
    }
    if (value.length < 3) {
      customToast.warning("Requirement Too Short", {
        description: "Requirements should be at least 3 characters long",
        duration: 3000
      });
      return;
    }
    if (requirements.includes(value)) {
      customToast.warning("Duplicate Entry", {
        description: "This requirement has already been added",
        duration: 3000
      });
      return;
    }
    if (requirements.length >= 10) {
      customToast.warning("Limit Reached", {
        description: "You can add up to 10 requirements only",
        duration: 4000
      });
      return;
    }
    setRequirements([...requirements, value]);
    customToast.success("✅ Requirement Added", {
      description: `"${value.substring(0, 50)}${value.length > 50 ? '...' : ''}" has been added successfully`,
      duration: 2500
    });
    requirement.current.value = "";
  }

  const handleAddQualification = (e) => {
    e.preventDefault();
    const value = qualification.current.value.trim();
    if (!value) {
      customToast.error("Empty Qualification", {
        description: "Please enter a valid qualification before adding",
        duration: 3000
      });
      return;
    }
    if (value.length < 3) {
      customToast.warning("Qualification Too Short", {
        description: "Qualifications should be at least 3 characters long",
        duration: 3000
      });
      return;
    }
    if (qualifications.includes(value)) {
      customToast.warning("Duplicate Entry", {
        description: "This qualification has already been added",
        duration: 3000
      });
      return;
    }
    if (qualifications.length >= 10) {
      customToast.warning("Limit Reached", {
        description: "You can add up to 10 qualifications only",
        duration: 4000
      });
      return;
    }
    setQualifications([...qualifications, value]);
    customToast.success("✅ Qualification Added", {
      description: `"${value.substring(0, 50)}${value.length > 50 ? '...' : ''}" has been added successfully`,
      duration: 2500
    });
    qualification.current.value = "";
  }

  const handleAddResponsibility = (e) => {
    e.preventDefault();
    const value = responsibility.current.value.trim();
    if (!value) {
      customToast.error("Empty Responsibility", {
        description: "Please enter a valid responsibility before adding",
        duration: 3000
      });
      return;
    }
    if (value.length < 3) {
      customToast.warning("Responsibility Too Short", {
        description: "Responsibilities should be at least 3 characters long",
        duration: 3000
      });
      return;
    }
    if (responsibilities.includes(value)) {
      customToast.warning("Duplicate Entry", {
        description: "This responsibility has already been added",
        duration: 3000
      });
      return;
    }
    if (responsibilities.length >= 15) {
      customToast.warning("Limit Reached", {
        description: "You can add up to 15 responsibilities only",
        duration: 4000
      });
      return;
    }
    setResponsibilities([...responsibilities, value]);
    customToast.success("✅ Responsibility Added", {
      description: `"${value.substring(0, 50)}${value.length > 50 ? '...' : ''}" has been added successfully`,
      duration: 2500
    });
    responsibility.current.value = "";
  }

  const handleAddTag = (e) => {
    e.preventDefault();
    const value = tag.current.value.trim().toLowerCase();
    if (!value) {
      customToast.error("Empty Tag", {
        description: "Please enter a valid tag before adding",
        duration: 3000
      });
      return;
    }
    if (value.length < 2) {
      customToast.warning("Tag Too Short", {
        description: "Tags should be at least 2 characters long",
        duration: 3000
      });
      return;
    }
    if (tags.map(t => t.toLowerCase()).includes(value)) {
      customToast.warning("Duplicate Entry", {
        description: "This tag has already been added",
        duration: 3000
      });
      return;
    }
    if (tags.length >= 20) {
      customToast.warning("Limit Reached", {
        description: "You can add up to 20 tags only",
        duration: 4000
      });
      return;
    }
    setTags([...tags, tag.current.value.trim()]);
    customToast.success("✅ Tag Added", {
      description: `"${tag.current.value.trim()}" has been added successfully`,
      duration: 2500
    });
    tag.current.value = "";
  }

  const handleDeleteRequirement = (index) => {
    const deletedItem = requirements[index];
    setRequirements(requirements.filter((_, i) => i !== index));
    customToast.success("🗑️ Requirement Removed", {
      description: `"${deletedItem.substring(0, 40)}${deletedItem.length > 40 ? '...' : ''}" has been removed`,
      duration: 2500
    });
  }

  const handleDeleteQualification = (index) => {
    const deletedItem = qualifications[index];
    setQualifications(qualifications.filter((_, i) => i !== index));
    customToast.success("🗑️ Qualification Removed", {
      description: `"${deletedItem.substring(0, 40)}${deletedItem.length > 40 ? '...' : ''}" has been removed`,
      duration: 2500
    });
  }

  const handleDeleteResponsibility = (index) => {
    const deletedItem = responsibilities[index];
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
    customToast.success("🗑️ Responsibility Removed", {
      description: `"${deletedItem.substring(0, 40)}${deletedItem.length > 40 ? '...' : ''}" has been removed`,
      duration: 2500
    });
  }

  const handleDeleteTag = (index) => {
    const deletedItem = tags[index];
    setTags(tags.filter((_, i) => i !== index));
    customToast.success("🗑️ Tag Removed", {
      description: `"${deletedItem}" has been removed`,
      duration: 2500
    });
  }

  const handleKeyPress = (e, handler) => {
    if (e.key === 'Enter') {
      handler(e);
    }
  }

  const getFieldClassName = (fieldName) => {
    let className = "form-input";
    if (touched[fieldName] && errors[fieldName]) {
      className += " error";
    }
    return className;
  };

  return (
    <div className="job-form-wrapper">
      <div className="job-form-header">
        <h1 className="form-title">Create New Job Posting</h1>
        <p className="form-subtitle">Build a comprehensive job posting to attract the right talent</p>
      </div>

      <div className="job-form-component">
        <form onSubmit={handleSubmit} noValidate>
          {/* Basic Information */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">📋</div>
              <div>
                <h3 className="section-title">Basic Information</h3>
                <p className="section-description">Essential details about the job position</p>
              </div>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Job Title <span className="required">*</span>
                </label>
                <input 
                  type="text" 
                  ref={title} 
                  className={getFieldClassName('title')}
                  placeholder="e.g. Senior Software Engineer"
                  maxLength="100"
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  required
                />
                {touched.title && errors.title && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {errors.title}
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">Years of Experience</label>
                <input 
                  type="number" 
                  ref={exp} 
                  className={getFieldClassName('exp')}
                  placeholder="e.g. 3"
                  min="0"
                  max="50"
                  onChange={(e) => handleFieldChange('exp', e.target.value)}
                />
                {touched.exp && errors.exp && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {errors.exp}
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">Work Mode</label>
                <select ref={mode} className="form-select">
                  <option value="onsite">🏢 On-site</option>
                  <option value="remote">🏠 Remote</option>
                  <option value="hybrid">🔄 Hybrid</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Application Deadline <span className="required">*</span>
                </label>
                <input 
                  type="date" 
                  ref={deadline} 
                  className={getFieldClassName('deadline')}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => handleFieldChange('deadline', e.target.value)}
                  required
                />
                {touched.deadline && errors.deadline && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {errors.deadline}
                  </div>
                )}
              </div>
              
              <div className="form-group full-width">
                <label className="form-label">Job Type</label>
                <select ref={jobType} className="form-select">
                  <option value="full time">💼 Full Time</option>
                  <option value="part time">⏰ Part Time</option>
                  <option value="internship">🎓 Internship</option>
                  <option value="project base">📁 Project Based</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Job Description</label>
              <textarea 
                ref={jobDescription} 
                className={getFieldClassName('jobDescription')}
                placeholder="Describe the role, company culture, and what makes this opportunity exciting..."
                rows="8"
                maxLength="2000"
                onChange={(e) => handleFieldChange('jobDescription', e.target.value)}
              />
              <div className="character-count">
                {jobDescription.current?.value?.length || 0}/2000 characters
              </div>
              {touched.jobDescription && errors.jobDescription && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errors.jobDescription}
                </div>
              )}
            </div>
          </div>

          {/* Requirements Section */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">✅</div>
              <div>
                <h3 className="section-title">Requirements</h3>
                <p className="section-description">Technical skills and qualifications needed ({requirements.length}/10)</p>
              </div>
            </div>
            
            <div className="add-item-group">
              <input 
                type="text" 
                ref={requirement} 
                className="add-item-input" 
                placeholder="e.g. 3+ years experience with React.js"
                maxLength="200"
                onKeyPress={(e) => handleKeyPress(e, handleAddRequirement)}
              />
              <button 
                type="button" 
                className="add-item-btn" 
                onClick={handleAddRequirement}
                disabled={requirements.length >= 10}
              >
                ➕ Add Requirement
              </button>
            </div>
            
            <div className="items-container">
              {requirements.length === 0 && (
                <div className="empty-state">
                  <span className="empty-icon">📝</span>
                  <p>No requirements added yet. Add technical skills and experience needed for this role.</p>
                </div>
              )}
              {requirements.map((req, index) => (
                <div key={index} className="item-card requirement-item">
                  <span className="item-text">{req}</span>
                  <button 
                    type="button" 
                    className="delete-btn" 
                    onClick={() => handleDeleteRequirement(index)}
                    title="Remove requirement"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Qualifications Section */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">🎓</div>
              <div>
                <h3 className="section-title">Qualifications</h3>
                <p className="section-description">Educational background and certifications ({qualifications.length}/10)</p>
              </div>
            </div>
            
            <div className="add-item-group">
              <input 
                type="text" 
                ref={qualification} 
                className="add-item-input" 
                placeholder="e.g. Bachelor's degree in Computer Science"
                maxLength="200"
                onKeyPress={(e) => handleKeyPress(e, handleAddQualification)}
              />
              <button 
                type="button" 
                className="add-item-btn" 
                onClick={handleAddQualification}
                disabled={qualifications.length >= 10}
              >
                ➕ Add Qualification
              </button>
            </div>
            
            <div className="items-container">
              {qualifications.length === 0 && (
                <div className="empty-state">
                  <span className="empty-icon">🎓</span>
                  <p>No qualifications added yet. Add educational requirements and certifications.</p>
                </div>
              )}
              {qualifications.map((qual, index) => (
                <div key={index} className="item-card qualification-item">
                  <span className="item-text">{qual}</span>
                  <button 
                    type="button" 
                    className="delete-btn" 
                    onClick={() => handleDeleteQualification(index)}
                    title="Remove qualification"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Responsibilities Section */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">🎯</div>
              <div>
                <h3 className="section-title">Responsibilities</h3>
                <p className="section-description">Key duties and expectations for this role ({responsibilities.length}/15)</p>
              </div>
            </div>
            
            <div className="add-item-group">
              <input 
                type="text" 
                ref={responsibility} 
                className="add-item-input" 
                placeholder="e.g. Design and develop scalable web applications"
                maxLength="200"
                onKeyPress={(e) => handleKeyPress(e, handleAddResponsibility)}
              />
              <button 
                type="button" 
                className="add-item-btn" 
                onClick={handleAddResponsibility}
                disabled={responsibilities.length >= 15}
              >
                ➕ Add Responsibility
              </button>
            </div>
            
            <div className="items-container">
              {responsibilities.length === 0 && (
                <div className="empty-state">
                  <span className="empty-icon">🎯</span>
                  <p>No responsibilities added yet. Add key duties and daily tasks for this position.</p>
                </div>
              )}
              {responsibilities.map((resp, index) => (
                <div key={index} className="item-card responsibility-item">
                  <span className="item-text">{resp}</span>
                  <button 
                    type="button" 
                    className="delete-btn" 
                    onClick={() => handleDeleteResponsibility(index)}
                    title="Remove responsibility"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tags Section */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">🏷️</div>
              <div>
                <h3 className="section-title">Tags</h3>
                <p className="section-description">Keywords to help candidates find this job ({tags.length}/20)</p>
              </div>
            </div>
            
            <div className="add-item-group">
              <input 
                type="text" 
                ref={tag} 
                className="add-item-input" 
                placeholder="e.g. JavaScript, Frontend, React"
                maxLength="50"
                onKeyPress={(e) => handleKeyPress(e, handleAddTag)}
              />
              <button 
                type="button" 
                className="add-item-btn" 
                onClick={handleAddTag}
                disabled={tags.length >= 20}
              >
                ➕ Add Tag
              </button>
            </div>
            
            <div className="items-container tags-container">
              {tags.length === 0 && (
                <div className="empty-state">
                  <span className="empty-icon">🏷️</span>
                  <p>No tags added yet. Add relevant keywords and technologies.</p>
                </div>
              )}
              {tags.map((t, index) => (
                <div key={index} className="item-card tag-item">
                  <span className="item-text">{t}</span>
                  <button 
                    type="button" 
                    className="delete-btn" 
                    onClick={() => handleDeleteTag(index)}
                    title="Remove tag"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Section */}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={clearAll} disabled={loading}>
              🗑️ Clear All
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Publishing Job...
                </>
              ) : (
                <>
                  🚀 Publish Job
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobFormComponent;
