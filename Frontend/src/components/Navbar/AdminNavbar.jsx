import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import './AdminNavbar.css'; // Assuming this will be the new CSS file
import logoPath from '../../assets/img/logo.png'; // Assuming you want to use the same logo

const AdminNavbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation(); // For active link styling

  const handleLogoutClick = () => { // Renamed to avoid conflict if onLogout is also named handleLogout
    if (onLogout) {
      onLogout(); // Call the passed onLogout function (from App.js)
    }
    // Navigation to /login is likely handled in App.js after user state is cleared
    // but can be kept here as a fallback if onLogout doesn't trigger it.
    // For now, let's assume App.js handles it. If not, uncomment:
    // navigate('/login'); 
  };

  return (
    <nav className="admin-navbar"> {/* Main navbar class */}
      <div className="admin-navbar-container"> {/* Inner container for max-width and centering */}
        <div className="admin-navbar-brand">
          <Link to="/">
            <img src={logoPath} alt="Admin Dashboard Logo" className="admin-navbar-logo-img" />
            {/* Optional: <span className="admin-brand-text">Admin Panel</span> */}
          </Link>
        </div>
        <div className="admin-nav-links">
          <Link 
            to="/" 
            className={`admin-nav-link ${location.pathname === '/' || location.pathname.startsWith('/') }`}
          >
            Home
          </Link>
          
          <Link 
            to="/aboutus" 
            className={`admin-nav-link ${location.pathname.startsWith('/jobseeker/dashboard') ? 'active' : ''}`}
          >
            About {/* Or "Manage Counselors" as you had */}
          </Link>
          <Link 
            to="/admin/managecounselor" 
            className={`admin-nav-link ${location.pathname.startsWith('/admin/managecounselor') ? 'active' : ''}`}
          >
            Contact Us {/* Or "Manage Counselors" as you had */}
          </Link>
         
        </div>
        <div className="admin-navbar-actions">
          <button 
            onClick={handleLogoutClick} 
            className="btn-base btn-logout-admin" // Themed logout button
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;