import React, { useState } from 'react';
import { User, Mail, Clock, Briefcase, Eye, ArrowRight, MapPin, Calendar, Phone } from 'lucide-react';

const EnhancedEmployeeInfo = () => {
  const [showAllJobs, setShowAllJobs] = useState(false);

  const employeeData = {
    id: 'EMP001',
    name: 'John Smith',
    email: 'john.smith@company.com',
    lastLogin: '2025-07-23 09:15 AM',
    jobsCount: 5,
    position: 'Senior HR Manager',
    department: 'Human Resources',
    joinDate: 'March 15, 2022',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY'
  };

  const recentJobs = [
    { id: 1, title: 'Frontend Developer', status: 'Active', applications: 24, posted: '2 days ago' },
    { id: 2, title: 'UI/UX Designer', status: 'Active', applications: 18, posted: '5 days ago' },
    { id: 3, title: 'Product Manager', status: 'Closed', applications: 32, posted: '1 week ago' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Information</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Employee Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                    <span className="text-2xl font-bold text-white">JS</span>
                  </div>
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">{employeeData.name}</h2>
                    <p className="text-blue-100 text-lg">{employeeData.position}</p>
                    <p className="text-blue-200 text-sm">{employeeData.department}</p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Employee ID */}
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Employee ID</p>
                      <p className="text-lg font-semibold text-gray-900">{employeeData.id}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email Address</p>
                      <p className="text-lg font-semibold text-gray-900 truncate">{employeeData.email}</p>
                    </div>
                  </div>

                  {/* Last Login */}
                  <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Last Login</p>
                      <p className="text-lg font-semibold text-gray-900">{employeeData.lastLogin}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Phone Number</p>
                      <p className="text-lg font-semibold text-gray-900">{employeeData.phone}</p>
                    </div>
                  </div>

                  {/* Join Date */}
                  <div className="flex items-center space-x-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Join Date</p>
                      <p className="text-lg font-semibold text-gray-900">{employeeData.joinDate}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-4 p-4 bg-teal-50 rounded-xl border border-teal-100">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Location</p>
                      <p className="text-lg font-semibold text-gray-900">{employeeData.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Jobs Preview */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Job Postings</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Briefcase className="w-4 h-4" />
                  <span>Last 3 posts</span>
                </div>
              </div>

              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{job.title}</h4>
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <span>{job.applications} applications</span>
                          <span>•</span>
                          <span>{job.posted}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      job.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Job Stats */}
          <div className="space-y-6">
            {/* Job Statistics Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Job Postings</h3>
                <p className="text-gray-600 mb-6">Total jobs posted by this employee</p>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {employeeData.jobsCount}
                  </div>
                  <p className="text-sm text-gray-600">Jobs in system</p>
                </div>

                <button 
                  onClick={() => setShowAllJobs(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <Eye className="w-5 h-5" />
                  <span>View All Jobs ({employeeData.jobsCount})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Performance Metrics</h4>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Jobs</span>
                  <span className="font-semibold text-green-600">3</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Applications</span>
                  <span className="font-semibold text-blue-600">74</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-semibold text-purple-600">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedEmployeeInfo;