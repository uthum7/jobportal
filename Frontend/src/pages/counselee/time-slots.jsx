"use client"

import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  FaStar,
  FaRegStar,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaUser,
  FaCalendarAlt,
  FaUsers,
  FaEnvelope,
  FaKey,
  FaTrashAlt,
  FaSignOutAlt,
} from "react-icons/fa"
import "./time-slots.css"

export default function TimeSlots() {
  const { counselorId } = useParams()
  const [selectedSlot, setSelectedSlot] = useState(null)

  // This would normally come from an API call using the counselorId
  const counselor = {
    id: counselorId,
    name: "Tyrone Roberts",
    title: "Career Development Specialist",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 4.8,
    reviews: 24,
  }

  // Generate current week dates
  const generateWeekDates = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const today = new Date()
    const weekDates = []

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      weekDates.push({
        day: days[date.getDay()],
        date: date.getDate(),
        month: date.toLocaleString("default", { month: "short" }),
        fullDate: date,
      })
    }

    return weekDates
  }

  const weekDates = generateWeekDates()

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = []
    const startHour = 9 // 9 AM
    const endHour = 17 // 5 PM

    for (let hour = startHour; hour <= endHour; hour++) {
      const timeSlots = []

      for (let day = 0; day < 7; day++) {
        // Randomly determine if slot is available (in a real app, this would come from the backend)
        const isAvailable = Math.random() > 0.3

        timeSlots.push({
          day,
          hour,
          time: `${hour % 12 || 12}:00 ${hour >= 12 ? "PM" : "AM"}`,
          available: isAvailable,
          id: `${day}-${hour}`,
        })
      }

      slots.push(timeSlots)
    }

    return slots
  }

  const timeSlots = generateTimeSlots()

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

  const handleSlotSelect = (slotId) => {
    setSelectedSlot(slotId)
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
        <div className="time-slots-container">
          <div className="counselor-brief">
            <img src={counselor.avatar || "/placeholder.svg"} alt={counselor.name} className="counselor-avatar" />
            <div className="counselor-info">
              <h2>{counselor.name}</h2>
              <p>{counselor.title}</p>
              <div className="rating">
                {renderStars(counselor.rating)}
                <span>({counselor.reviews} reviews)</span>
              </div>
            </div>
          </div>

          <div className="calendar-header">
            <h3>Select a Time Slot</h3>
            <div className="calendar-navigation">
              <button className="nav-btn">
                <FaChevronLeft />
              </button>
              <span>This Week</span>
              <button className="nav-btn">
                <FaChevronRight />
              </button>
            </div>
          </div>

          <div className="time-grid">
            <div className="time-grid-header">
              {weekDates.map((date, index) => (
                <div key={index} className="day-column">
                  <div className="day-name">{date.day}</div>
                  <div className="day-date">
                    {date.date} {date.month}
                  </div>
                </div>
              ))}
            </div>

            <div className="time-slots-grid">
              {timeSlots.map((row, rowIndex) => (
                <div key={rowIndex} className="time-row">
                  {row.map((slot) => (
                    <button
                      key={slot.id}
                      className={`time-slot ${!slot.available ? "unavailable" : ""} ${selectedSlot === slot.id ? "selected" : ""}`}
                      disabled={!slot.available}
                      onClick={() => handleSlotSelect(slot.id)}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="action-buttons">
            <Link
              to={`/counselee/payment/${counselorId}`}
              className="proceed-btn"
              style={{ pointerEvents: selectedSlot ? "auto" : "none", opacity: selectedSlot ? 1 : 0.5 }}
            >
              Proceed to Payment
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

