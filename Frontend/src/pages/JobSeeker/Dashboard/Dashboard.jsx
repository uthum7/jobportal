import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, CheckCircle, Clock, X, FileText, User, TrendingUp, Target } from 'lucide-react';
import JobseekerSidebar from '../../../components/JobSeeker/JobseekerSidebar/JobseekerSidebar';
import { getUserId, isAuthenticated, isJobSeeker, getToken } from '../../../utils/auth';
import { useCVForm } from '../../../context/CVFormContext';

const skillMatchData = [
  { skill: 'React', userLevel: 8, requiredLevel: 9 },
  { skill: 'JavaScript', userLevel: 9, requiredLevel: 8 },
  { skill: 'Node.js', userLevel: 6, requiredLevel: 8 },
  { skill: 'Python', userLevel: 4, requiredLevel: 7 },
  { skill: 'SQL', userLevel: 7, requiredLevel: 6 },
  { skill: 'AWS', userLevel: 3, requiredLevel: 8 }
];

const getDashboardCompletionStatus = (resumeData) => {
  if (!resumeData) return {};
  const {
    personalInfo,
    educationDetails,
    professionalExperience,
    skill,
    summary,
    references,
  } = resumeData;
  return {
    personalinfo: !!(personalInfo?.fullname && personalInfo?.email && personalInfo?.birthday && personalInfo?.gender),
    education: !!(educationDetails?.schoolName || educationDetails?.universitiyName),
    experience: professionalExperience && professionalExperience.length > 0,
    skills: skill && skill.length > 0,
    summary: summary && summary.length > 20,
    references: references && references.length > 0,
    preview: false,
  };
};

const JobSeekerDashboard = () => {
  // State for animations
  const [animationComplete, setAnimationComplete] = useState(false);
  const { resumeData, fetchResumeData } = useCVForm();

  // Dashboard CV status state
  const [dashboardCompletionStatus, setDashboardCompletionStatus] = useState({});

  useEffect(() => {
    if (resumeData) {
      const {
        personalInfo,
        educationDetails,
        professionalExperience,
        skill,
        summary,
        references,
      } = resumeData;

      // Check if education has meaningful data
      const hasMeaningfulEducation = Array.isArray(educationDetails) && 
        educationDetails.length > 0 && 
        educationDetails.some(edu => 
          edu.institute || edu.educationLevel || edu.fieldOfStudy || edu.gpaOrGrade
        );

      // Updated logic: use array checks for education, experience, skills, references
      const newCompletionStatus = {
        personalinfo: !!(personalInfo?.fullname && personalInfo?.email && personalInfo?.birthday && personalInfo?.gender),
        education: hasMeaningfulEducation,
        experience: Array.isArray(professionalExperience) && professionalExperience.length > 0,
        skills: Array.isArray(skill) && skill.length > 0,
        summary: summary && summary.length > 20,
        references: Array.isArray(references) && references.length > 0,
        preview: false,
      };

      console.log('CV Data received:', resumeData);
      console.log('Completion status:', newCompletionStatus);
      console.log('Personal Info details:', {
        fullname: personalInfo?.fullname,
        email: personalInfo?.email,
        birthday: personalInfo?.birthday,
        gender: personalInfo?.gender,
        hasFullname: !!personalInfo?.fullname,
        hasEmail: !!personalInfo?.email,
        hasBirthday: !!personalInfo?.birthday,
        hasGender: !!personalInfo?.gender
      });
      console.log('Education details:', {
        isArray: Array.isArray(educationDetails),
        length: educationDetails?.length,
        data: educationDetails
      });
      console.log('Education data content:', educationDetails?.[0]);
      console.log('Has meaningful education:', hasMeaningfulEducation);
      console.log('Experience details:', {
        isArray: Array.isArray(professionalExperience),
        length: professionalExperience?.length,
        data: professionalExperience
      });
      console.log('Skills details:', {
        isArray: Array.isArray(skill),
        length: skill?.length,
        data: skill
      });
      console.log('Summary details:', {
        summary: summary,
        length: summary?.length,
        hasRequiredLength: summary && summary.length > 20
      });
      console.log('References details:', {
        isArray: Array.isArray(references),
        length: references?.length,
        data: references
      });

      setDashboardCompletionStatus(newCompletionStatus);
    }
  }, [resumeData]);

  // Calculate CV completion percentage (DASHBOARD LOGIC)
  const getDashboardCVCompletionPercentage = () => {
    if (!dashboardCompletionStatus) return 0;
    const totalSections = 6; // personalinfo, education, experience, skills, summary, references (excluding preview)
    const completed = Object.values(dashboardCompletionStatus || {}).filter(Boolean).length;
    const percentage = Math.round((completed / totalSections) * 100);
    console.log('CV Completion calculation:', { completed, totalSections, percentage });
    return percentage;
  };
  const dashboardCvProgress = getDashboardCVCompletionPercentage();
  const dashboardCompletedSections = Object.keys(dashboardCompletionStatus || {}).filter(key => dashboardCompletionStatus[key] && key !== 'preview');
  const dashboardMissingSections = Object.keys(dashboardCompletionStatus || {}).filter(key => !dashboardCompletionStatus[key] && key !== 'preview');
  
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
    fetchResumeData();

    // Fetch real dashboard data
    fetchDashboardData();

    return () => {
      // clearInterval(timer); // This line was removed as per the new_code
    };
  }, [userId, navigate]); // Removed resumeData to prevent infinite re-renders

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
      let firstName = 'Gimhani';
      try {
        const userResponse = await axios.get(`http://localhost:5001/api/register/users/${userId}`, config);
        firstName = userResponse.data.firstName || 'User';
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
      <div className="circular-progress" style={{ width: size, height: size }}>
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
        <div className="progress-text">{percentage}%</div>
      </div>
    );
  };

  // Don't render if user is not authenticated or not a job seeker
  if (!isAuthenticated() || !isJobSeeker()) {
    return (
      <div className="dashboard-containerJS">
        <div className="main-contentJS">
          <div className="error-container">
            <h2>Access Denied</h2>
            <p>You need to be logged in as a Job Seeker to view the dashboard.</p>
            <Link to="/login" className="login-button">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-containerJS">
        <JobseekerSidebar />
        <main className="main-contentJS">
          <div className="loading-container">
            <p>Loading your dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-containerJS">
      <JobseekerSidebar />
      <div className="main-content-wrapper">
        <main className="main-contentJS">
          <header className="header">
            <h1 className="page-title">
              Welcome Back, {dashboardData.firstName}! 👋
            </h1>
            <nav className="breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <span>Dashboard</span>
            </nav>
          </header>

          {error && (
            <div className="error-message">
              <p>Error: {error}</p>
              <button onClick={fetchDashboardData} className="retry-button">
                Try Again
              </button>
            </div>
          )}

          {/* Stats Cards */}
          <section className="stats-container">
            <div className={`stats-card saved-jobs-card ${animationComplete ? 'animate-fade-in' : ''}`}>
              <div className="icon-container saved-icon">
                <FileText className="stats-icon" />
              </div>
              <div className="stats-info">
                <p className="stats-number">{dashboardData.savedJobsCount}</p>
                <p className="stats-label">Saved Jobs</p>
              </div>
            </div>

            <div className={`stats-card applied-jobs-card ${animationComplete ? 'animate-fade-in' : ''}`} style={{ animationDelay: '0.1s' }}>
              <div className="icon-container applied-icon">
                <TrendingUp className="stats-icon" />
              </div>
              <div className="stats-info">
                <p className="stats-number">{dashboardData.appliedJobsCount}</p>
                <p className="stats-label">Applied Jobs</p>
              </div>
            </div>

            <div className={`stats-card pending-jobs-card ${animationComplete ? 'animate-fade-in' : ''}`} style={{ animationDelay: '0.2s' }}>
              <div className="icon-container pending-icon">
                <Clock className="stats-icon" />
              </div>
              <div className="stats-info">
                <p className="stats-number">{dashboardData.pendingApplications}</p>
                <p className="stats-label">Pending Applications</p>
              </div>
            </div>

            <div className={`stats-card accepted-jobs-card ${animationComplete ? 'animate-fade-in' : ''}`} style={{ animationDelay: '0.3s' }}>
              <div className="icon-container accepted-icon">
                <CheckCircle className="stats-icon" />
              </div>
              <div className="stats-info">
                <p className="stats-number">{dashboardData.acceptedApplications}</p>
                <p className="stats-label">Accepted Applications</p>
              </div>
            </div>

            <div className={`stats-card rejected-jobs-card ${animationComplete ? 'animate-fade-in' : ''}`} style={{ animationDelay: '0.4s' }}>
              <div className="icon-container rejected-icon">
                <X className="stats-icon" />
              </div>
              <div className="stats-info">
                <p className="stats-number">{dashboardData.rejectedApplications}</p>
                <p className="stats-label">Rejected Applications</p>
              </div>
            </div>
          </section>

          {/* Main Content Grid */}
          <div className="content-grid">
            {/* Recent Applications */}
            <div className="recent-applications">
              <h3 className="chart-title">
                <Calendar />
                Recent Applications
              </h3>
              <div className="applications-list">
                {recentApplications.length > 0 ? (
                  recentApplications.map((app, index) => (
                    <div key={app.id} className={`application-item ${animationComplete ? 'animate-slide-in' : ''}`} style={{ animationDelay: `${index * 0.1}s `}}>
                      <div className="status-icon" style={{ backgroundColor: getStatusColor(app.status) + '20', color: getStatusColor(app.status) }}>
                        {getStatusIcon(app.status)}
                      </div>
                      <div className="application-info">
                        <h4 className="job-title">{app.jobTitle}</h4>
                        <p className="company-name">Applied on {formatDate(app.applyDate)}</p>
                      </div>
                      <div className="application-meta">
                        <p className="application-status" style={{ color: getStatusColor(app.status) }}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </p>
                        <p className="application-date">{formatDate(app.applyDate)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                    <p>No recent applications</p>
                    <Link to="/JobSeeker/apply-for-job" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                      Start applying to jobs →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Application Status Pie Chart */}
            <div className="chart-card">
              <h3 className="chart-title">
                <Target />
                Application Status
              </h3>
              <div className="chart-container">
                {applicationStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={applicationStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b' }}>
                    <p>No application data available</p>
                  </div>
                )}
              </div>
              {applicationStatusData.length > 0 && (
                <div className="chart-legend">
                  {applicationStatusData.map((entry, index) => (
                    <div key={index} className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: entry.color }}></div>
                      <span className="legend-label">{entry.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Secondary Grid */}
          <div className="secondary-grid">
            {/* CV Completion */}
            <div className="chart-card">
              <h3 className="chart-title">
                <User />
                CV Completion
              </h3>
              <div className="cv-progress-content">
                <CircularProgress percentage={dashboardCvProgress} />
                <div className="cv-progress-info">
                  <p>
                    {dashboardCompletedSections.length} of 6 sections completed
                  </p>
                  <p style={{ fontSize: '0.75rem' }}>
                    Missing: {dashboardMissingSections.map(section => section.charAt(0).toUpperCase() + section.slice(1)).join(', ')}
                  </p>
                  <button className="complete-cv-btn" onClick={fetchResumeData}>
                    Refresh CV Data
                  </button>
                </div>
              </div>
            </div>

            {/* Skill Gap Analysis */}
            <div className="chart-card">
              <h3 className="chart-title">
                <TrendingUp />
                Skill Gap Analysis
              </h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
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
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
                  <span className="legend-label">Your Level</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
                  <span className="legend-label">Required Level</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;