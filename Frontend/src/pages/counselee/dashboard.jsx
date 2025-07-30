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
<<<<<<< HEAD
  FaStar,
  FaClock,
  FaMapMarkerAlt,
  FaVideo,
  FaPhone,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
} from "react-icons/fa"
import "./dashboard.css"
import { useEffect } from "react"
import CounselorProfileModal from "../../components/CounselorProfileModal/CounselorProfileModal"
import { createBooking } from "../../services/counselorService"
import { bookingAPI } from "../../services/api.jsx"

// Group counselors by specialty (updated to match your object structure)
const groupCounselorsBySpecialty = (counselors) => {
  // Add safety check to ensure counselors is an array
  if (!Array.isArray(counselors)) {
    return {}
  }

  const grouped = {}

  counselors.forEach((counselor) => {
    const specialty = counselor.specialty || 'General Counseling'
    if (!grouped[specialty]) {
      grouped[specialty] = []
    }
    grouped[specialty].push(counselor)
=======
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
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
  })

  return grouped
}

export default function CounseleeDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
<<<<<<< HEAD
  const [counselors, setCounselors] = useState([])
  const [expandedSections, setExpandedSections] = useState({})
  const [filteredCounselors, setFilteredCounselors] = useState([])
  const [selectedCounselor, setSelectedCounselor] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState("")
  const [recentBookings, setRecentBookings] = useState([])
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0
  })
  const [loadingBookings, setLoadingBookings] = useState(false)
  
  const userString = localStorage.getItem("user")
  const user = userString ? JSON.parse(userString) : null
  useEffect(() => {
    // Fetch counselors from API
    fetch("http://localhost:5001/api/counselors")
      .then((res) => res.json())
      .then((data) => {
        // Ensure data is an array before setting state
        console.log("Fetched counselors:", data.data)
        const counselorsData = Array.isArray(data.data) ? data.data : []
        setCounselors(counselorsData)
        setFilteredCounselors(counselorsData)
      })
      .catch((err) => {
        setCounselors([])
        setFilteredCounselors([])
        console.error("Failed to fetch counselors:", err)
      })
  }, [])

  // Fetch recent bookings
  useEffect(() => {
    const fetchRecentBookings = async () => {
      if (!user?.userId) return
      
      try {
        setLoadingBookings(true)
        const response = await bookingAPI.getBookingsByUser(user.userId, { limit: 4 })
        if (response.success) {
          setRecentBookings(response.data || [])
          
          // Calculate stats
          const stats = {
            total: response.data.length,
            scheduled: response.data.filter(b => b.status === 'Scheduled').length,
            completed: response.data.filter(b => b.status === 'Completed').length,
            cancelled: response.data.filter(b => b.status === 'Cancelled').length
          }
          setBookingStats(stats)
        }
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setLoadingBookings(false)
      }
    }

    fetchRecentBookings()
  }, [user?.userId])

  useEffect(() => {
    // Filter counselors based on search query
    if (searchQuery.trim() === "") {
      // If search is empty, show all counselors
      setFilteredCounselors(counselors)
    } else {
      // Filter based on search query (updated to match your object structure)
      const filtered = counselors.filter(
        (counselor) =>
          counselor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (counselor.specialty && counselor.specialty.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (counselor._id && counselor._id.includes(searchQuery))
      )
      setFilteredCounselors(filtered)
    }
  }, [searchQuery, counselors])

  // Group filtered counselors by specialty
  const groupedCounselors = groupCounselorsBySpecialty(filteredCounselors)

  const toggleSection = (specialty) => {
    setExpandedSections((prev) => ({
      ...prev,
      [specialty]: !prev[specialty],
=======
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
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
    }))
  }

  const handleSearch = () => {
    // You can implement actual API search here
    console.log("Searching for:", searchQuery)
  }

<<<<<<< HEAD
  // Helper function to render availability
  const renderAvailability = (availability) => {
    if (!availability || !Array.isArray(availability)) return 'Not specified'
    return availability.join(', ')
  }

  // Handle view profile click
  const handleViewProfile = (counselor) => {
    setSelectedCounselor(counselor)
    setIsModalOpen(true)
  }

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCounselor(null)
    setBookingSuccess(false)
    setBookingError("")
  }

  // Handle booking creation
  const handleBooking = async (counselorId, bookingData) => {
    try {
      const userId = user?._id || user?.userId
      console.log("User ID:", userId)
      if (!userId) {
        setBookingError("Please log in to book an appointment.")
        return
      }
      
      const bookingPayload = {
        counselor_id: counselorId,
        user_id: userId,
        ...bookingData
      }

      const response = await createBooking(bookingPayload)
      
      if (response.success) {
        setBookingSuccess(true)
        setBookingError("")
        // Refresh recent bookings
        const updatedResponse = await bookingAPI.getBookingsByUser(userId, { limit: 3 })
        if (updatedResponse.success) {
          setRecentBookings(updatedResponse.data || [])
        }
        
        setTimeout(() => {
          handleCloseModal()
        }, 2000)
      }
    } catch (error) {
      console.error("Booking failed:", error)
      setBookingError(error.response?.data?.message || "Failed to create booking. Please try again.")
    }
  }

  // Get status class for booking cards
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'scheduled'
      case 'completed':
        return 'completed'
      case 'cancelled':
        return 'cancelled'
      case 'rescheduled':
        return 'rescheduled'
      default:
        return 'scheduled'
    }
  }

  return (
    <div className="app-container">
      {/* Left Sidebar */}
      <aside className="sidebar z-50">
        <div className="sidebar-profile">
          <img
            src={user?.profilePic || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/depositphotos_65103937-stock-illustration-male-avatar-profile-picture-vector.jpg-sGxy88AMCTZclrYwVI5URVtYVKxafN.jpeg"}
            alt={user?.fullName || "User"}
            className="profile-image"
          />
          <h3 className="profile-name">{user.name}</h3>
=======
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
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
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
<<<<<<< HEAD
          <h1>Welcome Back {user?.fullName || "User"}!</h1>
=======
          <h1>Welcome Back Alexander!</h1>
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
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
<<<<<<< HEAD
            <h2>{counselors.length}</h2>
            <p>Available Counselors</p>
=======
            <h2>05</h2>
            <p>Mentors Connected</p>
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
          </div>
          <div className="stat-card">
            <div className="stat-icon calendar">
              <FaCalendarAlt />
            </div>
<<<<<<< HEAD
            <h2>{bookingStats.scheduled}</h2>
            <p>Scheduled Sessions</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon check">
              <FaCheckCircle />
            </div>
            <h2>{bookingStats.completed}</h2>
            <p>Completed Sessions</p>
          </div>
        </div>

        {/* Quick Access Sections */}
        <div className="quick-access-sections">
          {/* Recent Bookings Section */}
          <div className="quick-section">
            <div className="section-header">
              <h2>Recent Bookings</h2>
              <Link to="/counselee/bookings" className="view-all-btn">
                View All <FaArrowRight />
              </Link>
            </div>
            <div className="booking-cards">
              {loadingBookings ? (
                <div className="loading-state">
                  <FaSpinner className="loading-spinner" />
                  <p>Loading bookings...</p>
                </div>
              ) : recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div key={booking._id} className="booking-quick-card">
                    <div className="booking-header">
                      <img
                        src={booking.counselor_id?.image || "/placeholder.svg"}
                        alt={booking.counselor_id?.name || "Counselor"}
                        className="counselor-avatar-small"
                        onError={(e) => {
                          e.target.src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/depositphotos_65103937-stock-illustration-male-avatar-profile-picture-vector.jpg-sGxy88AMCTZclrYwVI5URVtYVKxafN.jpeg"
                        }}
                      />
                      <div className="booking-info">
                        <h4>{booking.counselor_id?.name || "Unknown Counselor"}</h4>
                        <p className="booking-specialty">{booking.counselor_id?.specialty || "General Counseling"}</p>
                      </div>
                      <div className={`booking-status-badge ${getStatusClass(booking.status)}`}>
                        {booking.status}
                      </div>
                    </div>
                    <div className="booking-details-quick">
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
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-bookings-quick">
                  <FaCalendarAlt className="no-bookings-icon" />
                  <p>No recent bookings</p>
                  <Link to="/counselee/find-counselor" className="find-counselor-btn">
                    Find a Counselor
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Featured Counselors Section */}
          <div className="quick-section">
            <div className="section-header">
              <h2>Featured Counselors</h2>
              <Link to="/counselee/find-counselor" className="view-all-btn">
                View All <FaArrowRight />
              </Link>
            </div>
            <div className="booking-cards">
              {counselors.slice(0, 3).map((counselor) => (
                <div key={counselor._id} className="booking-quick-card">
                  <div className="booking-header">
                    <img
                      src={counselor.image || "/placeholder.svg"}
                      alt={counselor.name}
                      className="counselor-avatar-small"
                      onError={(e) => {
                        e.target.src =
                          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/depositphotos_65103937-stock-illustration-male-avatar-profile-picture-vector.jpg-sGxy88AMCTZclrYwVI5URVtYVKxafN.jpeg"
                      }}
                    />
                    <div className="booking-info">
                      <h4>{counselor.name}</h4>
                      <p className="booking-specialty">{counselor.specialty}</p>
                    </div>
                    <div className="booking-status-badge completed">
                      Featured
                    </div>
                  </div>
                  <div className="booking-details-quick">
                    <div className="booking-detail">
                      <FaStar className="detail-icon" />
                      <span>
                        {counselor.rating ? counselor.rating.toFixed(1) : "N/A"}
                      </span>
                    </div>
                    <div className="booking-detail">
                      <FaClock className="detail-icon" />
                      <span>{renderAvailability(counselor.availability)}</span>
                    </div>
                    <div className="booking-detail">
                      <FaGraduationCap className="detail-icon" />
                      <span>{counselor.experience ? `${counselor.experience} yrs` : "Experience N/A"}</span>
                    </div>
                  </div>
                  <button
                    className="view-profile-btn mt-2"
                    onClick={() => handleViewProfile(counselor)}
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* End of quick-access-sections */}
        <CounselorProfileModal
          counselor={selectedCounselor}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onBooking={handleBooking}
        />

        {/* Success/Error Messages */}
        {bookingSuccess && (
          <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              Booking created successfully!
            </div>
          </div>
        )}

        {bookingError && (
          <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
            <div className="flex items-center">
              <button 
                onClick={() => setBookingError("")}
                className="ml-2 text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
            <div>{bookingError}</div>
          </div>
        )}
      </main>
    </div>
  )
}
=======
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
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name, expertise, education..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={handleSearch}>
                <FaSearch /> Search
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

>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
