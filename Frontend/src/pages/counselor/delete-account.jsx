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
  FaExclamationTriangle,
  FaCheck,
  FaTimes,
} from "react-icons/fa"
import "./delete-account.css"

export default function CounselorDeleteAccount() {
  const [password, setPassword] = useState("")
  const [reason, setReason] = useState("")
  const [confirmText, setConfirmText] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const reasons = [
    "I don't need the platform anymore",
    "I'm not satisfied with the service",
    "I found a better alternative",
    "Too expensive",
    "Technical issues",
    "Privacy concerns",
    "Other",
  ]

  const handleInitialSubmit = (e) => {
    e.preventDefault()

    if (!password) {
      setErrorMessage("Please enter your password")
      return
    }

    if (!reason) {
      setErrorMessage("Please select a reason for leaving")
      return
    }

    setErrorMessage("")
    setShowConfirmDialog(true)
  }

  const handleConfirmDelete = () => {
    if (confirmText !== "DELETE") {
      setErrorMessage("Please type 'DELETE' to confirm")
      return
    }

    // In a real app, this would call an API to delete the account
    console.log("Account deleted")
    // Redirect to home or login page
    window.location.href = "/"
  }

  const handleCancel = () => {
    setShowConfirmDialog(false)
    setConfirmText("")
    setErrorMessage("")
  }
<<<<<<< HEAD
   const userstring = localStorage.getItem("user")
  const user = userstring ? JSON.parse(userstring) : null
  console.log("User data from localStorage:", user)
=======
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19

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
<<<<<<< HEAD
         <h3 className="profile-name">{user.name}</h3>
          <p className="profile-title">{user.specialty}</p>
=======
          <h3 className="profile-name">James Anderson</h3>
          <p className="profile-title">Career Development Specialist</p>
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
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
          <Link to="/counselor/change-password" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaKey />
              </span>
              <span className="menu-text">Change Password</span>
            </div>
          </Link>
          <Link to="/counselor/delete-account" className="menu-item active">
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
        <div className="delete-account-header">
          <h1>Delete Account</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> / Delete Account
          </div>
        </div>

        <div className="delete-account-content">
          {errorMessage && (
            <div className="error-message">
              <FaExclamationTriangle /> {errorMessage}
            </div>
          )}

          {!showConfirmDialog ? (
            <form onSubmit={handleInitialSubmit} className="delete-account-form">
              <div className="warning-box">
                <div className="warning-icon">
                  <FaExclamationTriangle />
                </div>
                <div className="warning-text">
                  <h3>Warning: This action cannot be undone</h3>
                  <p>
                    Deleting your account will permanently remove all your data, including your profile, bookings,
                    messages, and counselee relationships. This action cannot be reversed.
                  </p>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Enter your password to continue</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reason">Please tell us why you're leaving</label>
                <select id="reason" value={reason} onChange={(e) => setReason(e.target.value)} required>
                  <option value="">Select a reason</option>
                  {reasons.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {reason === "Other" && (
                <div className="form-group">
                  <label htmlFor="other-reason">Please specify</label>
                  <textarea id="other-reason" placeholder="Tell us more..." rows={3}></textarea>
                </div>
              )}

              <div className="what-happens">
                <h3>What happens when you delete your account:</h3>
                <ul>
                  <li>Your profile will be permanently removed</li>
                  <li>All your bookings will be canceled</li>
                  <li>Your counselees will be notified that you are no longer available</li>
                  <li>All messages and communication history will be deleted</li>
                  <li>You will lose access to all platform features</li>
                  <li>Any unpaid balances will still need to be settled</li>
                </ul>
              </div>

              <div className="form-actions">
                <button type="submit" className="delete-btn">
                  <FaTrashAlt /> Continue to Delete Account
                </button>
                <Link to="/counselor/profile" className="cancel-btn">
                  Cancel
                </Link>
              </div>
            </form>
          ) : (
            <div className="confirm-delete">
              <div className="confirm-icon">
                <FaExclamationTriangle />
              </div>
              <h2>Final Confirmation</h2>
              <p>
                This is your last chance to reconsider. Your account and all associated data will be permanently
                deleted.
              </p>
              <div className="confirm-input">
                <label htmlFor="confirm-text">Type "DELETE" to confirm</label>
                <input
                  type="text"
                  id="confirm-text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                />
              </div>
              <div className="confirm-actions">
                <button
                  className="confirm-delete-btn"
                  onClick={handleConfirmDelete}
                  disabled={confirmText !== "DELETE"}
                >
                  <FaCheck /> Yes, Delete My Account
                </button>
                <button className="go-back-btn" onClick={handleCancel}>
                  <FaTimes /> No, Go Back
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

