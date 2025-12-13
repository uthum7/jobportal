import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, CheckCircle, Clock, X, FileText, User, TrendingUp, Target } from 'lucide-react';
import JobseekerSidebar from '../../../components/JobSeeker/JobseekerSidebar/JobseekerSidebar';
import { getUserId, isAuthenticated, isJobSeeker, getToken } from '../../../utils/auth';
import { useCVForm } from '../../../context/CVFormContext';

// Helper function to capitalize first word (first name)
const capitalizeFirstWord = (str) => {
  if (!str) return '';
  return str.split(' ')[0].replace(/\b\w/g, (c) => c.toUpperCase());
};

const skillMatchData = [
  { skill: 'React', userLevel: 8, requiredLevel: 9 },
  { skill: 'JavaScript', userLevel: 9, requiredLevel: 8 },
  { skill: 'Node.js', userLevel: 6, requiredLevel: 8 },
  { skill: 'Python', userLevel: 4, requiredLevel: 7 },
  { skill: 'SQL', userLevel: 7, requiredLevel: 6 },
  { skill: 'AWS', userLevel: 3, requiredLevel: 8 }
];



const JobSeekerDashboard = () => {
  // State for animations
  const [animationComplete, setAnimationComplete] = useState(false);
  const { resumeData, fetchResumeData, completionStatus } = useCVForm();

  // Calculate CV completion percentage using context's completionStatus
  const getDashboardCVCompletionPercentage = () => {
    console.log('getDashboardCVCompletionPercentage called with completionStatus:', completionStatus);
    if (!completionStatus) return 0;
    const totalSections = 6; // personalinfo, education, experience, skills, summary, references (excluding preview)
    const completed = Object.values(completionStatus || {}).filter(Boolean).length;
    const percentage = Math.round((completed / totalSections) * 100);
    console.log('CV Completion calculation:', { completed, totalSections, percentage });
    return percentage;
  };
  const dashboardCvProgress = getDashboardCVCompletionPercentage();
  const dashboardCompletedSections = Object.keys(completionStatus || {}).filter(key => completionStatus[key] && key !== 'preview');
  const dashboardMissingSections = Object.keys(completionStatus || {}).filter(key => !completionStatus[key] && key !== 'preview');
  
  // State for real user data
  const [dashboardData, setDashboardData] = useState({
    firstName: '',
    savedJobsCount: 0,
    appliedJobsCount: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0
  });
  
  const [recentApplications, setRecentApplications] = useState([]);
  const [applicationStatusData, setApplicationStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const userId = getUserId();
  const token = getToken();

  useEffect(() => {
    // Check if user is authenticated and is a job seeker
    if (!isAuthenticated() || !isJobSeeker() || !userId) {
      console.warn("User not authenticated or not authorized as job seeker");
      navigate("/login");
      return;
    }

    // Trigger animations on mount
    setTimeout(() => setAnimationComplete(true), 100);
    
    // Fetch CV data to ensure completion status is up to date
    const fetchCVData = async () => {
      try {
        await fetchResumeData();
      } catch (error) {
        console.warn("Failed to fetch CV data:", error);
        // Don't redirect on CV fetch failure, just log the error
      }
    };
    
    fetchCVData();

    // Fetch real dashboard data
    fetchDashboardData();

    return () => {
      // clearInterval(timer); // This line was removed as per the new_code
    };
  }, [userId, navigate, fetchResumeData]); // Added fetchResumeData to dependencies

  const fetchDashboardData = async () => {
    if (!userId) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Fetch user profile for first name
      let firstName = 'User';
      try {
        const userResponse = await axios.get(`http://localhost:5001/api/register/users/${userId}`, config);
        // Use username field like in JobSeekerSidebar, fallback to firstName or other fields
        const rawName = userResponse.data.username || userResponse.data.firstName || userResponse.data.fullName || 'User';
        firstName = capitalizeFirstWord(rawName);
      } catch (err) {
        console.warn("Could not fetch user profile:", err);
      }

      // Fetch saved jobs count
      let savedJobsCount = 0;
try {
  const savedJobsResponse = await axios.get(`http://localhost:5001/api/saved-jobs/user/${userId}`, config);

  // Extract the saved job IDs array from response.data.data
  if (savedJobsResponse.data && Array.isArray(savedJobsResponse.data.data)) {
    savedJobsCount = savedJobsResponse.data.data.length;
  }
} catch (err) {
  console.warn("Could not fetch saved jobs count:", err);
}


      // Fetch applied jobs data
      let appliedJobsData = [];
      let appliedJobsCount = 0;
      let pendingApplications = 0;
      let acceptedApplications = 0;
      let rejectedApplications = 0;

      try {
        const appliedJobsResponse = await axios.get(`http://localhost:5001/api/applied-jobs/${userId}`, config);
        appliedJobsData = appliedJobsResponse.data || [];
        appliedJobsCount = appliedJobsData.length;

        // Count applications by status
        appliedJobsData.forEach(app => {
          switch (app.status) {
            case 'pending':
              pendingApplications++;
              break;
            case 'reviewed':
              pendingApplications++; // Treat reviewed as pending for display
              break;
            case 'shortlisted':
              acceptedApplications++; // Treat shortlisted as accepted for display
              break;
            case 'accepted':
              acceptedApplications++;
              break;
            case 'rejected':
              rejectedApplications++;
              break;
            default:
              pendingApplications++;
          }
        });
      } catch (err) {
        console.warn("Could not fetch applied jobs:", err);
      }

      // Update dashboard data
      setDashboardData({
        firstName,
        savedJobsCount,
        appliedJobsCount,
        pendingApplications,
        acceptedApplications,
        rejectedApplications
      });

      // Set recent applications (last 5 applications)
      const recentApps = appliedJobsData
        .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
        .slice(0, 5)
        .map(app => ({
          id: app._id,
          jobTitle: app.job.JobTitle,
          applyDate: app.appliedDate,
          status: app.status
        }));
      
      setRecentApplications(recentApps);

      // Set application status data for pie chart
      const statusData = [];
      if (pendingApplications > 0) {
        statusData.push({ name: 'Pending', value: pendingApplications, color: '#f59e0b' });
      }
      if (acceptedApplications > 0) {
        statusData.push({ name: 'Accepted', value: acceptedApplications, color: '#10b981' });
      }
      if (rejectedApplications > 0) {
        statusData.push({ name: 'Rejected', value: rejectedApplications, color: '#ef4444' });
      }
      
      setApplicationStatusData(statusData);
      setLoading(false);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      
      if (error.response?.status === 401) {
        console.warn("Authentication failed, redirecting to login");
        navigate("/login");
        return;
      }
      
      setError(error.response?.data?.message || "Failed to fetch dashboard data");
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
      case 'reviewed':
        return '#f59e0b';
      case 'accepted':
      case 'shortlisted':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
      case 'reviewed':
        return <Clock className="w-4 h-4" />;
      case 'accepted':
      case 'shortlisted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <X className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const CircularProgress = ({ percentage, size = 120 }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#3b82f6"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold text-gray-700">{percentage}%</span>
        </div>
      </div>
    );
  };

  // Don't render if user is not authenticated or not a job seeker
  if (!isAuthenticated() || !isJobSeeker()) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-4">You need to be logged in as a Job Seeker to view the dashboard.</p>
            <Link to="/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <JobseekerSidebar />
        <div className="flex-1 lg:ml-0">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <JobseekerSidebar />
      <div className="flex-1 lg:ml-0">
        <div className="p-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back, {dashboardData.firstName}! 👋
            </h1>
            <nav className="text-sm text-gray-600">
              <Link to="/" className="text-blue-600 hover:text-blue-700">Home</Link>
              <span className="mx-2">/</span>
              <span>Dashboard</span>
            </nav>
          </header>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">Error: {error}</p>
              <button onClick={fetchDashboardData} className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                Try Again
              </button>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Link to="/JobSeeker/saved-jobs" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <FileText className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-800">{dashboardData.savedJobsCount}</p>
                  <p className="text-sm text-gray-600">Saved Jobs</p>
                </div>
              </div>
            </Link>

            <Link to="/JobSeeker/applied-jobs" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-800">{dashboardData.appliedJobsCount}</p>
                  <p className="text-sm text-gray-600">Applied Jobs</p>
                </div>
              </div>
            </Link>

            <Link to="/JobSeeker/applied-jobs?filter=pending" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-800">{dashboardData.pendingApplications}</p>
                  <p className="text-sm text-gray-600">Pending Applications</p>
                </div>
              </div>
            </Link>

            <Link to="/JobSeeker/applied-jobs?filter=accepted" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-800">{dashboardData.acceptedApplications}</p>
                  <p className="text-sm text-gray-600">Accepted Applications</p>
                </div>
              </div>
            </Link>

            <Link to="/JobSeeker/applied-jobs?filter=rejected" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg">
                  <X className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-800">{dashboardData.rejectedApplications}</p>
                  <p className="text-sm text-gray-600">Rejected Applications</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Applications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Recent Applications
                </h3>
                {recentApplications.length > 3 && (
                  <Link 
                    to="/JobSeeker/applied-jobs"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    See All
                  </Link>
                )}
              </div>
              <div className="space-y-4">
                {recentApplications.length > 0 ? (
                  recentApplications.slice(0, 3).map((app, index) => (
                    <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full" style={{ backgroundColor: getStatusColor(app.status) + '20' }}>
                          <div style={{ color: getStatusColor(app.status) }}>
                            {getStatusIcon(app.status)}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{app.jobTitle}</h4>
                          <p className="text-sm text-gray-600">Applied on {formatDate(app.applyDate)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium" style={{ color: getStatusColor(app.status) }}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No recent applications</p>
                    <Link to="/JobSeeker/apply-for-job" className="text-blue-600 hover:text-blue-700 text-sm">
                      Start applying to jobs →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Application Status Pie Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Application Status
              </h3>
              <div className="h-48">
                {applicationStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={applicationStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {applicationStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>No application data available</p>
                  </div>
                )}
              </div>
              {applicationStatusData.length > 0 && (
                <div className="flex justify-center space-x-4 mt-4">
                  {applicationStatusData.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                      <span className="text-sm text-gray-600">{entry.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Secondary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CV Completion */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                CV Completion
              </h3>
              <div className="flex items-center space-x-6">
                <CircularProgress percentage={dashboardCvProgress} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">
                    {dashboardCompletedSections.length} of 6 sections completed
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Missing: {dashboardMissingSections.map(section => section.charAt(0).toUpperCase() + section.slice(1)).join(', ')}
                  </p>
                  <button 
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                    onClick={fetchResumeData}
                  >
                    Refresh CV Data
                  </button>
                </div>
              </div>
            </div>

            {/* Skill Gap Analysis */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Skill Gap Analysis
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillMatchData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Bar dataKey="userLevel" fill="#3b82f6" name="Your Level" />
                    <Bar dataKey="requiredLevel" fill="#f59e0b" name="Required Level" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-600">Your Level</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-sm text-gray-600">Required Level</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;