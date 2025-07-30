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
  FaStar,
  FaMoneyBillWave,
  FaChartLine,
  FaSearch,
  FaEllipsisV,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa"
import "./dashboard.css"

// Sample data for upcoming sessions
const upcomingSessions = [
  {
    id: 1,
    counselee: {
      name: "Alexander Mitchell",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/depositphotos_65103937-stock-illustration-male-avatar-profile-picture-vector.jpg-sGxy88AMCTZclrYwVI5URVtYVKxafN.jpeg",
      email: "alexander.mitchell@gmail.com",
    },
    date: "05 January 2025",
    time: "9:00 AM - 10:00 AM",
    topic: "Career Development Strategy",
<<<<<<< HEAD
    status: "Approved",
=======
    status: "Confirmed",
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
    type: "Video Call",
  },
  {
    id: 2,
    counselee: {
      name: "Emily Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "emily.johnson@gmail.com",
    },
    date: "06 January 2025",
    time: "2:00 PM - 3:00 PM",
    topic: "Resume Review",
    status: "Pending",
    type: "Video Call",
  },
  {
    id: 3,
    counselee: {
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "michael.brown@gmail.com",
    },
    date: "07 January 2025",
    time: "11:00 AM - 12:00 PM",
    topic: "Interview Preparation",
<<<<<<< HEAD
    status: "Approved",
=======
    status: "Confirmed",
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
    type: "Phone Call",
  },
]

// Sample data for recent reviews
const recentReviews = [
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
  {
    id: 3,
    counselee: {
      name: "James Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    rating: 5,
    comment: "Very helpful session. The mock interview practice was exactly what I needed.",
    date: "December 20, 2024",
  },
]

export default function CounselorDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")

  // Filter sessions based on search query
  const filteredSessions = upcomingSessions.filter(
    (session) =>
      session.counselee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.counselee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.topic.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Stats data
  const stats = {
    totalSessions: 45,
    completedSessions: 32,
    upcomingSessions: 13,
    averageRating: 4.8,
    totalEarnings: 3600,
    pendingPayments: 450,
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
          <h1>Welcome Back, James!</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> / Dashboard
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon sessions">
              <FaCalendarAlt />
            </div>
            <div className="stat-content">
              <h2>{stats.totalSessions}</h2>
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
              <h2>{stats.averageRating}</h2>
              <p>Average Rating</p>
            </div>
            <div className="stat-footer">
              <div className="star-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.floor(stats.averageRating) ? "star-filled" : "star-empty"} />
                ))}
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon earnings">
              <FaMoneyBillWave />
            </div>
            <div className="stat-content">
              <h2>${stats.totalEarnings}</h2>
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
              <h2>92%</h2>
              <p>Performance</p>
            </div>
            <div className="stat-footer">
              <span className="stat-detail positive">↑ 8% from last month</span>
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
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <div key={session.id} className="session-card">
                  <div className="session-header">
                    <div className="counselee-info">
                      <img
                        src={session.counselee.avatar || "/placeholder.svg"}
                        alt={session.counselee.name}
                        className="counselee-avatar"
                      />
                      <div>
                        <h3 className="counselee-name">{session.counselee.name}</h3>
                        <p className="counselee-email">{session.counselee.email}</p>
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
                      <span className="detail-value">{session.date}</span>
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
                      <span className="detail-value">{session.type}</span>
                    </div>
                  </div>

                  <div className="session-footer">
                    <div className={`session-status ${session.status.toLowerCase()}`}>{session.status}</div>
                    <div className="session-buttons">
                      <button className="view-details-btn">View Details</button>
<<<<<<< HEAD
                      {session.status === "Approved" && <button className="start-session-btn">Start Session</button>}
=======
                      {session.status === "Confirmed" && <button className="start-session-btn">Start Session</button>}
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
                      {session.status === "Pending" && (
                        <>
                          <button className="accept-btn">
                            <FaCheck /> Accept
                          </button>
                          <button className="decline-btn">
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

