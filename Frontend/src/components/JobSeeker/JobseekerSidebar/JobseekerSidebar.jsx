import React from 'react';
import {
  FiHome, FiUser, FiFileText, FiBriefcase,
  FiBookmark, FiMessageCircle, FiMail,
  FiLock, FiTrash2, FiLogOut
} from 'react-icons/fi';
import jobseeker from '/src/assets/img/JobSeeker/jobseeker.png';
import './JobseekerSidebar.css';
import { NavLink } from 'react-router-dom';


const JobseekerSidebar = () => {
  return (
    <div className="sidebar">
      <div className="profile-section">
        <img 
          src={jobseeker} 
          alt="Profile" 
          className="profile-image"
        />
        <h3 className="profile-name">Gimhani Imasha</h3>
        <div className="nav-title">Main Navigation</div>
      </div>
      <nav className="nav-menu">
        <NavLink to="/JobSeeker/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FiHome className="nav-icon" />
          <span>User Dashboard</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FiUser className="nav-icon" />
          <span>My Profile</span>
        </NavLink>
        <NavLink to="/resume" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FiFileText className="nav-icon" />
          <span>Create a Resume</span>
        </NavLink>
        <NavLink to="/JobSeeker/apply-for-job" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FiBriefcase className="nav-icon" />
          <span>Apply for a Job</span>
        </NavLink>
        <NavLink to="/applied-jobs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FiBriefcase className="nav-icon" />
          <span>Applied Jobs</span>
        </NavLink>
        <NavLink to="/saved-jobs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FiBookmark className="nav-icon" />
          <span>Saved Jobs</span>
        </NavLink>
        <NavLink to="/counselor" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FiMessageCircle className="nav-icon" />
          <span>Find a Counselor</span>
        </NavLink>
        <NavLink to="/messages" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FiMail className="nav-icon" />
          <span>Messages</span>
          <span className="notification-badge">3</span>
        </NavLink>
        <NavLink to="/change-password" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FiLock className="nav-icon" />
          <span>Change Password</span>
        </NavLink>
        <NavLink to="/delete-account" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FiTrash2 className="nav-icon" />
          <span>Delete Account</span>
        </NavLink>
        <NavLink to="/logout" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <FiLogOut className="nav-icon" />
          <span>Log Out</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default JobseekerSidebar;
