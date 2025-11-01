"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { FaHome, FaUser, FaCalendarAlt, FaUsers, FaEnvelope, FaKey, FaTrashAlt, FaSignOutAlt } from "react-icons/fa"
import "./find-counselor.css"

const counselors = [
  {
    id: 1,
    name: "Tyrone Roberts",
    title: "Career Development Specialist",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/320x400%20%281%29-REpF9XlE1aGoNXc24DtZUcea6LSrGe.jpeg",
  },
  {
    id: 2,
    name: "Allen Davis",
    title: "UI/UX Design Mentor",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/320x400%20%282%29-m3fEUTnh5jJi5e6WV6WR3ejFSlLlIc.jpeg",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    title: "Senior Software Engineer",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Female-lecturer-Stock-Photo.jpg-h6Tl73b8PiEfCwBGJORaorrkD1kqxt.jpeg",
  },
  {
    id: 4,
    name: "Patricia Manzi",
    title: "Leadership Coach",
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/320x400-A7ZyoORw73Amv0euMJmB7XmwLTmaS8.jpeg",
  },
  {
    id: 5,
    name: "Olivia Lawrence",
    title: "HR Specialist",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%281%29-dkn0B1cwNTfYcnLeKWZtV9YDBBTHdg.jpeg",
  },
  {
    id: 6,
    name: "Michael Thompson",
    title: "Web Development Instructor",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Young-and-confident-male-teacher-1024x683.jpg-R6ysbV9y1tkPVjRz96mm0z4KBc2S62.jpeg",
  },
  {
    id: 7,
    name: "Rebecca Wilson",
    title: "Career Transition Coach",
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-2mQsY2Kd1exyzvLZZhvO4bZbfaEFBZ.jpeg",
  },
  {
    id: 8,
    name: "David Chen",
    title: "Interview Preparation Specialist",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Young-and-confident-male-teacher-1024x683.jpg-R6ysbV9y1tkPVjRz96mm0z4KBc2S62.jpeg",
  },
]

export default function FindCounselor() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedExperience, setSelectedExperience] = useState([])
  const [selectedJobType, setSelectedJobType] = useState("")
  const [selectedJobLevel, setSelectedJobLevel] = useState([])
  const [selectedPostedDate, setSelectedPostedDate] = useState("")

  const handleClearAll = () => {
    setSearchQuery("")
    setSelectedExperience([])
    setSelectedJobType("")
    setSelectedJobLevel([])
    setSelectedPostedDate("")
  }

  return (
    <div className="dashboard-layout">
      {/* Left Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-profile">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/depositphotos_65103937-stock-illustration-male-avatar-profile-picture-vector.jpg-sGxy88AMCTZclrYwVI5URVtYVKxafN.jpeg"
            alt="Alexander Mitchell"
            className="profile-image"
          />
          <h3 className="profile-name">Alexander Mitchell</h3>
          <p className="profile-title">Web Designer</p>
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
          <Link to="/counselee/bookings" className="menu-item">
            <div className="menu-item-left">
              <span className="menu-icon">
                <FaCalendarAlt />
              </span>
              <span className="menu-text">Bookings</span>
            </div>
          </Link>
          <Link to="/counselee/find-counselor" className="menu-item active">
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
        <div className="page-header">
          <h1>Find a Counselor</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> / Find a Counselor
          </div>
        </div>

        <div className="search-container">
          {/* Search Filters Sidebar */}
          <aside className="search-filters">
            <div className="filters-header">
              <h2>Search Filter</h2>
              <button className="clear-all" onClick={handleClearAll}>
                Clear All
              </button>
            </div>

            {/* Search by Keyword */}
            <div className="filter-section">
              <h3>Search By Keyword</h3>
              <input
                type="text"
                placeholder="Search by keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Job Category */}
            <div className="filter-section">
              <h3>Job Category</h3>
              <select className="select-input">
                <option value="">Choose category</option>
                <option value="software">Software Development</option>
                <option value="design">Design</option>
                <option value="management">Management</option>
              </select>
            </div>

            {/* Experience Level */}
            <div className="filter-section">
              <h3>Experience Level</h3>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" value="beginner" /> Beginner (54)
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" value="1year" /> 1+ Year (32)
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" value="2year" /> 2+ Year (19)
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" value="3year" /> 3+ Year (16)
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" value="4year" /> 4+ Year (17)
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" value="5year" /> 5+ Year (22)
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" value="10year" /> 10+ Year (22)
                </label>
              </div>
            </div>

            {/* Job Type */}
            <div className="filter-section">
              <h3>Job Type</h3>
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" name="jobType" value="fullTime" /> Full Time
                </label>
                <label className="radio-label">
                  <input type="radio" name="jobType" value="partTime" /> Part Time
                </label>
                <label className="radio-label">
                  <input type="radio" name="jobType" value="contract" /> Contract Base
                </label>
                <label className="radio-label">
                  <input type="radio" name="jobType" value="internship" /> Internship
                </label>
                <label className="radio-label">
                  <input type="radio" name="jobType" value="regular" /> Regular
                </label>
              </div>
            </div>

            {/* Job Level */}
            <div className="filter-section">
              <h3>Job Level</h3>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" value="entry" /> Entry Level
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" value="mid" /> Mid Level
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" value="senior" /> Senior
                </label>
              </div>
            </div>

            {/* Posted Date */}
            <div className="filter-section">
              <h3>Posted Date</h3>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" value="lastHour" /> Last Hour
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" value="last24" /> Last 24 hours
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" value="lastWeek" /> Last Week
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" value="last30" /> Last 30 Days
                </label>
              </div>
            </div>

            <button className="search-jobs-btn">Search Jobs</button>
          </aside>

          {/* Counselors Grid */}
          <div className="counselors-grid">
            {counselors.map((counselor) => (
              <div key={counselor.id} className="counselor-card">
                <img src={counselor.avatar || "/placeholder.svg"} alt={counselor.name} className="counselor-image" />
                <h3>{counselor.name}</h3>
                <p>{counselor.title}</p>
                <Link to={`/counselee/counselor/${counselor.id}`} className="more-info-btn">
                  More Info
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

