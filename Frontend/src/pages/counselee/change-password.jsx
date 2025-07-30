"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import {
  FaHome,
  FaUser,
  FaCalendarAlt,
  FaUsers,
  FaEnvelope,
  FaKey,
  FaTrashAlt,
  FaSignOutAlt,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
} from "react-icons/fa"
import "./change-password.css"
import { axiosInstance } from "../../lib/axios"
  const userstring = localStorage.getItem("user")
  const user = userstring ? JSON.parse(userstring) : null


export default function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [formSuccess, setFormSuccess] = useState(false)

  // Password validation criteria
  const passwordCriteria = [
    { id: "length", label: "At least 8 characters", valid: formData.newPassword.length >= 8 },
    { id: "uppercase", label: "At least one uppercase letter", valid: /[A-Z]/.test(formData.newPassword) },
    { id: "lowercase", label: "At least one lowercase letter", valid: /[a-z]/.test(formData.newPassword) },
    { id: "number", label: "At least one number", valid: /[0-9]/.test(formData.newPassword) },
    { id: "special", label: "At least one special character", valid: /[^A-Za-z0-9]/.test(formData.newPassword) },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear errors when typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      })
    }

    // Clear success message when making changes
    if (formSuccess) {
      setFormSuccess(false)
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.currentPassword) {
      errors.currentPassword = "Current password is required"
    }

    if (!formData.newPassword) {
      errors.newPassword = "New password is required"
    } else {
      // Check if new password meets all criteria
      const allCriteriaMet = passwordCriteria.every((criteria) => criteria.valid)
      if (!allCriteriaMet) {
        errors.newPassword = "Password does not meet all requirements"
      }
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password"
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    try {
      // Call backend API to change password
      const res = await axiosInstance.put("http://localhost:5001/api/auth/change-password", {
        userId: JSON.parse(localStorage.getItem("user")).userId, // Get userId from localStorage
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      })
      setFormSuccess(true)
      setFormErrors({})
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setFormErrors({ api: err.response.data.message })
      } else {
        setFormErrors({ api: "Failed to change password. Please try again." })
      }
      setFormSuccess(false)
    }
  }

  return (
    <div className="dashboard-layout">
      {/* Left Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-profile">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-16%20132226-dgHAwgPAd5U9t5uD3aiDzazUMdPqCu.png"
            alt="Sanduni Dilhara"
            className="profile-image"
          />
          <h3 className="profile-name">{user.name}</h3>
          
        </div>

        <nav className="sidebar-menu">
          <Link to="/counselee/dashboard" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaHome />
              </span>
              <span className="menu-text">Dashboard</span>
            </div>
          </Link>
          <Link to="/counselee/profile" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaUser />
              </span>
              <span className="menu-text">My Profile</span>
            </div>
          </Link>
          <Link to="/counselee/bookings" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaCalendarAlt />
              </span>
              <span className="menu-text">Bookings</span>
            </div>
          </Link>
          <Link to="/counselee/find-counselor" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaUsers />
              </span>
              <span className="menu-text">Find a Counselor</span>
            </div>
          </Link>
          <Link to="/counselee/messages" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaEnvelope />
              </span>
              <span className="menu-text">Messages</span>
            </div>
            <span className="menu-badge">2</span>
          </Link>
          <Link to="/counselee/change-password" className="menu-item active">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaKey />
              </span>
              <span className="menu-text">Change Password</span>
            </div>
          </Link>
          <Link to="/counselee/delete-account" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaTrashAlt />
              </span>
              <span className="menu-text">Delete Account</span>
            </div>
          </Link>
          <Link to="/logout" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaSignOutAlt />
              </span>
              <span className="menu-text">Log Out</span>
            </div>
          </Link>
        </nav>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <h1>Change Password</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> / Change Password
          </div>
        </div>

        <div className="password-container">
          {formSuccess && (
            <div className="success-message">
              <FaCheck className="success-icon" />
              <p>Your password has been changed successfully!</p>
            </div>
          )}
          {formErrors.api && (
            <div className="error-message" style={{ marginBottom: "1rem" }}>
              <FaTimes className="criteria-icon" /> {formErrors.api}
            </div>
          )}

          <form className="password-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Current Password</label>
              <div className="password-input-container">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className={formErrors.currentPassword ? "error" : ""}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formErrors.currentPassword && <div className="error-message">{formErrors.currentPassword}</div>}
            </div>

            <div className="form-group">
              <label>New Password</label>
              <div className="password-input-container">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className={formErrors.newPassword ? "error" : ""}
                />
                <button type="button" className="toggle-password" onClick={() => setShowNewPassword(!showNewPassword)}>
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formErrors.newPassword && <div className="error-message">{formErrors.newPassword}</div>}

              <div className="password-criteria">
                <h4>Password must contain:</h4>
                <ul>
                  {passwordCriteria.map((criteria) => (
                    <li key={criteria.id} className={criteria.valid ? "valid" : ""}>
                      {criteria.valid ? <FaCheck className="criteria-icon" /> : <FaTimes className="criteria-icon" />}
                      {criteria.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={formErrors.confirmPassword ? "error" : ""}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formErrors.confirmPassword && <div className="error-message">{formErrors.confirmPassword}</div>}
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                Change Password
              </button>
              <Link to="/counselee/dashboard" className="cancel-btn">
                Cancel
              </Link>
            </div>
          </form>

          <div className="password-tips">
            <h3>Password Security Tips</h3>
            <ul>
              <li>Use a unique password for each of your important accounts</li>
              <li>Never share your password with anyone</li>
              <li>Avoid using personal information in your password</li>
              <li>Change your password regularly</li>
              <li>Consider using a password manager to generate and store strong passwords</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

