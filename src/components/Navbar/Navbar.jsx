import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; 
import logo from "../../assets/img/logo.png"; 

const Navbar = ({ onSignupClick,onRegisterClick }) => {
  return (
    <header className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Job Portal Logo" />
          </Link>
        </div>

        <nav className="nav-links">
          <Link to="/" className="active">Home</Link>
          <Link to="/jobseeker">Jobseeker</Link>
          <Link to="/employee">Employee</Link>
          <Link to="/mentor">Mentor</Link>
          <Link to="/mentee">Mentee</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
        </nav>

        <div className="nav-buttons">
          <button className="btn sign-in" onClick={onSignupClick}>Sign In</button> {/* ✅ Fix button click */}
          <button className="btn sign-out" onClick={onRegisterClick}>Registration</button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
