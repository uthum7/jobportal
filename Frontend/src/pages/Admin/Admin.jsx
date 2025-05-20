import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaBriefcase, FaEye, FaBookmark, FaUsers, FaCalendarCheck } from "react-icons/fa";
import "../../pages/Admin/Admin.css";
import admin from "../../assets/img/admin.jpg";

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
  
  
} from 'react-icons/fa';

const Admin = () => {
  const [submenuOpen, setSubmenuOpen] = useState(false);

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
    { month: "Feb", offered: 100, applied: 70, succeed: 50 },
    { month: "Mar", offered: 130, applied: 90, succeed: 80 },
    { month: "Apr", offered: 90, applied: 60, succeed: 55 },
    { month: "May", offered: 110, applied: 85, succeed: 75 },
    { month: "Jun", offered: 140, applied: 120, succeed: 130 },
    { month: "Jul", offered: 150, applied: 135, succeed: 140 },
    { month: "Aug", offered: 170, applied: 140, succeed: 130 },
    { month: "Sep", offered: 160, applied: 125, succeed: 115 },
    { month: "Oct", offered: 140, applied: 110, succeed: 100 },
    { month: "Nov", offered: 180, applied: 140, succeed: 130 },
    { month: "Dec", offered: 250, applied: 180, succeed: 160 },
  ];

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
            <li className="active"><FaHome />Admin Dashboard</li>
            <li>My Profile</li>
            <li className={`has-submenu ${submenuOpen ? "open" : ""}`} onClick={toggleSubmenu}>
              Manage ▼
            </li>
            {submenuOpen && (
              <ul className="submenu">
                <li>Mentor</li>
                <li>Mentee</li>
                <li>Employee</li>
                <li>Jobseeker</li>
              </ul>
            )}
            <li>
              Messages <span className="message-count">4</span>
            </li>
            <li>Change Password</li>
            <li>Log Out</li>
          </ul>
        </nav>
      </aside>

      <main className="content">
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
      </main>
    </div>
  );
};

export default Admin;
