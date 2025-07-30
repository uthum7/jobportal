import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getRole } from "../../utils/auth";
import logo from "../../assets/img/logo.png";
import "./Navbar.css"; // Assuming this still points to your modernized Navbar.css

const Navbar = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hideNavbar, setHideNavbar] = useState(false);
  // Optional: For scrolled navbar effect
  // const [scrolled, setScrolled] = useState(false); 
  const lastScrollY = useRef(window.scrollY);
  const userRole = getRole();

  // Scroll event handler
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Hide navbar logic
      setHideNavbar(currentScrollY > lastScrollY.current && currentScrollY > 70);
      lastScrollY.current = currentScrollY;

      // Optional: Scrolled navbar effect logic
      // setScrolled(currentScrollY > 50); 
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Handle logout
  const handleLogout = () => {
    localStorage.clear(); // Clear all local storage
    if (onLogout) onLogout(); // Ensure onLogout is a function before calling
    navigate("/");
  };

  // Define role-based navigation links
  const navLinks = {
    ADMIN: [
      { path: '/admin/dashboard', label: 'Dashboard' },
      { path: '/admin/manage-users', label: 'Manage Users' },
      { path: '/admin/manage-jobs', label: 'Manage Jobs' }
    ],
    MENTOR: [
      { path: '/mentor/dashboard', label: 'Dashboard' },
      { path: '/mentor/profile', label: 'Profile' },
      { path: '/mentor/sessions', label: 'Sessions' }
    ],
    MENTEE: [
      { path: '/mentee/dashboard', label: 'Dashboard' },
      { path: '/mentee/cv-dashboard', label: 'CV Builder' },
      { path: '/mentee/profile', label: 'Profile' }
    ],
    JOBSEEKER: [
      { path: '/jobseeker/dashboard', label: 'Dashboard' },
      { path: '/jobseeker/cv-dashboard', label: 'CV Builder' },
      { path: '/jobseeker/jobs', label: 'Find Jobs' }
    ]
    // Add other roles if necessary
  };

  // Optional: className for scrolled navbar
  // const navbarClasses = `navbar ${hideNavbar ? 'hidden' : ''} ${scrolled ? 'scrolled' : ''}`;
  const navbarClasses = `navbar ${hideNavbar ? 'hidden' : ''}`;


  return (
    <nav className={navbarClasses}>
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="JobPortal Logo" />
          </Link>
        </div>

        {/* Navigation Links (Desktop) - CSS will hide/show as needed */}
        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          {!userRole ? (
            // Public Navigation
            <>
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                Home
              </Link>
              <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
                About
              </Link>
<<<<<<< HEAD
              <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
=======
              <Link to="/contact" className={location.pathname === '/message/login' ? 'active' : ''}>
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
                Contact
              </Link>
            </>
          ) : (
            // Role-based Navigation
            navLinks[userRole]?.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={location.pathname === path ? 'active' : ''}
              >
                {label}
              </Link>
            ))
          )}
           {/* 
            If you want auth buttons inside the mobile menu, you might duplicate them here,
            conditionally rendered for mobile, or restructure.
            For simplicity, we are keeping them in navbar-auth for now.
            Example for mobile menu auth buttons:
            {menuOpen && (
              <div className="auth-buttons-mobile"> 
                {!userRole ? (
                  <>
                    <Link to="/login" className="btn-base btn-secondary">Sign In</Link>
                    <Link to="/signup" className="btn-base btn-primary">Sign Up</Link>
                  </>
                ) : (
                  <button onClick={handleLogout} className="btn-base btn-logout-mobile">
                    Sign Out
                  </button>
                )}
              </div>
            )}
           */}
        </div>

        {/* Auth Buttons & User Menu */}
        <div className="navbar-auth">
          {!userRole ? (
            // Login/Signup Buttons
            <div className="auth-buttons">
              <Link to="/login" className="btn-base btn-secondary">Sign In</Link>
              <Link to="/register" className="btn-base btn-primary">Sign Up</Link>
            </div>
          ) : (
            // User Menu
            <div className="user-menu">
              <span className="user-role">{userRole}</span>
              <button onClick={handleLogout} className="btn-base btn-logout"> {/* Changed class */}
                Sign Out
              </button>
            </div>
          )}
        </div>

         {/* Mobile Menu Button - Placed after navbar-auth for typical mobile layout (logo, links(hidden), auth, burger) */}
         {/* Or place it before navbar-links if you prefer burger on the far right next to auth buttons */}
        <button
          className={`mobile-menu-icon ${menuOpen ? 'open' : ''}`} // Apply 'open' class for X animation
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen} // For accessibility
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;