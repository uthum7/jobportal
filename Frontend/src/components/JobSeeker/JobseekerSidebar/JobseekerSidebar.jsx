import React, { useRef, useState, useEffect } from 'react';
// Importing various icons from react-icons/fi for use in sidebar menu
import { FiHome, FiUser, FiFileText, FiBriefcase, FiBookmark, FiMessageCircle, FiMail, FiLock, FiTrash2, FiLogOut, FiCamera, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
// Importing jobseeker profile image
import jobseeker from '/src/assets/img/JobSeeker/jobseeker.png';
// Importing NavLink and useLocation to enable route-based navigation with active class
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import axios from 'axios';
import { getToken } from '../../../utils/auth';

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
    
    const config = {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    };
    
    axios.get(`http://localhost:5001/api/register/users/${userId}`, config)
      .then(res => {
        setSidebarUser(res.data);
        setSidebarLoading(false);
      })
      .catch(err => {
        console.warn("Could not fetch user profile for sidebar:", err);
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
          className="fixed top-20 left-3 z-50 bg-gray-100 border-none rounded-full shadow-md p-2 text-xl text-gray-700 block cursor-pointer transition-colors hover:bg-gray-200 lg:hidden"
          aria-label="Open sidebar menu"
          onClick={() => setSidebarOpen(true)}
        >
          <FiChevronRight />
        </button>
      )}
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-35 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto bg-white shadow-lg transform transition-transform duration-300 lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`} style={{ width: '260px' }}>
        
        {/* Close button for mobile sidebar */}
        {sidebarOpen && (
          <button
            className="fixed top-20 right-3 z-50 bg-gray-100 border-none rounded-full shadow-md p-2 text-xl text-gray-700 cursor-pointer transition-colors hover:bg-gray-200 lg:hidden"
            aria-label="Close sidebar menu"
            onClick={e => { e.stopPropagation(); setSidebarOpen(false); }}
          >
            <FiChevronLeft />
          </button>
        )}

        {/* Profile Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
              <img 
                src={profilePicSrc} 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
              <label
                htmlFor="sidebar-avatar-upload"
                className={`absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow-md flex items-center justify-center z-10 transition-opacity ${isUpdatingProfile ? 'opacity-60 pointer-events-none' : 'hover:shadow-lg'}`}
                title={isUpdatingProfile ? 'Uploading...' : 'Change photo'}
              >
                <FiCamera size={14} className="text-gray-600" />
                <input
                  type="file"
                  id="sidebar-avatar-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                  ref={fileInputRef}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                {sidebarLoading ? 'Loading...' : sidebarError ? 'Jobseeker' : displayName}
              </h3>
              <p className="text-sm text-gray-600">Job Seeker</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="px-4 py-6">
          <div className="space-y-2">
            <NavLink 
              to="/jobSeeker/dashboard" 
              className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-emerald-50 text-emerald-600 border-r-2 border-emerald-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FiHome className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink 
              to="/JobSeeker/profile" 
              className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-emerald-50 text-emerald-600 border-r-2 border-emerald-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FiUser className="w-4 h-4" />
              <span>My Profile</span>
            </NavLink>

            <NavLink 
              to="/cv" 
              className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-emerald-50 text-emerald-600 border-r-2 border-emerald-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FiFileText className="w-4 h-4" />
              <span>Create a Resume</span>
            </NavLink>

            <NavLink 
              to="/JobSeeker/apply-for-job" 
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isJobSectionActive() 
                  ? 'bg-emerald-50 text-emerald-600 border-r-2 border-emerald-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FiBriefcase className="w-4 h-4" />
              <span>Apply for a Job</span>
            </NavLink>

            <NavLink 
              to="/JobSeeker/applied-jobs" 
              className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-emerald-50 text-emerald-600 border-r-2 border-emerald-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FiBriefcase className="w-4 h-4" />
              <span>Applied Jobs</span>
            </NavLink>

            <NavLink 
              to="/JobSeeker/saved-jobs" 
              className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-emerald-50 text-emerald-600 border-r-2 border-emerald-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FiBookmark className="w-4 h-4" />
              <span>Saved Jobs</span>
            </NavLink>

            <NavLink 
              to="/counselor" 
              className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-emerald-50 text-emerald-600 border-r-2 border-emerald-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FiMessageCircle className="w-4 h-4" />
              <span>Find a Counselor</span>
            </NavLink>

            <NavLink 
              to="/messages" 
              className={({ isActive }) => `flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-emerald-50 text-emerald-600 border-r-2 border-emerald-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <FiMail className="w-4 h-4" />
                <span>Messages</span>
              </div>
              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-emerald-600 rounded-full">
                3
              </span>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobseekerSidebar;