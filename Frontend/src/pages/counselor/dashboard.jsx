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
  FaStar,
  FaMoneyBillWave,
  FaChartLine,
  FaSearch,
  FaEllipsisV,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa"
import "./dashboard.css"
import { bookingAPI } from "../../services/api.jsx"
import { getCounselorById } from "../../services/counselorService"

export default function CounselorDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")
  const [sessions, setSessions] = useState([])
  const [filteredSessions, setFilteredSessions] = useState([])
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    averageRating: 0,
    totalReviews: 0,
    performancePercentage: 0,
    totalEarnings: 0,
    pendingPayments: 0,
  })
  const [recentReviews, setRecentReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [counselorProfile, setCounselorProfile] = useState(null)
  const [actionLoading, setActionLoading] = useState({})

  const userstring = localStorage.getItem("user") 
  const user = userstring ? JSON.parse(userstring) : null
  const counselorId = user?.counselors_id

  // Fetch counselor data and sessions
  useEffect(() => {
    const fetchData = async () => {
      if (!counselorId) {
        setError("Counselor ID not found. Please log in again.")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Fetch counselor profile
        const profileResponse = await getCounselorById(counselorId)
        if (profileResponse.success) {
          setCounselorProfile(profileResponse.data)
        }

        // Fetch bookings/sessions
        const bookingsResponse = await bookingAPI.getBookingsByCounselor(counselorId)
        if (bookingsResponse.success) {
          const bookings = bookingsResponse.data || []
          setSessions(bookings)

          // Calculate stats from bookings
          const totalSessions = bookings.length
          const completedSessions = bookings.filter(b => b.status === "Completed").length
          const upcomingSessions = bookings.filter(b => 
            ["Pending", "Approved", "Scheduled"].includes(b.status) &&
            new Date(b.date) >= new Date()
          ).length
          
          // Get rating and reviews from counselor profile (with fallbacks)
          const counselorData = profileResponse.success ? profileResponse.data : null
          const averageRating = counselorData?.rating || 4.7
          const totalReviews = counselorData?.reviews || 102
          
          // Calculate performance based on rating (out of 5) converted to percentage
          // Performance = (rating / 5) * 100
          const performancePercentage = Math.round((averageRating / 5) * 100)
          
          // Calculate earnings (sum of completed sessions with price)
          const totalEarnings = bookings
            .filter(b => b.status === "Completed" && b.price)
            .reduce((sum, b) => sum + (b.price || 0), 0)
          
          // Calculate pending payments
          const pendingPayments = bookings
            .filter(b => b.status === "Payment Pending" && b.price)
            .reduce((sum, b) => sum + (b.price || 0), 0)

          setStats({
            totalSessions,
            completedSessions,
            upcomingSessions,
            averageRating,
            totalReviews,
            performancePercentage,
            totalEarnings,
            pendingPayments,
          })
        }

        // For reviews, we'll use a placeholder for now
        // You might want to implement a proper reviews system
        setRecentReviews([
          {
            id: 1,
            counselee: {
              name: "David Wilson",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            rating: 5,
            comment: "Excellent session! Very insightful and provided practical advice for my career transition.",
            date: "December 28, 2024",
          },
          {
            id: 2,
            counselee: {
              name: "Sarah Thompson",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            rating: 4,
            comment: "Great advice on improving my resume. Would definitely recommend.",
            date: "December 25, 2024",
          },
        ])

      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError(err.message || "Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [counselorId])

  // Filter sessions based on search query and active tab
  useEffect(() => {
    if (!sessions.length) {
      setFilteredSessions([])
      return
    }

    let filtered = sessions

    // Filter by tab
    const today = new Date()
    if (activeTab === "upcoming") {
      filtered = sessions.filter(session => 
        ["Pending", "Approved", "Scheduled"].includes(session.status) &&
        new Date(session.date) >= today
      )
    } else if (activeTab === "past") {
      filtered = sessions.filter(session => 
        session.status === "Completed" ||
        (new Date(session.date) < today && session.status !== "Cancelled")
      )
    } else if (activeTab === "cancelled") {
      filtered = sessions.filter(session => session.status === "Cancelled")
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(session =>
        session.user_id?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.user_id?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.topic?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredSessions(filtered)
  }, [sessions, activeTab, searchQuery])

  // Handle session status change
  const handleStatusChange = async (sessionId, newStatus) => {
    try {
      setActionLoading(prev => ({ ...prev, [sessionId]: true }))
      
      const response = await bookingAPI.updateBooking(sessionId, { status: newStatus })
      
      if (response.success) {
        // Update local state
        setSessions(prev => 
          prev.map(session => 
            session._id === sessionId 
              ? { ...session, status: newStatus }
              : session
          )
        )
        
        const statusMessages = {
          "Approved": "Session approved successfully",
          "Cancelled": "Session cancelled successfully",
          "Scheduled": "Session scheduled successfully"
        }
        
        alert(statusMessages[newStatus] || `Session ${newStatus.toLowerCase()} successfully`)
      } else {
        throw new Error(response.message || "Failed to update session")
      }
    } catch (error) {
      console.error("Error updating session:", error)
      alert(error.message || "Failed to update session")
    } finally {
      setActionLoading(prev => ({ ...prev, [sessionId]: false }))
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

  console.log("User data from localStorage:", user)

  return (
    <div className="dashboard-layout">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-profile">
          <img
            src={counselorProfile?.image || user?.profilePic || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Young-and-confident-male-teacher-1024x683.jpg-R6ysbV9y1tkPVjRz96mm0z4KBc2S62.jpeg"}
            alt={user?.name || "Counselor"}
            className="profile-image"
          />
          <h3 className="profile-name">{counselorProfile?.name || user?.name}</h3>
          <p className="profile-title">{counselorProfile?.specialty || user?.specialty}</p>
        </div>

        <nav className="sidebar-menu">
          <Link to="/counselor/dashboard" className="menu-item active">
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
        <div className="main-header">
          <h1>Welcome Back, {counselorProfile?.name || user?.name || "Counselor"}!</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> / Dashboard
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <FaExclamationTriangle className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon sessions">
              <FaCalendarAlt />
            </div>
            <div className="stat-content">
              <h2>{loading ? "..." : stats.totalSessions}</h2>
              <p>Total Sessions</p>
            </div>
            <div className="stat-footer">
              <span className="stat-detail">{stats.completedSessions} completed</span>
              <span className="stat-detail">{stats.upcomingSessions} upcoming</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon rating">
              <FaStar />
            </div>
            <div className="stat-content">
              <h2>{loading ? "..." : stats.averageRating.toFixed(1)}</h2>
              <p>Average Rating</p>
            </div>
            <div className="stat-footer">
              <div className="star-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.floor(stats.averageRating) ? "star-filled" : "star-empty"} />
                ))}
              </div>
              <span className="stat-detail">{stats.totalReviews} reviews</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon earnings">
              <FaMoneyBillWave />
            </div>
            <div className="stat-content">
              <h2>{loading ? "..." : `$${stats.totalEarnings}`}</h2>
              <p>Total Earnings</p>
            </div>
            <div className="stat-footer">
              <span className="stat-detail">${stats.pendingPayments} pending</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon performance">
              <FaChartLine />
            </div>
            <div className="stat-content">
              <h2>{loading ? "..." : `${stats.performancePercentage}%`}</h2>
              <p>Performance</p>
            </div>
            <div className="stat-footer">
              <span className="stat-detail positive">
                Based on {stats.averageRating}/5 rating
              </span>
            </div>
          </div>
        </div>

        {/* Sessions Section */}
        <div className="sessions-section">
          <div className="section-header">
            <div className="section-title">
              <h2>Sessions</h2>
              <div className="tab-navigation">
                <button
                  className={`tab-button ${activeTab === "upcoming" ? "active" : ""}`}
                  onClick={() => setActiveTab("upcoming")}
                >
                  Upcoming
                </button>
                <button
                  className={`tab-button ${activeTab === "past" ? "active" : ""}`}
                  onClick={() => setActiveTab("past")}
                >
                  Past
                </button>
                <button
                  className={`tab-button ${activeTab === "cancelled" ? "active" : ""}`}
                  onClick={() => setActiveTab("cancelled")}
                >
                  Cancelled
                </button>
              </div>
            </div>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search sessions..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="search-button">
                <FaSearch className="search-icon" />
              </button>
            </div>
          </div>

          <div className="sessions-list">
            {loading ? (
              <div className="loading-state">
                <FaSpinner className="loading-spinner" />
                <p>Loading sessions...</p>
              </div>
            ) : filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <div key={session._id} className="session-card">
                  <div className="session-header">
                    <div className="counselee-info">
                      <img
                        src={session.user_id?.profilePic || "/placeholder.svg"}
                        alt={session.user_id?.username || "User"}
                        className="counselee-avatar"
                        onError={(e) => {
                          e.target.src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/depositphotos_65103937-stock-illustration-male-avatar-profile-picture-vector.jpg-sGxy88AMCTZclrYwVI5URVtYVKxafN.jpeg"
                        }}
                      />
                      <div>
                        <h3 className="counselee-name">{session.user_id?.username || "Unknown User"}</h3>
                        <p className="counselee-email">{session.user_id?.email || "No email"}</p>
                      </div>
                    </div>
                    <div className="session-actions">
                      <button className="action-button">
                        <FaEllipsisV />
                      </button>
                    </div>
                  </div>

                  <div className="session-details">
                    <div className="detail-item">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">{formatDate(session.date) || session.date}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Time:</span>
                      <span className="detail-value">{session.time}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Topic:</span>
                      <span className="detail-value">{session.topic}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Type:</span>
                      <span className="detail-value">{session.type || "Video Call"}</span>
                    </div>
                  </div>

                  <div className="session-footer">
                    <div className={`session-status ${session.status?.toLowerCase() || 'pending'}`}>{session.status}</div>
                    <div className="session-buttons">
                      <Link to="/counselor/bookings" className="view-details-btn">View Details</Link>
                      {session.status === "Approved" && <button className="start-session-btn">Start Session</button>}
                      {session.status === "Pending" && (
                        <>
                          <button 
                            className="accept-btn"
                            onClick={() => handleStatusChange(session._id, "Approved")}
                            disabled={actionLoading[session._id]}
                          >
                            {actionLoading[session._id] ? (
                              <FaSpinner className="btn-spinner" />
                            ) : (
                              <><FaCheck /> Accept</>
                            )}
                          </button>
                          <button 
                            className="decline-btn"
                            onClick={() => handleStatusChange(session._id, "Cancelled")}
                            disabled={actionLoading[session._id]}
                          >
                            <FaTimes /> Decline
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-sessions">
                <FaExclamationTriangle className="no-sessions-icon" />
                <h3>No sessions found</h3>
                <p>No {activeTab} sessions match your search criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Reviews Section */}
        <div className="reviews-section">
          <div className="section-header">
            <h2>Recent Reviews</h2>
            <Link to="/counselor/reviews" className="view-all-link">
              View All
            </Link>
          </div>

          <div className="reviews-list">
            {recentReviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <img
                      src={review.counselee.avatar || "/placeholder.svg"}
                      alt={review.counselee.name}
                      className="reviewer-avatar"
                    />
                    <div>
                      <h3 className="reviewer-name">{review.counselee.name}</h3>
                      <p className="review-date">{review.date}</p>
                    </div>
                  </div>
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < review.rating ? "star-filled" : "star-empty"} />
                    ))}
                  </div>
                </div>
                <div className="review-content">
                  <p>{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

