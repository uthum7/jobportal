import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './MenteeNavbar.css'; // This will be our modernized CSS file
import logoPath from '../../assets/img/logo.png'; // Using the main app logo

const MenteeNavbar = ({ onLogout }) => {
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
    <nav className="mentee-navbar">
      <div className="mentee-navbar-container">
        <div className="mentee-navbar-brand">
          <Link to="/counselee/dashboard" onClick={handleLinkClick}> {/* Changed from /mentee/dashboard */}
            <img src={logoPath} alt="Mentee Dashboard Logo" className="mentee-navbar-logo-img" />
            {/* <span className="mentee-brand-text">Mentee Portal</span> */}
          </Link>
        </div>

        {/* Core Navigation Links - Centered on desktop */}
        <div className="mentee-nav-links-group">
          <Link 
            to="/counselee/dashboard"  // Changed from /mentee/dashboard
            className={`mentee-nav-link ${location.pathname === '/counselee/dashboard' ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Dashboard
          </Link>
          <Link 
            to="/cv" // Kept as /cv as per original
            className={`mentee-nav-link ${location.pathname.startsWith('/cv') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            CV Builder
          </Link>
          <Link 
            to="/counselee/profile" // Changed from /mentee/profile
            className={`mentee-nav-link ${location.pathname.startsWith('/counselee/profile') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Profile
          </Link>
        </div>

        {/* Actions - Logout button (for desktop) */}
        <div className="mentee-navbar-actions">
          <button 
            onClick={handleLogoutClick} 
            className="btn-base btn-logout-mentee" // Themed logout button
          >
            Logout
          </button>
        </div>
        
        {/* Hamburger Menu Button - visible on mobile */}
        <button 
          className="mentee-mobile-menu-button"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Dropdown Menu Content */}
        <div className={`mentee-mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/counselee/dashboard"
            className={`mentee-nav-link ${location.pathname === '/counselee/dashboard' ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Dashboard
          </Link>
          <Link 
            to="/cv"
            className={`mentee-nav-link ${location.pathname.startsWith('/cv') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            CV Builder
          </Link>
          <Link 
            to="/counselee/profile"
            className={`mentee-nav-link ${location.pathname.startsWith('/counselee/profile') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Profile
          </Link>
          <button 
            onClick={() => { handleLogoutClick(); handleLinkClick(); }}
            className="btn-base btn-logout-mentee mentee-nav-link-logout" 
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default MenteeNavbar;