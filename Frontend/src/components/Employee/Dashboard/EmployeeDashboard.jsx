import React, { useEffect, useState } from 'react';
import "./style.css";
import axios from 'axios';
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const StatCard = ({ iconText, title, value, subtitle, color, trend, bgColor }) => (
        <div className={`stat-card ${color}`}>
            <div className="stat-card-content">
                <div className="stat-icon-wrapper">
                    <div className={`stat-icon ${bgColor}`}>
                        <span className="stat-icon-text">{iconText}</span>
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
                        <h1 className="dashboard-title">Welcome Back, Hansamali! 👋</h1>
                        <p className="dashboard-subtitle">Here's what's happening with your job postings today</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-container">
                <StatCard
                    iconText="💼"
                    title="Total Jobs"
                    value={dashboardStats.totalJobs}
                    subtitle="All posted positions"
                    color="primary"
                    bgColor="blue"
                    trend="+12%"
                />
                <StatCard
                    iconText="✅"
                    title="Active Jobs"
                    value={dashboardStats.activeJobs}
                    subtitle="Currently accepting applications"
                    color="success"
                    bgColor="green"
                    trend="+8%"
                />
                <StatCard
                    iconText="⏰"
                    title="Expired Jobs"
                    value={dashboardStats.expiredJobs}
                    subtitle="Past deadline"
                    color="warning"
                    bgColor="orange"
                />
                <StatCard
                    iconText="📅"
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
