import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaUser, 
  FaUserTie, 
  FaUserGraduate, 
  FaUserCog, 
  FaUserPlus, 
  FaEnvelope, 
  FaKey, 
  FaTrash, 
  FaSignOutAlt, 
  FaChevronDown,
  FaEye,
  FaEdit,
  FaMapMarkerAlt
} from 'react-icons/fa';
import "../../pages/Admin/managecounselor.css";
import admin from "../../assets/img/admin.jpg";

// Move SearchBar component outside of the main component
const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return ( 
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ID, Keywords etc."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
};

const CounselorManagement = () => {
  const [counselors, setCounselors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState('manage');
  
  const toggleMenu = (menu) => {
    if (expandedMenu === menu) {
      setExpandedMenu(null);
    } else {
      setExpandedMenu(menu);
    }
  };

  useEffect(() => {
    // Fetch counselors from backend
    const fetchCounselors = async () => {
      try {
        const response = await fetch('/api/counselors');
        const data = await response.json();
        setCounselors(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching counselors:', error);
        setLoading(false);
      }
    };

    fetchCounselors();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Implement search functionality
    // In a real app, you would call an API with the search term
    console.log('Searching for:', term);
  };

  const handleView = (id) => {
    console.log('View counselor:', id);
    // Implement view functionality
  };

  const handleEdit = (id) => {
    console.log('Edit counselor:', id);
    // Implement edit functionality
  };

  const handleDelete = (id) => {
    console.log('Delete counselor:', id);
    // Implement delete functionality
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Start */}
      <div className="sidebar">
        <div className="sidebar-user">
        <div className="profile">
          <div className="profile-pic">
            <img src={admin} alt="Admin" />
          </div>
          <h3>Dinusha Herath</h3>
          <p>Admin</p>
        </div>
        </div>

        

        <nav className="sidebar-navigation">
          <ul>
            <li>
              <Link to="/dashboard">
                <FaHome /> Admin Dashboard
              </Link>
            </li>
            <li>
              <Link to="/profile">
                <FaUser /> My profile
              </Link>
            </li>
            <li className={expandedMenu === 'counselor' ? 'active' : ''}>
              <div className="menu-item" onClick={() => toggleMenu('manage')}>
                <div className="menu-title">
                  <FaUserCog /> Manage
                </div>
                <FaChevronDown className={`arrow ${expandedMenu === 'manage' ? 'rotated' : ''}`} />
              </div>
              
              {expandedMenu === 'manage' && (
                <ul className="submenu">
                  <li className="active">
                    <Link to="/manage/counselor">
                      <FaUserTie /> Counselor
                    </Link>
                  </li>
                  <li>
                    <Link to="/manage/counselee">
                      <FaUserGraduate /> Counselee
                    </Link>
                  </li>
                  <li>
                    <Link to="/manage/employee">
                      <FaUserCog /> Employee
                    </Link>
                  </li>
                  <li>
                    <Link to="/manage/jobseeker">
                      <FaUserPlus /> Jobseeker
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link to="/messages">
                <FaEnvelope /> Messages <span className="badge">4</span>
              </Link>
            </li>
            <li>
              <Link to="/change-password">
                <FaKey /> Change Password
              </Link>
            </li>
            <li>
              <Link to="/delete-account">
                <FaTrash /> Delete Account
              </Link>
            </li>
            <li>
              <Link to="/logout">
                <FaSignOutAlt /> Log Out
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {/* Sidebar End */}

      {/* Main Content Start */}
      <div className="main-content">
        <div className="header">
          <h1>Manage Counselor</h1>
          <div className="breadcrumb">Admin / Counselor</div>
        </div>

        {/* Use the SearchBar component properly */}
        <SearchBar onSearch={handleSearch} />

        <div className="counselors-table">
          <div className="table-header">
            <div className="header-name">Name</div>
            <div className="header-id">Mentor ID</div>
            <div className="header-status">Status</div>
          </div>

          {loading ? (
            <div className="loading">Loading counselors...</div>
          ) : (
            counselors.map((counselor) => (
              <div className="counselor-card" key={counselor._id}>
                <div className="counselor-info">
                  <div className="counselor-avatar">
                    <img src={counselor.avatar} alt={counselor.name} />
                    <div className={`status-indicator ${counselor.isOnline ? 'online' : 'offline'}`}></div>
                  </div>
                  <div className="counselor-details">
                    <h3>{counselor.name}</h3>
                    <p className="counselor-title">{counselor.title}</p>
                    <div className="counselor-location">
                      <FaMapMarkerAlt /> {counselor.location}
                    </div>
                    <div className="counselor-skills">
                      {counselor.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="counselor-id">#{counselor.mentorId}</div>
                <div className="counselor-actions">
                  <button className="action-btn view" onClick={() => handleView(counselor._id)}>
                    <FaEye />
                  </button>
                  <button className="action-btn edit" onClick={() => handleEdit(counselor._id)}>
                    <FaEdit />
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(counselor._id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Main Content End */}
    </div>
  );
};

export default CounselorManagement;