import axios from "axios";
import "./formstyle.css";
import { useRef, useState } from "react";
import { toast } from 'sonner';

const JobFormComponent = () => {
  const [requirements, setRequirements] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [responsibilities, setResponsibilities] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState(null);
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
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Job title is required';
        } else if (value.trim().length < 3) {
          newErrors.title = 'Job title must be at least 3 characters';
        } else if (value.trim().length > 100) {
          newErrors.title = 'Job title must be less than 100 characters';
        } else {
          delete newErrors.title;
        }
        break;
        
      case 'exp':
        if (value && (value < 0 || value > 50)) {
          newErrors.exp = 'Experience must be between 0 and 50 years';
        } else {
          delete newErrors.exp;
        }
        break;
        
      case 'deadline':
        if (!value) {
          newErrors.deadline = 'Application deadline is required';
        } else if (new Date(value) <= new Date()) {
          newErrors.deadline = 'Deadline must be in the future';
        } else {
          delete newErrors.deadline;
        }
        break;
        
      case 'jobDescription':
        if (value && value.length > 2000) {
          newErrors.jobDescription = 'Description must be less than 2000 characters';
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

  const handleFieldBlur = (name, value) => {
    setTouched({ ...touched, [name]: true });
    validateField(name, value);
  };

  const clearAll = () => {
    title.current.value = "";
    exp.current.value = "";
    mode.current.value = "onsite";
    jobType.current.value = "full time";
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
    
    toast.success("🧹 Form cleared successfully!", {
      description: "All fields have been reset",
    });
  }

  const validateForm = () => {
    const titleValue = title.current.value;
    const expValue = exp.current.value;
    const deadlineValue = deadline.current.value;
    const descriptionValue = jobDescription.current.value;
    
    const isValid = (
      validateField('title', titleValue) &&
      validateField('exp', expValue) &&
      validateField('deadline', deadlineValue) &&
      validateField('jobDescription', descriptionValue)
    );
    
    // Mark all fields as touched to show validation errors
    setTouched({
      title: true,
      exp: true,
      deadline: true,
      jobDescription: true
    });
    
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("❌ Please fix the validation errors", {
        description: "Check the highlighted fields and try again",
        duration: 4000,
      });
      return;
    }

    const jobData = {
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
    };

    setFormData(jobData);
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setLoading(true);
    setShowConfirmModal(false);

    try {
      const response = await axios.post("http://localhost:5001/api/job/create", formData);
      
      if (response.status === 200 || response.status === 201) {
        toast.success("🎉 Job posted successfully!", {
          description: "Your job posting is now live and visible to candidates",
          duration: 5000,
        });
        clearAll();
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Error posting job", {
        description: "Please check your connection and try again",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRequirement = (e) => {
    e.preventDefault();
    const value = requirement.current.value.trim();
    if (!value) {
      toast.error("Please enter a requirement");
      return;
    }
    if (value.length < 5) {
      toast.error("Requirement must be at least 5 characters long");
      return;
    }
    if (requirements.includes(value)) {
      toast.error("This requirement already exists");
      return;
    }
    setRequirements([...requirements, value]);
    toast.success("✅ Requirement added successfully");
    requirement.current.value = "";
  }

  const handleAddQualification = (e) => {
    e.preventDefault();
    const value = qualification.current.value.trim();
    if (!value) {
      toast.error("Please enter a qualification");
      return;
    }
    if (value.length < 5) {
      toast.error("Qualification must be at least 5 characters long");
      return;
    }
    if (qualifications.includes(value)) {
      toast.error("This qualification already exists");
      return;
    }
    setQualifications([...qualifications, value]);
    toast.success("✅ Qualification added successfully");
    qualification.current.value = "";
  }

  const handleAddResponsibility = (e) => {
    e.preventDefault();
    const value = responsibility.current.value.trim();
    if (!value) {
      toast.error("Please enter a responsibility");
      return;
    }
    if (value.length < 5) {
      toast.error("Responsibility must be at least 5 characters long");
      return;
    }
    if (responsibilities.includes(value)) {
      toast.error("This responsibility already exists");
      return;
    }
    setResponsibilities([...responsibilities, value]);
    toast.success("✅ Responsibility added successfully");
    responsibility.current.value = "";
  }

  const handleAddTag = (e) => {
    e.preventDefault();
    const value = tag.current.value.trim();
    if (!value) {
      toast.error("Please enter a tag");
      return;
    }
    if (value.length < 2) {
      toast.error("Tag must be at least 2 characters long");
      return;
    }
    if (tags.includes(value)) {
      toast.error("This tag already exists");
      return;
    }
    if (tags.length >= 10) {
      toast.error("Maximum 10 tags allowed");
      return;
    }
    setTags([...tags, value]);
    toast.success("✅ Tag added successfully");
    tag.current.value = "";
  }

  const handleDeleteRequirement = (index) => {
    setRequirements(requirements.filter((_, i) => i !== index));
    toast.success("🗑️ Requirement removed");
  }

  const handleDeleteQualification = (index) => {
    setQualifications(qualifications.filter((_, i) => i !== index));
    toast.success("🗑️ Qualification removed");
  }

  const handleDeleteResponsibility = (index) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
    toast.success("🗑️ Responsibility removed");
  }

  const handleDeleteTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
    toast.success("🗑️ Tag removed");
  }

  const handleKeyPress = (e, handler) => {
    if (e.key === 'Enter') {
      handler(e);
    }
  }

  const ConfirmationModal = () => {
    if (!showConfirmModal) return null;

    return (
      <div className="modal-overlay">
        <div className="confirmation-modal">
          <div className="modal-header">
            <div className="modal-icon">🚀</div>
            <h3>Confirm Job Posting</h3>
            <p>Are you sure you want to post this job? Once posted, it will be visible to all candidates.</p>
          </div>
          
          <div className="modal-content">
            <div className="job-preview">
              <h4>📋 Job Preview</h4>
              <div className="preview-item">
                <strong>Title:</strong> {formData?.JobTitle}
              </div>
              <div className="preview-item">
                <strong>Type:</strong> {formData?.JobType}
              </div>
              <div className="preview-item">
                <strong>Mode:</strong> {formData?.JobMode}
              </div>
              <div className="preview-item">
                <strong>Experience:</strong> {formData?.JobExperienceYears} years
              </div>
              <div className="preview-item">
                <strong>Deadline:</strong> {formData?.JobDeadline ? new Date(formData.JobDeadline).toLocaleDateString() : 'Not set'}
              </div>
              <div className="preview-item">
                <strong>Requirements:</strong> {requirements.length} items
              </div>
              <div className="preview-item">
                <strong>Qualifications:</strong> {qualifications.length} items
              </div>
              <div className="preview-item">
                <strong>Responsibilities:</strong> {responsibilities.length} items
              </div>
              <div className="preview-item">
                <strong>Tags:</strong> {tags.length} items
              </div>
            </div>
          </div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={() => setShowConfirmModal(false)}
            >
              ❌ Cancel
            </button>
            <button 
              type="button" 
              className="btn-confirm" 
              onClick={confirmSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Posting...
                </>
              ) : (
                <>
                  ✅ Confirm & Post
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="job-form-wrapper">
      <div className="job-form-header">
        <h1 className="form-title">Create New Job Posting</h1>
        <p className="form-subtitle">Fill in the details below to post a new job opportunity</p>
      </div>

      <div className="job-form-component">
        <form onSubmit={handleSubmit}>
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
                <label className="form-label">Job Title <span className="required">*</span></label>
                <input 
                  type="text" 
                  ref={title} 
                  className={`form-input ${errors.title && touched.title ? 'error' : ''}`}
                  placeholder="e.g. Senior Software Engineer"
                  onBlur={(e) => handleFieldBlur('title', e.target.value)}
                  onChange={(e) => touched.title && validateField('title', e.target.value)}
                />
                {errors.title && touched.title && (
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
                  className={`form-input ${errors.exp && touched.exp ? 'error' : ''}`}
                  placeholder="e.g. 3"
                  min="0"
                  max="50"
                  onBlur={(e) => handleFieldBlur('exp', e.target.value)}
                  onChange={(e) => touched.exp && validateField('exp', e.target.value)}
                />
                {errors.exp && touched.exp && (
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
                <label className="form-label">Application Deadline <span className="required">*</span></label>
                <input 
                  type="date" 
                  ref={deadline} 
                  className={`form-input ${errors.deadline && touched.deadline ? 'error' : ''}`}
                  min={new Date().toISOString().split('T')[0]}
                  onBlur={(e) => handleFieldBlur('deadline', e.target.value)}
                  onChange={(e) => touched.deadline && validateField('deadline', e.target.value)}
                />
                {errors.deadline && touched.deadline && (
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
                className={`form-textarea ${errors.jobDescription && touched.jobDescription ? 'error' : ''}`}
                placeholder="Describe the role, company culture, and what makes this opportunity exciting..."
                rows="8"
                onBlur={(e) => handleFieldBlur('jobDescription', e.target.value)}
                onChange={(e) => touched.jobDescription && validateField('jobDescription', e.target.value)}
              />
              {errors.jobDescription && touched.jobDescription && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errors.jobDescription}
                </div>
              )}
              <div className="character-count">
                {jobDescription.current?.value?.length || 0} / 2000 characters
              </div>
            </div>
          </div>

          {/* Requirements Section */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">✅</div>
              <div>
                <h3 className="section-title">Requirements</h3>
                <p className="section-description">Technical skills and qualifications needed ({requirements.length} added)</p>
              </div>
            </div>
            
            <div className="add-item-group">
              <input 
                type="text" 
                ref={requirement} 
                className="add-item-input" 
                placeholder="e.g. 3+ years experience with React.js"
                onKeyPress={(e) => handleKeyPress(e, handleAddRequirement)}
              />
              <button type="button" className="add-item-btn" onClick={handleAddRequirement}>
                ➕ Add Requirement
              </button>
            </div>
            
            <div className="items-container">
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
              {requirements.length === 0 && (
                <div className="empty-state">
                  <span className="empty-icon">📝</span>
                  <p>No requirements added yet. Add some technical skills or qualifications.</p>
                </div>
              )}
            </div>
          </div>

          {/* Qualifications Section */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">🎓</div>
              <div>
                <h3 className="section-title">Qualifications</h3>
                <p className="section-description">Educational background and certifications ({qualifications.length} added)</p>
              </div>
            </div>
            
            <div className="add-item-group">
              <input 
                type="text" 
                ref={qualification} 
                className="add-item-input" 
                placeholder="e.g. Bachelor's degree in Computer Science"
                onKeyPress={(e) => handleKeyPress(e, handleAddQualification)}
              />
              <button type="button" className="add-item-btn" onClick={handleAddQualification}>
                ➕ Add Qualification
              </button>
            </div>
            
            <div className="items-container">
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
              {qualifications.length === 0 && (
                <div className="empty-state">
                  <span className="empty-icon">🎓</span>
                  <p>No qualifications added yet. Add educational requirements or certifications.</p>
                </div>
              )}
            </div>
          </div>

          {/* Responsibilities Section */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">🎯</div>
              <div>
                <h3 className="section-title">Responsibilities</h3>
                <p className="section-description">Key duties and expectations for this role ({responsibilities.length} added)</p>
              </div>
            </div>
            
            <div className="add-item-group">
              <input 
                type="text" 
                ref={responsibility} 
                className="add-item-input" 
                placeholder="e.g. Design and develop scalable web applications"
                onKeyPress={(e) => handleKeyPress(e, handleAddResponsibility)}
              />
              <button type="button" className="add-item-btn" onClick={handleAddResponsibility}>
                ➕ Add Responsibility
              </button>
            </div>
            
            <div className="items-container">
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
              {responsibilities.length === 0 && (
                <div className="empty-state">
                  <span className="empty-icon">🎯</span>
                  <p>No responsibilities added yet. Add key duties and expectations.</p>
                </div>
              )}
            </div>
          </div>

          {/* Tags Section */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">🏷️</div>
              <div>
                <h3 className="section-title">Tags</h3>
                <p className="section-description">Keywords to help candidates find this job ({tags.length}/10 added)</p>
              </div>
            </div>
            
            <div className="add-item-group">
              <input 
                type="text" 
                ref={tag} 
                className="add-item-input" 
                placeholder="e.g. JavaScript, Frontend, React"
                onKeyPress={(e) => handleKeyPress(e, handleAddTag)}
                disabled={tags.length >= 10}
              />
              <button 
                type="button" 
                className="add-item-btn" 
                onClick={handleAddTag}
                disabled={tags.length >= 10}
              >
                ➕ Add Tag
              </button>
            </div>
            
            <div className="items-container tags-container">
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
              {tags.length === 0 && (
                <div className="empty-state">
                  <span className="empty-icon">🏷️</span>
                  <p>No tags added yet. Add keywords to help candidates find this job.</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Section */}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={clearAll}>
              🗑️ Clear All
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              🚀 Post Job
            </button>
          </div>
        </form>
      </div>
      
      <ConfirmationModal />
    </div>
  );
}

export default JobFormComponent;