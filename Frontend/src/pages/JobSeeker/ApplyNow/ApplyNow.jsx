import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ApplyNow.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

const ApplyJobForm = ({ jobId, userId, JobTitle, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        nic: '',
        email: '',
        phoneNumber: '',
        address: '',
        birthday: '', 
        gender: '',
        skills: [''],
        education: [{
            institute: '',
            degree: '',
            startDate: '',
            endDate: '',
            currentlyStudying: false
        }],
        summary: '',
        workExperience: [{
            jobTitle: '',
            company: '',
            startDate: '',
            endDate: '',
            description: '',
            currentlyWorking: false
        }],
        certifications: [''],
        coverLetter: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [isFormDirty, setIsFormDirty] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Validation functions
    const validateField = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'fullName':
                // Only allow letters, spaces, and common name characters
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
                // Sri Lankan NIC format: 9 digits + V/X or 12 digits
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
                // Sri Lankan phone number format: 0771234567 or +94771234567
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
        const validSkills = formData.skills.filter(skill => skill.trim());
        if (validSkills.length === 0) {
            setErrors(prev => ({ ...prev, skills: 'At least one skill is required' }));
            return false;
        } else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.skills;
                return newErrors;
            });
            return true;
        }
    };

    const validateEducation = () => {
        const validEducation = formData.education.filter(edu =>
            edu.institute.trim() && edu.degree.trim()
        );
        if (validEducation.length === 0) {
            setErrors(prev => ({ ...prev, education: 'At least one education entry is required' }));
            return false;
        } else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.education;
                return newErrors;
            });
            return true;
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const jobRes = await axios.get(`http://localhost:5001/api/job/${jobId}`);
                setJobTitle(jobRes.data.title);

                const profileRes = await axios.get(`http://localhost:5001/api/users/profile/${userId}`);
                const profile = profileRes.data;

                setFormData({
                    fullName: profile.fullName || '',
                    nic: profile.nic || '',
                    email: profile.email || '',
                    phoneNumber: profile.phoneNumber || '',
                    address: profile.address || '',
                    birthday: profile.birthday || '',
                    gender: profile.gender || '',
                    skills: profile.skills.length ? profile.skills : [''],
                    education: profile.education.length ? profile.education : [{
                        institute: '',
                        degree: '',
                        startDate: '',
                        endDate: '',
                        currentlyStudying: false
                    }],
                    summary: profile.summary || '',
                    workExperience: profile.workExperience.length ? profile.workExperience : [{
                        jobTitle: '',
                        company: '',
                        startDate: '',
                        endDate: '',
                        description: '',
                        currentlyWorking: false
                    }],
                    certifications: profile.certifications.length ? profile.certifications : [''],
                    coverLetter: ''
                });
            } catch (err) {
                console.error('Error loading data', err);
            }
        };

        loadData();
    }, [jobId, userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle special input restrictions
        let processedValue = value;

        if (name === 'fullName') {
            // Remove numbers and special characters except allowed ones
            processedValue = value.replace(/[^a-zA-Z\s\.',-]/g, '');
        } else if (name === 'nic') {
            // Only allow numbers and V/X at the end
            processedValue = value.replace(/[^0-9VXvx]/g, '');
            // Ensure V/X only at the end for 10-character NIC
            if (processedValue.length === 10) {
                const lastChar = processedValue.slice(-1);
                if (['V', 'X', 'v', 'x'].includes(lastChar)) {
                    processedValue = processedValue.slice(0, 9) + lastChar;
                }
            }
        } else if (name === 'phoneNumber') {
            // Only allow numbers, +, and limit length
            processedValue = value.replace(/[^0-9+]/g, '');
            if (processedValue.startsWith('+94')) {
                processedValue = processedValue.slice(0, 12); // +94 + 9 digits
            } else if (processedValue.startsWith('0')) {
                processedValue = processedValue.slice(0, 10); // 0 + 9 digits
            }
        }

        setFormData({ ...formData, [name]: processedValue });
        setIsFormDirty(true);

        // Real-time validation
        validateField(name, processedValue);
    };

    const handleArrayChange = (field, index, value) => {
        const updated = [...formData[field]];
        updated[index] = value;
        setFormData({ ...formData, [field]: updated });
        setIsFormDirty(true);

        // Validate skills when they change
        if (field === 'skills') {
            setTimeout(() => validateSkills(), 100);
        }
    };

    const handleNestedChange = (field, index, key, value) => {
        const updated = [...formData[field]];
        updated[index][key] = value;

// Clear end date when "currently studying" or "currently working" is checked
    if (key === 'currentlyStudying' || key === 'currentlyWorking') {
        if (value === true) {
            updated[index]['endDate'] = ''; // Clear the end date
        }
    }

        setFormData({ ...formData, [field]: updated });
        setIsFormDirty(true);

        // Validate education when it changes
        if (field === 'education') {
            setTimeout(() => validateEducation(), 100);
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

        // Validate all required fields
        const requiredFields = ['fullName', 'nic', 'email', 'phoneNumber', 'address', 'birthday', 'gender'];
        requiredFields.forEach(field => {
            if (!validateField(field, formData[field])) {
                isValid = false;
            }
        });

        // Validate skills and education
        if (!validateSkills()) isValid = false;
        if (!validateEducation()) isValid = false;

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const payload = {
                jobId,
                userId,
                applicationData: {
                    ...formData,
                    skills: formData.skills.filter(s => s.trim()),
                    certifications: formData.certifications.filter(c => c.trim()),
                    education: formData.education.filter(e => e.institute.trim() || e.degree.trim()),
                    workExperience: formData.workExperience.filter(w => w.jobTitle.trim() || w.company.trim())
                }
            };

            await axios.post('http://localhost:5001/api/applications/submit', payload);
            setSubmitSuccess(true);
            setShowSuccess(true);
            setIsFormDirty(false);
            setTimeout(() => onSuccess ? onSuccess() : onClose(), 3000);
        } catch (err) {
            alert(err.response?.data?.error || 'Submission failed');
        } finally {
            setLoading(false);
        }
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
                 <strong>  <h2>Apply for: {JobTitle}</h2></strong> 
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
                                value={formData.fullName}
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
                                value={formData.nic}
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
                                value={formData.email}
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
                                value={formData.phoneNumber}
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
                                value={formData.address}
                                onChange={handleChange}
                                className={errors.address ? 'error' : ''}
                                placeholder="Enter your complete address"
                            />
                            {errors.address && <span className="error-message">{errors.address}</span>}
                        </div>

                        <div className="form-group">
    <label>Birthday *</label>
    <DatePicker
        selected={formData.birthday ? new Date(formData.birthday) : null}
        onChange={(date) => {
            const dateString = date ? date.toISOString().split('T')[0] : '';
            setFormData({ ...formData, birthday: dateString });
            setIsFormDirty(true);
            validateField('birthday', dateString);
        }}
        dateFormat="yyyy-MM-dd"
        placeholderText="Select your birthday"
        maxDate={new Date()} // No future dates
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        customInput={
            <div className="date-picker-input">
                <input 
                    value={formData.birthday} 
                    readOnly 
                    placeholder="Select your birthday"
                    className={errors.birthday ? 'error' : ''}
                />
                <FaCalendarAlt className="calendar-icon" />
            </div>
        }
    />
    {errors.birthday && <span className="error-message">{errors.birthday}</span>}
</div>

<div className="form-group">
    <label>Gender *</label>
    <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        className={errors.gender ? 'error' : ''}
    >
        <option value="" disabled hidden>Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
        <option value="prefer-not-to-say">Prefer not to say</option>
    </select>
    {errors.gender && <span className="error-message">{errors.gender}</span>}
</div>
                    </div>

                    {/* Skills & Certifications */}
                    <div className="form-section">
                        <h3>Skills & Certifications</h3>

                        <div className="form-group">
                            <label>Skills *</label>

                            {/* New input field always at the top */}
                            <div className="input-with-add">
                                <input
                                    value={formData.skills[formData.skills.length - 1]}
                                    onChange={e => handleArrayChange('skills', formData.skills.length - 1, e.target.value)}
                                    placeholder="Enter a skill"
                                />
                                <button
                                    type="button"
                                    onClick={() => addItem('skills', '')}
                                    disabled={!formData.skills[formData.skills.length - 1].trim()}
                                >
                                    +
                                </button>
                            </div>

                            {/* Added skills displayed below */}
                            {formData.skills.slice(0, -1).map((skill, i) => (
                                <div className="input-with-add" key={i}>
                                    <input
                                        value={skill}
                                        onChange={e => handleArrayChange('skills', i, e.target.value)}
                                        placeholder="Enter a skill"
                                        readOnly
                                    />
                                    <button className="remove-btn" type="button" onClick={() => removeItem('skills', i)}>×</button>
                                </div>
                            ))}

                            {errors.skills && <span className="error-message">{errors.skills}</span>}
                        </div>

                        <div className="form-group">
                            <label>Certifications</label>

                            {/* New input field always at the top */}
                            <div className="input-with-add">
                                <input
                                    value={formData.certifications[formData.certifications.length - 1]}
                                    onChange={e => handleArrayChange('certifications', formData.certifications.length - 1, e.target.value)}
                                    placeholder="Enter a certification"
                                />
                                <button
                                    type="button"
                                    onClick={() => addItem('certifications', '')}
                                    disabled={!formData.certifications[formData.certifications.length - 1].trim()}
                                >
                                    +
                                </button>
                            </div>

                            {/* Added certifications displayed below */}
                            {formData.certifications.slice(0, -1).map((cert, i) => (
                                <div className="input-with-add" key={i}>
                                    <input
                                        value={cert}
                                        onChange={e => handleArrayChange('certifications', i, e.target.value)}
                                        placeholder="Enter a certification"
                                        readOnly
                                    />
                                    <button className="remove-btn" type="button" onClick={() => removeItem('certifications', i)}>×</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Education */}
                    <div className="form-section">
                        <h3>Education </h3>

                        {/* New education entry always at the top */}
                        <div className="education-entry">
                            <div className="education-row">
                                <input
                                    placeholder="Institute"
                                    value={formData.education[formData.education.length - 1].institute}
                                    onChange={e => handleNestedChange('education', formData.education.length - 1, 'institute', e.target.value)}
                                />
                                <input
                                    placeholder="Degree"
                                    value={formData.education[formData.education.length - 1].degree}
                                    onChange={e => handleNestedChange('education', formData.education.length - 1, 'degree', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => addItem('education', {
                                        institute: '',
                                        degree: '',
                                        startDate: '',
                                        endDate: '',
                                        currentlyStudying: false
                                    })}
                                    disabled={!formData.education[formData.education.length - 1].institute.trim() || !formData.education[formData.education.length - 1].degree.trim()}
                                >
                                    +
                                </button>
                            </div>

                            <div className="education-dates">
                                <DatePicker
                                    selected={formData.education[formData.education.length - 1].startDate ? new Date(formData.education[formData.education.length - 1].startDate) : null}
                                    onChange={(date) => handleNestedChange('education', formData.education.length - 1, 'startDate', date ? date.toISOString().split('T')[0] : '')}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Start Date"
                                    maxDate={new Date()}
                                    customInput={
                                        <div className="date-picker-input">
                                            <input value={formData.education[formData.education.length - 1].startDate} readOnly placeholder="Start Date" />
                                            <FaCalendarAlt className="calendar-icon" />
                                        </div>
                                    }
                                />

                                <DatePicker
                                    selected={formData.education[formData.education.length - 1].endDate ? new Date(formData.education[formData.education.length - 1].endDate) : null}
                                    onChange={(date) => handleNestedChange('education', formData.education.length - 1, 'endDate', date ? date.toISOString().split('T')[0] : '')}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="End Date"
                                    maxDate={new Date()} // Prevent future dates
                                    disabled={formData.education[formData.education.length - 1].currentlyStudying}
                                    customInput={
                                        <div className="date-picker-input">
                                            <input value={formData.education[formData.education.length - 1].endDate} readOnly placeholder="End Date" />
                                            <FaCalendarAlt className="calendar-icon" />
                                        </div>
                                    }
                                />

                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.education[formData.education.length - 1].currentlyStudying}
                                        onChange={e => handleNestedChange('education', formData.education.length - 1, 'currentlyStudying', e.target.checked)}
                                    />
                                    Currently Studying
                                </label>
                            </div>
                        </div>

                        {/* Added education entries displayed below */}
                        {formData.education.slice(0, -1).map((edu, i) => (
                            <div key={i} className="education-entry">
                                <div className="education-row">
                                    <input
                                        placeholder="Institute"
                                        value={edu.institute}
                                        readOnly
                                    />
                                    <input
                                        placeholder="Degree"
                                        value={edu.degree}
                                        readOnly
                                    />
                                    <button className="remove-btn" type="button" onClick={() => removeItem('education', i)}>×</button>
                                </div>

                                <div className="education-dates">
                                    <div className="date-picker-input">
                                        <input value={edu.startDate} readOnly placeholder="Start Date" />
                                        <FaCalendarAlt className="calendar-icon" />
                                    </div>

                                    <div className="date-picker-input">
                                        <input value={edu.endDate} readOnly placeholder="End Date" />
                                        <FaCalendarAlt className="calendar-icon" />
                                    </div>

                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={edu.currentlyStudying}
                                            readOnly
                                        />
                                        Currently Studying
                                    </label>
                                </div>
                            </div>
                        ))}

                        {errors.education && <span className="error-message">{errors.education}</span>}
                    </div>

                    {/* work Experience */}
                    <div className="form-section">
                        <h3>Work Experience & Cover Letter</h3>


                        {/* New work experience entry always at the top */}
                        <div className="work-experience-entry">
                            <div className="work-experience-row">
                                <input
                                    placeholder="Job Title"
                                    value={formData.workExperience[formData.workExperience.length - 1].jobTitle}
                                    onChange={e => handleNestedChange('workExperience', formData.workExperience.length - 1, 'jobTitle', e.target.value)}
                                />
                                <input
                                    placeholder="Company"
                                    value={formData.workExperience[formData.workExperience.length - 1].company}
                                    onChange={e => handleNestedChange('workExperience', formData.workExperience.length - 1, 'company', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => addItem('workExperience', {
                                        jobTitle: '',
                                        company: '',
                                        startDate: '',
                                        endDate: '',
                                        description: '',
                                        currentlyWorking: false
                                    })}
                                    disabled={!formData.workExperience[formData.workExperience.length - 1].jobTitle.trim() || !formData.workExperience[formData.workExperience.length - 1].company.trim()}
                                >
                                    +
                                </button>
                            </div>

                            <div className="work-experience-dates">
                                <DatePicker
                                    selected={formData.workExperience[formData.workExperience.length - 1].startDate ? new Date(formData.workExperience[formData.workExperience.length - 1].startDate) : null}
                                    onChange={(date) => handleNestedChange('workExperience', formData.workExperience.length - 1, 'startDate', date ? date.toISOString().split('T')[0] : '')}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Start Date"
                                    maxDate={new Date()}
                                    customInput={
                                        <div className="date-picker-input">
                                            <input value={formData.workExperience[formData.workExperience.length - 1].startDate} readOnly placeholder="Start Date" />
                                            <FaCalendarAlt className="calendar-icon" />
                                        </div>
                                    }
                                />

                                <DatePicker
                                    selected={formData.workExperience[formData.workExperience.length - 1].endDate ? new Date(formData.workExperience[formData.workExperience.length - 1].endDate) : null}
                                    onChange={(date) => handleNestedChange('workExperience', formData.workExperience.length - 1, 'endDate', date ? date.toISOString().split('T')[0] : '')}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="End Date"
                                    maxDate={new Date()} // Prevent future dates
                                    disabled={formData.workExperience[formData.workExperience.length - 1].currentlyWorking}

                                    customInput={
                                        <div className="date-picker-input">
                                            <input value={formData.workExperience[formData.workExperience.length - 1].endDate} readOnly placeholder="End Date" />
                                            <FaCalendarAlt className="calendar-icon" />
                                        </div>
                                    }
                                />

                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.workExperience[formData.workExperience.length - 1].currentlyWorking}
                                        onChange={e => handleNestedChange('workExperience', formData.workExperience.length - 1, 'currentlyWorking', e.target.checked)}
                                    />
                                    Currently Working
                                </label>
                            </div>

                            <textarea
                                placeholder="Job Description"
                                value={formData.workExperience[formData.workExperience.length - 1].description}
                                onChange={e => handleNestedChange('workExperience', formData.workExperience.length - 1, 'description', e.target.value)}
                            />
                        </div>

                        {/* Added work experience entries displayed below */}
                        {formData.workExperience.slice(0, -1).map((exp, i) => (
                            <div key={i} className="work-experience-entry">
                                <div className="work-experience-row">
                                    <input
                                        placeholder="Job Title"
                                        value={exp.jobTitle}
                                        readOnly
                                    />
                                    <input
                                        placeholder="Company"
                                        value={exp.company}
                                        readOnly
                                    />
                                    <button className="remove-btn" type="button" onClick={() => removeItem('workExperience', i)}>×</button>
                                </div>

                                <div className="work-experience-dates">
                                    <div className="date-picker-input">
                                        <input value={exp.startDate} readOnly placeholder="Start Date" />
                                        <FaCalendarAlt className="calendar-icon" />
                                    </div>

                                    <div className="date-picker-input">
                                        <input value={exp.endDate} readOnly placeholder="End Date" />
                                        <FaCalendarAlt className="calendar-icon" />
                                    </div>

                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={exp.currentlyWorking}
                                            readOnly
                                        />
                                        Currently Working
                                    </label>
                                </div>

                                <textarea
                                    placeholder="Job Description"
                                    value={exp.description}
                                    readOnly
                                />
                            </div>
                        ))}

                        <textarea
                            name="coverLetter"
                            value={formData.coverLetter}
                            onChange={handleChange}
                            placeholder="Cover Letter"
                        />
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