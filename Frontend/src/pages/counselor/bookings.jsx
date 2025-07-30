"use client"

<<<<<<< HEAD
import { useState, useEffect } from "react"
=======
import { useState } from "react"
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
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
<<<<<<< HEAD
  FaSpinner,
  FaMapMarkerAlt,
} from "react-icons/fa"
import { bookingAPI } from "../../services/api.jsx"
import "./bookings.css"
import "./booking-payment-styles.css"
=======
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
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19

export default function CounselorBookings() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
<<<<<<< HEAD
  const [bookings, setBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [sessionNotes, setSessionNotes] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({})

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

      const params = {
        page: currentPage,
        limit: 10,
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(sortBy === "date" && { sort: "-createdAt" }),
        ...(sortBy === "name" && { sort: "user_id.username" }),
        ...(sortBy === "status" && { sort: "status" }),
      }

      const response = await bookingAPI.getBookingsByCounselor(counselorId, params)
      
      if (response.success) {
        setBookings(response.data || [])
        setPagination(response.pagination || {})
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

  // Fetch bookings on component mount and when filters change
  useEffect(() => {
    fetchBookings()
  }, [counselorId, currentPage, statusFilter, sortBy])

  // Filter bookings based on search query
  const filteredBookings = bookings.filter((booking) => {
    if (!searchQuery) return true
    
    const searchLower = searchQuery.toLowerCase()
    return (
      booking.user_id?.username?.toLowerCase().includes(searchLower) ||
      booking.user_id?.email?.toLowerCase().includes(searchLower) ||
      booking.topic?.toLowerCase().includes(searchLower) ||
      booking.location?.toLowerCase().includes(searchLower)
    )
=======
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
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
  })

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status)
<<<<<<< HEAD
    setCurrentPage(1) // Reset to first page when filtering
=======
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
  }

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption)
<<<<<<< HEAD
    setCurrentPage(1) // Reset to first page when sorting
=======
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
  }

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setSessionNotes(booking.notes || "")
    setShowDetailsModal(true)
  }

  const handleCloseModal = () => {
    setShowDetailsModal(false)
    setSelectedBooking(null)
<<<<<<< HEAD
    setSessionNotes("")
  }

  const handleSaveNotes = async () => {
    if (!selectedBooking) return

    try {
      setActionLoading(prev => ({ ...prev, saveNotes: true }))
      
      const response = await bookingAPI.updateBooking(selectedBooking._id, {
        notes: sessionNotes
      })
      
      if (response.success) {
        // Update local state
        setBookings(prev => 
          prev.map(booking => 
            booking._id === selectedBooking._id 
              ? { ...booking, notes: sessionNotes }
              : booking
          )
        )
        handleCloseModal()
        alert("Notes saved successfully")
      } else {
        throw new Error(response.message || "Failed to save notes")
      }
    } catch (error) {
      console.error("Error saving notes:", error)
      alert(error.message || "Failed to save notes")
    } finally {
      setActionLoading(prev => ({ ...prev, saveNotes: false }))
    }
  }

  const handleStatusChange = async (bookingId, newStatus, additionalData = {}) => {
    try {
      setActionLoading(prev => ({ ...prev, [bookingId]: true }))
      
      let response;
      
      if (newStatus === "Approved") {
        // Use the approve endpoint
        response = await bookingAPI.approveBooking(bookingId, additionalData)
      } else {
        // Use regular update for other status changes
        response = await bookingAPI.updateBooking(bookingId, {
          status: newStatus,
          ...additionalData
        })
      }
      
      if (response.success) {
        // Refresh bookings
        await fetchBookings()
        
        const statusMessages = {
          "Approved": "Booking approved successfully",
          "Payment Pending": "Payment request sent to counselee",
          "Scheduled": "Booking scheduled successfully",
          "Cancelled": "Booking cancelled successfully"
        }
        
        alert(statusMessages[newStatus] || `Booking ${newStatus.toLowerCase()} successfully`)
      } else {
        throw new Error(response.message || "Failed to update booking")
      }
    } catch (error) {
      console.error("Error updating booking:", error)
      alert(error.message || "Failed to update booking")
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: false }))
    }
  }

  const handleRequestPayment = async (bookingId, price = 0) => {
    const amount = price || prompt("Enter the session price (in USD):", "50")
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid price")
      return
    }

    try {
      setActionLoading(prev => ({ ...prev, [bookingId]: true }))
      
      const response = await bookingAPI.updateBooking(bookingId, {
        status: "Payment Pending",
        price: parseFloat(amount)
      })
      
      if (response.success) {
        await fetchBookings()
        alert(`Payment request sent for $${amount}`)
      } else {
        throw new Error(response.message || "Failed to request payment")
      }
    } catch (error) {
      console.error("Error requesting payment:", error)
      alert(error.message || "Failed to request payment")
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: false }))
    }
  }

  // Get status class for styling
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'pending'
      case 'approved':
        return 'approved'
      case 'payment pending':
        return 'payment-pending'
      case 'scheduled':
        return 'scheduled'
      case 'completed':
        return 'completed'
      case 'cancelled':
        return 'cancelled'
      case 'rescheduled':
        return 'rescheduled'
      default:
        return 'pending'
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }


=======
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

>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
  return (
    <div className="dashboard-layout">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-profile">
          <img
<<<<<<< HEAD
            src={user?.profilePic || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Young-and-confident-male-teacher-1024x683.jpg-R6ysbV9y1tkPVjRz96mm0z4KBc2S62.jpeg"}
            alt={user?.fullName || "Counselor"}
            className="profile-image"
          />
          <h3 className="profile-name">{user.name }</h3>
          <p className="profile-title">{user.specialty}</p>
=======
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Young-and-confident-male-teacher-1024x683.jpg-R6ysbV9y1tkPVjRz96mm0z4KBc2S62.jpeg"
            alt="James Anderson"
            className="profile-image"
          />
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
<<<<<<< HEAD
                placeholder="Search by counselee name, email, or topic..."
=======
                placeholder="Search bookings..."
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
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
<<<<<<< HEAD
=======
                    className={`filter-option ${statusFilter === "confirmed" ? "active" : ""}`}
                    onClick={() => handleStatusFilterChange("confirmed")}
                  >
                    Confirmed
                  </button>
                  <button
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
                    className={`filter-option ${statusFilter === "pending" ? "active" : ""}`}
                    onClick={() => handleStatusFilterChange("pending")}
                  >
                    Pending
                  </button>
                  <button
<<<<<<< HEAD
                    className={`filter-option ${statusFilter === "approved" ? "active" : ""}`}
                    onClick={() => handleStatusFilterChange("approved")}
                  >
                    Approved
                  </button>
                  <button
                    className={`filter-option ${statusFilter === "scheduled" ? "active" : ""}`}
                    onClick={() => handleStatusFilterChange("scheduled")}
                  >
                    Scheduled
                  </button>
                  <button
                    className={`filter-option ${statusFilter === "payment pending" ? "active" : ""}`}
                    onClick={() => handleStatusFilterChange("payment pending")}
                  >
                    Payment Pending
                  </button>
                  <button
                    className={`filter-option ${statusFilter === "cancelled" ? "active" : ""}`}
                    onClick={() => handleStatusFilterChange("cancelled")}
                  >
                    Cancelled
                  </button>
                  <button
=======
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
                    className={`filter-option ${statusFilter === "completed" ? "active" : ""}`}
                    onClick={() => handleStatusFilterChange("completed")}
                  >
                    Completed
                  </button>
                  <button
<<<<<<< HEAD
                    className={`filter-option ${statusFilter === "rescheduled" ? "active" : ""}`}
                    onClick={() => handleStatusFilterChange("rescheduled")}
                  >
                    Rescheduled
=======
                    className={`filter-option ${statusFilter === "cancelled" ? "active" : ""}`}
                    onClick={() => handleStatusFilterChange("cancelled")}
                  >
                    Cancelled
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
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
<<<<<<< HEAD
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
            ) : filteredBookings.length > 0 ? (
              <>
                {filteredBookings.map((booking) => (
                  <div key={booking._id} className="booking-card">
                    <div className="booking-left">
                      <div className="booking-counselee">
                        <img
                          src={booking.user_id?.profilePic || "/placeholder.svg"}
                          alt={booking.user_id?.username || "User"}
                          className="counselee-avatar"
                          onError={(e) => {
                            e.target.src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/depositphotos_65103937-stock-illustration-male-avatar-profile-picture-vector.jpg-sGxy88AMCTZclrYwVI5URVtYVKxafN.jpeg"
                          }}
                        />
                        <div className="counselee-details">
                          <h3 className="counselee-name">{booking.user_id?.username || "Unknown User"}</h3>
                          <p className="counselee-email">{booking.user_id?.email || "No email"}</p>
                        </div>
                      </div>
                      <div className="booking-details">
                        <div className="booking-detail">
                          <FaCalendarAlt className="detail-icon" />
                          <span>{formatDate(booking.date) || booking.date}</span>
                        </div>
                        <div className="booking-detail">
                          <FaClock className="detail-icon" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="booking-detail">
                          <FaMapMarkerAlt className="detail-icon" />
                          <span>{booking.location}</span>
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
                        {booking.notes && (
                          <>
                            <h4>Notes:</h4>
                            <p className="booking-notes">{booking.notes}</p>
                          </>
                        )}
                      </div>
                      <div className="booking-actions">
                        <div className={`booking-status ${getStatusClass(booking.status)}`}>
                          {booking.status}
                        </div>
                        <div className="action-buttons">
                          <button 
                            className="view-details-btn" 
                            onClick={() => handleViewDetails(booking)}
                          >
                            View Details
                          </button>
                          {booking.status === "Pending" && (
                            <div className="status-action-buttons">
                              <button 
                                className="accept-btn" 
                                onClick={() => handleStatusChange(booking._id, "Approved")}
                                disabled={actionLoading[booking._id]}
                              >
                                {actionLoading[booking._id] ? (
                                  <><FaSpinner className="btn-spinner" /> Processing...</>
                                ) : (
                                  <><FaCheck /> Accept</>
                                )}
                              </button>
                              <button 
                                className="decline-btn" 
                                onClick={() => handleStatusChange(booking._id, "Cancelled")}
                                disabled={actionLoading[booking._id]}
                              >
                                <FaTimes /> Decline
                              </button>
                            </div>
                          )}
                          {booking.status === "Approved" && (
                            <div className="status-action-buttons">
                              <button 
                                className="request-payment-btn" 
                                onClick={() => handleRequestPayment(booking._id, booking.price)}
                                disabled={actionLoading[booking._id]}
                              >
                                {actionLoading[booking._id] ? (
                                  <><FaSpinner className="btn-spinner" /> Processing...</>
                                ) : (
                                  "Request Payment"
                                )}
                              </button>
                              <button className="start-session-btn">
                                Start Session
                              </button>
                            </div>
                          )}
                          {booking.status === "Scheduled" && (
                            <div className="status-action-buttons">
                              <button className="start-session-btn">
                                Start Session
                              </button>
                              {booking.meeting_link && (
                                <a 
                                  href={booking.meeting_link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="join-meeting-btn"
                                >
                                  Join Meeting
                                </a>
                              )}
                            </div>
                          )}
                          {booking.status === "Payment Pending" && (
                            <div className="status-info">
                              <p className="payment-info">
                                Waiting for counselee to complete payment of ${booking.price || 0}
                              </p>
                            </div>
                          )}
                          {booking.status === "Completed" && (
                            <button 
                              className="add-notes-btn" 
                              onClick={() => handleViewDetails(booking)}
                            >
                              Add Notes
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Pagination */}
                {pagination.total_pages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <span className="pagination-info">
                      Page {pagination.current_page} of {pagination.total_pages}
                      ({pagination.total_items} total bookings)
                    </span>
                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.total_pages))}
                      disabled={currentPage === pagination.total_pages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
=======
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
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
            ) : (
              <div className="no-bookings">
                <FaExclamationTriangle className="no-bookings-icon" />
                <h3>No bookings found</h3>
<<<<<<< HEAD
                <p>
                  {searchQuery 
                    ? "Try adjusting your search criteria" 
                    : statusFilter !== "all" 
                    ? `No ${statusFilter} bookings found`
                    : "You don't have any bookings yet"
                  }
                </p>
=======
                <p>Try adjusting your search or filter criteria</p>
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
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
<<<<<<< HEAD
                  <div className="detail-value">{selectedBooking.user_id?.username || "Unknown User"}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Email:</div>
                  <div className="detail-value">{selectedBooking.user_id?.email || "No email"}</div>
=======
                  <div className="detail-value">{selectedBooking.counselee.name}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Email:</div>
                  <div className="detail-value">{selectedBooking.counselee.email}</div>
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
                </div>
              </div>

              <div className="booking-detail-section">
                <h3>Session Information</h3>
                <div className="detail-row">
                  <div className="detail-label">Date:</div>
<<<<<<< HEAD
                  <div className="detail-value">{formatDate(selectedBooking.date) || selectedBooking.date}</div>
=======
                  <div className="detail-value">{selectedBooking.date}</div>
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
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
<<<<<<< HEAD
                  <div className="detail-label">Location:</div>
                  <div className="detail-value">{selectedBooking.location}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Duration:</div>
                  <div className="detail-value">{selectedBooking.duration || 60} minutes</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Status:</div>
                  <div className="detail-value">
                    <span className={`status-badge ${getStatusClass(selectedBooking.status)}`}>
=======
                  <div className="detail-label">Status:</div>
                  <div className="detail-value">
                    <span className={`status-badge ${selectedBooking.status.toLowerCase()}`}>
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
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
<<<<<<< HEAD
              <button 
                className="save-notes-btn" 
                onClick={handleSaveNotes}
                disabled={actionLoading.saveNotes}
              >
                {actionLoading.saveNotes ? (
                  <><FaSpinner className="btn-spinner" /> Saving...</>
                ) : (
                  "Save Notes"
                )}
=======
              <button className="save-notes-btn" onClick={handleSaveNotes}>
                Save Notes
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
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

