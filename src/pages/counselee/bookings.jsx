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
  FaSearch,
  FaClock,
  FaMapMarkerAlt,
  FaVideo,
  FaPhone,
  FaFilter,
  FaSortAmountDown,
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
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/depositphotos_65103937-stock-illustration-male-avatar-profile-picture-vector.jpg-sGxy88AMCTZclrYwVI5URVtYVKxafN.jpeg"
            alt="Alexander Mitchell"
            className="profile-image"
          />
          <h3 className="profile-name">Alexander Mitchell</h3>
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
            ) : (
              <div className="no-bookings">
                <FaCalendarAlt className="no-bookings-icon" />
                <h3>No bookings found</h3>
                <p>Try adjusting your search or filter criteria</p>
                <Link to="/counselee/find-counselor" className="find-counselor-btn">
                  Find a Counselor
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

