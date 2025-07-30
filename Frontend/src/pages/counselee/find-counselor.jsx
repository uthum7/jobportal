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
  FaStar,
} from "react-icons/fa"
import "./dashboard.css"
import { useEffect } from "react"
import CounselorProfileModal from "../../components/CounselorProfileModal/CounselorProfileModal"
import { createBooking } from "../../services/counselorService"
 const userstring = localStorage.getItem("user")
  const user = userstring ? JSON.parse(userstring) : null

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
  })

  return grouped
}

export default function CounseleeDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [counselors, setCounselors] = useState([])
  const [expandedSections, setExpandedSections] = useState({})
  const [filteredCounselors, setFilteredCounselors] = useState([])
  const [selectedCounselor, setSelectedCounselor] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState("")
  
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
    }))
  }

  const handleSearch = () => {
    // You can implement actual API search here
    console.log("Searching for:", searchQuery)
  }

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
      
      const userId = user?._id || user?.userId;
      console.log("User ID:", userId)
      if (!userId) {
        setBookingError("Please log in to book an appointment.")
        return;
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
        // Close modal after 2 seconds
        setTimeout(() => {
          handleCloseModal()
        }, 2000)
      }
    } catch (error) {
      console.error("Booking failed:", error)
      setBookingError(error.response?.data?.message || "Failed to create booking. Please try again.")
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
        <div className="main-header">
          <h1>Find counsellor !</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> / find-counselor
          </div>
        </div>
        {/* Counselor Lists by Specialty */}
        <div className="counselor-section">
          <div className="section-header">
            <h2>Available Counselors by Specialty</h2>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name, specialty, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={handleSearch}>
                <FaSearch /> Search
              </button>
            </div>
          </div>

          {/* Specialty Groups */}
          <div className="expertise-groups">
            {Object.keys(groupedCounselors).length > 0 ? (
              Object.entries(groupedCounselors).map(([specialty, counselorList]) => (
                <div key={specialty} className="expertise-group">
                  <div className="expertise-header" onClick={() => toggleSection(specialty)}>
                    <div className="expertise-title">
                      <FaGraduationCap className="expertise-icon" />
                      <h3>{specialty}</h3>
                      <span className="counselor-count">({counselorList.length})</span>
                    </div>
                    <button className="toggle-btn">
                      {expandedSections[specialty] ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>

                  {expandedSections[specialty] !== false && (
                    <div className="counselors-grid">
                      {counselorList.map((counselor) => (
                        <div key={counselor._id} className="counselor-card">
                          <div className="counselor-avatar">
                            <img 
                              src={counselor.image || "/placeholder.svg"} 
                              alt={counselor.name}
                              onError={(e) => {
                                e.target.src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/depositphotos_65103937-stock-illustration-male-avatar-profile-picture-vector.jpg-sGxy88AMCTZclrYwVI5URVtYVKxafN.jpeg"
                              }}
                            />
                          </div>
                          <div className="counselor-info">
                            <h4 className="counselor-name">{counselor.name}</h4>
                            
                            {/* Rating Display */}
                            <div className="counselor-rating">
                              <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  className="star-icon"
                                  color={star <= Math.round(counselor.rating) ? "#FFD700" : "#ccc"}
                                />
                              ))}
                              </div>
                              <span>{counselor.rating}</span>
                              <span className="reviews-count">({counselor.reviews} reviews)</span>
                            </div>

                            {/* Availability */}
                            <div className="counselor-availability">
                              <strong>Available: </strong>
                              <span>{renderAvailability(counselor.availability)}</span>
                            </div>
                            <button 
                              className="view-button m-1"
                              onClick={() => handleViewProfile(counselor)}
                            >
                              View Profile
                            </button>
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

      {/* Counselor Profile Modal */}
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
    </div>
  )
}