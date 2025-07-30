<<<<<<< HEAD
import React from 'react'
import "./style.css"
const EmployeeDashboard = () => {
    return (
        <>
            <div className="main-header">
                <h1>Welcome Back Admin, </h1>
            </div>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon users">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 640 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path></svg>
                    </div>
                    <h2>523</h2>
                    <p>Offered Jobs</p>
                </div>
                <div className="stat-card">
                    <div className="stat-icon succeeded">
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 640 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path></svg>
                    </div>
                    <h2>523</h2>
                    <p>Succeeded Jobs</p>
                </div>
                <div className="stat-card">
                    <div className="stat-icon candidates">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 640 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path></svg>
                    </div>
                    <h2>523</h2>
                    <p>Applied Candidates</p>
                </div>
            </div>
            <div className="job-section"></div>
        </>
    )
}

export default EmployeeDashboard
=======
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
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
