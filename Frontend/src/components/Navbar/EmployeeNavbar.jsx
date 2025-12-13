import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './EmployeeNavbar.css'; // Employee-specific CSS file
import logoPath from '../../assets/img/logo.png'; 

const EmployeeNavbar = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Common function to handle link clicks and close menu if open
  const handleLinkClick = () => {
    if (isMenuOpen) {
      toggleMenu();
    }
  };

  return (
    <nav className="employee-navbar">
      <div className="employee-navbar-container">
        <div className="employee-navbar-brand">
          <Link to="/employee" onClick={handleLinkClick}>
            <img src={logoPath} alt="Employee Dashboard Logo" className="employee-navbar-logo-img height-[50px] width-[50px]" />
          </Link>
        </div>

        {/* Core Navigation Links - This block will be centered on desktop */}

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
          {/* Links repeated for mobile menu structure */}
          <Link 
            to="/employee" 
            className={`employee-nav-link ${location.pathname === '/employee' ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Dashboard
          </Link>
          <Link 
            to="/employee/profile" 
            className={`employee-nav-link ${location.pathname.startsWith('/employee/profile') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Profile
          </Link>
          <Link 
            to="/employee/jobs" 
            className={`employee-nav-link ${location.pathname.startsWith('/employee/jobs') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Posted Jobs
          </Link>
          <Link 
            to="/employee/candidates" 
            className={`employee-nav-link ${location.pathname.startsWith('/employee/candidates') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Candidates
          </Link>
          <Link 
            to="/employee/analytics" 
            className={`employee-nav-link ${location.pathname.startsWith('/employee/analytics') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Analytics
          </Link>
          <button 
            onClick={() => { handleLogoutClick(); handleLinkClick(); }} // Also close menu on logout
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