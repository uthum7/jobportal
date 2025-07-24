// src/components/Navbar/EmployeeNavbar.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './EmployeeNavbar.css'; // New CSS file for the Employee Navbar
import logoPath from '../../assets/img/logo.png';

const EmployeeNavbar = ({ onLogout, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
  };

  useEffect(() => {
    setIsMenuOpen(false); // Close mobile menu on route change
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLinkClick = () => {
    if (isMenuOpen) {
      toggleMenu();
    }
  };

  return (
    <nav className="employee-navbar">
      <div className="employee-navbar-container">
        <div className="employee-navbar-brand">
          <Link to="/employee/dashboard" onClick={handleLinkClick}>
            <img src={logoPath} alt="Employee Dashboard Logo" className="employee-navbar-logo-img" />
            <span className="employee-brand-text">Employee Portal</span>
          </Link>
        </div>

        {/* Core Navigation Links - Centered on desktop */}
        <div className="employee-nav-links-group">
          <Link 
            to="/employee/dashboard"
            className={`employee-nav-link ${location.pathname === '/employee/dashboard' ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Dashboard
          </Link>
          <Link 
            to="/employee/post-job"
            className={`employee-nav-link ${location.pathname.startsWith('/employee/post-job') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Post a Job
          </Link>
          <Link 
            to="/employee/profile" // A good-to-have link for consistency
            className={`employee-nav-link ${location.pathname.startsWith('/employee/profile') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Profile
          </Link>
        </div>

        {/* Actions - Logout button (for desktop) */}
        <div className="employee-navbar-actions">
          <button 
            onClick={handleLogoutClick} 
            className="btn-base btn-logout-employee"
          >
            Logout
          </button>
        </div>
        
        {/* Hamburger Menu Button - visible on mobile */}
        <button 
          className="employee-mobile-menu-button"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Dropdown Menu Content */}
        <div className={`employee-mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/employee/dashboard"
            className={`employee-nav-link ${location.pathname === '/employee/dashboard' ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Dashboard
          </Link>
          <Link 
            to="/employee/post-job"
            className={`employee-nav-link ${location.pathname.startsWith('/employee/post-job') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Post a Job
          </Link>
          <Link 
            to="/employee/profile"
            className={`employee-nav-link ${location.pathname.startsWith('/employee/profile') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Profile
          </Link>
          <button 
            onClick={() => { handleLogoutClick(); handleLinkClick(); }}
            className="btn-base btn-logout-employee employee-nav-link-logout" 
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default EmployeeNavbar;