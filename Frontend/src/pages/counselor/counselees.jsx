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
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaComment,
  FaHistory,
  FaSpinner,
} from "react-icons/fa"
import { getCounselees, deleteCounselee } from "../../services/counselorService"
import { useAuthStore } from "../../store/useAuthStore"
import "./counselees.css"

export default function CounselorCounselees() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [counselees, setCounselees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
   const userstring = localStorage.getItem("user")
   const user = JSON.parse(userstring)

  // Get counselor ID from auth user or use a default for demo
  const counselorId = user?.counselors_id

  // Fetch counselees data
  useEffect(() => {
    const fetchCounselees = async () => {
      try {
        setLoading(true)
        setError(null)
        const filters = {
          search: searchQuery,
          status: statusFilter,
          sort: sortBy
        }
        const response = await getCounselees(counselorId, filters)
        setCounselees(response.data || [])
      } catch (err) {
        console.error("Error fetching counselees:", err)
        setError("Failed to load counselees. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchCounselees()
  }, [counselorId, searchQuery, statusFilter, sortBy])

  // Filter counselees based on search query and status (client-side backup)
  const filteredCounselees = counselees.filter((counselee) => {
    const matchesSearch =
      counselee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      counselee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      counselee.topic.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || counselee.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  // Sort counselees (client-side backup)
  const sortedCounselees = [...filteredCounselees].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name)
    } else if (sortBy === "lastSession") {
      return new Date(b.lastSession) - new Date(a.lastSession)
    } else if (sortBy === "sessionCount") {
      return b.sessionCount - a.sessionCount
    }
    return 0
  })

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status)
  }

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption)
  }

  const handleDeleteCounselee = async (counseleeId) => {
    if (window.confirm("Are you sure you want to end this counselee relationship?")) {
      try {
        await deleteCounselee(counselorId, counseleeId)
        // Refresh the counselees list
        const filters = {
          search: searchQuery,
          status: statusFilter,
          sort: sortBy
        }
        const response = await getCounselees(counselorId, filters)
        setCounselees(response.data || [])
      } catch (err) {
        console.error("Error deleting counselee:", err)
        alert("Failed to delete counselee. Please try again.")
      }
    }
  }

  const handleViewProfile = (counselee) => {
    // Navigate to counselee profile or show detailed modal
    alert(`Viewing profile for ${counselee.name}`)
  }

  const handleViewHistory = (counselee) => {
    // Navigate to session history or show history modal
    alert(`Viewing session history for ${counselee.name}`)
  }

  const handleScheduleSession = (counselee) => {
    // Navigate to schedule session page or show modal
    alert(`Scheduling session with ${counselee.name}`)
  }

  const handleSendMessage = (counselee) => {
    // Navigate to messaging or open chat
    alert(`Opening message with ${counselee.name}`)
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
          <Link to="/counselor/schedule" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaClock />
              </span>
              <span className="menu-text">Schedule Timings</span>
            </div>
          </Link>
          <Link to="/counselor/counselees" className="menu-item active">
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
        <div className="counselees-header">
          <h1>My Counselees</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> / Counselees
          </div>
        </div>

        <div className="counselees-content">
          {/* Search and Filter Section */}
          <div className="counselees-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search counselees..."
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
                    className={`filter-option ${statusFilter === "active" ? "active" : ""}`}
                    onClick={() => handleStatusFilterChange("active")}
                  >
                    Active
                  </button>
                  <button
                    className={`filter-option ${statusFilter === "inactive" ? "active" : ""}`}
                    onClick={() => handleStatusFilterChange("inactive")}
                  >
                    Inactive
                  </button>
                </div>
              </div>

              <div className="sort-dropdown">
                <button className="sort-button">
                  <FaSortAmountDown className="sort-icon" /> Sort by
                </button>
                <div className="sort-dropdown-content">
                  <button
                    className={`sort-option ${sortBy === "name" ? "active" : ""}`}
                    onClick={() => handleSortChange("name")}
                  >
                    Name
                  </button>
                  <button
                    className={`sort-option ${sortBy === "lastSession" ? "active" : ""}`}
                    onClick={() => handleSortChange("lastSession")}
                  >
                    Last Session
                  </button>
                  <button
                    className={`sort-option ${sortBy === "sessionCount" ? "active" : ""}`}
                    onClick={() => handleSortChange("sessionCount")}
                  >
                    Session Count
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Counselees Grid */}
          {loading ? (
            <div className="loading-container">
              <FaSpinner className="loading-spinner" />
              <p>Loading counselees...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <h3>Error Loading Counselees</h3>
              <p>{error}</p>
              <button 
                className="retry-btn"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="counselees-grid">
              {sortedCounselees.map((counselee) => (
                <div key={counselee.id} className="counselee-card">
                  <div className="counselee-card-header">
                    <div className={`status-indicator ${counselee.status.toLowerCase()}`}></div>
                    <div className={`progress-badge ${counselee.progress.toLowerCase().replace(/\s+/g, "-")}`}>
                      {counselee.progress}
                    </div>
                  </div>
                  <div className="counselee-card-content">
                    <div className="counselee-image-container">
                      <img
                        src={counselee.avatar || "/placeholder.svg"}
                        alt={counselee.name}
                        className="counselee-image"
                      />
                    </div>
                    <div className="counselee-info">
                      <h3 className="counselee-name">{counselee.name}</h3>
                      <p className="counselee-topic">
                        <span className="topic-label">Focus:</span> {counselee.topic}
                      </p>
                      <div className="counselee-stats">
                        <div className="stat-item">
                          <span className="stat-label">Age:</span>
                          <span className="stat-value">{counselee.age}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Sessions:</span>
                          <span className="stat-value">{counselee.sessionCount}</span>
                        </div>
                      </div>
                      <div className="counselee-sessions">
                        <div className="session-item">
                          <span className="session-label">Last Session:</span>
                          <span className="session-value">{counselee.lastSession}</span>
                        </div>
                        <div className="session-item">
                          <span className="session-label">Next Session:</span>
                          <span className="session-value">{counselee.nextSession || "Not Scheduled"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="counselee-card-actions">
                    <button 
                      className="action-btn view-profile-btn"
                      onClick={() => handleViewProfile(counselee)}
                    >
                      <FaUser className="action-icon" /> View Profile
                    </button>
                    <button 
                      className="action-btn view-history-btn"
                      onClick={() => handleViewHistory(counselee)}
                    >
                      <FaHistory className="action-icon" /> Session History
                    </button>
                    <button 
                      className="action-btn add-session-btn"
                      onClick={() => handleScheduleSession(counselee)}
                    >
                      <FaCalendarAlt className="action-icon" /> Schedule Session
                    </button>
                    <button 
                      className="action-btn send-message-btn"
                      onClick={() => handleSendMessage(counselee)}
                    >
                      <FaComment className="action-icon" /> Message
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteCounselee(counselee.id)}
                    >
                      <FaTrashAlt className="action-icon" /> Remove Counselee
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && sortedCounselees.length === 0 && (
            <div className="no-counselees">
              <h3>No counselees found</h3>
              <p>Try adjusting your search or filter criteria, or check back later when you have new counselees.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

