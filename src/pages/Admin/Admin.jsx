import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FaUser, FaBriefcase, FaEye, FaBookmark, FaUsers, FaCalendarCheck } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import "../../pages/Admin/Admin.css";
import admin from "../../assets/img/admin.jpg";

const Admin = () => {
  const stats = [
    { icon: <FaBriefcase />, label: "Offered job", value: 523 },
    { icon: <FaEye />, label: "Applied candidates", value: 523 },
    { icon: <FaBookmark />, label: "Succeed Job Apply", value: 523 },
    { icon: <FaUsers />, label: "Admins", value: 523 },
    { icon: <FaUsers />, label: "Mentors", value: 523 },
    { icon: <FaUsers />, label: "Mentees", value: 523 },
    { icon: <FaUsers />, label: "Employees", value: 523 },
    { icon: <FaCalendarCheck />, label: "Appointments", value: 523 },
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
                <img src={admin} alt="Admin" /></div>         
          <h3>Dinusha Herath</h3>
          <p>Admin</p>
        </div>
        <nav>
        <ul>
      <li className="active">Admin Dashboard</li>
      <li>My Profile</li>
      <li className="has-submenu">
        Manage ▼
        <ul className="submenu">
          <li>Mentor</li>
          <li>Mentee</li>
          <li>Employee</li>
          <li>Jobseeker</li>
        </ul>
      </li>
      <li>
        Messages <span className="message-count">4</span>
      </li>
      <li>Change Password</li>
      <li>Delete Account</li>
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
              <Line type="monotone" dataKey="offered" stroke="#2ecc71" name="Offered Jobs" />
              <Line type="monotone" dataKey="applied" stroke="#e74c3c" name="Applied Candidates" />
              <Line type="monotone" dataKey="succeed" stroke="#f1c40f" name="Succeed Job Apply" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
};

export default Admin;
