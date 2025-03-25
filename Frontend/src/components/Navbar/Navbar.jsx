"use client"

import { useState, useEffect } from "react"
import "./Navbar.css" // Import the CSS file
import logo from "../../assets/img/logo.png"
import { Link, useLocation } from "react-router-dom"

const Navbar = () => {
  const location = useLocation()
  const [currentPath, setCurrentPath] = useState("")

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

  return (
    <header className="navbar fixed-navbar">
      <div className="container">
        {/* Logo */}
        <div className="logo">
          <img src={logo || "/placeholder.svg"} alt="Job Portal" />
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          <Link to="/" className={isActive("/") ? "active" : ""}>
            Home
          </Link>
          <Link to="/jobseeker" className={isActive("/jobseeker") ? "active" : ""}>
            Jobseeker
          </Link>
          <Link to="/employee" className={isActive("/employee") ? "active" : ""}>
            Employee
          </Link>
          <Link to="/counselor/dashboard" className={isActive("/counselor") ? "active" : ""}>
            Counselor
          </Link>
          <Link to="/counselee/dashboard" className={isActive("/counselee") ? "active" : ""}>
            Counselee
          </Link>
          <Link to="/about" className={isActive("/about") ? "active" : ""}>
            About Us
          </Link>
          <Link to="/contact" className={isActive("/contact") ? "active" : ""}>
            Contact Us
          </Link>
        </nav>

        {/* Buttons */}
        <div className="nav-buttons">
          <button className="btn sign-in">Sign In</button>
          <button className="btn sign-out">Sign Out</button>
        </div>
      </div>
    </header>
  )
}

export default Navbar

