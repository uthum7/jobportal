//frontend/src/components/JobSeeker/JobseekerSidebar/JobseekerSidebar.jsx

import React, { useRef, useState, useEffect } from 'react';
// Importing various icons from react-icons/fi for use in sidebar menu
import { FiHome, FiUser, FiFileText, FiBriefcase, FiBookmark, FiMessageCircle, FiMail, FiLock, FiTrash2, FiLogOut, FiCamera, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
// Importing jobseeker profile image
import jobseeker from '/src/assets/img/JobSeeker/jobseeker.png';
// Importing component-specific CSS styles
import './JobseekerSidebar.css';
// Importing NavLink and useLocation to enable route-based navigation with active class
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import axios from 'axios';

function capitalizeWords(str) {
  if (!str) return '';
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

const JobseekerSidebar = () => {
  const location = useLocation();
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const fileInputRef = useRef();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- New state for fetched user info ---
  const [sidebarUser, setSidebarUser] = useState({ username: '', email: '', profilePic: '' });
  const [sidebarLoading, setSidebarLoading] = useState(true);
  const [sidebarError, setSidebarError] = useState('');

  // Helper function to get userId from localStorage or authUser
  const getUserId = () => {
    if (authUser && (authUser.userId || authUser._id)) return authUser.userId || authUser._id;
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.userId || user?._id || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      setSidebarError('User not found');
      setSidebarLoading(false);
      return;
    }
    setSidebarLoading(true);
    setSidebarError('');
    axios.get(`http://localhost:5001/api/register/users/${userId}`)
      .then(res => {
        setSidebarUser(res.data);
        setSidebarLoading(false);
      })
      .catch(err => {
        setSidebarError('Could not load user info');
        setSidebarLoading(false);
      });
  }, []);

  // Helper function to check if job-related routes should be active
  const isJobSectionActive = () => {
    return location.pathname === '/JobSeeker/apply-for-job' || 
           location.pathname.startsWith('/JobSeeker/job-details/');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  // Prefer username from backend, then username/fullName/name from authUser, then fallback
  const displayName = sidebarUser.username
    ? capitalizeWords(sidebarUser.username)
    : capitalizeWords(authUser?.username || authUser?.fullName || authUser?.name || 'Jobseeker');
  const profilePicSrc = selectedImg || sidebarUser.profilePic || authUser?.profilePic || jobseeker;

  return (
    <>
      {/* Sidebar toggle button for mobile, below navbar */}
      {!sidebarOpen && (
        <button
          className="sidebar-toggle-open"
          aria-label="Open sidebar menu"
          onClick={() => setSidebarOpen(true)}
        >
          <FiChevronRight />
        </button>
      )}
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      <div
        className={`sidebar${sidebarOpen ? ' sidebar--mobile-open' : ' sidebar--mobile-hidden'}`}
        onClick={() => sidebarOpen && setSidebarOpen(false)}
      >
        {/* Close button for mobile sidebar */}
        {sidebarOpen && (
          <button
            className="sidebar-toggle-close"
            aria-label="Close sidebar menu"
            onClick={e => { e.stopPropagation(); setSidebarOpen(false); }}
          >
            <FiChevronLeft />
          </button>
        )}
        {/* Sidebar container */}
        <div className="profile-section">
          {/* Top profile section */}
          <div className="profile-image-wrapper" style={{ position: 'relative' }}>
            <img src={profilePicSrc} alt="Profile" className="profile-image" />
            <label
              htmlFor="sidebar-avatar-upload"
              className={`sidebar-avatar-upload-btn${isUpdatingProfile ? ' disabled' : ''}`}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                background: '#fff',
                borderRadius: '50%',
                padding: '0.3rem',
                cursor: isUpdatingProfile ? 'not-allowed' : 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
              }}
              title={isUpdatingProfile ? 'Uploading...' : 'Change photo'}
            >
              <FiCamera size={18} color="#001f3f" />
              <input
                type="file"
                id="sidebar-avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          <h3 className="profile-name">
            {sidebarLoading ? 'Loading...' : sidebarError ? 'Jobseeker' : displayName}
          </h3>
          {/* Hardcoded profile name */}
        </div>

        {/* Navigation menu with route links */}
        <nav className="nav-menu">
          {/* Each NavLink changes the route and highlights the active item */}
          <NavLink to="/jobSeeker/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FiHome className="nav-icon" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/JobSeeker/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FiUser className="nav-icon" />
            <span>My Profile</span>
          </NavLink>

          <NavLink to="/cv" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FiFileText className="nav-icon" />
            <span>Create a Resume</span>
          </NavLink>

          {/* Modified: Using custom active state check for job-related pages */}
          <NavLink 
            to="/JobSeeker/apply-for-job" 
            className={`nav-item ${isJobSectionActive() ? 'active' : ''}`}
          >
            <FiBriefcase className="nav-icon" />
            <span>Apply for a Job</span>
          </NavLink>

          <NavLink to="/JobSeeker/applied-jobs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <FiBriefcase className="nav-icon" />
            <span>Applied Jobs</span>
          </NavLink>

          <NavLink to="/JobSeeker/saved-jobs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
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
            {/* Static message count badge */}
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default JobseekerSidebar;