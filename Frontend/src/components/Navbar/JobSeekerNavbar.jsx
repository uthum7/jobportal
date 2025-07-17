import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './JobSeekerNavbar.css';

const JobSeekerNavbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="jobseeker-navbar">
      <div className="jobseeker-navbar-brand">
        <Link to="/jobseeker/dashboard">JobSeeker Dashboard</Link>
      </div>
      <div className="jobseeker-nav-links">
        <Link to="/jobseeker/dashboard" className="jobseeker-nav-link">Dashboard</Link>
        <Link to="/cv" className="jobseeker-nav-link">CV Builder</Link>
        <Link to="/jobseeker/jobs" className="jobseeker-nav-link">Find Jobs</Link>
        <button onClick={handleLogout} className="jobseeker-logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default JobSeekerNavbar;