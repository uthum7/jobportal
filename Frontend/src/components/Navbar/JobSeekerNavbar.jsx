// src/components/JobSeekerNavbar/JobSeekerNavbar.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './JobSeekerNavbar.css';
import logoPath from '../../assets/img/logo.png';

const JobSeekerNavbar = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
    // navigate('/login');
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLinkClick = () => {
    if (isMenuOpen) toggleMenu();
  };

  return (
    <nav className="jobseeker-navbar">
      <div className="jobseeker-navbar-container">
        <div className="jobseeker-navbar-brand">
          <Link to="/" onClick={handleLinkClick}>
            <img
              src={logoPath}
              alt="JobSeeker Portal Logo"
              className="jobseeker-navbar-logo-img"
            />
          </Link>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="jobseeker-nav-links-group">
          <Link
            to="/jobseeker/dashboard"
            className={`jobseeker-nav-link ${location.pathname.toLowerCase() === '/jobseeker/dashboard' ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Dashboard
          </Link>
          <Link
            to="/cv"
            className={`jobseeker-nav-link ${location.pathname.startsWith('/cv') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            CV Builder
          </Link>
          
        </div>

        {/* Logout Button - Desktop */}
        <div className="jobseeker-navbar-actions">
          <button
            onClick={handleLogoutClick}
            className="btn-base btn-logout-jobseeker"
          >
            Logout
          </button>
        </div>

        {/* Hamburger Button - Mobile */}
        <button
          className="jobseeker-mobile-menu-button"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Menu */}
        <div className={`jobseeker-mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link
            to="/jobseeker/dashboard"
            className={`jobseeker-nav-link ${location.pathname.toLowerCase() === '/jobseeker/dashboard' ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Dashboard
          </Link>
          <Link
            to="/cv"
            className={`jobseeker-nav-link ${location.pathname.startsWith('/cv') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            CV Builder
          </Link>
          
          <button
            onClick={() => {
              handleLogoutClick();
              handleLinkClick();
            }}
            className="btn-base btn-logout-jobseeker jobseeker-nav-link-logout"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default JobSeekerNavbar;
