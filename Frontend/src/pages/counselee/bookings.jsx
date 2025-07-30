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
  FaSearch,
  FaClock,
  FaMapMarkerAlt,
  FaVideo,
  FaPhone,
  FaFilter,
  FaSortAmountDown,
<<<<<<< HEAD
  FaSpinner,
  FaExclamationCircle,
  FaCreditCard,
} from "react-icons/fa"
import { bookingAPI } from "../../services/api.jsx"
import BookingDetailsModal from "../../components/BookingDetailsModal/BookingDetailsModal.jsx"
import BookingPaymentManager from "../../components/BookingPaymentManager/BookingPaymentManager.jsx"
import "./bookings.css"
import "../counselor/booking-payment-styles.css"
 const userstring = localStorage.getItem("user")
  const user = userstring ? JSON.parse(userstring) : null


export default function CounseleeBookings() {
  const [searchQuery, setSearchQuery] = useState("")
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const [actionLoading, setActionLoading] = useState({})
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const user = localStorage.getItem('user')
      const userObj = JSON.parse(user)
      const userId = userObj.userId
      console.log("Fetching bookings for user ID:", userId)
      if (!userId) {
        throw new Error("User not authenticated")
      }

      const params = {
        page: currentPage,
        limit: 10,
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(sortBy === "date" && { sort: "-createdAt" }),
        ...(sortBy === "name" && { sort: "counselor_id.name" }),
        ...(sortBy === "status" && { sort: "status" }),
      }

      const response = await bookingAPI.getBookingsByUser(userId, params)
      
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
  }, [currentPage, statusFilter, sortBy])

  // Handle canceling a booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return
    }

    try {
      setActionLoading(prev => ({ ...prev, [bookingId]: true }))
      
      const cancellationData = {
        cancelled_by: "user",
        cancellation_reason: "Cancelled by user"
      }

      const response = await bookingAPI.cancelBooking(bookingId, cancellationData)
      
      if (response.success) {
        // Refresh bookings list
        await fetchBookings()
        alert("Booking cancelled successfully")
      } else {
        throw new Error(response.message || "Failed to cancel booking")
      }
    } catch (err) {
      console.error("Error cancelling booking:", err)
      alert(err.message || "Failed to cancel booking")
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: false }))
    }
  }

  // Filter bookings based on search query
  const filteredBookings = bookings.filter((booking) => {
    if (!searchQuery) return true
    
    const searchLower = searchQuery.toLowerCase()
    return (
      booking.counselor_id?.name?.toLowerCase().includes(searchLower) ||
      booking.counselor_id?.specialty?.toLowerCase().includes(searchLower) ||
      booking.topic?.toLowerCase().includes(searchLower) ||
      booking.location?.toLowerCase().includes(searchLower)
    )
=======
} from "react-icons/fa"
import "./bookings.css"

// Sample bookings data with updated counselor images
const bookingsData = [
  {
    id: 1,
    counselor: {
      name: "Tyrone Roberts",
      email: "tyroneroberts@gmail.com",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/320x400%20%281%29-REpF9XlE1aGoNXc24DtZUcea6LSrGe.jpeg",
      expertise: "Career Development",
      education: "Ph.D. in Organizational Psychology, Stanford University",
    },
    date: "05 January 2025",
    time: "9:00 AM - 10:00 AM",
    topic: "Career Development Strategy",
    status: "Scheduled",
    location: "Online (Zoom)",
    type: "Video Call",
  },
  {
    id: 2,
    counselor: {
      name: "Allen Davis",
      email: "allendavis@gmail.com",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/320x400%20%282%29-m3fEUTnh5jJi5e6WV6WR3ejFSlLlIc.jpeg",
      expertise: "Resume Building",
      education: "MBA, Harvard Business School",
    },
    date: "05 January 2025",
    time: "9:00 AM - 10:00 AM",
    topic: "Resume Review",
    status: "Completed",
    location: "Online (Google Meet)",
    type: "Video Call",
  },
  {
    id: 3,
    counselor: {
      name: "Sarah Johnson",
      email: "sarahjohnson@gmail.com",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Female-lecturer-Stock-Photo.jpg-h6Tl73b8PiEfCwBGJORaorrkD1kqxt.jpeg",
      expertise: "Career Transition",
      education: "M.S. in Career Counseling, Columbia University",
    },
    date: "05 January 2025",
    time: "9:00 AM - 10:00 AM",
    topic: "Interview Preparation",
    status: "Scheduled",
    location: "Phone Call",
    type: "Phone",
  },
  {
    id: 4,
    counselor: {
      name: "Patricia Manzi",
      email: "patriciamanzi@gmail.com",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/320x400-A7ZyoORw73Amv0euMJmB7XmwLTmaS8.jpeg",
      expertise: "Workplace Communication",
      education: "Ph.D. in Communication Studies, UCLA",
    },
    date: "05 January 2025",
    time: "9:00 AM - 10:00 AM",
    topic: "Leadership Skills",
    status: "Cancelled",
    location: "Online (Zoom)",
    type: "Video Call",
  },
  {
    id: 5,
    counselor: {
      name: "Olivia Lawrence",
      email: "olivialawrence@gmail.com",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%281%29-dkn0B1cwNTfYcnLeKWZtV9YDBBTHdg.jpeg",
      expertise: "Job Search Strategy",
      education: "M.A. in Human Resources Management, NYU",
    },
    date: "05 January 2025",
    time: "9:00 AM - 10:00 AM",
    topic: "Career Transition",
    status: "Scheduled",
    location: "Online (Microsoft Teams)",
    type: "Video Call",
  },
]

export default function CounseleeBookings() {
  const [searchQuery, setSearchQuery] = useState("")
  const [bookings] = useState(bookingsData)
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  // Filter bookings based on search query and status
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.counselor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.counselor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.counselor.expertise.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.topic.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.date) - new Date(b.date)
    } else if (sortBy === "name") {
      return a.counselor.name.localeCompare(b.counselor.name)
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
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  // Handle viewing booking details
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setShowModal(true)
  }

  // Handle payment modal
  const handlePayment = (booking) => {
    setSelectedBooking(booking)
    setShowPaymentModal(true)
  }

  // Handle closing modals
  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedBooking(null)
  }

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false)
    setSelectedBooking(null)
  }

  // Handle successful payment
  const handlePaymentSuccess = (paymentIntent, updatedBooking) => {
    // Refresh bookings to get updated status
    fetchBookings()
    setShowPaymentModal(false)
    setSelectedBooking(null)
    alert("Payment successful! Your booking has been confirmed.")
  }

  // Handle rescheduling (you can implement a reschedule modal later)
  const handleReschedule = (booking) => {
    alert(`Rescheduling functionality for booking ${booking._id} - to be implemented`)
    // You can implement a reschedule modal here
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

  // Get status badge class
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
=======
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
  }

  return (
    <div className="dashboard-layout">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-profile">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/depositphotos_65103937-stock-illustration-male-avatar-profile-picture-vector.jpg-sGxy88AMCTZclrYwVI5URVtYVKxafN.jpeg"
            alt="Alexander Mitchell"
            className="profile-image"
          />
<<<<<<< HEAD
        <h3 className="profile-name">{user.name}</h3>
=======
          <h3 className="profile-name">Alexander Mitchell</h3>
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
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
          <Link to="/counselee/bookings" className="menu-item active">
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
                placeholder="Search bookings by counselor, topic, or location..."
                value={searchQuery}
                onChange={handleSearch}
=======
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
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
                    className={`filter-option ${statusFilter === "pending" ? "active" : ""}`}
                    onClick={() => handleStatusFilterChange("pending")}
                  >
                    Pending
                  </button>
                  <button
                    className={`filter-option ${statusFilter === "approved" ? "active" : ""}`}
                    onClick={() => handleStatusFilterChange("approved")}
                  >
                    Approved
                  </button>
                  <button
                    className={`filter-option ${statusFilter === "payment pending" ? "active" : ""}`}
                    onClick={() => handleStatusFilterChange("payment pending")}
                  >
                    Payment Pending
                  </button>
                  <button
=======
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
                    className={`filter-option ${statusFilter === "scheduled" ? "active" : ""}`}
                    onClick={() => handleStatusFilterChange("scheduled")}
                  >
                    Scheduled
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
                    Counselor Name
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
                <FaExclamationCircle className="error-icon" />
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
                      <div className="booking-counselor">
                        <img
                          src={booking.counselor_id?.image || "/placeholder.svg"}
                          alt={booking.counselor_id?.name || "Counselor"}
                          className="counselor-avatar"
                          onError={(e) => {
                            e.target.src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/depositphotos_65103937-stock-illustration-male-avatar-profile-picture-vector.jpg-sGxy88AMCTZclrYwVI5URVtYVKxafN.jpeg"
                          }}
                        />
                        <div className="counselor-details">
                          <h3 className="counselor-name">
                            {booking.counselor_id?.name || "Unknown Counselor"}
                          </h3>
                          <p className="counselor-expertise">
                            {booking.counselor_id?.specialty || "General Counseling"}
                          </p>
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
                          {booking.status === "Payment Pending" && (
                            <button 
                              className="pay-now-btn"
                              onClick={() => handlePayment(booking)}
                            >
                              <FaCreditCard /> Pay ${booking.price || 0}
                            </button>
                          )}
                          {(booking.status === "Scheduled" || booking.status === "Approved") && (
                            <div className="session-buttons">
                              {booking.meeting_link && (
                                <a 
                                  href={booking.meeting_link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="join-session-btn"
                                >
                                  Join Session
                                </a>
                              )}
                              <button 
                                className="cancel-booking-btn"
                                onClick={() => handleCancelBooking(booking._id)}
                                disabled={actionLoading[booking._id]}
                              >
                                {actionLoading[booking._id] ? (
                                  <><FaSpinner className="btn-spinner" /> Cancelling...</>
                                ) : (
                                  "Cancel"
                                )}
                              </button>
                            </div>
                          )}
                          {booking.status === "Pending" && (
                            <div className="pending-info">
                              <p>Waiting for counselor approval</p>
                            </div>
                          )}
                          {booking.status === "Approved" && booking.price > 0 && (
                            <div className="approved-info">
                              <p>Approved - Waiting for payment request</p>
                            </div>
                          )}
                          {booking.status === "Completed" && (
                            <button className="feedback-btn">
                              Leave Feedback
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
                    <div className="booking-counselor">
                      <img
                        src={booking.counselor.avatar || "/placeholder.svg"}
                        alt={booking.counselor.name}
                        className="counselor-avatar"
                      />
                      <div className="counselor-details">
                        <h3 className="counselor-name">{booking.counselor.name}</h3>
                        <p className="counselor-expertise">{booking.counselor.expertise}</p>
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
                    </div>
                    <div className="booking-actions">
                      <div className={`booking-status ${booking.status.toLowerCase()}`}>{booking.status}</div>
                      <div className="action-buttons">
                        <button className="view-details-btn">View Details</button>
                        {booking.status === "Scheduled" && <button className="cancel-booking-btn">Cancel</button>}
                        {booking.status === "Completed" && <button className="feedback-btn">Leave Feedback</button>}
                      </div>
                    </div>
                  </div>
                </div>
              ))
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
            ) : (
              <div className="no-bookings">
                <FaCalendarAlt className="no-bookings-icon" />
                <h3>No bookings found</h3>
<<<<<<< HEAD
                <p>
                  {searchQuery 
                    ? "Try adjusting your search criteria" 
                    : statusFilter !== "all" 
                    ? `No ${statusFilter} bookings found`
                    : "You haven't made any bookings yet"
                  }
                </p>
=======
                <p>Try adjusting your search or filter criteria</p>
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
                <Link to="/counselee/find-counselor" className="find-counselor-btn">
                  Find a Counselor
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
<<<<<<< HEAD

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={showModal}
        onClose={handleCloseModal}
        onCancel={handleCancelBooking}
        onReschedule={handleReschedule}
      />

      {/* Payment Modal */}
      {showPaymentModal && selectedBooking && (
        <div className="modal-overlay">
          <div className="modal-content payment-modal">
            <div className="modal-header">
              <h2>Complete Payment</h2>
              <button className="close-modal-btn" onClick={handleClosePaymentModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <BookingPaymentManager
                booking={selectedBooking}
                onBookingUpdate={handlePaymentSuccess}
              />
            </div>
          </div>
        </div>
      )}
=======
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
    </div>
  )
}

