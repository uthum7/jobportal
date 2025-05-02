import React from 'react'
import { Link } from 'react-router-dom'
import "./Sidebar.css"
import admin from "../../../assets/img/admin.jpg"

const EmployeeSidebar = () => {
    return (
        <div className="employee-sidebar">
            <div className="profile-section">
                <img
                    src={admin}
                    alt="User Profile"
                    className="profile-image"
                />
                <h3>Sanduni Dilhara</h3>
            </div>

            <nav className="sidebar-nav">
                <Link to="/counselee/dashboard" className="nav-item">
                    {/* <Home className="nav-icon" /> */}
                    <span>User Dashboard</span>
                </Link>

                <Link to="/counselee/dashboard" className="nav-item">
                    {/* <Home className="nav-icon" /> */}
                    <span>My Profile</span>
                </Link>

                <Link to="/counselee/dashboard" className="nav-item">
                    {/* <Home className="nav-icon" /> */}
                    <span>Posted Jobs</span>
                </Link>

                <Link to="/counselee/dashboard" className="nav-item">
                    {/* <Home className="nav-icon" /> */}
                    <span>User Dashboard</span>
                </Link>
                <Link to="/counselee/dashboard" className="nav-item">
                    {/* <Home className="nav-icon" /> */}
                    <span>My Profile</span>
                </Link>

                <Link to="/counselee/dashboard" className="nav-item">
                    {/* <Home className="nav-icon" /> */}
                    <span>Posted Jobs</span>
                </Link>

            </nav>
        </div>
    )
}

export default EmployeeSidebar