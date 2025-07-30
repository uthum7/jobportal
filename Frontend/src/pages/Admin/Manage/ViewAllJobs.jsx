import React, { useEffect, useState } from 'react';
import {
  Calendar, Clock, MapPin, User, Edit3, Save, X, Briefcase,
  Users, CheckCircle, Tag, FileText, Target, ChevronDown,
  ArrowLeft, Search, Eye
} from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const JobListingsUI = () => {
  const { id } = useParams(); // employee ID from URL
  const [employee, setEmployee] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applicationCount, setApplicationCount] = useState(0);

  const [editingJob, setEditingJob] = useState(null);
  const [editingDeadline, setEditingDeadline] = useState('');
  const [editingOwner, setEditingOwner] = useState('');
  const [ownerDropdownOpen, setOwnerDropdownOpen] = useState(false);
  const [jobIdFilter, setJobIdFilter] = useState('');
  const [employees, setEmployees] = useState([]); // ✅ dynamically fetched

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch employee, jobs, and application count on mount
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [employeeRes, jobRes, appCountRes, employeeListRes] = await Promise.all([
          axios.get(`http://localhost:5001/api/users/employees/${id}`),
          axios.get(`http://localhost:5001/api/users/recent/${id}`),
          axios.get(`http://localhost:5001/api/users/applicationcount/${id}`),
          axios.get('http://localhost:5001/api/users/employees') // ✅ GET all employees for dropdown
        ]);

        setEmployee(employeeRes.data);
        setJobs(Array.isArray(jobRes.data) ? jobRes.data : []);
        setApplicationCount(appCountRes.data?.count || 0);
        
        // ✅ Handle different API response structures
        const employeeData = employeeListRes.data?.employees || employeeListRes.data || [];
        setEmployees(Array.isArray(employeeData) ? employeeData : []);
        
        console.log('✅ Data loaded successfully:', {
          employee: employeeRes.data,
          jobsCount: jobRes.data?.length || 0,
          employeesCount: employeeData?.length || 0
        });
      } catch (error) {
        console.error('❌ Error fetching data:', error);
        setError(error.response?.data?.message || error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Format date helpers
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return 0;
    try {
      const today = new Date();
      const deadlineDate = new Date(deadline);
      const diffTime = deadlineDate - today;
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch {
      return 0;
    }
  };

  // Colors and icons for job type/mode
  const getJobModeIcon = (mode) => {
    if (!mode) return <span className="text-gray-500">📍</span>;
    switch (mode.toLowerCase()) {
      case 'remote': return <span className="text-green-500">🏠</span>;
      case 'onsite': return <span className="text-blue-500">🏢</span>;
      case 'hybrid': return <span className="text-purple-500">🔄</span>;
      default: return <span className="text-gray-500">📍</span>;
    }
  };

  const getJobTypeColor = (type) => {
    if (!type) return 'bg-gray-100 text-gray-800';
    switch (type.toLowerCase()) {
      case 'full time': return 'bg-green-100 text-green-800';
      case 'part time': return 'bg-blue-100 text-blue-800';
      case 'contract': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOwnerSelect = (ownerId, event) => {
    event?.stopPropagation(); // Prevent event bubbling
    console.log("Selected owner ID:", ownerId);
    setEditingOwner(ownerId);
    setOwnerDropdownOpen(false);
  };

  const handleDropdownToggle = (event) => {
    event.stopPropagation();
    setOwnerDropdownOpen(prev => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ownerDropdownOpen && !event.target.closest('.dropdown-container')) {
        setOwnerDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ownerDropdownOpen]);

  // ✅ Fixed Helper function to get employee by ID with proper fallbacks
  const getEmployeeById = (id) => {
    if (!Array.isArray(employees) || !id) {
      return { 
        name: 'Unknown Employee', 
        role: 'N/A', 
        avatar: '?',
        _id: id || ''
      };
    }
    
    const employee = employees.find(emp => emp._id === id);
    if (!employee) {
      return { 
        name: 'Unknown Employee', 
        role: 'N/A', 
        avatar: '?',
        _id: id
      };
    }
    
    // ✅ Generate consistent employee data structure
    const fullName = `${employee.username || ''} ${employee.lastName || ''}`.trim() || employee.name || 'Unknown Employee';
    const avatar = employee.avatar || 
      `${employee.username?.[0] || ''}${employee.lastName?.[0] || ''}` || 
      fullName[0] || '?';
    
    return {
      ...employee,
      name: fullName,
      role: employee.jobTitle || employee.role || 'Employee',
      avatar: avatar.toUpperCase()
    };
  };

  // Editing handlers
  const handleEditClick = (job) => {
    setEditingJob(job._id);
    setEditingDeadline(job.JobDeadline ? job.JobDeadline.split('T')[0] : '');
    setEditingOwner(job.PostedBy?._id || job.PostedBy || '');
  };

  const handleCancelEdit = () => {
    setEditingJob(null);
    setEditingDeadline('');
    setEditingOwner('');
    setOwnerDropdownOpen(false);
  };

  const handleSaveEdit = async (jobId) => {
    try {
      if (!editingDeadline || !editingOwner) {
        alert('Please fill in all required fields');
        return;
      }

      // API call to backend to update JobDeadline and PostedBy
      const response = await axios.put(`http://localhost:5001/api/users/jobs/${jobId}/updatedetails`, {
        JobDeadline: editingDeadline + 'T00:00:00.000Z',
        PostedBy: editingOwner,
      });

      // Update local state after successful update
      setJobs(jobs.map(job =>
        job._id === jobId
          ? { 
              ...job, 
              JobDeadline: editingDeadline + 'T00:00:00.000Z', 
              PostedBy: response.data?.job?.PostedBy || editingOwner
            }
          : job
      ));

      console.log("✅ Job updated successfully");
    } catch (error) {
      console.error("❌ Error updating job:", error.response?.data?.message || error.message);
      alert('Failed to update job. Please try again.');
    } finally {
      // Reset editing state
      setEditingJob(null);
      setEditingDeadline('');
      setEditingOwner('');
      setOwnerDropdownOpen(false);
    }
  };

  // ✅ Filter jobs by job ID filter input with safety checks
  const filteredJobs = jobs?.filter(job =>
    job?._id?.toLowerCase().includes(jobIdFilter.toLowerCase())
  ) || [];

  const clearFilter = () => {
    setJobIdFilter('');
  };

  // Back button (dummy here, replace with navigate logic)
  const handleBackClick = () => {
    console.log('Back clicked');
    // Add navigation logic here, e.g., navigate(-1) or navigate('/dashboard')
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job listings...</p>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-2 px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg border border-green-600 hover:border-green-700 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {employee ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-semibold text-blue-600">
                    {employee.username?.[0] || '?'}{employee.lastName?.[0] || ''}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {`${employee.username || ''} ${employee.lastName || ''}`.trim() || 'Unknown Employee'} - Job Postings
                  </h1>
                  <p className="text-gray-600">{employee.jobTitle || 'Employee'}</p>
                  <p className="text-sm text-gray-500">Employee ID: {employee._id}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">{filteredJobs.length}</div>
                <div className="text-sm text-gray-500">
                  {jobIdFilter ? 'Filtered' : 'Total'} Job Postings
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {applicationCount} Applications
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">Loading employee data...</div>
          )}
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Search className="w-5 h-5 text-blue-500" />
              <span>Filter Jobs</span>
            </h2>
            {jobIdFilter && (
              <button
                onClick={clearFilter}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Clear Filter
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Job ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={jobIdFilter}
                  onChange={(e) => setJobIdFilter(e.target.value)}
                  placeholder="Enter Job ID (e.g., 68812b0a2aefc33151e66a3a)"
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div className="flex items-end">
              <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-800">
                  <span className="font-medium">Results: </span>
                  <span className="font-bold">{filteredJobs.length}</span>
                  <span className="text-blue-600"> of {jobs.length} jobs</span>
                </div>
              </div>
            </div>
          </div>

          {jobIdFilter && filteredJobs.length === 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  No jobs found matching Job ID: <span className="font-mono font-medium">"{jobIdFilter}"</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.length === 0 && !jobIdFilter ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Job Postings</h3>
              <p className="text-gray-500">This employee hasn't posted any jobs yet.</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Job Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Briefcase className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-xl font-semibold text-gray-900">{job.JobTitle || 'Untitled Job'}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getJobTypeColor(job.JobType)}`}>
                          {job.JobType || 'N/A'}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex items-center space-x-1">
                          {getJobModeIcon(job.JobMode)}
                          <span>{job.JobMode || 'N/A'}</span>
                        </span>
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span>Posted: {formatDate(job.postedDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span className={getDaysUntilDeadline(job.JobDeadline) < 7 ? 'text-red-600 font-medium' : ''}>
                            Deadline: {formatDate(job.JobDeadline)} 
                            ({getDaysUntilDeadline(job.JobDeadline)} days left)
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-green-500" />
                          <span>{job.applications || 0} applications</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="w-4 h-4 text-purple-500" />
                          <span>{job.JobExperienceYears || 0}+ years exp</span>
                        </div>
                      </div>

                      {/* Edit Controls */}
                      {editingJob === job._id ? (
                        <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-lg">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                            <Edit3 className="w-5 h-5 text-blue-600" />
                            <span>Edit Job Details</span>
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Deadline Edit */}
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                <Clock className="w-4 h-4 inline mr-2 text-orange-500" />
                                Job Deadline
                              </label>
                              <input
                                type="date"
                                value={editingDeadline}
                                onChange={(e) => setEditingDeadline(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                              />
                            </div>

                            {/* Owner Edit */}
                            <div className="space-y-2 relative dropdown-container">
                              <label className="block text-sm font-semibold text-gray-700">
                                <User className="w-4 h-4 inline mr-2 text-green-500" />
                                Job Owner
                              </label>
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={handleDropdownToggle}
                                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm flex items-center justify-between hover:bg-gray-50"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                      <span className="text-xs font-semibold text-blue-600">
                                        {getEmployeeById(editingOwner).avatar}
                                      </span>
                                    </div>
                                    <div className="text-left">
                                      <div className="font-medium text-gray-900">{getEmployeeById(editingOwner).name}</div>
                                      <div className="text-xs text-gray-500">{getEmployeeById(editingOwner).role}</div>
                                    </div>
                                  </div>
                                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${ownerDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {ownerDropdownOpen && (
                                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {employees.length === 0 ? (
                                      <div className="px-4 py-3 text-gray-500 text-center">
                                        No employees found
                                      </div>
                                    ) : (
                                      employees.map((employee) => (
                                        <button
                                          key={employee._id}
                                          type="button"
                                          onClick={(e) => handleOwnerSelect(employee._id, e)}
                                          className={`w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none flex items-center space-x-3 border-b border-gray-100 last:border-b-0 transition-colors ${
                                            editingOwner === employee._id ? 'bg-blue-100' : ''
                                          }`}
                                        >
                                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-semibold text-blue-600">
                                              {`${employee.username?.[0] || ''}${employee.lastName?.[0] || ''}` || '?'}
                                            </span>
                                          </div>
                                          <div className="flex-1">
                                            <div className="font-medium text-gray-900">
                                              {`${employee.username || ''} ${employee.lastName || ''}`.trim() || 'Unknown Employee'}
                                            </div>
                                            <div className="text-xs text-gray-500">{employee.jobTitle || employee.role || 'Employee'}</div>
                                            <div className="text-xs text-gray-400 font-mono">{employee._id}</div>
                                          </div>
                                          {editingOwner === employee._id && (
                                            <CheckCircle className="w-4 h-4 text-blue-600" />
                                          )}
                                        </button>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-end space-x-3 mt-6">
                            <button
                              onClick={handleCancelEdit}
                              className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-md"
                            >
                              <X className="w-4 h-4" />
                              <span>Cancel</span>
                            </button>
                            <button
                              onClick={() => handleSaveEdit(job._id)}
                              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
                            >
                              <Save className="w-4 h-4" />
                              <span>Save Changes</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditClick(job)}
                          className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium border border-blue-200 hover:border-blue-300 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Edit Details</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600 font-medium">{job.status || 'Active'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Content */}
                <div className="p-6">
                  {/* Job Description */}
                  <div className="mb-6">
                    <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <span>Job Description</span>
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <p className="text-gray-700 leading-relaxed">{job.JobDescription || 'No description provided.'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {job.Requirements && job.Requirements.length > 0 && (
                        <div>
                          <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                            <CheckCircle className="w-5 h-5 text-red-500" />
                            <span>Requirements</span>
                          </h3>
                          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                            <ul className="space-y-2">
                              {job.Requirements.map((req, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <span className="text-red-500 mt-1">•</span>
                                  <span className="text-gray-700">{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {job.Qualifications && job.Qualifications.length > 0 && (
                        <div>
                          <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                            <Target className="w-5 h-5 text-green-500" />
                            <span>Qualifications</span>
                          </h3>
                          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <ul className="space-y-2">
                              {job.Qualifications.map((qual, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <span className="text-green-500 mt-1">•</span>
                                  <span className="text-gray-700">{qual}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {job.Responsibilities && job.Responsibilities.length > 0 && (
                        <div>
                          <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                            <Briefcase className="w-5 h-5 text-purple-500" />
                            <span>Responsibilities</span>
                          </h3>
                          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <ul className="space-y-2">
                              {job.Responsibilities.map((resp, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <span className="text-purple-500 mt-1">•</span>
                                  <span className="text-gray-700">{resp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {job.Tags && job.Tags.length > 0 && (
                        <div>
                          <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                            <Tag className="w-5 h-5 text-indigo-500" />
                            <span>Skills & Technologies</span>
                          </h3>
                          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                            <div className="flex flex-wrap gap-2">
                              {job.Tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full font-medium border border-indigo-200"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                          <User className="w-5 h-5 text-gray-600" />
                          <span>Job Details</span>
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 font-medium">Posted By:</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-semibold text-blue-600">
                                    {getEmployeeById(job.PostedBy?._id || job.PostedBy || '').avatar}
                                  </span>
                                </div>
                                <span className="text-gray-900 font-medium">
                                  {job.PostedBy?.name || getEmployeeById(job.PostedBy?._id || job.PostedBy || '').name}
                                </span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">Job ID:</span>
                              <span className="text-gray-900 font-mono text-xs bg-gray-100 px-2 py-1 rounded">{job._id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">Experience Required:</span>
                              <span className="text-gray-900 font-semibold">{job.JobExperienceYears || 0}+ years</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListingsUI;