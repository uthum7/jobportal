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
  FaComment,
  FaHistory,
  FaUserPlus,
} from "react-icons/fa"
import "./counselees.css"

// Sample counselees data
const counseleesData = [
  {
    id: 1,
    name: "Alexander Mitchell",
    email: "alexander.mitchell@gmail.com",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/depositphotos_65103937-stock-illustration-male-avatar-profile-picture-vector.jpg-sGxy88AMCTZclrYwVI5URVtYVKxafN.jpeg",
    age: 28,
    topic: "Career Development",
    lastSession: "03 Jan 2025",
    nextSession: "15 Jan 2025",
    sessionCount: 5,
    status: "Active",
    progress: "On Track",
  },
  {
    id: 2,
    name: "Emily Johnson",
    email: "emily.johnson@gmail.com",
    avatar: "/placeholder.svg?height=100&width=100",
    age: 32,
    topic: "Resume Review",
    lastSession: "28 Dec 2024",
    nextSession: "11 Jan 2025",
    sessionCount: 3,
    status: "Active",
    progress: "Excellent",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.brown@gmail.com",
    avatar: "/placeholder.svg?height=100&width=100",
    age: 25,
    topic: "Interview Preparation",
    lastSession: "05 Jan 2025",
    nextSession: "19 Jan 2025",
    sessionCount: 2,
    status: "Active",
    progress: "Needs Attention",
  },
  {
    id: 4,
    name: "Sarah Thompson",
    email: "sarah.thompson@gmail.com",
    avatar: "/placeholder.svg?height=100&width=100",
    age: 29,
    topic: "Career Transition",
    lastSession: "20 Dec 2024",
    nextSession: "None",
    sessionCount: 8,
    status: "Inactive",
    progress: "Completed",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.wilson@gmail.com",
    avatar: "/placeholder.svg?height=100&width=100",
    age: 35,
    topic: "Salary Negotiation",
    lastSession: "15 Dec 2024",
    nextSession: "16 Jan 2025",
    sessionCount: 4,
    status: "Active",
    progress: "On Track",
  },
]

export default function CounselorCounselees() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [counselees] = useState(counseleesData)

  // Filter counselees based on search query and status
  const filteredCounselees = counselees.filter((counselee) => {
    const matchesSearch =
      counselee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      counselee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      counselee.topic.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || counselee.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  // Sort counselees
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

          {/* Add New Counselee Button */}
          <div className="add-counselee-section">
            <button className="add-counselee-btn">
              <FaUserPlus className="add-icon" /> Add New Counselee
            </button>
          </div>

          {/* Counselees Grid */}
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
                  <button className="action-btn view-profile-btn">View Profile</button>
                  <button className="action-btn view-history-btn">
                    <FaHistory className="action-icon" /> Session History
                  </button>
                  <button className="action-btn add-session-btn">
                    <FaCalendarAlt className="action-icon" /> Schedule Session
                  </button>
                  <button className="action-btn send-message-btn">
                    <FaComment className="action-icon" /> Message
                  </button>
                </div>
              </div>
            ))}
          </div>

          {sortedCounselees.length === 0 && (
            <div className="no-counselees">
              <h3>No counselees found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button className="add-counselee-btn mt-4">
                <FaUserPlus className="add-icon" /> Add New Counselee
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

