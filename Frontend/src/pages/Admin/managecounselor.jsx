<<<<<<< HEAD
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
=======
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Menu,
  X,
  User,
  Briefcase,
  PlusCircle,
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';

const ManageCounselor = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counselors, setCounselors] = useState([]);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/users/counselors');
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setCounselors(data);
      } catch (err) {
        console.error('Error fetching counselors:', err);
      }
    };
    fetchCounselors();
  }, []);

  const filteredCounselors = counselors.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNavigation = (path) => navigate(path);

  const handleView = (id) => navigate(`/admin/viewcounselor/${id}`);

  const handleDelete = (counselor) => {
    setSelectedCounselor(counselor);
    setIsDeleteMode(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:5001/api/users/counselors/${selectedCounselor._id}`);
      if (response.status === 200) {
        alert('Counselor deleted successfully');
        setCounselors(counselors.filter(c => c._id !== selectedCounselor._id));
        setIsDeleteMode(false);
        setSelectedCounselor(null);
      } else {
        alert('Failed to delete counselor');
      }
    } catch (error) {
      console.error('Error deleting counselor:', error);
      alert('Error deleting counselor');
    }
  };

  const handleEdit = (counselorData) => {
    navigate(`/admin/viewallbookings/${counselorData._id}`);
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/users/counselors/${selectedCounselor._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedCounselor),
      });
      if (res.ok) {
        const updated = await res.json();
        setCounselors(counselors.map(c => c._id === updated._id ? updated : c));
        setIsEditMode(false);
      }
    } catch (err) {
      console.error('Error updating counselor:', err);
    }
  };

  const SidebarItem = ({ icon: Icon, label, active = false, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
        active ? 'bg-emerald-50 text-emerald-600 border-r-2 border-emerald-600' : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
              <img src="/api/placeholder/48/48" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Dinusha Herath</h3>
              <p className="text-sm text-gray-600">Admin</p>
            </div>
          </div>
        </div>
        <div className="px-4 py-6">
          <h4 className="text-sm font-medium text-gray-500 mb-4">Main Navigation</h4>
          <div className="space-y-2">
            <SidebarItem icon={Calendar} label="Dashboard" onClick={() => handleNavigation('/admin')} />
            <SidebarItem icon={Users} label="My Profile" onClick={() => handleNavigation('/admin/myprofile')} />
          </div>
          <div className="pt-6">
            <h5 className="text-sm font-medium text-gray-500 mb-2">Manage</h5>
            <div className="space-y-1">
              <SidebarItem icon={Users} label="Employee" onClick={() => handleNavigation('/admin/manageemployee')} />
              <SidebarItem icon={Users} label="Jobseeker" onClick={() => handleNavigation('/admin/managejobseeker')} />
              <SidebarItem icon={Users} label="Counselor" active onClick={() => handleNavigation('/admin/managecounselor')} />
              <SidebarItem icon={Users} label="Counselee" onClick={() => handleNavigation('/admin/managecounselee')} />
            </div>
          </div>
          <div className="pt-6">
            <SidebarItem icon={MessageSquare} label="Messages" onClick={() => handleNavigation('/message/login')} />
            <SidebarItem icon={PlusCircle} label="AddUser" onClick={() => handleNavigation('/admin/adduser')} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="p-6">
          <div className="lg:hidden mb-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-gray-700 bg-white rounded-lg shadow-sm">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Counselors</h2>
          <div className="flex items-center mb-6 gap-4">
            <input
              type="text"
              placeholder="Search counselors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredCounselors.map((c) => (
              <div key={c._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center space-x-4">
                  <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold text-xl">
                    {c.name?.charAt(0).toUpperCase() || "C"}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{c.username}</h3>
                    <p className="text-sm text-gray-600">{c.email}</p>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="w-4 h-4 text-purple-600" /> <span>ID: {c._id}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 text-blue-600" /> <span>Role: {c.roles?.join(', ') || 'N/A'}</span>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
                  <button onClick={() => handleView(c._id)} className="text-emerald-600 hover:text-emerald-700 flex items-center space-x-1">
                    <Eye className="w-4 h-4" /> <span>View</span>
                  </button>
                  <button onClick={() => handleEdit(c)} className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                    <Edit className="w-4 h-4" /> <span>Edit</span>
                  </button>
                  <button onClick={() => handleDelete(c)} className="text-red-600 hover:text-red-700 flex items-center space-x-1">
                    <Trash2 className="w-4 h-4" /> <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {isEditMode && selectedCounselor && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit Counselor</h2>
                <input
                  type="text"
                  value={selectedCounselor.name || ''}
                  onChange={(e) => setSelectedCounselor({ ...selectedCounselor, name: e.target.value })}
                  className="w-full mb-3 px-4 py-2 border rounded"
                  placeholder="Name"
                />
                <input
                  type="email"
                  value={selectedCounselor.email || ''}
                  onChange={(e) => setSelectedCounselor({ ...selectedCounselor, email: e.target.value })}
                  className="w-full mb-3 px-4 py-2 border rounded"
                  placeholder="Email"
                />
                <input
                  type="text"
                  value={selectedCounselor.roles?.join(', ') || ''}
                  onChange={(e) => setSelectedCounselor({
                    ...selectedCounselor,
                    roles: e.target.value.split(',').map(r => r.trim())
                  })}
                  className="w-full mb-3 px-4 py-2 border rounded"
                  placeholder="Roles (comma separated)"
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setIsEditMode(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                  <button onClick={handleUpdate} className="px-4 py-2 bg-emerald-600 text-white rounded">Update</button>
                </div>
              </div>
            </div>
          )}

          {isDeleteMode && selectedCounselor && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl shadow-xl max-w-md w-full mx-4 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                      <AlertTriangle className="text-red-600" size={20} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Delete Counselor</h2>
                  </div>
                  <button
                    onClick={() => setIsDeleteMode(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  Are you sure you want to delete this counselor? This action cannot be undone.
                </p>

                <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 text-lg">{selectedCounselor.username || 'Unknown Counselor'}</h3>
                  <p className="text-gray-600">{selectedCounselor.email || 'No Email'}</p>
                  <p className="text-gray-500 text-sm mt-1">ID: {selectedCounselor._id}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsDeleteMode(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    No, Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-2xl font-medium hover:bg-red-700 transition-colors"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
    </div>
  );
};

<<<<<<< HEAD
export default CounselorManagement;
=======
export default ManageCounselor;
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
