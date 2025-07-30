import React from 'react';
import { Link } from 'react-router-dom';
import "./Sidebar.css";
import hansi from "../../../assets/img/hansi.jpg";

const EmployeeSidebar = ({ activeTab, setActiveTab }) => {
    const handleTabClick = (tabName, e) => {
        e.preventDefault();
        setActiveTab(tabName);
    };

    const navigationItems = [
        {
            name: "Dashboard",
            label: "Dashboard",
            icon: "📊"
        },
        {
            name: "Profile",
            label: "My Profile",
            icon: "👤"
        },
        {
            name: "PostedJob",
            label: "Posted Jobs",
            icon: "💼"
        },
        {
            name: "PostJobSpecs",
            label: "Post New Job",
            icon: "📝"
        },
        {
            name: "Candidates",
            label: "Candidates",
            icon: "👥"
        },
        {
            name: "Messages",
            label: "Messages",
            icon: "💬"
        }
    ];

    const accountItems = [
        {
            name: "Password",
            label: "Security",
            icon: "🔒"
        },
    ];

    return (
        <div className="employee-sidebar">

            {/* Profile Section */}
            <div className="profile-section">
                <div className="profile-image-container">
                    <img
                        src={hansi}
                        alt="User Profile"
                        className="profile-image"
                    />
                    <div className="online-indicator"></div>
                </div>
                <div className="profile-info">
                    <h3 className="profile-name">Hansamali Awarjana</h3>
                    <p className="profile-role">Employee</p>
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="sidebar-nav">
                <div className="nav-section">
                    <h4 className="nav-section-title">Main Menu</h4>
                    <div className="nav-items">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.name}
                                to="#"
                                onClick={(e) => handleTabClick(item.name, e)}
                                className={`nav-item ${activeTab === item.name ? "active" : ""}`}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                                {item.name === "Messages" && (
                                    <span className="nav-badge">3</span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>

            </nav>

            
        </div>
    );
};

export default EmployeeSidebar;
