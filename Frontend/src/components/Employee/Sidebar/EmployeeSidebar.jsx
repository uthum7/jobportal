import React from 'react'
import { Link } from 'react-router-dom'
const EmployeeSidebar = () => {
    return (
        <div className="counselee-sidebar">
            <div className="profile-section">
                <img
                    src="/assets/img/placeholder-avatar.jpg"
                    alt="User Profile"
                    className="profile-image"
                />
                <h3>Sanduni Dilhara</h3>
            </div>

            <nav className="sidebar-nav">
                <Link to="/counselee/dashboard" className="nav-item">
                    {/* <Home className="nav-icon" /> */}
                    <span>Dashboard</span>
                </Link>
                {/* ... other navigation items */}
            </nav>
        </div>
    )
}

export default EmployeeSidebar