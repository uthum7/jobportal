import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import "./Navbar.css";

const Navbar = ({ onSignupClick, onRegisterClick }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hideNavbar, setHideNavbar] = useState(false);
  const lastScrollY = useRef(window.scrollY);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Hide/show navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 70) {
        setHideNavbar(true);
      } else {
        setHideNavbar(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active link logic
  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`navbar${hideNavbar ? " hide" : ""}`}>
      <div className="navbar-container">
        {/* Left: Logo */}
        <div className="navbar-left">
          <Link to="/" className="logo">
            <img src={logo} alt="Logo" />
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="navbar-center">
          <div className={`nav-links${menuOpen ? " open" : ""}`}>
            <Link to="/" className={isActive("/") ? "active" : ""}>Home</Link>
            <Link to="/jobseeker" className={isActive("/jobseeker") ? "active" : ""}>Jobseeker</Link>
            <Link to="/employee" className={isActive("/employee") ? "active" : ""}>Employee</Link>
            <Link to="/counselor/dashboard" className={isActive("/counselor") ? "active" : ""}>Counselor</Link>
            <Link to="/counselee/dashboard" className={isActive("/counselee") ? "active" : ""}>Counselee</Link>
          </div>
        </div>

        {/* Right: Buttons */}
        <div className="navbar-right">
          <div className="nav-buttons">
            <button className="btn" onClick={onSignupClick}>Sign Up</button>
            <button className="btn sign-out" onClick={onRegisterClick}>Register</button>
          </div>
          <div
            className={`hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </nav>

  );
};

export default Navbar;
