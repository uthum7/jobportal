import React from "react";
import "./Footer.css";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTwitter, FaGlobe } from "react-icons/fa";
import logo from "../../assets/img/logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
       
        {/* Middle Sections */}
        <div className="footer-links">
             {/* Left Section */}
        <div className="footer-logo">
        <img src={logo} alt="Job Portal Logo" className="logo-img" />
          </div>
        <ul>
        <li>
            <p className="Footer-p">
            Our web application is designed to streamline the job-seeking process by integrating AI-powered CV creation, 
            job searching, and mentorship opportunities. Users can build professional resumes, apply for jobs, and 
            connect with mentors to enhance their career prospects.
            
          </p></li>
          </ul>
          </div>

        <div className="footer-links">
          <h3>Job Portal</h3>
          <ul>
            <li>Create Resumes</li>
            <li>Mentors</li>
            <li>Job Opportunity</li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Services</h3>
          <ul>
            <li>Provide Jobs</li>
            <li>Find a Mentor</li>
            <li>Create a Resume</li>
            <li>Get Useful Comments</li>
            <li>Help & Support</li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Information</h3>
          <ul>
            <li>About Us</li>
            <li>Our Mentors</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="footer-contact">
          <h3>Contact Us</h3>
          <div className="content">
          <p>Collins Street West, Victoria Near Bank Road, Australia QHR12456.</p>
          <p>Email: jobportal@gmail.com</p>
          <p>Phone: +1 1123 456 765</p>
          <div className="footer-icons">
            <FaFacebookF />
            <FaLinkedinIn />
            <FaInstagram />
            <FaTwitter />
            <FaGlobe />
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
