import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  User, Mail, Clock, Briefcase, Eye, MapPin, Calendar, Phone
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {useNavigate } from 'react-router-dom';


const colorClasses = {
  green: {
    text: 'text-green-600',
    bg: 'bg-green-500'
  },
  blue: {
    text: 'text-blue-600',
    bg: 'bg-blue-500'
  },
  purple: {
    text: 'text-purple-600',
    bg: 'bg-purple-500'
  },
  gray: {
    text: 'text-gray-600',
    bg: 'bg-gray-400'
  }
};

const EnhancedEmployeeInfo = () => {
  const { id } = useParams();
  const [employeeData, setEmployeeData] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [applicationCount, setApplicationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/users/employees/${id}`);
        setEmployeeData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load employee data');
      }
    };

    const fetchRecentJobs = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/users/recent/${id}`);
        setRecentJobs(res.data);
      } catch (err) {
        console.error('Error fetching recent jobs:', err);
      }
    };

    const fetchApplicationCount = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/users/applicationcount/${id}`);
        setApplicationCount(res.data.count);
      } catch (err) {
        console.error('Error fetching application count:', err);
      }
    };

    const loadData = async () => {
      await Promise.all([
        fetchEmployee(),
        fetchRecentJobs(),
        fetchApplicationCount()
      ]);
      setLoading(false);
    };

    loadData();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">Employee Information</h1>
          <p className="text-gray-600">View detailed employee information and job postings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-white px-6 py-5 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-semibold text-blue-600">
                      {employeeData.fullName?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{employeeData.username}</h2>
                    <p className="text-gray-600">{employeeData.position || 'Employee'}</p>
                    <p className="text-sm text-gray-500">{employeeData.department || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard icon={<User />} label="Employee ID" value={employeeData._id} />
                  <InfoCard icon={<Mail />} label="Email Address" value={employeeData.email} />
                  <InfoCard icon={<Clock />} label="Last Login" value={employeeData.updatedAt || 'N/A'} />
                  <InfoCard icon={<Phone />} label="Phone Number" value={employeeData.phone || 'N/A'} />
                  <InfoCard icon={<Calendar />} label="Join Date" value={employeeData.createdAt || 'N/A'} />
                  <InfoCard icon={<MapPin />} label="Address" value={employeeData.address || 'N/A'} />
                </div>
              </div>
            </div>

            {/* Recent Jobs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Job Postings</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Briefcase className="w-4 h-4" />
                  <span>Last 3 posts</span>
                </div>
              </div>

              <div className="space-y-3">
                {recentJobs.length === 0 && (
                  <p className="text-sm text-gray-500">No recent jobs posted by this employee.</p>
                )}
                {recentJobs.map((job) => (
                  <div key={job._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{job.JobTitle}</h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{job.applications || 0} applications</span>
                          <span>•</span>
                          <span>{formatDistanceToNow(new Date(job.postedDate), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      job.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Job Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Job Postings</h3>
              <p className="text-sm text-gray-600 mb-4">Total jobs posted by this employee</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="text-3xl font-bold text-green-600 mb-1">{employeeData.jobsCount || recentJobs.length}</div>
                <p className="text-xs text-gray-500">Jobs in system</p>
              </div>
              <button
                  onClick={() => navigate(`/admin/viewalljobs/${employeeData._id}`)}
                  className="w-full bg-green-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View All Jobs ({employeeData.jobsCount || recentJobs.length})</span>
                </button>


            </div>

            {/* Performance */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Performance Overview</h4>
              <StatBar label="Active Jobs" value={recentJobs.filter(j => j.isActive).length} max={5} color="green" />
              <StatBar label="Total Applications" value={applicationCount} max={100} color="blue" />
              <StatBar label="Success Rate" value={92} max={100} color="purple" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
      {React.cloneElement(icon, { className: "w-5 h-5 text-blue-600" })}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900 text-sm">{value}</p>
    </div>
  </div>
);

const StatBar = ({ label, value, max, color }) => {
  const percent = Math.min((value / max) * 100, 100);
  const textColor = colorClasses[color]?.text || colorClasses.gray.text;
  const bgColor = colorClasses[color]?.bg || colorClasses.gray.bg;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        <span className={`text-sm font-medium ${textColor}`}>{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${bgColor} h-2 rounded-full`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
};

export default EnhancedEmployeeInfo;
