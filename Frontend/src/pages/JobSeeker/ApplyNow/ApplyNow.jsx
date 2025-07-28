import React, { useState, useEffect } from 'react';
import './ApplyNow.css';
import { FaCalendarAlt } from 'react-icons/fa';

const ApplyJobForm = ({ jobId, userId, JobTitle, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        nic: '',
        email: '',
        phoneNumber: '',
        address: '',
        birthday: '', 
        gender: '',
        technicalSkills: [{ name: '', proficiency: 1 }],
        socialLinks: { linkedIn: '', github: '', portfolio: '' },
        education: [{
            institute: '',
            educationLevel: '',
            fieldOfStudy: '',
            gpaOrGrade: '',
            results: [{ subject: '', grade: '' }],
            startDate: '',
            endDate: '',
            currentlyStudying: false,
            alYear: '',
            alSubjects: [{ subject: '', grade: '' }]
        }],
        workExperience: [{
            jobTitle: '',
            company: '',
            industry: '',
            startDate: '',
            endDate: '',
            currentlyWorking: false,
            description: ''
        }],
        projects: [{
            title: '',
            description: '',
            technologies: [],
            link: ''
        }],
        certifications: [{
            name: '',
            issuer: '',
            year: ''
        }],
        coverLetter: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [isFormDirty, setIsFormDirty] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Field validation helpers
    const validateYear = (value) => {
        if (!value) return true;
        
        if (!/^\d+$/.test(value)) {
            return false;
        }
        
        if (value.length > 4) {
            return false;
        }
        
        const currentYear = new Date().getFullYear();
        const inputYear = parseInt(value);
        if (value.length === 4 && inputYear > currentYear) {
            return false;
        }
        
        return true;
    };

    const validateURL = (url) => {
        if (!url) return true;
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const validateTextOnly = (value) => {
        if (!value) return true;
        return /^[a-zA-Z\s\.',-/&()]+$/.test(value);
    };

    const getTodayString = () => {
        return new Date().toISOString().split('T')[0];
    };

    // Helper function to check if any field in an object has content
    const hasAnyContent = (obj, fields) => {
        return fields.some(field => {
            const value = obj[field];
            if (Array.isArray(value)) {
                return value.length > 0 && value.some(item => 
                    typeof item === 'string' ? item.trim() : 
                    typeof item === 'object' ? Object.values(item).some(v => v && v.toString().trim()) : 
                    item
                );
            }
            return value && value.toString().trim();
        });
    };

    // Validation functions for Add buttons
    const canAddEducation = () => {
        if (formData.education.length === 0) return true;
        const lastEdu = formData.education[formData.education.length - 1];
        
        if (!lastEdu.institute?.trim() || !lastEdu.educationLevel?.trim()) {
            return false;
        }
        
        if (lastEdu.educationLevel === 'A/L') {
            if (!lastEdu.fieldOfStudy?.trim() || !lastEdu.alYear?.trim()) {
                return false;
            }
            const validSubjects = (lastEdu.alSubjects || []).filter(sub => 
                sub.subject?.trim() && sub.grade?.trim()
            );
            return validSubjects.length > 0;
        }
        
        if (['Diploma', 'Bachelor\'s', 'Master\'s', 'PhD'].includes(lastEdu.educationLevel)) {
            const hasRequiredFields = lastEdu.fieldOfStudy?.trim() && 
                                    lastEdu.gpaOrGrade?.trim() && 
                                    lastEdu.startDate?.trim();
            
            if (lastEdu.currentlyStudying) {
                return hasRequiredFields;
            }
            
            return hasRequiredFields && lastEdu.endDate?.trim();
        }
        
        return true;
    };

    const canAddExperience = () => {
        if (formData.workExperience.length === 0) return true;
        const lastExp = formData.workExperience[formData.workExperience.length - 1];
        
        const hasRequiredFields = lastExp.jobTitle?.trim() && 
                                 lastExp.company?.trim() && 
                                 lastExp.startDate?.trim();
        
        if (lastExp.currentlyWorking) {
            return hasRequiredFields;
        }
        
        return hasRequiredFields && lastExp.endDate?.trim();
    };

    const canAddProject = () => {
        if (formData.projects.length === 0) return true;
        const lastProject = formData.projects[formData.projects.length - 1];
        
        return lastProject.title?.trim() && 
               lastProject.technologies?.length > 0 && 
               lastProject.link?.trim();
    };

    const canAddCertification = () => {
        if (formData.certifications.length === 0) return true;
        const lastCert = formData.certifications[formData.certifications.length - 1];
        
        return lastCert.name?.trim() && lastCert.issuer?.trim() && lastCert.year?.trim();
    };

    // Validation functions
    const validateField = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'fullName':
                const nameRegex = /^[a-zA-Z\s\.',-]*$/;
                if (!value.trim()) {
                    newErrors[name] = 'Full name is required';
                } else if (!nameRegex.test(value)) {
                    newErrors[name] = 'Name can only contain letters, spaces, and common punctuation';
                } else if (value.trim().length < 2) {
                    newErrors[name] = 'Name must be at least 2 characters long';
                } else if (value.trim().length > 50) {
                    newErrors[name] = 'Name must be less than 50 characters';
                } else {
                    delete newErrors[name];
                }
                break;

            case 'nic':
                const nicRegex = /^(\d{12}|\d{9}[VXvx])$/;
                if (!value.trim()) {
                    newErrors[name] = 'NIC is required';
                } else if (!nicRegex.test(value.trim())) {
                    newErrors[name] = 'Invalid NIC format. Use 9 digits + V/X or 12 digits';
                } else {
                    delete newErrors[name];
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value.trim()) {
                    newErrors[name] = 'Email is required';
                } else if (!emailRegex.test(value.trim())) {
                    newErrors[name] = 'Please enter a valid email address';
                } else {
                    delete newErrors[name];
                }
                break;

            case 'phoneNumber':
                const phoneRegex = /^(0[1-9]\d{8}|\+94[1-9]\d{8})$/;
                if (!value.trim()) {
                    newErrors[name] = 'Phone number is required';
                } else if (!phoneRegex.test(value.trim())) {
                    newErrors[name] = 'Invalid phone number. Use 0771234567 or +94771234567 format';
                } else {
                    delete newErrors[name];
                }
                break;

            case 'address':
                if (!value.trim()) {
                    newErrors[name] = 'Address is required';
                } else if (value.trim().length < 10) {
                    newErrors[name] = 'Please provide a complete address';
                } else if (value.trim().length > 200) {
                    newErrors[name] = 'Address is too long';
                } else {
                    delete newErrors[name];
                }
                break;

                case 'birthday':
    if (!value.trim()) {
        newErrors[name] = 'Birthday is required';
    } else {
        const birthDate = new Date(value);
        const today = new Date();
        if (birthDate >= today) {
            newErrors[name] = 'Birthday cannot be today or in the future';
        } else {
            delete newErrors[name];
        }
    }
    break;

case 'gender':
    if (!value.trim()) {
        newErrors[name] = 'Gender is required';
    } else {
        delete newErrors[name];
    }
    break;

            default:
                break;
        }

        setErrors(newErrors);
        return !newErrors[name];
    };

    const validateSkills = () => {
        const validSkills = formData.technicalSkills.filter(skill => skill.name.trim());
        if (validSkills.length === 0) {
            setErrors(prev => ({ ...prev, technicalSkills: 'At least one technical skill is required' }));
            return false;
        } else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.technicalSkills;
                return newErrors;
            });
            return true;
        }
    };

    // Updated validation functions for optional sections
    const validateWorkExperience = () => {
        // Check if any work experience entry has any content
        const hasAnyWorkExperience = formData.workExperience.some(exp => 
            hasAnyContent(exp, ['jobTitle', 'company', 'startDate', 'endDate', 'description'])
        );
        
        // If no work experience at all, it's valid (optional)
        if (!hasAnyWorkExperience) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.workExperience;
                return newErrors;
            });
            return true;
        }
        
        // If there's content, validate that at least one entry is complete
        const validWorkExperience = formData.workExperience.filter(exp => {
            const hasRequiredFields = exp.jobTitle?.trim() && exp.company?.trim() && exp.startDate?.trim();
            return hasRequiredFields && (exp.currentlyWorking || exp.endDate?.trim());
        });
        
        if (validWorkExperience.length === 0) {
            setErrors(prev => ({ ...prev, workExperience: 'Please complete the work experience entry or remove it' }));
            return false;
        } else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.workExperience;
                return newErrors;
            });
            return true;
        }
    };

    const validateProjects = () => {
        // Check if any project entry has any content
        const hasAnyProjects = formData.projects.some(project => 
            hasAnyContent(project, ['title', 'description', 'technologies', 'link'])
        );
        
        // If no projects at all, it's valid (optional)
        if (!hasAnyProjects) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.projects;
                return newErrors;
            });
            return true;
        }
        
        // If there's content, validate that at least one entry has a title
        const validProjects = formData.projects.filter(project => project.title?.trim());
        
        if (validProjects.length === 0) {
            setErrors(prev => ({ ...prev, projects: 'Please add a project title or remove the entry' }));
            return false;
        } else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.projects;
                return newErrors;
            });
            return true;
        }
    };

    const validateCertifications = () => {
        // Check if any certification entry has any content
        const hasAnyCertifications = formData.certifications.some(cert =>
            hasAnyContent(cert, ['name', 'issuer', 'year'])
        );
        
        // If no certifications at all, it's valid (optional)
        if (!hasAnyCertifications) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.certifications;
                return newErrors;
            });
            return true;
        }
        
        // If there's content, validate that at least one entry is complete
        const validCertifications = formData.certifications.filter(cert =>
            cert.name?.trim() && cert.issuer?.trim() && cert.year?.trim()
        );
        
        if (validCertifications.length === 0) {
            setErrors(prev => ({ ...prev, certifications: 'Please complete the certification entry or remove it' }));
            return false;
        } else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.certifications;
                return newErrors;
            });
            return true;
        }
    };

    // Mock data loading for demonstration
    useEffect(() => {
        const mockProfile = {
            fullName: '',
            nic: '',
            email: '',
            phoneNumber: '',
            address: '',
            birthday: '',
            gender: '',
            technicalSkills: [{ name: '', proficiency: 1 }],
            socialLinks: { linkedIn: '', github: '', portfolio: '' },
            education: [{
                        institute: '',
                educationLevel: '',
                fieldOfStudy: '',
                gpaOrGrade: '',
                results: [{ subject: '', grade: '' }],
                        startDate: '',
                        endDate: '',
                currentlyStudying: false,
                alYear: '',
                alSubjects: [{ subject: '', grade: '' }]
                    }],
            workExperience: [{
                        jobTitle: '',
                        company: '',
                industry: '',
                        startDate: '',
                        endDate: '',
                currentlyWorking: false,
                description: ''
            }],
            projects: [{
                title: '',
                        description: '',
                technologies: [],
                link: ''
            }],
            certifications: [{
                name: '',
                issuer: '',
                year: ''
            }]
        };

        setFormData({ ...formData, ...mockProfile });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        if (name === 'fullName') {
            processedValue = value.replace(/[^a-zA-Z\s\.',-]/g, '');
        } else if (name === 'nic') {
            processedValue = value.replace(/[^0-9VXvx]/g, '');
            if (processedValue.length === 10) {
                const lastChar = processedValue.slice(-1);
                if (['V', 'X', 'v', 'x'].includes(lastChar)) {
                    processedValue = processedValue.slice(0, 9) + lastChar;
                }
            }
        } else if (name === 'phoneNumber') {
            processedValue = value.replace(/[^0-9+]/g, '');
            if (processedValue.startsWith('+94')) {
                processedValue = processedValue.slice(0, 12);
            } else if (processedValue.startsWith('0')) {
                processedValue = processedValue.slice(0, 10);
            }
        }

        setFormData({ ...formData, [name]: processedValue });
        setIsFormDirty(true);
        validateField(name, processedValue);
    };

    const handleArrayChange = (field, index, value) => {
        if (field === 'technicalSkills') {
            const updated = [...formData.technicalSkills];
        updated[index] = value;
            setFormData({ ...formData, technicalSkills: updated });
        setIsFormDirty(true);
            setTimeout(() => validateSkills(), 100);
            return;
        }
        const updated = [...formData[field]];
        updated[index] = value;
        setFormData({ ...formData, [field]: updated });
        setIsFormDirty(true);
    };

    const handleNestedChange = (field, index, key, value) => {
        const updated = [...formData[field]];
        
        // Year field validation
        if (key === 'year' || key === 'alYear') {
            const cleanValue = value.replace(/[^\d]/g, '').slice(0, 4);
            
            if (!validateYear(cleanValue)) {
                setErrors(prev => ({
                    ...prev,
                    [`${field}_${index}_${key}`]: 'Enter a valid year'
                }));
                return;
            } else {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[`${field}_${index}_${key}`];
                    return newErrors;
                });
            }
            value = cleanValue;
        }
        
        // Text-only field validation
        if (key === 'jobTitle' || key === 'fieldOfStudy' || key === 'subject') {
            if (value && !validateTextOnly(value)) {
                setErrors(prev => ({
                    ...prev,
                    [`${field}_${index}_${key}`]: 'This field cannot contain numbers'
                }));
                return;
            } else {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[`${field}_${index}_${key}`];
                    return newErrors;
                });
            }
        }
        
        // Link validation
        if (key === 'link') {
            if (value && !validateURL(value)) {
                setErrors(prev => ({
                    ...prev,
                    [`${field}_${index}_${key}`]: 'Please enter a valid URL'
                }));
            } else {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[`${field}_${index}_${key}`];
                    return newErrors;
                });
            }
        }
        
        // Date validation for start and end dates
        if (key === 'startDate' || key === 'endDate') {
            const today = new Date().toISOString().split('T')[0];
            
            if (value > today) {
                return;
            }
            
            if (key === 'endDate' && updated[index].startDate && value < updated[index].startDate) {
                return;
            }
            
            if (key === 'startDate' && updated[index].endDate && value > updated[index].endDate) {
                updated[index].endDate = '';
            }
        }
        
        updated[index][key] = value;

    if (key === 'currentlyStudying' || key === 'currentlyWorking') {
        if (value === true) {
                updated[index]['endDate'] = '';
        }
    }

        setFormData({ ...formData, [field]: updated });
        setIsFormDirty(true);
    };

    // Handle A/L subjects
    const handleALSubjectChange = (eduIndex, subjectIndex, field, value) => {
        const updated = [...formData.education];
        if (!updated[eduIndex].alSubjects) {
            updated[eduIndex].alSubjects = [{ subject: '', grade: '' }];
        }
        
        if (field === 'subject') {
            if (value && !validateTextOnly(value)) {
                setErrors(prev => ({
                    ...prev,
                    [`education_${eduIndex}_subject_${subjectIndex}`]: 'Subject cannot contain numbers'
                }));
                return;
            } else {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[`education_${eduIndex}_subject_${subjectIndex}`];
                    return newErrors;
                });
            }
        }
        
        updated[eduIndex].alSubjects[subjectIndex][field] = value;
        setFormData({ ...formData, education: updated });
        setIsFormDirty(true);
    };

    const addALSubject = (eduIndex) => {
        const updated = [...formData.education];
        if (!updated[eduIndex].alSubjects) {
            updated[eduIndex].alSubjects = [];
        }
        updated[eduIndex].alSubjects.push({ subject: '', grade: '' });
        setFormData({ ...formData, education: updated });
        setIsFormDirty(true);
    };

    const removeALSubject = (eduIndex, subjectIndex) => {
        const updated = [...formData.education];
        if (updated[eduIndex].alSubjects && updated[eduIndex].alSubjects.length > 1) {
            updated[eduIndex].alSubjects.splice(subjectIndex, 1);
            setFormData({ ...formData, education: updated });
            setIsFormDirty(true);
        }
    };

    const addItem = (field, newItem) => {
        setFormData({ ...formData, [field]: [...formData[field], newItem] });
        setIsFormDirty(true);
    };

    const removeItem = (field, index) => {
        if (formData[field].length > 1) {
            const newArray = formData[field].filter((_, i) => i !== index);
            setFormData({ ...formData, [field]: newArray });
            setIsFormDirty(true);
        }
    };

    const validateForm = () => {
        let isValid = true;
        const requiredFields = ['fullName', 'nic', 'email', 'phoneNumber', 'address', 'birthday', 'gender'];
        
        requiredFields.forEach(field => {
            if (!validateField(field, formData[field])) {
                isValid = false;
            }
        });

        if (!validateSkills()) isValid = false;
        
        // Validate optional sections - they only need validation if they have content
        if (!validateWorkExperience()) isValid = false;
        if (!validateProjects()) isValid = false;
        if (!validateCertifications()) isValid = false;

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Filter out empty optional sections before submitting
            const submissionData = {
                    ...formData,
                technicalSkills: formData.technicalSkills.filter(skill => skill.name && skill.name.trim()),
                workExperience: formData.workExperience.filter(exp => 
                    hasAnyContent(exp, ['jobTitle', 'company', 'startDate', 'endDate', 'description'])
                ),
                projects: formData.projects.filter(project => 
                    hasAnyContent(project, ['title', 'description', 'technologies', 'link'])
                ),
                certifications: formData.certifications.filter(cert => 
                    hasAnyContent(cert, ['name', 'issuer', 'year'])
                )
            };

            // Make real API call to submit application
            const response = await fetch('http://localhost:5001/api/applications/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobId: jobId,
                    userId: userId,
                    applicationData: submissionData
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit application');
            }

            const result = await response.json();
            console.log('Application submitted successfully:', result);

            setSubmitSuccess(true);
            setShowSuccess(true);
            setIsFormDirty(false);
            if (onSuccess) {
                setTimeout(() => onSuccess(), 3000);
            }
        } catch (err) {
            console.error('Submission failed:', err);
            alert(`Submission failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

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

    if (showSuccess) {
        return (
            <div className="apply-form-overlay">
                <div className="success-modal">
                    <div className="success-content">
                        <div className="success-icon">✅</div>
                        <h2>Application Submitted!</h2>
                        <p>Your application for <strong>{JobTitle}</strong> has been submitted.</p>
                        <div className="success-actions">
                            <button onClick={() => onSuccess ? onSuccess() : onClose()} className="success-btn">
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
                    <strong><h2>Apply for: {JobTitle}</h2></strong>
                    <button
                        onClick={() => isFormDirty && !submitSuccess ? setShowWarning(true) : onClose()}
                        className="close-btn"
                    >
                        ❌
                    </button>
                </div>

                <form className="apply-form" onSubmit={handleSubmit}>
                    {/* Personal Info */}
                    <div className="form-section">
                        <h3>Personal Information</h3>

                        <div className="form-group">
                            <label>Full Name *</label>
                            <input
                                name="fullName"
                                value={formData.fullName || ''}
                                onChange={handleChange}
                                className={errors.fullName ? 'error' : ''}
                                placeholder="Enter your full name"
                            />
                            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                        </div>

                        <div className="form-group">
                            <label>NIC *</label>
                            <input
                                name="nic"
                                value={formData.nic || ''}
                                onChange={handleChange}
                                className={errors.nic ? 'error' : ''}
                                placeholder="123456789V or 123456789012"
                                maxLength="12"
                            />
                            {errors.nic && <span className="error-message">{errors.nic}</span>}
                        </div>

                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                className={errors.email ? 'error' : ''}
                                placeholder="your.email@example.com"
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label>Phone Number *</label>
                            <input
                                name="phoneNumber"
                                value={formData.phoneNumber || ''}
                                onChange={handleChange}
                                className={errors.phoneNumber ? 'error' : ''}
                                placeholder="0771234567 or +94771234567"
                            />
                            {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                        </div>

                        <div className="form-group">
                            <label>Address *</label>
                            <textarea
                                name="address"
                                value={formData.address || ''}
                                onChange={handleChange}
                                className={errors.address ? 'error' : ''}
                                placeholder="Enter your complete address"
                            />
                            {errors.address && <span className="error-message">{errors.address}</span>}
                        </div>

                        <div className="form-group">
    <label>Birthday *</label>
                            <div className="simple-date-picker">
                <input 
                                    type="date"
                                    name="birthday"
                                    value={formData.birthday || ''}
                                    onChange={handleChange}
                    className={errors.birthday ? 'error' : ''}
                                    max={new Date().toISOString().split('T')[0]}
                />
                                <FaCalendarAlt className="calendar-icon-simple" />
            </div>
    {errors.birthday && <span className="error-message">{errors.birthday}</span>}
                            <div className="age-display">
                                <label>Age: </label>
                                <input value={calculateAge(formData.birthday)} readOnly className="age-input" />
                            </div>
</div>

<div className="form-group">
    <label>Gender *</label>
    <select
        name="gender"
                                value={formData.gender || ''}
        onChange={handleChange}
        className={errors.gender ? 'error' : ''}
    >
        <option value="" disabled hidden>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Prefer not to say">Prefer not to say</option>
    </select>
    {errors.gender && <span className="error-message">{errors.gender}</span>}
</div>
                    </div>

                    {/* Skills & Social Links */}
                    <div className="form-section">
                        <h3>Skills & Social Links</h3>

                        {/* Technical Skills */}
                        <div className="form-group">
                            <label>Technical Skills *</label>
                            {errors.technicalSkills && <span className="error-message">{errors.technicalSkills}</span>}

                            {/* Add new skill input row (always on top) */}
                            <div className="skill-input-container">
                                <div className="skill-input-row">
                                <input
                                        value={formData.technicalSkills[formData.technicalSkills.length - 1].name || ''}
                                        onChange={e => handleArrayChange('technicalSkills', formData.technicalSkills.length - 1, { ...formData.technicalSkills[formData.technicalSkills.length - 1], name: e.target.value })}
                                        placeholder="Enter a technical skill"
                                        className="skill-name-input"
                                    />
                                    <div className="proficiency-container">
                                        <label className="proficiency-label">Proficiency (1-5):</label>
                                        <select
                                            value={formData.technicalSkills[formData.technicalSkills.length - 1].proficiency || 1}
                                            onChange={e => handleArrayChange('technicalSkills', formData.technicalSkills.length - 1, { ...formData.technicalSkills[formData.technicalSkills.length - 1], proficiency: Number(e.target.value) })}
                                            className="proficiency-select"
                                        >
                                            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                                        </select>
                                    </div>
                                    <div className="skill-actions">
                                <button
                                    type="button"
                                            className="add-skill-btn"
                                            onClick={() => addItem('technicalSkills', { name: '', proficiency: 1 })}
                                            disabled={!formData.technicalSkills[formData.technicalSkills.length - 1].name.trim()}
                                            title="Add new skill"
                                >
                                    +
                                </button>
                                    </div>
                                </div>
                            </div>

                            {/* List of added skills (read-only, with remove) */}
                            {formData.technicalSkills.slice(0, -1).map((skill, i) => (
                                <div key={i} className="skill-input-container">
                                    <div className="skill-input-row">
                                    <input
                                            value={skill.name}
                                        readOnly
                                            className="skill-name-input"
                                        />
                                        <div className="proficiency-container">
                                            <label className="proficiency-label">Proficiency (1-5):</label>
                                            <select value={skill.proficiency} className="proficiency-select" disabled>
                                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                                            </select>
                                        </div>
                                        <div className="skill-actions">
                                            <button
                                                type="button"
                                                className="remove-skill-btn"
                                                onClick={() => removeItem('technicalSkills', i)}
                                                title="Remove skill"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social Links */}
                        <div className="form-group">
                            <label>Social Links</label>
                                <input
                                name="linkedIn"
                                value={formData.socialLinks?.linkedIn || ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    socialLinks: { ...formData.socialLinks, linkedIn: e.target.value }
                                })}
                                placeholder="LinkedIn URL"
                                className="social-link-input"
                            />
                            <input
                                name="github"
                                value={formData.socialLinks?.github || ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    socialLinks: { ...formData.socialLinks, github: e.target.value }
                                })}
                                placeholder="GitHub URL"
                                className="social-link-input"
                            />
                            <input
                                name="portfolio"
                                value={formData.socialLinks?.portfolio || ''}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    socialLinks: { ...formData.socialLinks, portfolio: e.target.value }
                                })}
                                placeholder="Portfolio URL"
                                className="social-link-input"
                            />
                        </div>
                            </div>

                    {/* Education Section */}
                    <div className="form-section">
                        <h3>Education</h3>
                        {formData.education.map((edu, i) => (
                            <div key={i} className="education-entry">
                                <div className="form-group">
                                    <input
                                        placeholder="Institute Name"
                                        value={edu.institute || ''}
                                        onChange={e => handleNestedChange('education', i, 'institute', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <select
                                        value={edu.educationLevel || ''}
                                        onChange={e => handleNestedChange('education', i, 'educationLevel', e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Select Level</option>
                                        <option value="A/L">A/L</option>
                                        <option value="Diploma">Diploma</option>
                                        <option value="Bachelor's">Bachelor's</option>
                                        <option value="Master's">Master's</option>
                                        <option value="PhD">PhD</option>
                                    </select>
                    </div>

                                {/* A/L specific fields */}
                                {edu.educationLevel === 'A/L' && (
                                    <>
                                        <div className="form-group">
                                <input
                                                placeholder="Subject Stream"
                                                value={edu.fieldOfStudy || ''}
                                                onChange={e => handleNestedChange('education', i, 'fieldOfStudy', e.target.value)}
                                                className={errors[`education_${i}_fieldOfStudy`] ? 'error' : ''}
                                                required
                                            />
                                            {errors[`education_${i}_fieldOfStudy`] && (
                                                <span className="error-message">{errors[`education_${i}_fieldOfStudy`]}</span>
                                            )}
                                        </div>
                                        <div className="form-group">
                                <input
                                                placeholder="Year (e.g., 2020)"
                                                value={edu.alYear || ''}
                                                onChange={e => handleNestedChange('education', i, 'alYear', e.target.value)}
                                                className={errors[`education_${i}_alYear`] ? 'error' : ''}
                                                required
                                            />
                                            {errors[`education_${i}_alYear`] && (
                                                <span className="error-message">{errors[`education_${i}_alYear`]}</span>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label>A/L Subjects and Grades</label>
                                            
                                            {/* Add new subject input row (always on top) */}
                                            <div className="skill-input-container">
                                                <div className="skill-input-row">
                                                    <div style={{ flex: 1 }}>
                                                        <input
                                                            placeholder="Subject"
                                                            value={(edu.alSubjects && edu.alSubjects[edu.alSubjects.length - 1]?.subject) || ''}
                                                            onChange={e => handleALSubjectChange(i, (edu.alSubjects?.length || 1) - 1, 'subject', e.target.value)}
                                                            className={`skill-name-input ${errors[`education_${i}_subject_${(edu.alSubjects?.length || 1) - 1}`] ? 'error' : ''}`}
                                                        />
                                                        {errors[`education_${i}_subject_${(edu.alSubjects?.length || 1) - 1}`] && (
                                                            <span className="error-message" style={{ fontSize: '12px' }}>
                                                                {errors[`education_${i}_subject_${(edu.alSubjects?.length || 1) - 1}`]}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="proficiency-container">
                                                        <label className="proficiency-label">Grade:</label>
                                                        <select
                                                            value={(edu.alSubjects && edu.alSubjects[edu.alSubjects.length - 1]?.grade) || ''}
                                                            onChange={e => handleALSubjectChange(i, (edu.alSubjects?.length || 1) - 1, 'grade', e.target.value)}
                                                            className="proficiency-select"
                                                        >
                                                            <option value="" disabled>Select Grade</option>
                                                            <option value="A">A</option>
                                                            <option value="B">B</option>
                                                            <option value="C">C</option>
                                                            <option value="S">S</option>
                                                            <option value="F">F</option>
                                                        </select>
                                                    </div>
                                                    <div className="skill-actions">
                                <button
                                    type="button"
                                                            className="add-skill-btn"
                                                            onClick={() => addALSubject(i)}
                                                            disabled={
                                                                !edu.alSubjects ||
                                                                !edu.alSubjects[edu.alSubjects.length - 1]?.subject?.trim() ||
                                                                !edu.alSubjects[edu.alSubjects.length - 1]?.grade?.trim()
                                                            }
                                                            title="Add new subject"
                                >
                                    +
                                </button>
                            </div>
                                        </div>
                                        </div>

                                            {/* List of added subjects (read-only, with remove) */}
                                            {(edu.alSubjects || []).slice(0, -1).map((subjectGrade, subIndex) => (
                                                <div key={subIndex} className="skill-input-container">
                                                    <div className="skill-input-row">
                                    <input
                                                            value={subjectGrade.subject || ''}
                                                            readOnly
                                                            className="skill-name-input"
                                                        />
                                                        <div className="proficiency-container">
                                                            <label className="proficiency-label">Grade:</label>
                                                            <select value={subjectGrade.grade || ''} className="proficiency-select" disabled>
                                                                <option value="">Select Grade</option>
                                                                <option value="A">A</option>
                                                                <option value="B">B</option>
                                                                <option value="C">C</option>
                                                                <option value="S">S</option>
                                                                <option value="F">F</option>
                                                            </select>
                            </div>
                                                        <div className="skill-actions">
                                                            <button
                                                                type="button"
                                                                className="remove-skill-btn"
                                                                onClick={() => removeALSubject(i, subIndex)}
                                                                title="Remove subject"
                                                            >
                                                                ×
                                                            </button>
                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Non-A/L fields */}
                                {edu.educationLevel !== 'A/L' && edu.educationLevel !== '' && (
                                    <>
                                        <div className="form-group">
                                    <input
                                                placeholder="Field of Study"
                                                value={edu.fieldOfStudy || ''}
                                                onChange={e => handleNestedChange('education', i, 'fieldOfStudy', e.target.value)}
                                                className={errors[`education_${i}_fieldOfStudy`] ? 'error' : ''}
                                                required={['Diploma', 'Bachelor\'s', 'Master\'s', 'PhD'].includes(edu.educationLevel)}
                                            />
                                            {errors[`education_${i}_fieldOfStudy`] && (
                                                <span className="error-message">{errors[`education_${i}_fieldOfStudy`]}</span>
                                            )}
                                        </div>

                                        <div className="form-group">
                                    <input
                                                placeholder="GPA / Grade"
                                                value={edu.gpaOrGrade || ''}
                                                onChange={e => handleNestedChange('education', i, 'gpaOrGrade', e.target.value)}
                                                required
                                            />
                                </div>

                                        <div className="education-dates-simple">
                                            <div className="date-input-group">
                                                <label>Start Date</label>
                                                <div className="simple-date-picker">
                                                    <input
                                                        type="date"
                                                        value={edu.startDate || ''}
                                                        onChange={e => handleNestedChange('education', i, 'startDate', e.target.value)}
                                                        max={getTodayString()}
                                                        required
                                                    />
                                                    <FaCalendarAlt className="calendar-icon-simple" />
                                    </div>
                                    </div>
                                            <div className="date-input-group">
                                                <label>End Date</label>
                                                <div className="simple-date-picker">
                                                    <input
                                                        type="date"
                                                        value={edu.endDate || ''}
                                                        onChange={e => handleNestedChange('education', i, 'endDate', e.target.value)}
                                                        disabled={edu.currentlyStudying}
                                                        min={edu.startDate || ''}
                                                        max={getTodayString()}
                                                        required={!edu.currentlyStudying}
                                                    />
                                                    <FaCalendarAlt className="calendar-icon-simple" />
                                                </div>
                                            </div>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                                    checked={!!edu.currentlyStudying}
                                                    onChange={e => handleNestedChange('education', i, 'currentlyStudying', e.target.checked)}
                                        />
                                        Currently Studying
                                    </label>
                                </div>
                                    </>
                                )}

                                {formData.education.length > 1 && (
                                    <button className="remove-btn" type="button" onClick={() => removeItem('education', i)}>
                                        Remove Education
                                    </button>
                                )}
                    </div>
                        ))}
                                <button
                                    type="button"
                            className="add-btn" 
                            onClick={() => addItem('education', { 
                                institute: '', 
                                educationLevel: '', 
                                fieldOfStudy: '', 
                                gpaOrGrade: '', 
                                results: [{ subject: '', grade: '' }], 
                                        startDate: '',
                                        endDate: '',
                                currentlyStudying: false,
                                alYear: '',
                                alSubjects: [{ subject: '', grade: '' }]
                                    })}
                            disabled={!canAddEducation()}
                                >
                            + Add Education
                                </button>
                            </div>

                    {/* Work Experience Section */}
                    <div className="form-section">
                        <h3>Work Experience (Optional)</h3>
                        {errors.workExperience && <span className="error-message">{errors.workExperience}</span>}
                        {formData.workExperience.map((exp, i) => (
                            <div key={i} className="work-experience-entry">
                                <div className="work-experience-row">
                                    <div style={{ flex: 1 }}>
                                        <input
                                            placeholder="Job Title"
                                            value={exp.jobTitle || ''}
                                            onChange={e => handleNestedChange('workExperience', i, 'jobTitle', e.target.value)}
                                            className={errors[`workExperience_${i}_jobTitle`] ? 'error' : ''}
                                        />
                                        {errors[`workExperience_${i}_jobTitle`] && (
                                            <span className="error-message">{errors[`workExperience_${i}_jobTitle`]}</span>
                                        )}
                                        </div>
                                    <input
                                        placeholder="Company Name"
                                        value={exp.company || ''}
                                        onChange={e => handleNestedChange('workExperience', i, 'company', e.target.value)}
                                    />
                                </div>

                                <div className="work-experience-dates-simple">
                                    <div className="date-input-group">
                                        <label>Start Date</label>
                                        <div className="simple-date-picker">
                                            <input
                                                type="date"
                                                value={exp.startDate || ''}
                                                onChange={e => handleNestedChange('workExperience', i, 'startDate', e.target.value)}
                                                max={getTodayString()}
                                            />
                                            <FaCalendarAlt className="calendar-icon-simple" />
                                        </div>
                                    </div>
                                    <div className="date-input-group">
                                        <label>End Date</label>
                                        <div className="simple-date-picker">
                                            <input
                                                type="date"
                                                value={exp.endDate || ''}
                                                onChange={e => handleNestedChange('workExperience', i, 'endDate', e.target.value)}
                                                disabled={exp.currentlyWorking}
                                                min={exp.startDate || ''}
                                                max={getTodayString()}
                                            />
                                            <FaCalendarAlt className="calendar-icon-simple" />
                                        </div>
                                    </div>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                            checked={!!exp.currentlyWorking}
                                            onChange={e => handleNestedChange('workExperience', i, 'currentlyWorking', e.target.checked)}
                                    />
                                    Currently Working
                                </label>
                            </div>

                            <textarea
                                placeholder="Job Description"
                                    value={exp.description || ''}
                                    onChange={e => handleNestedChange('workExperience', i, 'description', e.target.value)}
                                />

                                {formData.workExperience.length > 1 && (
                                    <button className="remove-btn" type="button" onClick={() => removeItem('workExperience', i)}>
                                        Remove Experience
                                    </button>
                                )}
                            </div>
                        ))}
                        <button 
                            type="button" 
                            className="add-btn" 
                            onClick={() => addItem('workExperience', { 
                                jobTitle: '', 
                                company: '', 
                                startDate: '', 
                                endDate: '', 
                                currentlyWorking: false, 
                                description: '' 
                            })}
                            disabled={!canAddExperience()}
                        >
                            + Add Experience
                        </button>
                        </div>

                    {/* Projects Section */}
                    <div className="form-section">
                        <h3>Projects (Optional)</h3>
                        {errors.projects && <span className="error-message">{errors.projects}</span>}
                        {formData.projects.map((proj, i) => (
                            <div key={i} className="project-entry">
                                    <input
                                    placeholder="Project Title"
                                    value={proj.title || ''}
                                    onChange={e => handleNestedChange('projects', i, 'title', e.target.value)}
                                />
                                <textarea
                                    placeholder="Description (optional)"
                                    value={proj.description || ''}
                                    onChange={e => handleNestedChange('projects', i, 'description', e.target.value)}
                                    />
                                    <input
                                    placeholder="Technologies (comma separated)"
                                    value={proj.technologies ? proj.technologies.join(', ') : ''}
                                    onChange={e => handleNestedChange('projects', i, 'technologies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                />
                                <div>
                                    <input
                                        placeholder="Project Link (GitHub or Live URL)"
                                        value={proj.link || ''}
                                        onChange={e => handleNestedChange('projects', i, 'link', e.target.value)}
                                        className={errors[`projects_${i}_link`] ? 'error' : ''}
                                    />
                                    {errors[`projects_${i}_link`] && (
                                        <span className="error-message">{errors[`projects_${i}_link`]}</span>
                                    )}
                                </div>
                                {formData.projects.length > 1 && (
                                    <button className="remove-btn" type="button" onClick={() => removeItem('projects', i)}>
                                        Remove Project
                                    </button>
                                )}
                                    </div>
                        ))}
                        <button 
                            type="button" 
                            className="add-btn" 
                            onClick={() => addItem('projects', { title: '', description: '', technologies: [], link: '' })}
                            disabled={!canAddProject()}
                        >
                            + Add Project
                        </button>
                                    </div>

                    {/* Certifications Section */}
                    <div className="form-section">
                        <h3>Certifications (Optional)</h3>
                        {errors.certifications && <span className="error-message">{errors.certifications}</span>}
                        {formData.certifications.map((cert, i) => (
                            <div key={i} className="certification-entry">
                                        <input
                                    placeholder="Certification Name"
                                    value={cert.name || ''}
                                    onChange={e => handleNestedChange('certifications', i, 'name', e.target.value)}
                                />
                                <input
                                    placeholder="Issuer"
                                    value={cert.issuer || ''}
                                    onChange={e => handleNestedChange('certifications', i, 'issuer', e.target.value)}
                                />
                                <div>
                                    <input
                                        placeholder="Year"
                                        value={cert.year || ''}
                                        onChange={e => handleNestedChange('certifications', i, 'year', e.target.value)}
                                        className={errors[`certifications_${i}_year`] ? 'error' : ''}
                                    />
                                    {errors[`certifications_${i}_year`] && (
                                        <span className="error-message">{errors[`certifications_${i}_year`]}</span>
                                    )}
                                </div>
                                {formData.certifications.length > 1 && (
                                    <button className="remove-btn" type="button" onClick={() => removeItem('certifications', i)}>
                                        Remove Certification
                                    </button>
                                )}
                            </div>
                        ))}
                        <button 
                            type="button" 
                            className="add-btn" 
                            onClick={() => addItem('certifications', { name: '', issuer: '', year: '' })}
                            disabled={!canAddCertification()}
                        >
                            + Add Certification
                        </button>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => isFormDirty && !submitSuccess ? setShowWarning(true) : onClose()}
                            className="cancel-btn"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || Object.keys(errors).length > 0}
                            className="submit-btn"
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>

                {showWarning && (
                    <div className="warning-overlay">
                        <div className="warning-dialog">
                            <h3>Are you sure?</h3>
                            <p>All data will be lost.</p>
                            <div className="warning-actions">
                                <button onClick={() => setShowWarning(false)}>Cancel</button>
                                <button onClick={onClose} className="confirm-btn">Yes, Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplyJobForm;