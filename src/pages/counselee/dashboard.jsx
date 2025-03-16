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
  FaGraduationCap,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa"
import "./dashboard.css"

// Updated counselor data with expertise and education
const counselorsData = [
  {
    id: "01",
    name: "Tyrone Roberts",
    email: "tyroneroberts@gmail.com",
    expertise: "Career Development",
    education: "Ph.D. in Organizational Psychology, Stanford University",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/320x400%20%281%29-REpF9XlE1aGoNXc24DtZUcea6LSrGe.jpeg",
  },
  {
    id: "02",
    name: "Allen Davis",
    email: "allendavis@gmail.com",
    expertise: "Resume Building",
    education: "MBA, Harvard Business School",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/320x400%20%282%29-m3fEUTnh5jJi5e6WV6WR3ejFSlLlIc.jpeg",
  },
  {
    id: "03",
    name: "Julie Pennington",
    email: "juliepennington@gmail.com",
    expertise: "Career Transition",
    education: "M.S. in Career Counseling, Columbia University",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Female-lecturer-Stock-Photo.jpg-h6Tl73b8PiEfCwBGJORaorrkD1kqxt.jpeg",
  },
  {
    id: "04",
    name: "Patricia Manzi",
    email: "patriciamanzi@gmail.com",
    expertise: "Workplace Communication",
    education: "Ph.D. in Communication Studies, UCLA",
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/320x400-A7ZyoORw73Amv0euMJmB7XmwLTmaS8.jpeg",
  },
  {
    id: "05",
    name: "Olivia Lawrence",
    email: "olivialawrence@gmail.com",
    expertise: "Job Search Strategy",
    education: "M.A. in Human Resources Management, NYU",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%281%29-dkn0B1cwNTfYcnLeKWZtV9YDBBTHdg.jpeg",
  },
  {
    id: "06",
    name: "Michael Thompson",
    email: "michaelthompson@gmail.com",
    expertise: "Professional Development",
    education: "Ed.D. in Adult Learning, University of Pennsylvania",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Young-and-confident-male-teacher-1024x683.jpg-R6ysbV9y1tkPVjRz96mm0z4KBc2S62.jpeg",
  },
]

// Group counselors by expertise
const groupCounselorsByExpertise = (counselors) => {
  const grouped = {}

  counselors.forEach((counselor) => {
    if (!grouped[counselor.expertise]) {
      grouped[counselor.expertise] = []
    }
    grouped[counselor.expertise].push(counselor)
  })

  return grouped
}

export default function CounseleeDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [counselors] = useState(counselorsData)
  const [expandedSections, setExpandedSections] = useState({})

  // Filter counselors based on search query
  const filteredCounselors = counselors.filter(
    (counselor) =>
      counselor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      counselor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      counselor.expertise.toLowerCase().includes(searchQuery.toLowerCase()) ||
      counselor.education.toLowerCase().includes(searchQuery.toLowerCase()) ||
      counselor.id.includes(searchQuery),
  )

  // Group filtered counselors by expertise
  const groupedCounselors = groupCounselorsByExpertise(filteredCounselors)

  const toggleSection = (expertise) => {
    setExpandedSections((prev) => ({
      ...prev,
      [expertise]: !prev[expertise],
    }))
  }

  const handleSearch = () => {
    // You can implement actual API search here
    console.log("Searching for:", searchQuery)
  }

  return (
    <div className="app-container">
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
          <Link to="/counselee/dashboard" className="menu-item active">
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
          <Link to="/counselee/bookings" className="menu-item">
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
        <div className="main-header">
          <h1>Welcome Back Alexander!</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> / Dashboard
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon users">
              <FaUsers />
            </div>
            <h2>05</h2>
            <p>Mentors Connected</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon calendar">
              <FaCalendarAlt />
            </div>
            <h2>12</h2>
            <p>Sessions Booked</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon check">
              <span>✓</span>
            </div>
            <h2>03</h2>
            <p>Sessions Completed</p>
          </div>
        </div>

        {/* Counselor Lists by Expertise */}
        <div className="counselor-section">
          <div className="section-header">
            <h2>Available Counselors by Expertise</h2>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by name, expertise, education..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="search-button" onClick={handleSearch}>
                <FaSearch className="search-icon" /> Search
              </button>
            </div>
          </div>

          {/* Expertise Groups */}
          <div className="expertise-groups">
            {Object.keys(groupedCounselors).length > 0 ? (
              Object.entries(groupedCounselors).map(([expertise, counselorList]) => (
                <div key={expertise} className="expertise-group">
                  <div className="expertise-header" onClick={() => toggleSection(expertise)}>
                    <div className="expertise-title">
                      <FaGraduationCap className="expertise-icon" />
                      <h3>{expertise}</h3>
                    </div>
                    <button className="toggle-btn">
                      {expandedSections[expertise] ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>

                  {expandedSections[expertise] !== false && (
                    <div className="counselors-grid">
                      {counselorList.map((counselor) => (
                        <div key={counselor.id} className="counselor-card">
                          <div className="counselor-avatar">
                            <img src={counselor.avatar || "/placeholder.svg"} alt={counselor.name} />
                          </div>
                          <div className="counselor-info">
                            <div className="counselor-id">ID: {counselor.id}</div>
                            <h4 className="counselor-name">{counselor.name}</h4>
                            <p className="counselor-email">{counselor.email}</p>
                            <p className="counselor-education">{counselor.education}</p>
                            <button className="view-button">View Profile</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No counselors found matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

