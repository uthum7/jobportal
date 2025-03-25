import React, { useState } from "react";
import { FaSignInAlt, FaCloudUploadAlt } from "react-icons/fa";
import "./Navbar.css"; // Import the CSS file
import logo from "../../assets/img/logo.png";
import { Link } from 'react-router-dom';



const Navbar = () => {
  return (
    <header className="navbar">
      <div className="container">
        {/* Logo */}
        <div className="logo">
        <img src={logo} alt="Job Portal" />
          
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          <Link to="/" className="active">Home</Link>
          <Link to="/jobseeker">Jobseeker</Link>
          <Link to="/employee">Employee</Link>
          <Link to="/mentor">Mentor</Link>
          <Link to="/mentee">Mentee</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
        </nav>

        {/* Buttons */}
        <div className="nav-buttons">
          <button className="btn sign-in">Sign In</button>
          <button className="btn sign-out">Sign Out</button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
