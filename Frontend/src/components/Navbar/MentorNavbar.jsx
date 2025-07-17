import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './MentorNavbar.css'; // Your modernized CSS file
import logoPath from '../../assets/img/logo.png'; 

const MentorNavbar = ({ onLogout }) => {
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
    <nav className="mentor-navbar">
      <div className="mentor-navbar-container">
        <div className="mentor-navbar-brand">
          <Link to="/mentor/dashboard" onClick={handleLinkClick}>
            <img src={logoPath} alt="Mentor Dashboard Logo" className="mentor-navbar-logo-img" />
            {/* <span className="mentor-brand-text">Mentor Panel</span> */}
          </Link>
        </div>

        {/* Core Navigation Links - This block will be centered on desktop */}
        <div className="mentor-nav-links-group"> {/* Renamed for clarity */}
          <Link 
            to="/mentor/dashboard" 
            className={`mentor-nav-link ${location.pathname === '/mentor/dashboard' ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Dashboard
          </Link>
          <Link 
            to="/mentor/profile" 
            className={`mentor-nav-link ${location.pathname.startsWith('/mentor/profile') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Profile
          </Link>
          <Link 
            to="/mentor/sessions" 
            className={`mentor-nav-link ${location.pathname.startsWith('/mentor/sessions') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Sessions
          </Link>
        </div>

        {/* Actions - Logout button (for desktop) */}
        <div className="mentor-navbar-actions">
          <button 
            onClick={handleLogoutClick} 
            className="btn-base btn-logout-mentor"
          >
            Logout
          </button>
        </div>
        
        {/* Hamburger Menu Button - visible on mobile */}
        <button 
          className="mentor-mobile-menu-button"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Dropdown Menu Content */}
        <div className={`mentor-mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          {/* Links repeated for mobile menu structure */}
          <Link 
            to="/mentor/dashboard" 
            className={`mentor-nav-link ${location.pathname === '/mentor/dashboard' ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Dashboard
          </Link>
          <Link 
            to="/mentor/profile" 
            className={`mentor-nav-link ${location.pathname.startsWith('/mentor/profile') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Profile
          </Link>
          <Link 
            to="/mentor/sessions" 
            className={`mentor-nav-link ${location.pathname.startsWith('/mentor/sessions') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Sessions
          </Link>
          <button 
            onClick={() => { handleLogoutClick(); handleLinkClick(); }} // Also close menu on logout
            className="btn-base btn-logout-mentor mentor-nav-link-logout" 
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default MentorNavbar;