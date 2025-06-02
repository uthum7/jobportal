import React from 'react';
import { // Import Recharts components for data visualization
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ResponsiveContainer,
} from 'recharts';
import {
  FiBriefcase,
  FiBookmark
} from 'react-icons/fi';
import './Dashboard.css';
import JobseekerSidebar from '../../../components/JobSeeker/JobseekerSidebar/JobseekerSidebar';
import Footer from '../../../components/Footer/Footer';
import { Link } from 'react-router-dom';

// Sample data for the monthly job application chart
const monthlyData = [
  { name: 'January', applied: 12, saved: 45 },
  { name: 'February', applied: 4, saved: 8 },
  { name: 'March', applied: 14, saved: 8 },
  { name: 'April', applied: 12, saved: 7 },
  { name: 'May', applied: 5, saved: 8 },
  { name: 'June', applied: 8, saved: 15 },
  { name: 'July', applied: 15, saved: 20 },
  { name: 'August', applied: 18, saved: 16 },
  { name: 'September', applied: 15, saved: 14 },
  { name: 'October', applied: 12, saved: 12 },
  { name: 'November', applied: 15, saved: 13},
  { name: 'December', applied: 24, saved: 15 },
];

//Main dashboard view for job seekers showing statistics and analytics
const JobseekerDashboard = () => {
  return (
    // Main container for the entire dashboard page
    <div className="DashboardMainContainer">  
    
    {/* Dashboard container with sidebar and main content */} 
      <div className="dashboard-container">
        {/* Sidebar navigation for job seekers */}
        
        <JobseekerSidebar />
        
        {/* Main content area containing statistics and charts */}
        <div className="main-content">
          {/* Header section with welcome message and breadcrumb navigation */}
          <div className="header">
            <h1 className="page-title">Welcome Back Gimhani!</h1>
            {/* Breadcrumb navigation showing current location in app */}
            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">Home</Link>
              <span className="breadcrumb-separator">/</span>
              <span>Dashboard</span>
            </div>
          </div>
          
          {/* Statistics cards section showing key metrics */}
          <div className="stats-container">
            {/* Applied jobs statistics card */}
            <div className="stats-card">
              {/* Icon container with briefcase icon */}
              <div className="icon-container">
                <FiBriefcase className="stats-icon" style={{ color: "#107C5A" }} />
              </div>
              {/* Statistics information showing number and label */}
              <div className="stats-info">
                <h2 className="stats-number">52</h2>
                <p className="stats-label">Applied jobs</p>
              </div>
            </div>
            
            {/* Saved jobs statistics card */}
            <div className="stats-card">
              {/* Icon container with bookmark icon */}
              <div className="icon-container">
                <FiBookmark className="stats-icon" style={{ color: "#FFA410" }} />
              </div>
              {/* Statistics information showing number and label */}
              <div className="stats-info">
                <h2 className="stats-number">83</h2>
                <p className="stats-label">Saved jobs</p>
              </div>
            </div>
          </div>
          
          {/* Chart section for job application analytics */}
          <div className="chart-container">
            {/* Chart title */}
            <h2 className="chart-title">Analysis Chart</h2>
            
            {/* Chart legend showing what each line represents */}
            <div className="chart-legend">
              {/* Applied jobs legend item */}
              <div className="legend-item">
                <div className="legend-color applied"></div>
                <span>Applied Jobs</span>
              </div>
              {/* Saved jobs legend item */}
              <div className="legend-item">
                <div className="legend-color saved"></div>
                <span>Saved Jobs</span>
              </div>
            </div>
            
            {/* Chart visualization using Recharts */}
            <div className="chart-wrapper">
              {/* ResponsiveContainer makes chart adjust to parent container size */}
              <ResponsiveContainer width="100%" height={300}>
                {/* LineChart component showing applied vs saved jobs over time */}
                <LineChart 
                  data={monthlyData} 
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }} // Chart margins
                >
                  {/* Grid lines for better readability */}
                  <CartesianGrid strokeDasharray="3 3" />
                  {/* X-axis showing month names */}
                  <XAxis dataKey="name" />
                  {/* Y-axis for job counts */}
                  <YAxis  />
                  {/* Tooltip showing data on hover */}
                  <Tooltip />
                  {/* Line for applied jobs - green color with enlarged active dots */}
                  <Line 
                    type="monotone" 
                    dataKey="applied" 
                    stroke="#10B981" 
                    activeDot={{ r: 8 }} // Enlarged dots when active
                  />
                  {/* Line for saved jobs - amber color */}
                  <Line 
                    type="monotone" 
                    dataKey="saved" 
                    stroke="#F59E0B" 
                    activeDot={{ r: 8 }} // Enlarged dots when active
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer section at the bottom of the page */}
      <div className="footer1">
        <Footer />
      </div>
    </div>
  );
};

export default JobseekerDashboard;