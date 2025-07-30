import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../../../utils/auth';

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
        // Allow letters, spaces, and common punctuation (but not numbers)
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
                        // Calculate age and check if user is at least 15 years old
                        const age = calculateAge(value);
                        if (age < 15) {
                            newErrors[name] = 'You must be at least 15 years old to apply';
                        } else {
                            delete newErrors[name];
                        }
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

        // Text-only field validation - COMPLETELY EXCLUDE projects field
        if (field !== 'projects' && (key === 'jobTitle' || key === 'fieldOfStudy' || key === 'subject')) {
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
        const newErrors = { ...errors };

        // Validate required personal information fields
        const requiredFields = ['fullName', 'nic', 'email', 'phoneNumber', 'address', 'birthday', 'gender'];
        
        requiredFields.forEach(field => {
            if (!formData[field] || !formData[field].toString().trim()) {
                newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
                isValid = false;
            } else if (!validateField(field, formData[field])) {
                isValid = false;
            }
        });

        // Validate technical skills (at least one skill required)
        if (!formData.technicalSkills || formData.technicalSkills.length === 0) {
            newErrors.technicalSkills = 'At least one technical skill is required';
            isValid = false;
        } else {
            // Check if at least one skill has a name
            const hasValidSkill = formData.technicalSkills.some(skill => skill.name && skill.name.trim());
            if (!hasValidSkill) {
                newErrors.technicalSkills = 'Please add at least one technical skill with a name';
                isValid = false;
            } else {
                delete newErrors.technicalSkills;
            }
        }

        // Validate education (at least one education entry required)
        if (!formData.education || formData.education.length === 0) {
            newErrors.education = 'At least one education entry is required';
            isValid = false;
        } else {
            // Check each education entry for required fields
            let hasValidEducation = false;
            formData.education.forEach((edu, index) => {
                if (!edu.institute || !edu.institute.trim()) {
                    newErrors[`education_${index}_institute`] = 'Institute name is required';
                    isValid = false;
                } else {
                    delete newErrors[`education_${index}_institute`];
                }
                
                if (!edu.educationLevel || !edu.educationLevel.trim()) {
                    newErrors[`education_${index}_educationLevel`] = 'Education level is required';
                    isValid = false;
                } else {
                    delete newErrors[`education_${index}_educationLevel`];
                }
                
                // If this entry has both required fields, mark as valid
                if (edu.institute && edu.institute.trim() && edu.educationLevel && edu.educationLevel.trim()) {
                    hasValidEducation = true;
                }
            });
            
            if (!hasValidEducation) {
                newErrors.education = 'Please complete at least one education entry with institute and level';
                isValid = false;
            } else {
                delete newErrors.education;
            }
        }

        // Validate optional sections - they only need validation if they have content
        if (!validateWorkExperience()) isValid = false;
        if (!validateProjects()) isValid = false;
        if (!validateCertifications()) isValid = false;

        setErrors(newErrors);
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

            // Configure axios with authentication header
            const config = {
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json'
                }
            };

            // Make actual API call to submit application
            const response = await axios.post('http://localhost:5001/api/applications/submit', {
                jobId: jobId,
                userId: userId,
                applicationData: submissionData
            }, config);

            console.log('Application submitted successfully:', response.data);
            setSubmitSuccess(true);
            setShowSuccess(true);
            setIsFormDirty(false);
            
            if (onSuccess) {
                setTimeout(() => onSuccess(), 3000);
            }
            setLoading(false);

        } catch (err) {
            console.error('Submission failed:', err);
            const errorMessage = err.response?.data?.error || err.message || 'Submission failed';
            alert(`Submission failed: ${errorMessage}`);
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] pt-20">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Application Submitted!</h2>
                        <p className="text-gray-600 mb-6">Your application for <strong>{JobTitle}</strong> has been submitted.</p>
                        <div className="flex justify-center">
                            <button
                                onClick={() => onSuccess ? onSuccess() : onClose()}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 pt-20">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Apply for: {JobTitle || 'Software Developer'}</h2>
                    <button
                        onClick={() => isFormDirty && !submitSuccess ? setShowWarning(true) : onClose()}
                        className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                        ❌
                    </button>
                </div>

                <form className="p-6 space-y-8" onSubmit={handleSubmit}>
                    {/* Personal Info */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information *</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                            <input
                                name="fullName"
                                value={formData.fullName || ''}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter your full name"
                            />
                            {errors.fullName && <span className="text-red-500 text-sm mt-1 block">{errors.fullName}</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">NIC *</label>
                            <input
                                name="nic"
                                value={formData.nic || ''}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.nic ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="123456789V or 123456789012"
                                maxLength="12"
                            />
                            {errors.nic && <span className="text-red-500 text-sm mt-1 block">{errors.nic}</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="your.email@example.com"
                            />
                            {errors.email && <span className="text-red-500 text-sm mt-1 block">{errors.email}</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                            <input
                                name="phoneNumber"
                                value={formData.phoneNumber || ''}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="0771234567 or +94771234567"
                            />
                            {errors.phoneNumber && <span className="text-red-500 text-sm mt-1 block">{errors.phoneNumber}</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                            <textarea
                                name="address"
                                value={formData.address || ''}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter your complete address"
                                rows="3"
                            />
                            {errors.address && <span className="text-red-500 text-sm mt-1 block">{errors.address}</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Birthday *</label>
                            <input
                                type="date"
                                name="birthday"
                                value={formData.birthday || ''}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.birthday ? 'border-red-500' : 'border-gray-300'}`}
                                max={new Date().toISOString().split('T')[0]}
                                style={{
                                    colorScheme: 'light',
                                    WebkitAppearance: 'none',
                                    MozAppearance: 'textfield'
                                }}
                            />
                            {errors.birthday && <span className="text-red-500 text-sm mt-1 block">{errors.birthday}</span>}
                            <div className="mt-2 flex items-center">
                                <label className="text-sm font-medium text-gray-700 mr-2">Age: </label>
                                <input
                                    value={calculateAge(formData.birthday)}
                                    readOnly
                                    className="w-20 px-2 py-1 border border-gray-300 rounded bg-gray-50 text-gray-700 text-sm"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                            <select
                                name="gender"
                                value={formData.gender || ''}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="" disabled hidden>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                            {errors.gender && <span className="text-red-500 text-sm mt-1 block">{errors.gender}</span>}
                        </div>
                    </div>

                    {/* Skills & Social Links */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills & Social Links</h3>

                        {/* Technical Skills */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills *</label>
                            {errors.technicalSkills && <span className="text-red-500 text-sm mb-2 block">{errors.technicalSkills}</span>}

                            {/* Add new skill input row (always on top) */}
                            <div className="mb-4">
                                <div className="flex items-center space-x-4">
                                    <input
                                        value={formData.technicalSkills[formData.technicalSkills.length - 1].name || ''}
                                        onChange={e => handleArrayChange('technicalSkills', formData.technicalSkills.length - 1, { ...formData.technicalSkills[formData.technicalSkills.length - 1], name: e.target.value })}
                                        placeholder="Enter a technical skill"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div className="flex items-center space-x-2">
                                        <label className="text-sm font-medium text-gray-700">Proficiency (1-5):</label>
                                        <select
                                            value={formData.technicalSkills[formData.technicalSkills.length - 1].proficiency || 1}
                                            onChange={e => handleArrayChange('technicalSkills', formData.technicalSkills.length - 1, { ...formData.technicalSkills[formData.technicalSkills.length - 1], proficiency: Number(e.target.value) })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => addItem('technicalSkills', { name: '', proficiency: 1 })}
                                        disabled={!formData.technicalSkills[formData.technicalSkills.length - 1].name.trim()}
                                        title="Add new skill"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* List of added skills (read-only, with remove) */}
                            {formData.technicalSkills.slice(0, -1).map((skill, i) => (
                                <div key={i} className="mb-3 p-3 bg-gray-100 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <input
                                            value={skill.name}
                                            readOnly
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white"
                                        />
                                        <div className="flex items-center space-x-2">
                                            <label className="text-sm font-medium text-gray-700">Proficiency (1-5):</label>
                                            <select value={skill.proficiency} className="px-3 py-2 border border-gray-300 rounded-lg bg-white" disabled>
                                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                                            </select>
                                        </div>
                                        <button
                                            type="button"
                                            className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                            onClick={() => removeItem('technicalSkills', i)}
                                            title="Remove skill"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social Links */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">Social Links (Optional)</label>
                            <input
                                name="linkedIn"
                                value={formData.socialLinks?.linkedIn || ''}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        socialLinks: { ...formData.socialLinks, linkedIn: e.target.value }
                                    });
                                    setIsFormDirty(true);
                                }}
                                placeholder="LinkedIn URL"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                name="github"
                                value={formData.socialLinks?.github || ''}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        socialLinks: { ...formData.socialLinks, github: e.target.value }
                                    });
                                    setIsFormDirty(true);
                                }}
                                placeholder="GitHub URL"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                name="portfolio"
                                value={formData.socialLinks?.portfolio || ''}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        socialLinks: { ...formData.socialLinks, portfolio: e.target.value }
                                    });
                                    setIsFormDirty(true);
                                }}
                                placeholder="Portfolio URL"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Education Section */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Education *</h3>
                        {errors.education && <span className="text-red-500 text-sm mb-4 block">{errors.education}</span>}
                        {formData.education.map((edu, i) => (
                            <div key={i} className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            placeholder="Institute Name *"
                                            value={edu.institute || ''}
                                            onChange={e => handleNestedChange('education', i, 'institute', e.target.value)}
                                            required
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`education_${i}_institute`] ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors[`education_${i}_institute`] && (
                                            <span className="text-red-500 text-sm mt-1 block">{errors[`education_${i}_institute`]}</span>
                                        )}
                                    </div>
                                    <div>
                                        <select
                                            value={edu.educationLevel || ''}
                                            onChange={e => handleNestedChange('education', i, 'educationLevel', e.target.value)}
                                            required
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`education_${i}_educationLevel`] ? 'border-red-500' : 'border-gray-300'}`}
                                        >
                                            <option value="" disabled>Select Level *</option>
                                            <option value="A/L">A/L</option>
                                            <option value="Diploma">Diploma</option>
                                            <option value="Bachelor's">Bachelor's</option>
                                            <option value="Master's">Master's</option>
                                            <option value="PhD">PhD</option>
                                        </select>
                                        {errors[`education_${i}_educationLevel`] && (
                                            <span className="text-red-500 text-sm mt-1 block">{errors[`education_${i}_educationLevel`]}</span>
                                        )}
                                    </div>
                                </div>

                                {/* A/L specific fields */}
                                {edu.educationLevel === 'A/L' && (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <input
                                                    placeholder="Subject Stream"
                                                    value={edu.fieldOfStudy || ''}
                                                    onChange={e => handleNestedChange('education', i, 'fieldOfStudy', e.target.value)}
                                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`education_${i}_fieldOfStudy`] ? 'border-red-500' : 'border-gray-300'}`}
                                                    required
                                                />
                                                {errors[`education_${i}_fieldOfStudy`] && (
                                                    <span className="text-red-500 text-sm mt-1 block">{errors[`education_${i}_fieldOfStudy`]}</span>
                                                )}
                                            </div>
                                            <div>
                                                <input
                                                    placeholder="Year (e.g., 2020)"
                                                    value={edu.alYear || ''}
                                                    onChange={e => handleNestedChange('education', i, 'alYear', e.target.value)}
                                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`education_${i}_alYear`] ? 'border-red-500' : 'border-gray-300'}`}
                                                    required
                                                />
                                                {errors[`education_${i}_alYear`] && (
                                                    <span className="text-red-500 text-sm mt-1 block">{errors[`education_${i}_alYear`]}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">A/L Subjects and Grades</label>

                                            {/* Add new subject input row (always on top) */}
                                            <div className="mb-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex-1">
                                                        <input
                                                            placeholder="Subject"
                                                            value={(edu.alSubjects && edu.alSubjects[edu.alSubjects.length - 1]?.subject) || ''}
                                                            onChange={e => handleALSubjectChange(i, (edu.alSubjects?.length || 1) - 1, 'subject', e.target.value)}
                                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`education_${i}_subject_${(edu.alSubjects?.length || 1) - 1}`] ? 'border-red-500' : 'border-gray-300'}`}
                                                        />
                                                        {errors[`education_${i}_subject_${(edu.alSubjects?.length || 1) - 1}`] && (
                                                            <span className="text-red-500 text-xs mt-1 block">
                                                                {errors[`education_${i}_subject_${(edu.alSubjects?.length || 1) - 1}`]}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <label className="text-sm font-medium text-gray-700">Grade:</label>
                                                        <select
                                                            value={(edu.alSubjects && edu.alSubjects[edu.alSubjects.length - 1]?.grade) || ''}
                                                            onChange={e => handleALSubjectChange(i, (edu.alSubjects?.length || 1) - 1, 'grade', e.target.value)}
                                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <option value="" disabled>Select Grade</option>
                                                            <option value="A">A</option>
                                                            <option value="B">B</option>
                                                            <option value="C">C</option>
                                                            <option value="S">S</option>
                                                            <option value="F">F</option>
                                                        </select>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

                                            {/* List of added subjects (read-only, with remove) */}
                                            {(edu.alSubjects || []).slice(0, -1).map((subjectGrade, subIndex) => (
                                                <div key={subIndex} className="mb-3 p-3 bg-gray-100 rounded-lg">
                                                    <div className="flex items-center space-x-4">
                                                        <input
                                                            value={subjectGrade.subject || ''}
                                                            readOnly
                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white"
                                                        />
                                                        <div className="flex items-center space-x-2">
                                                            <label className="text-sm font-medium text-gray-700">Grade:</label>
                                                            <select value={subjectGrade.grade || ''} className="px-3 py-2 border border-gray-300 rounded-lg bg-white" disabled>
                                                                <option value="">Select Grade</option>
                                                                <option value="A">A</option>
                                                                <option value="B">B</option>
                                                                <option value="C">C</option>
                                                                <option value="S">S</option>
                                                                <option value="F">F</option>
                                                            </select>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                                            onClick={() => removeALSubject(i, subIndex)}
                                                            title="Remove subject"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Non-A/L fields */}
                                {edu.educationLevel !== 'A/L' && edu.educationLevel !== '' && (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <input
                                                    placeholder="Field of Study"
                                                    value={edu.fieldOfStudy || ''}
                                                    onChange={e => handleNestedChange('education', i, 'fieldOfStudy', e.target.value)}
                                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`education_${i}_fieldOfStudy`] ? 'border-red-500' : 'border-gray-300'}`}
                                                    required={['Diploma', 'Bachelor\'s', 'Master\'s', 'PhD'].includes(edu.educationLevel)}
                                                />
                                                {errors[`education_${i}_fieldOfStudy`] && (
                                                    <span className="text-red-500 text-sm mt-1 block">{errors[`education_${i}_fieldOfStudy`]}</span>
                                                )}
                                            </div>
                                            <div>
                                                <input
                                                    placeholder="GPA / Grade"
                                                    value={edu.gpaOrGrade || ''}
                                                    onChange={e => handleNestedChange('education', i, 'gpaOrGrade', e.target.value)}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                                <input
                                                    type="date"
                                                    value={edu.startDate || ''}
                                                    onChange={e => handleNestedChange('education', i, 'startDate', e.target.value)}
                                                    max={getTodayString()}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    style={{
                                                        colorScheme: 'light',
                                                        WebkitAppearance: 'none',
                                                        MozAppearance: 'textfield'
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                                <input
                                                    type="date"
                                                    value={edu.endDate || ''}
                                                    onChange={e => handleNestedChange('education', i, 'endDate', e.target.value)}
                                                    disabled={edu.currentlyStudying}
                                                    min={edu.startDate || ''}
                                                    max={getTodayString()}
                                                    required={!edu.currentlyStudying}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                                    style={{
                                                        colorScheme: 'light',
                                                        WebkitAppearance: 'none',
                                                        MozAppearance: 'textfield'
                                                    }}
                                                />
                                            </div>
                                            <div className="flex items-end">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!edu.currentlyStudying}
                                                        onChange={e => handleNestedChange('education', i, 'currentlyStudying', e.target.checked)}
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                    />
                                                    <span className="text-sm font-medium text-gray-700">Currently Studying</span>
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {formData.education.length > 1 && (
                                    <button
                                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                        type="button"
                                        onClick={() => removeItem('education', i)}
                                    >
                                        Remove Education
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Work Experience (Optional)</h3>
                        {errors.workExperience && <span className="text-red-500 text-sm mb-4 block">{errors.workExperience}</span>}
                        {formData.workExperience.map((exp, i) => (
                            <div key={i} className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <input
                                            placeholder="Job Title"
                                            value={exp.jobTitle || ''}
                                            onChange={e => handleNestedChange('workExperience', i, 'jobTitle', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`workExperience_${i}_jobTitle`] ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors[`workExperience_${i}_jobTitle`] && (
                                            <span className="text-red-500 text-sm mt-1 block">{errors[`workExperience_${i}_jobTitle`]}</span>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            placeholder="Company Name"
                                            value={exp.company || ''}
                                            onChange={e => handleNestedChange('workExperience', i, 'company', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                        <input
                                            type="date"
                                            value={exp.startDate || ''}
                                            onChange={e => handleNestedChange('workExperience', i, 'startDate', e.target.value)}
                                            max={getTodayString()}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            style={{
                                                colorScheme: 'light',
                                                WebkitAppearance: 'none',
                                                MozAppearance: 'textfield'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                        <input
                                            type="date"
                                            value={exp.endDate || ''}
                                            onChange={e => handleNestedChange('workExperience', i, 'endDate', e.target.value)}
                                            disabled={exp.currentlyWorking}
                                            min={exp.startDate || ''}
                                            max={getTodayString()}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                            style={{
                                                colorScheme: 'light',
                                                WebkitAppearance: 'none',
                                                MozAppearance: 'textfield'
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={!!exp.currentlyWorking}
                                                onChange={e => handleNestedChange('workExperience', i, 'currentlyWorking', e.target.checked)}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Currently Working</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <textarea
                                        placeholder="Job Description"
                                        value={exp.description || ''}
                                        onChange={e => handleNestedChange('workExperience', i, 'description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                    />
                                </div>

                                {formData.workExperience.length > 1 && (
                                    <button
                                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                        type="button"
                                        onClick={() => removeItem('workExperience', i)}
                                    >
                                        Remove Experience
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Projects (Optional)</h3>
                        {errors.projects && <span className="text-red-500 text-sm mb-4 block">{errors.projects}</span>}
                        {formData.projects.map((proj, i) => (
                            <div key={i} className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
                                <div className="space-y-4">
                                    <input
                                        placeholder="Project Title"
                                        value={proj.title || ''}
                                        onChange={e => handleNestedChange('projects', i, 'title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <textarea
                                        placeholder="Description (optional)"
                                        value={proj.description || ''}
                                        onChange={e => handleNestedChange('projects', i, 'description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Technologies (comma separated, e.g., React.js, Node.js, MongoDB, C++, .NET, ASP.NET)"
                                        value={proj.technologies ? proj.technologies.join(', ') : ''}
                                        onChange={e => {
                                            const inputValue = e.target.value;
                                            // Don't apply ANY validation - just split and store
                                            const technologies = inputValue === '' ? [] : inputValue.split(',').map(s => s.trim());

                                            // Direct state update - bypass all validation
                                            const updatedProjects = [...formData.projects];
                                            updatedProjects[i] = { ...updatedProjects[i], technologies };
                                            setFormData({ ...formData, projects: updatedProjects });
                                            setIsFormDirty(true);
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        style={{ 
                                            textTransform: 'none',
                                            WebkitAppearance: 'none',
                                            MozAppearance: 'textfield'
                                        }}
                                        autoComplete="off"
                                        spellCheck="false"
                                    />
                                    <input
                                        placeholder="Project Link (GitHub or Live URL)"
                                        value={proj.link || ''}
                                        onChange={e => handleNestedChange('projects', i, 'link', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`projects_${i}_link`] ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors[`projects_${i}_link`] && (
                                        <span className="text-red-500 text-sm mt-1 block">{errors[`projects_${i}_link`]}</span>
                                    )}
                                </div>
                                {formData.projects.length > 1 && (
                                    <button
                                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                        type="button"
                                        onClick={() => removeItem('projects', i)}
                                    >
                                        Remove Project
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => addItem('projects', { title: '', description: '', technologies: [], link: '' })}
                            disabled={!canAddProject()}
                        >
                            + Add Project
                        </button>
                    </div>

                    {/* Certifications Section */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Certifications (Optional)</h3>
                        {errors.certifications && <span className="text-red-500 text-sm mb-4 block">{errors.certifications}</span>}
                        {formData.certifications.map((cert, i) => (
                            <div key={i} className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input
                                        placeholder="Certification Name"
                                        value={cert.name || ''}
                                        onChange={e => handleNestedChange('certifications', i, 'name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        placeholder="Issuer"
                                        value={cert.issuer || ''}
                                        onChange={e => handleNestedChange('certifications', i, 'issuer', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        placeholder="Year"
                                        value={cert.year || ''}
                                        onChange={e => handleNestedChange('certifications', i, 'year', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`certifications_${i}_year`] ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                </div>
                                {errors[`certifications_${i}_year`] && (
                                    <span className="text-red-500 text-sm mt-1 block">{errors[`certifications_${i}_year`]}</span>
                                )}
                                {formData.certifications.length > 1 && (
                                    <button
                                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                        type="button"
                                        onClick={() => removeItem('certifications', i)}
                                    >
                                        Remove Certification
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => addItem('certifications', { name: '', issuer: '', year: '' })}
                            disabled={!canAddCertification()}
                        >
                            + Add Certification
                        </button>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => isFormDirty && !submitSuccess ? setShowWarning(true) : onClose()}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || Object.keys(errors).length > 0}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>
                </form>

                {showWarning && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Are you sure?</h3>
                            <p className="text-gray-600 mb-6">All data will be lost.</p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setShowWarning(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Yes, Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplyJobForm;