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
  FaClock,
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa"
import "./change-password.css"

export default function CounselorChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    }
    setPasswordRequirements(requirements)

    return (
      requirements.length &&
      requirements.uppercase &&
      requirements.lowercase &&
      requirements.number &&
      requirements.special
    )
  }

  const handleNewPasswordChange = (e) => {
    const newPass = e.target.value
    setNewPassword(newPass)
    validatePassword(newPass)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    // Validate password
    if (!validatePassword(newPassword)) {
      setErrorMessage("Password does not meet all requirements")
      return
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password do not match")
      return
    }

    // Simulate API call
    setTimeout(() => {
      setSuccessMessage("Password updated successfully!")
      // Reset form
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setPasswordRequirements({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      })
    }, 1000)
  }
  return (
    <div className="dashboard-layout">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-profile">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Young-and-confident-male-teacher-1024x683.jpg-R6ysbV9y1tkPVjRz96mm0z4KBc2S62.jpeg"
            alt="James Anderson"
            className="profile-image"
          />
          <h3 className="profile-name">James Anderson</h3>
          <p className="profile-title">Career Development Specialist</p>
        </div>

        <nav className="sidebar-menu">
          <Link to="/counselor/dashboard" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaHome />
              </span>
              <span className="menu-text">Dashboard</span>
            </div>
          </Link>
          <Link to="/counselor/profile" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaUser />
              </span>
              <span className="menu-text">My Profile</span>
            </div>
          </Link>
          <Link to="/counselor/bookings" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaCalendarAlt />
              </span>
              <span className="menu-text">Bookings</span>
            </div>
          </Link>
          <Link to="/counselor/schedule" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaClock />
              </span>
              <span className="menu-text">Schedule Timings</span>
            </div>
          </Link>
          <Link to="/counselor/counselees" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaUsers />
              </span>
              <span className="menu-text">My Counselees</span>
            </div>
          </Link>
          <Link to="/counselor/messages" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaEnvelope />
              </span>
              <span className="menu-text">Messages</span>
            </div>
            <span className="menu-badge">3</span>
          </Link>
          <Link to="/counselor/change-password" className="menu-item active">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaKey />
              </span>
              <span className="menu-text">Change Password</span>
            </div>
          </Link>
          <Link to="/counselor/delete-account" className="menu-item">
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

      {/* Main Content */}
      <main className="main-content">
        <div className="change-password-header">
          <h1>Change Password</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> / Change Password
          </div>
        </div>

        <div className="change-password-content">
          {successMessage && (
            <div className="success-message">
              <FaCheckCircle className="message-icon" />
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="error-message">
              <FaExclamationCircle className="message-icon" />
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="change-password-form">
            <div className="form-section">
              <h2>Change Your Password</h2>
              <p>Please enter your current password and new password below</p>

              <div className="form-group">
                <label htmlFor="current-password">Current Password</label>
                <div className="password-input-container">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="new-password">New Password</label>
                <div className="password-input-container">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="new-password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirm-password">Confirm New Password</label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="password-requirements">
                <h3>Password Requirements</h3>
                <ul className="requirements-list">
                  <li className={passwordRequirements.length ? "fulfilled" : ""}>
                    {passwordRequirements.length ? <FaCheckCircle /> : <FaExclamationCircle />}
                    Minimum 8 characters
                  </li>
                  <li className={passwordRequirements.uppercase ? "fulfilled" : ""}>
                    {passwordRequirements.uppercase ? <FaCheckCircle /> : <FaExclamationCircle />}
                    At least one uppercase letter
                  </li>
                  <li className={passwordRequirements.lowercase ? "fulfilled" : ""}>
                    {passwordRequirements.lowercase ? <FaCheckCircle /> : <FaExclamationCircle />}
                    At least one lowercase letter
                  </li>
                  <li className={passwordRequirements.number ? "fulfilled" : ""}>
                    {passwordRequirements.number ? <FaCheckCircle /> : <FaExclamationCircle />}
                    At least one number
                  </li>
                  <li className={passwordRequirements.special ? "fulfilled" : ""}>
                    {passwordRequirements.special ? <FaCheckCircle /> : <FaExclamationCircle />}
                    At least one special character (!@#$%^&*)
                  </li>
                </ul>
              </div>

              <div className="form-actions">
                <button type="submit" className="update-password-btn">
                  <FaKey className="btn-icon" /> Update Password
                </button>
                <Link to="/counselor/profile" className="cancel-btn">
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

