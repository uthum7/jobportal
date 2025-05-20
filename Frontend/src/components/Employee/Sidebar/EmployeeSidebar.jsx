import React from 'react';
import { Link } from 'react-router-dom';
import "./Sidebar.css";
import hansi from "../../../assets/img/hansi.jpg";

const EmployeeSidebar = ({ activeTab, setActiveTab }) => {
    const handleTabClick = (tabName, e) => {
        e.preventDefault(); // Prevent default link behavior
        setActiveTab(tabName);
    };

    return (
        <div className="employee-sidebar">
            <div className="profile-section">
                <img
                    src={hansi}
                    alt="User Profile"
                    className="profile-image"
                />
                <h3>Hansamali Awarjana</h3>
            </div>

            <nav className="sidebar-nav">
                <Link 
                    to="#" 
                    onClick={(e) => handleTabClick("Dashboard", e)} 
                    className={`nav-item ${activeTab === "Dashboard" ? "active" : ""}`}
                >
                    <span>User Dashboard</span>
                </Link>

                <Link 
                    to="#" 
                    onClick={(e) => handleTabClick("Profile", e)} 
                    className={`nav-item ${activeTab === "Profile" ? "active" : ""}`}
                >
                    <span>My Profile</span>
                </Link>

                <Link 
                    to="#" 
                    onClick={(e) => handleTabClick("PostedJob", e)} 
                    className={`nav-item ${activeTab === "PostedJob" ? "active" : ""}`}
                >
                    <span>Posted Jobs</span>
                </Link>

                <Link 
                    to="#" 
                    onClick={(e) => handleTabClick("PostJobSpecs", e)} 
                    className={`nav-item ${activeTab === "PostJobSpecs" ? "active" : ""}`}
                >
                    <span>Post Job Specifications</span>
                </Link>

                <Link 
                    to="#" 
                    onClick={(e) => handleTabClick("Candidates", e)} 
                    className={`nav-item ${activeTab === "Candidates" ? "active" : ""}`}
                >
                    <span>Shortlisted Candidates</span>
                </Link>

                <Link 
                    to="#" 
                    onClick={(e) => handleTabClick("Messages", e)} 
                    className={`nav-item ${activeTab === "Messages" ? "active" : ""}`}
                >
                    <span>Messages</span>
                </Link>

                <Link 
                    to="#" 
                    onClick={(e) => handleTabClick("Password", e)} 
                    className={`nav-item ${activeTab === "Password" ? "active" : ""}`}
                >
                    <span>Change Password</span>
                </Link>

                <Link 
                    to="#" 
                    onClick={(e) => handleTabClick("DeleteAccount", e)} 
                    className={`nav-item ${activeTab === "DeleteAccount" ? "active" : ""}`}
                >
                    <span>Delete Account</span>
                </Link>

                <Link 
                    to="#" 
                    onClick={(e) => handleTabClick("Logout", e)} 
                    className="nav-item"
                >
                    <span>Logout</span>
                </Link>
            </nav>
        </div>
    );
};

export default EmployeeSidebar;