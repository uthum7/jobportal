import React from 'react';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Line, ResponsiveContainer } from 'recharts';
import { 
  FiHome, 
  FiUser, 
  FiFileText, 
  FiBriefcase, 
  FiBookmark, 
  FiMessageCircle, 
  FiMail, 
  FiLock, 
  FiTrash2, 
  FiLogOut 
} from 'react-icons/fi';
import './Dashboard.css';
import jobseeker from "/src/assets/img/JobSeeker/jobseeker.png";
import JobseekerSidebar from '../../../components/JobseekerSidebar/JobseekerSidebar';
import Footer from '../../../components/Footer/Footer';


const monthlyData = [
  { name: 'January', applied: 65, saved: 50 },
  { name: 'February', applied: 110, saved: 85 },
  { name: 'March', applied: 140, saved: 80 },
  { name: 'April', applied: 120, saved: 70 },
  { name: 'May', applied: 75, saved: 80 },
  { name: 'June', applied: 85, saved: 150 },
  { name: 'July', applied: 150, saved: 200 },
  { name: 'August', applied: 180, saved: 160 },
  { name: 'September', applied: 155, saved: 140 },
  { name: 'October', applied: 125, saved: 120 },
  { name: 'November', applied: 150, saved: 130 },
  { name: 'December', applied: 240, saved: 150 },
];

const JobseekerDashboard = () => {
  return (
    <div className="dashboard-container">
      <JobseekerSidebar />

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1 className="page-title">Welcome Back Gimhani!</h1>
          <div className="breadcrumb">
            <span>Home</span>
            <span className="breadcrumb-separator">/</span>
            <span>Dashboard</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-container">
          <div className="stats-card">
            <div className="icon-container">
              <FiBriefcase className="stats-icon" style={{ color: "#107C5A" }}/>
            </div>
            <div className="stats-info">
              <h2 className="stats-number">523</h2>
              <p className="stats-label">Applied jobs</p>
            </div>
          </div>
          <div className="stats-card">
            <div className="icon-container">
              <FiBookmark className="stats-icon" style={{ color: "#FFA410" }}/>
            </div>
            <div className="stats-info">
              <h2 className="stats-number">523</h2>
              <p className="stats-label">Saved jobs</p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="chart-container">
          <h2 className="chart-title">Analysis Chart</h2>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color applied"></div>
              <span>Applied Jobs</span>
            </div>
            <div className="legend-item">
              <div className="legend-color saved"></div>
              <span>Saved Jobs</span>
            </div>
          </div>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="applied" stroke="#10B981" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="saved" stroke="#F59E0B" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


      <Footer />
    </div>
  );
};

export default JobseekerDashboard;