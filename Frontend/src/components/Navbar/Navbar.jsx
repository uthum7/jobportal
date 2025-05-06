// Navbar.jsx
"use client"

import { useState, useEffect } from "react"
import "./Navbar.css" // Import the CSS file
import logo from "../../assets/img/logo.png"
import { Link, useLocation } from "react-router-dom"

const Navbar = () => {
  const location = useLocation()
  const [currentPath, setCurrentPath] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setCurrentPath(location.pathname)
  }, [location])

  // Function to check if a link should be active
  const isActive = (path) => {
    if (path === "/") {
      return currentPath === "/"
    }
    return currentPath.startsWith(path)
  }

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false)
    }
  }

  return (
    <header className="navbar fixed-navbar">
      <div className="container">
        {/* Logo */}
        <div className="logo-container">
          <div className="logo">
            <img src={logo || "/placeholder.svg"} alt="Job Portal" />
          </div>

          {/* Hamburger Menu Icon */}
          <div className="hamburger-menu" onClick={toggleMobileMenu}>
            <span className={`bar ${mobileMenuOpen ? 'active' : ''}`}></span>
            <span className={`bar ${mobileMenuOpen ? 'active' : ''}`}></span>
            <span className={`bar ${mobileMenuOpen ? 'active' : ''}`}></span>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'active' : ''}`}>
          {/* Navigation Links */}
          <nav className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <Link to="/" className={isActive("/") ? "active" : ""} onClick={handleLinkClick}>
              Home
            </Link>
            <Link to="/jobseeker" className={isActive("/jobseeker") ? "active" : ""} onClick={handleLinkClick}>
              Jobseeker
            </Link>
            <Link to="/employee" className={isActive("/employee") ? "active" : ""} onClick={handleLinkClick}>
              Employee
            </Link>
            <Link to="/counselor/dashboard" className={isActive("/counselor") ? "active" : ""} onClick={handleLinkClick}>
              Counselor
            </Link>
            <Link to="/counselee/dashboard" className={isActive("/counselee") ? "active" : ""} onClick={handleLinkClick}>
              Counselee
            </Link>
            <Link to="/about" className={isActive("/about") ? "active" : ""} onClick={handleLinkClick}>
              About Us
            </Link>
            <Link to="/contact" className={isActive("/contact") ? "active" : ""} onClick={handleLinkClick}>
              Contact Us
            </Link>
          </nav>

          {/* Buttons */}
          <div className={`nav-buttons ${mobileMenuOpen ? 'active' : ''}`}>
            <button className="btn sign-in">Sign In</button>
            <button className="btn sign-out">Sign Out</button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar