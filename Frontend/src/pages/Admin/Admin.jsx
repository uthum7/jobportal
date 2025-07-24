// src/pages/Admin/Admin.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaBriefcase, FaEye, FaBookmark, FaUsers, FaCalendarCheck, FaUserPlus, FaHome } from "react-icons/fa";

// Ensure the paths are correct based on your project structure
import "./Admin.css"; 
import admin from "../../assets/img/admin.jpg";
import AddUserForm from "./AddUserForm.jsx";  // Make sure this path is correct

const Admin = () => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  
  // --- NEW: State to control which view is shown in the main content area ---
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' or 'addUser'

  const toggleSubmenu = () => {
    setSubmenuOpen(!submenuOpen);
  };

  const stats = [
    { icon: <FaBriefcase style={{ color: "#009868" }} />, label: "Offered job", value: 523 },
    { icon: <FaEye style={{ color: "#A70A29" }} />, label: "Applied candidates", value: 523 },
    { icon: <FaBookmark style={{ color: "#FFA410" }} />, label: "Succeed Job Apply", value: 523 },
    { icon: <FaUsers style={{ color: "#FA1919" }} />, label: "Admins", value: 523 },
    { icon: <FaUsers style={{ color: "#888888" }} />, label: "Mentors", value: 523 },
    { icon: <FaUsers style={{ color: "#9237CB" }} />, label: "Mentees", value: 523 },
    { icon: <FaUsers style={{ color: "#1E88E5" }} />, label: "Employees", value: 523 },
    { icon: <FaCalendarCheck style={{ color: "#3DD598" }} />, label: "Appointments", value: 523 },
  ];

  const data = [
      { month: "Jan", offered: 50, applied: 30, succeed: 20 },
      // ... other data points
      { month: "Dec", offered: 250, applied: 180, succeed: 160 },
  ];

  // --- Helper to render the main content dynamically ---
  const renderContent = () => {
    switch (activeView) {
      case 'addUser':
        return (
          <div className="form-section-container">
            <AddUserForm />
          </div>
        );
      case 'dashboard':
      default:
        return (
          <>
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="icon">{stat.icon}</div>
                  <div className="details">
                    <h4>{stat.value}</h4>
                    <p>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="chart-container">
              <h3>Analysis Chart</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="offered" stroke="#1CC100" name="Offered Jobs" legendType="circle" />
                  <Line type="monotone" dataKey="applied" stroke="#1DB4BD" name="Applied Candidates" legendType="circle" />
                  <Line type="monotone" dataKey="succeed" stroke="#FDC006" name="Succeed Job Apply" legendType="circle" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        );
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <div className="profile">
          <div className="profile-pic">
            <img src={admin} alt="Admin" />
          </div>
          <h3>Dinusha Herath</h3>
          <p>Admin</p>
        </div>
        <nav>
          <ul>
            {/* --- MODIFIED: Navigation items now control the view --- */}
            <li className={activeView === 'dashboard' ? 'active' : ''} onClick={() => setActiveView('dashboard')}>
              <FaHome /> Admin Dashboard
            </li>
            <li className={activeView === 'addUser' ? 'active' : ''} onClick={() => setActiveView('addUser')}>
              <FaUserPlus /> Add New User
            </li>
            <li className={`has-submenu ${submenuOpen ? "open" : ""}`} onClick={toggleSubmenu}>
              Manage ▼
            </li>
            {submenuOpen && (
              <ul className="submenu">
                {/* These links could also set the view or navigate to different pages */}
                <li><Link to="/admin/manage-mentors">Mentor</Link></li>
                <li><Link to="/admin/manage-mentees">Mentee</Link></li>
                <li><Link to="/admin/manage-employees">Employee</Link></li>
                <li><Link to="/admin/manage-jobseekers">Jobseeker</Link></li>
              </ul>
            )}
            <li><Link to="/admin/messages">Messages <span className="message-count">4</span></Link></li>
            <li>Change Password</li>
            <li>Log Out</li>
          </ul>
        </nav>
      </aside>
      {/* --- MODIFIED: Main content is now rendered dynamically --- */}
      <main className="content">
        {renderContent()}
      </main>
    </div>
  );
};

export default Admin;