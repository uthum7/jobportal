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
  FaExclamationTriangle,
} from "react-icons/fa"
import "./delete-account.css"
 const userstring = localStorage.getItem("user")
  const user = userstring ? JSON.parse(userstring) : null


export default function DeleteAccount() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [reason, setReason] = useState("")
  const [password, setPassword] = useState("")
  const [confirmText, setConfirmText] = useState("")
  const [errors, setErrors] = useState({})

  const handleInitiateDelete = () => {
    setShowConfirmation(true)
  }

  const handleCancel = () => {
    setShowConfirmation(false)
    setReason("")
    setPassword("")
    setConfirmText("")
    setErrors({})
  }

  const validateForm = () => {
    const errors = {}

    if (!reason) {
      errors.reason = "Please select a reason for deleting your account"
    }

    if (!password) {
      errors.password = "Please enter your password to confirm"
    }

    if (confirmText !== "DELETE") {
      errors.confirmText = "Please type DELETE to confirm"
    }

    return errors
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    const formErrors = validateForm()

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    // In a real app, you would call an API to delete the account
    console.log("Account deletion submitted:", { reason, password })

    // Redirect to home page or confirmation page
    window.location.href = "/"
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
          <Link to="/counselee/change-password" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaKey />
              </span>
              <span className="menu-text">Change Password</span>
            </div>
          </Link>
          <Link to="/counselee/delete-account" className="menu-item active">
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
          <h1>Delete Account</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> / Delete Account
          </div>
        </div>

        <div className="delete-account-container">
          {!showConfirmation ? (
            <div className="initial-warning">
              <div className="warning-header">
                <FaExclamationTriangle className="warning-icon" />
                <h2>Delete Your Account</h2>
              </div>

              <div className="warning-content">
                <p>
                  We're sorry to see you go. Before you proceed with deleting your account, please be aware of the
                  following:
                </p>

                <ul className="warning-list">
                  <li>All your personal information will be permanently deleted</li>
                  <li>Your profile will no longer be visible to counselors</li>
                  <li>All your booking history and messages will be removed</li>
                  <li>This action cannot be undone</li>
                </ul>

                <p>
                  If you're experiencing issues with our service, please consider
                  <Link to="/contact" className="contact-link">
                    {" "}
                    contacting our support team{" "}
                  </Link>
                  before deleting your account.
                </p>

                <div className="warning-actions">
                  <button className="delete-btn" onClick={handleInitiateDelete}>
                    Delete My Account
                  </button>
                  <Link to="/counselee/dashboard" className="cancel-btn">
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="confirmation-form">
              <h2>Confirm Account Deletion</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Please tell us why you're leaving:</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className={errors.reason ? "error" : ""}
                  >
                    <option value="">Select a reason</option>
                    <option value="not-useful">The service is not useful to me</option>
                    <option value="found-job">I found a job</option>
                    <option value="too-expensive">The service is too expensive</option>
                    <option value="privacy">Privacy concerns</option>
                    <option value="difficult">The platform is difficult to use</option>
                    <option value="other">Other reason</option>
                  </select>
                  {errors.reason && <div className="error-message">{errors.reason}</div>}
                </div>

                <div className="form-group">
                  <label>Enter your password to confirm:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? "error" : ""}
                  />
                  {errors.password && <div className="error-message">{errors.password}</div>}
                </div>

                <div className="form-group">
                  <label>Type DELETE to confirm:</label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    className={errors.confirmText ? "error" : ""}
                    placeholder="DELETE"
                  />
                  {errors.confirmText && <div className="error-message">{errors.confirmText}</div>}
                </div>

                <div className="final-warning">
                  <FaExclamationTriangle className="final-warning-icon" />
                  <p>
                    This action is permanent and cannot be undone. All your data will be permanently deleted from our
                    servers.
                  </p>
                </div>

                <div className="confirmation-actions">
                  <button type="submit" className="confirm-delete-btn">
                    Permanently Delete Account
                  </button>
                  <button type="button" className="go-back-btn" onClick={handleCancel}>
                    Go Back
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

