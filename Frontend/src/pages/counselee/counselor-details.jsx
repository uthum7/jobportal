"use client"
import { Link, useParams } from "react-router-dom"
import {
  FaStar,
  FaRegStar,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaUser,
  FaCalendarAlt,
  FaUsers,
  FaKey,
  FaTrashAlt,
  FaSignOutAlt,
} from "react-icons/fa"
import "./counselor-details.css"

export default function CounselorDetails() {
  const { counselorId } = useParams()

  // This would normally come from an API call using the counselorId
  const counselor = {
    id: counselorId,
    name: "Tyrone Roberts",
    title: "Career Development Specialist",
    avatar: "/placeholder.svg?height=160&width=160",
    rating: 4.8,
    reviews: 24,
    rate: "$75 / hour",
    about:
      "I am a certified career development specialist with over 10 years of experience helping professionals navigate career transitions, improve their resumes, and prepare for interviews. My approach is personalized to each client's unique needs and goals.\n\nI specialize in career planning, resume optimization, interview preparation, and professional networking strategies.",
    experience: "10+ years",
    specialization: "Career Development, Resume Building",
    location: "New York, USA",
    languages: "English, Spanish",
    email: "tyrone.roberts@example.com",
    phone: "+1 (555) 123-4567",
  }

  // Generate star rating display
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="star-filled" />)
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half-star" className="star-filled" />)
    }

    const remainingStars = 5 - stars.length
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaRegStar key={`empty-star-${i}`} className="star-empty" />)
    }

    return stars
  }

  return (
    <div className="dashboard-layout">
      {/* Left Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-profile">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-16%20132226-dgHAwgPAd5U9t5uD3aiDzazUMdPqCu.png"
            alt="Sanduni Dilhara"
            className="profile-image"
          />
          <h3 className="profile-name">Sanduni Dilhara</h3>
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

      <main className="main-content">
        <div className="counselor-profile">
          <div className="profile-header">
            <div className="profile-main">
              <img src={counselor.avatar || "/placeholder.svg"} alt={counselor.name} className="profile-avatar" />
              <div className="profile-info">
                <h1>{counselor.name}</h1>
                <p className="title">{counselor.title}</p>
                <div className="rating">
                  {renderStars(counselor.rating)}
                  <span>({counselor.reviews} reviews)</span>
                </div>
                <div className="contact-buttons">
                  <button className="contact-btn message">
                    <FaEnvelope /> Message
                  </button>
                  <button className="contact-btn call">
                    <FaPhone /> Call
                  </button>
                </div>
              </div>
            </div>
            <div className="profile-actions">
              <div className="rate">{counselor.rate}</div>
              <Link to={`/counselee/time-slots/${counselor.id}`} className="hire-btn">
                Book a Session
              </Link>
            </div>
          </div>

          <div className="about-section">
            <h2>About {counselor.name}</h2>
            <p>{counselor.about}</p>
          </div>

          <div className="details-section">
            <h2>Details</h2>
            <div className="details-grid">
              <div className="detail-item">
                <label>Experience</label>
                <span>{counselor.experience}</span>
              </div>
              <div className="detail-item">
                <label>Specialization</label>
                <span>{counselor.specialization}</span>
              </div>
              <div className="detail-item">
                <label>Location</label>
                <span>{counselor.location}</span>
              </div>
              <div className="detail-item">
                <label>Languages</label>
                <span>{counselor.languages}</span>
              </div>
              <div className="detail-item">
                <label>Email</label>
                <span>{counselor.email}</span>
              </div>
              <div className="detail-item">
                <label>Phone</label>
                <span>{counselor.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

