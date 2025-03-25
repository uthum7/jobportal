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
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaVideo,
  FaPhone,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa"
import "./bookings.css"

// Sample bookings data
const bookingsData = [
  {
    id: 1,
    counselee: {
      name: "Alexander Mitchell",
      email: "alexander.mitchell@gmail.com",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/depositphotos_65103937-stock-illustration-male-avatar-profile-picture-vector.jpg-sGxy88AMCTZclrYwVI5URVtYVKxafN.jpeg",
    },
    date: "05 January 2025",
    time: "9:00 AM - 10:00 AM",
    topic: "Career Development Strategy",
    status: "Confirmed",
    type: "Video Call",
    notes: "Initial consultation to discuss career goals and development strategy.",
  },
  {
    id: 2,
    counselee: {
      name: "Emily Johnson",
      email: "emily.johnson@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "06 January 2025",
    time: "2:00 PM - 3:00 PM",
    topic: "Resume Review",
    status: "Pending",
    type: "Video Call",
    notes: "Review and provide feedback on updated resume.",
  },
  {
    id: 3,
    counselee: {
      name: "Michael Brown",
      email: "michael.brown@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "07 January 2025",
    time: "11:00 AM - 12:00 PM",
    topic: "Interview Preparation",
    status: "Confirmed",
    type: "Phone Call",
    notes: "Mock interview practice for upcoming job interview.",
  },
  {
    id: 4,
    counselee: {
      name: "Sarah Thompson",
      email: "sarah.thompson@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "10 January 2025",
    time: "3:30 PM - 4:30 PM",
    topic: "Career Transition",
    status: "Completed",
    type: "Video Call",
    notes: "Follow-up session to discuss progress on career transition plan.",
  },
  {
    id: 5,
    counselee: {
      name: "David Wilson",
      email: "david.wilson@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    date: "12 January 2025",
    time: "10:00 AM - 11:00 AM",
    topic: "Salary Negotiation",
    status: "Cancelled",
    type: "Video Call",
    notes: "Strategies for upcoming salary negotiation.",
  },
]

export default function CounselorBookings() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [bookings] = useState(bookingsData)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [sessionNotes, setSessionNotes] = useState("")

  // Filter bookings based on search query and status
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.counselee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.counselee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.topic.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.date) - new Date(b.date)
    } else if (sortBy === "name") {
      return a.counselee.name.localeCompare(b.counselee.name)
    } else if (sortBy === "status") {
      return a.status.localeCompare(b.status)
    }
    return 0
  })

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status)
  }

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption)
  }

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setSessionNotes(booking.notes || "")
    setShowDetailsModal(true)
  }

  const handleCloseModal = () => {
    setShowDetailsModal(false)
    setSelectedBooking(null)
  }

  const handleSaveNotes = () => {
    console.log("Saving notes for booking ID:", selectedBooking.id)
    console.log("Notes:", sessionNotes)

    // In a real app, you would call an API to save the notes
    // For now, we'll just update the local state
    const updatedBookings = bookings.map((booking) =>
      booking.id === selectedBooking.id ? { ...booking, notes: sessionNotes } : booking,
    )

    // Close the modal
    handleCloseModal()
  }

  const handleStatusChange = (bookingId, newStatus) => {
    console.log(`Changing status of booking ${bookingId} to ${newStatus}`)

    // In a real app, you would call an API to update the status
    // For now, we'll just log the action
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
          <Link to="/counselor/bookings" className="menu-item active">
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
        <div className="bookings-header">
          <h1>My Bookings</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> / Bookings
          </div>
        </div>

        <div className="bookings-content">
          {/* Search and Filter Section */}
          <div className="bookings-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button className="search-button">
                <FaSearch className="search-icon" />
              </button>
            </div>

            <div className="filter-controls">
              <div className="filter-dropdown">
                <button className="filter-button">
                  <FaFilter className="filter-icon" /> Filter by Status
                </button>
                <div className="filter-dropdown-content">
                  <button
                    className={`filter-option ${statusFilter === "all" ? "active" : ""}`}
                    onClick={() => handleStatusFilterChange("all")}
                  >
                    All
                  </button>
                  <button
                    className={`filter-option ${statusFilter === "confirmed" ? "active" : ""}`}
                    onClick={() => handleStatusFilterChange("confirmed")}
                  >
                    Confirmed
                  </button>
                  <button
                    className={`filter-option ${statusFilter === "pending" ? "active" : ""}`}
                    onClick={() => handleStatusFilterChange("pending")}
                  >
                    Pending
                  </button>
                  <button
                    className={`filter-option ${statusFilter === "completed" ? "active" : ""}`}
                    onClick={() => handleStatusFilterChange("completed")}
                  >
                    Completed
                  </button>
                  <button
                    className={`filter-option ${statusFilter === "cancelled" ? "active" : ""}`}
                    onClick={() => handleStatusFilterChange("cancelled")}
                  >
                    Cancelled
                  </button>
                </div>
              </div>

              <div className="sort-dropdown">
                <button className="sort-button">
                  <FaSortAmountDown className="sort-icon" /> Sort by
                </button>
                <div className="sort-dropdown-content">
                  <button
                    className={`sort-option ${sortBy === "date" ? "active" : ""}`}
                    onClick={() => handleSortChange("date")}
                  >
                    Date
                  </button>
                  <button
                    className={`sort-option ${sortBy === "name" ? "active" : ""}`}
                    onClick={() => handleSortChange("name")}
                  >
                    Counselee Name
                  </button>
                  <button
                    className={`sort-option ${sortBy === "status" ? "active" : ""}`}
                    onClick={() => handleSortChange("status")}
                  >
                    Status
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="bookings-list">
            {sortedBookings.length > 0 ? (
              sortedBookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-left">
                    <div className="booking-counselee">
                      <img
                        src={booking.counselee.avatar || "/placeholder.svg"}
                        alt={booking.counselee.name}
                        className="counselee-avatar"
                      />
                      <div className="counselee-details">
                        <h3 className="counselee-name">{booking.counselee.name}</h3>
                        <p className="counselee-email">{booking.counselee.email}</p>
                      </div>
                    </div>
                    <div className="booking-details">
                      <div className="booking-detail">
                        <FaCalendarAlt className="detail-icon" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="booking-detail">
                        <FaClock className="detail-icon" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="booking-detail">
                        {booking.type === "Video Call" ? (
                          <FaVideo className="detail-icon" />
                        ) : (
                          <FaPhone className="detail-icon" />
                        )}
                        <span>{booking.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="booking-right">
                    <div className="booking-topic">
                      <h4>Topic:</h4>
                      <p>{booking.topic}</p>
                    </div>
                    <div className="booking-actions">
                      <div className={`booking-status ${booking.status.toLowerCase()}`}>{booking.status}</div>
                      <div className="action-buttons">
                        <button className="view-details-btn" onClick={() => handleViewDetails(booking)}>
                          View Details
                        </button>
                        {booking.status === "Pending" && (
                          <div className="status-action-buttons">
                            <button className="accept-btn" onClick={() => handleStatusChange(booking.id, "Confirmed")}>
                              <FaCheck /> Accept
                            </button>
                            <button className="decline-btn" onClick={() => handleStatusChange(booking.id, "Cancelled")}>
                              <FaTimes /> Decline
                            </button>
                          </div>
                        )}
                        {booking.status === "Confirmed" && <button className="start-session-btn">Start Session</button>}
                        {booking.status === "Completed" && (
                          <button className="add-notes-btn" onClick={() => handleViewDetails(booking)}>
                            Add Notes
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-bookings">
                <FaExclamationTriangle className="no-bookings-icon" />
                <h3>No bookings found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Booking Details</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="booking-detail-section">
                <h3>Counselee Information</h3>
                <div className="detail-row">
                  <div className="detail-label">Name:</div>
                  <div className="detail-value">{selectedBooking.counselee.name}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Email:</div>
                  <div className="detail-value">{selectedBooking.counselee.email}</div>
                </div>
              </div>

              <div className="booking-detail-section">
                <h3>Session Information</h3>
                <div className="detail-row">
                  <div className="detail-label">Date:</div>
                  <div className="detail-value">{selectedBooking.date}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Time:</div>
                  <div className="detail-value">{selectedBooking.time}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Topic:</div>
                  <div className="detail-value">{selectedBooking.topic}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Type:</div>
                  <div className="detail-value">{selectedBooking.type}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Status:</div>
                  <div className="detail-value">
                    <span className={`status-badge ${selectedBooking.status.toLowerCase()}`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="booking-detail-section">
                <h3>Session Notes</h3>
                <textarea
                  className="session-notes"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Add notes about this session..."
                  rows={5}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="save-notes-btn" onClick={handleSaveNotes}>
                Save Notes
              </button>
              <button className="cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

