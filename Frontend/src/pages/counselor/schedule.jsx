"use client"

import { useState, useEffect } from "react"
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
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa"
import Calendar from "../../components/Calendar/Calendar"
import BookingModal from "../../components/BookingModal/BookingModal"
import BookingStats from "../../components/BookingStats/BookingStats"
import Notification from "../../components/Notification/Notification"
import { bookingAPI } from "../../services/api.jsx"
import "./schedule.css"

export default function ScheduleTimings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [notification, setNotification] = useState(null)

  // Get user from localStorage
  const userString = localStorage.getItem("user")
  const user = userString ? JSON.parse(userString) : null
  const counselorId = user?.counselors_id

  // Fetch bookings for this counselor
  const fetchBookings = async () => {
    if (!counselorId) {
      setError("Counselor ID not found. Please log in again.")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await bookingAPI.getBookingsByCounselor(counselorId)
      
      if (response.success) {
        setBookings(response.data || [])
      } else {
        throw new Error(response.message || "Failed to fetch bookings")
      }
    } catch (err) {
      console.error("Error fetching bookings:", err)
      setError(err.message || "Failed to load bookings")
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings()
  }, [counselorId])

  // Handle booking click
  const handleBookingClick = (booking) => {
    setSelectedBooking(booking)
    setShowModal(true)
  }

  // Handle date selection
  const handleDateSelect = (date) => {
    console.log("Selected date:", date)
    // You can implement additional functionality here
  }

  // Handle status change
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setActionLoading(true)
      
      const response = await bookingAPI.updateBooking(bookingId, {
        status: newStatus
      })
      
      if (response.success) {
        // Refresh bookings
        await fetchBookings()
        setShowModal(false)
        setNotification({
          message: `Booking ${newStatus.toLowerCase()} successfully`,
          type: 'success'
        })
      } else {
        throw new Error(response.message || "Failed to update booking")
      }
    } catch (error) {
      console.error("Error updating booking:", error)
      setNotification({
        message: error.message || "Failed to update booking",
        type: 'error'
      })
    } finally {
      setActionLoading(false)
    }
  }

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedBooking(null)
  }

  // Handle edit booking
  const handleEditBooking = (booking) => {
    // You can implement edit functionality here
    console.log("Edit booking:", booking)
    setNotification({
      message: "Edit functionality will be implemented in the next update",
      type: 'success'
    })
  }

  // Handle notification close
  const handleCloseNotification = () => {
    setNotification(null)
  }
   

  return (
    <div className="dashboard-layout">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-profile">
          <img
            src={user?.profilePic || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Young-and-confident-male-teacher-1024x683.jpg-R6ysbV9y1tkPVjRz96mm0z4KBc2S62.jpeg"}
            alt={user?.fullName || "Counselor"}
            className="profile-image"
          />
          <h3 className="profile-name">{user.name}</h3>
          <p className="profile-title">{user.specialty}</p>
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
          <Link to="/counselor/schedule" className="menu-item active">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaClock />
              </span>
              <span className="menu-text">Booking Calendar</span>
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
        <div className="schedule-header">
          <h1>Booking Calendar</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> / Booking Calendar
          </div>
        </div>

        <div className="schedule-content">
          <div className="schedule-instructions">
            <h2>Your Booking Calendar</h2>
            <p>
              View and manage all your counseling appointments. Click on any booking to see details, update status, or make changes.
            </p>
          </div>

          {/* Booking Statistics */}
          {!loading && !error && (
            <BookingStats bookings={bookings} />
          )}

          {loading ? (
            <div className="loading-state">
              <FaSpinner className="loading-spinner" />
              <p>Loading your bookings...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <FaExclamationTriangle className="error-icon" />
              <h3>Error Loading Bookings</h3>
              <p>{error}</p>
              <button onClick={fetchBookings} className="retry-btn">
                Try Again
              </button>
            </div>
          ) : (
            <Calendar
              bookings={bookings}
              onDateSelect={handleDateSelect}
              onBookingClick={handleBookingClick}
            />
          )}
        </div>
      </main>

      {/* Booking Details Modal */}
      <BookingModal
        booking={selectedBooking}
        isOpen={showModal}
        onClose={handleCloseModal}
        onStatusChange={handleStatusChange}
        onEdit={handleEditBooking}
        actionLoading={actionLoading}
      />

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
    </div>
  )
}

