import React, { useEffect, useState } from 'react';
import "./style.css";
import axios from 'axios';
import { Users, Briefcase, CheckCircle, Clock, Calendar } from 'lucide-react';
import EmployeeDashboardChart from './Chart/EmployeeDashboardChart';
import EmployeeDashboardJobs from './Jobs/EmployeeDashboardJobs';
import JobTypeChart from './Chart/JobTypeChart';
import JobModeChart from './Chart/JobModeChart';
import ExperienceLevelChart from './Chart/ExperienceLevelChart';

const EmployeeDashboard = () => {
    const [dashboardStats, setDashboardStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        expiredJobs: 0,
        jobsThisMonth: 0,
        jobsThisWeek: 0,
        experienceDistribution: []
    });
    const [employeeData, setEmployeeData] = useState({
        fullName: '',
        username: ''
    });
    const [loading, setLoading] = useState(true);
    const [employeeLoading, setEmployeeLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get employee ID from localStorage
    const getEmployeeId = () => {
        try {
            const userString = localStorage.getItem('user');
            if (!userString) {
                console.error('No user data found in localStorage');
                return null;
            }
            
            const userData = JSON.parse(userString);
            
            if (userData.userId) {
                return userData.userId;
            }
            
            console.error('No userId found in user data:', userData);
            return null;
        } catch (err) {
            console.error('Error parsing user data from localStorage:', err);
            return null;
        }
    };

    // Fetch employee data
    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                setEmployeeLoading(true);
                const employeeId = getEmployeeId();
                
                if (!employeeId) {
                    throw new Error('No employee ID found');
                }

                const response = await axios.get(`http://localhost:5001/api/users/employees/${employeeId}`);
                
                if (response.status === 200) {
                    setEmployeeData(response.data);
                }
            } catch (err) {
                console.error('Error fetching employee data:', err);
                // Keep default values if API fails, don't set error for this
            } finally {
                setEmployeeLoading(false);
            }
        };

        fetchEmployeeData();
    }, []);

    // Fetch dashboard stats
    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:5001/api/dashboard/stats");
                if (response.data.success) {
                    setDashboardStats(response.data.stats);
                }
            } catch (err) {
                console.error("Error fetching dashboard stats:", err);
                setError("Failed to load dashboard statistics");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    // Get display name for the user
    const getDisplayName = () => {
        if (employeeLoading) return "Loading...";
        
        if (employeeData.fullName && employeeData.fullName.trim() !== '') {
            // Extract first name from full name
            return employeeData.fullName.split(' ')[0];
        }
        
        if (employeeData.username && employeeData.username.trim() !== '') {
            return employeeData.username;
        }
        
        return "User";
    };

    const StatCard = ({ icon: Icon, title, value, subtitle, color, trend, bgColor }) => (
        <div className={`stat-card ${color}`}>
            <div className="stat-card-content">
                <div className="stat-icon-wrapper">
                    <div className={`stat-icon ${bgColor}`}>
                        <Icon size={30} />
                    </div>
                </div>
                <div className="stat-details">
                    <div className="stat-number">{loading ? "..." : value}</div>
                    <div className="stat-label">{title}</div>
                    {subtitle && <div className="stat-subtitle">{subtitle}</div>}
                </div>
                {trend && (
                    <div className="stat-trend">
                        <span className="trend-arrow">↗</span>
                        <span className="trend-value">{trend}</span>
                    </div>
                )}
            </div>
        </div>
    );

    if (error) {
        return (
            <div className="dashboard-container">
                <div className="error-state">
                    <div className="error-icon">⚠️</div>
                    <h2>Oops! Something went wrong</h2>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="retry-button">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="header-content">
                    <div className="welcome-section">
                        <h1 className="dashboard-title">
                            Welcome Back, {getDisplayName()}! 👋
                        </h1>
                        <p className="dashboard-subtitle">Here's what's happening with your job postings today</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-container">
                <StatCard
                    icon={Users}
                    title="Total Jobs"
                    value={dashboardStats.totalJobs}
                    subtitle="All posted positions"
                    color="primary"
                    bgColor="blue"
                    trend="+12%"
                />
                <StatCard
                    icon={Users}
                    title="Active Jobs"
                    value={dashboardStats.activeJobs}
                    subtitle="Currently accepting applications"
                    color="success"
                    bgColor="green"
                    trend="+8%"
                />
                <StatCard
                    icon={Users}
                    title="Expired Jobs"
                    value={dashboardStats.expiredJobs}
                    subtitle="Past deadline"
                    color="warning"
                    bgColor="orange"
                />
                <StatCard
                    icon={Users}
                    title="This Month"
                    value={dashboardStats.jobsThisMonth}
                    subtitle="Jobs posted this month"
                    color="info"
                    bgColor="purple"
                    trend="+24%"
                />
            </div>

            {/* Charts Section */}
            <div className="charts-section">
                {/* Main Chart */}
                <div className="main-chart">
                    <EmployeeDashboardChart />
                </div>

                {/* Side Charts */}
                <div className="side-charts">
                    <div className="chart-item">
                        <JobTypeChart />
                    </div>
                    <div className="chart-item">
                        <JobModeChart />
                    </div>
                </div>
            </div>

            {/* Additional Charts */}
            <div className="additional-charts">
                <div className="chart-item">
                    <ExperienceLevelChart />
                </div>
            </div>

            {/* Jobs Section */}
            <div className="jobs-section">
                <EmployeeDashboardJobs />
            </div>
        </div>
    );
};

export default EmployeeDashboard;