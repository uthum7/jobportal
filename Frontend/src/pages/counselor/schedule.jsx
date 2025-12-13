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
  FaPlus,
  FaMinus,
  FaSave,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa"
import "./schedule.css"

// Days of the week
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

// Time slots from 8 AM to 8 PM in 30-minute intervals
const generateTimeSlots = () => {
  const slots = []
  for (let hour = 8; hour < 20; hour++) {
    const hourFormatted = hour % 12 === 0 ? 12 : hour % 12
    const period = hour >= 12 ? "PM" : "AM"

    slots.push(`${hourFormatted}:00 ${period}`)
    slots.push(`${hourFormatted}:30 ${period}`)
  }
  return slots
}

const timeSlots = generateTimeSlots()

export default function ScheduleTimings() {
  const [schedule, setSchedule] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  })

  const [successMessage, setSuccessMessage] = useState("")
  const [activeDay, setActiveDay] = useState("Monday")

  // Toggle time slot selection
  const toggleTimeSlot = (day, time) => {
    setSchedule((prevSchedule) => {
      const daySchedule = [...prevSchedule[day]]

      if (daySchedule.includes(time)) {
        // Remove time slot if already selected
        return {
          ...prevSchedule,
          [day]: daySchedule.filter((slot) => slot !== time),
        }
      } else {
        // Add time slot if not selected
        return {
          ...prevSchedule,
          [day]: [...daySchedule, time].sort((a, b) => {
            // Sort time slots chronologically
            const aHour = Number.parseInt(a.split(":")[0])
            const bHour = Number.parseInt(b.split(":")[0])
            const aMinute = Number.parseInt(a.split(":")[1].split(" ")[0])
            const bMinute = Number.parseInt(b.split(":")[1].split(" ")[0])
            const aPeriod = a.split(" ")[1]
            const bPeriod = b.split(" ")[1]

            if (aPeriod !== bPeriod) {
              return aPeriod === "AM" ? -1 : 1
            }

            if (aHour !== bHour) {
              return aHour - bHour
            }

            return aMinute - bMinute
          }),
        }
      }
    })
  }

  // Add a time range (start time to end time)
  const addTimeRange = (day, startTime, endTime) => {
    // Find indices of start and end times in the timeSlots array
    const startIndex = timeSlots.indexOf(startTime)
    const endIndex = timeSlots.indexOf(endTime)

    if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
      return // Invalid range
    }

    // Get all time slots between start and end (inclusive)
    const slotsToAdd = timeSlots.slice(startIndex, endIndex + 1)

    setSchedule((prevSchedule) => {
      const daySchedule = [...prevSchedule[day]]

      // Add all slots in the range that aren't already selected
      const updatedSchedule = [...new Set([...daySchedule, ...slotsToAdd])].sort((a, b) => {
        // Sort time slots chronologically
        const aHour = Number.parseInt(a.split(":")[0])
        const bHour = Number.parseInt(b.split(":")[0])
        const aMinute = Number.parseInt(a.split(":")[1].split(" ")[0])
        const bMinute = Number.parseInt(b.split(":")[1].split(" ")[0])
        const aPeriod = a.split(" ")[1]
        const bPeriod = b.split(" ")[1]

        if (aPeriod !== bPeriod) {
          return aPeriod === "AM" ? -1 : 1
        }

        if (aHour !== bHour) {
          return aHour - bHour
        }

        return aMinute - bMinute
      })

      return {
        ...prevSchedule,
        [day]: updatedSchedule,
      }
    })
  }

  // Clear all time slots for a day
  const clearDay = (day) => {
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      [day]: [],
    }))
  }

  // Copy schedule from one day to another
  const copySchedule = (fromDay, toDay) => {
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      [toDay]: [...prevSchedule[fromDay]],
    }))
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Schedule saved:", schedule)

    // Show success message
    setSuccessMessage("Schedule updated successfully!")

    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  // Navigate to previous day
  const goToPreviousDay = () => {
    const currentIndex = daysOfWeek.indexOf(activeDay)
    const previousIndex = (currentIndex - 1 + daysOfWeek.length) % daysOfWeek.length
    setActiveDay(daysOfWeek[previousIndex])
  }

  // Navigate to next day
  const goToNextDay = () => {
    const currentIndex = daysOfWeek.indexOf(activeDay)
    const nextIndex = (currentIndex + 1) % daysOfWeek.length
    setActiveDay(daysOfWeek[nextIndex])
  }

  // Group time slots into morning, afternoon, and evening
  const groupedTimeSlots = {
    Morning: timeSlots.filter((slot) => slot.includes("AM")),
    Afternoon: timeSlots.filter((slot) => slot.includes("PM") && Number.parseInt(slot.split(":")[0]) < 5),
    Evening: timeSlots.filter((slot) => slot.includes("PM") && Number.parseInt(slot.split(":")[0]) >= 5),
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
          <Link to="/counselor/schedule" className="menu-item active">
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
        <div className="schedule-header">
          <h1>Schedule Timings</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> / Schedule Timings
          </div>
        </div>

        {successMessage && (
          <div className="success-message">
            <span>{successMessage}</span>
          </div>
        )}

        <div className="schedule-content">
          <div className="schedule-instructions">
            <h2>Set Your Availability</h2>
            <p>
              Select the time slots when you are available for counseling sessions. Counselees will only be able to book
              appointments during these times.
            </p>
          </div>

          <div className="schedule-tabs">
            <div className="tabs-header">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  className={`tab-button ${activeDay === day ? "active" : ""}`}
                  onClick={() => setActiveDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="day-schedule">
            <div className="day-header">
              <button className="nav-button" onClick={goToPreviousDay}>
                <FaChevronLeft />
              </button>
              <h3>{activeDay}</h3>
              <button className="nav-button" onClick={goToNextDay}>
                <FaChevronRight />
              </button>
            </div>

            <div className="time-range-selector">
              <div className="time-range-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Time</label>
                    <select id="startTime" className="time-select">
                      {timeSlots.map((time, index) => (
                        <option key={`start-${index}`} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>End Time</label>
                    <select id="endTime" className="time-select">
                      {timeSlots.map((time, index) => (
                        <option key={`end-${index}`} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    className="add-range-btn"
                    onClick={() => {
                      const startTime = document.getElementById("startTime").value
                      const endTime = document.getElementById("endTime").value
                      addTimeRange(activeDay, startTime, endTime)
                    }}
                  >
                    <FaPlus /> Add
                  </button>
                </div>
              </div>
              <div className="schedule-actions">
                <button type="button" className="clear-day-btn" onClick={() => clearDay(activeDay)}>
                  <FaMinus /> Clear Day
                </button>
                <div className="copy-schedule">
                  <select id="copyToDay" className="day-select">
                    {daysOfWeek
                      .filter((day) => day !== activeDay)
                      .map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    className="copy-btn"
                    onClick={() => {
                      const toDay = document.getElementById("copyToDay").value
                      copySchedule(activeDay, toDay)
                    }}
                  >
                    Copy To
                  </button>
                </div>
              </div>
            </div>

            <div className="time-slots-container">
              {Object.entries(groupedTimeSlots).map(([period, slots]) => (
                <div key={period} className="time-period">
                  <h4>{period}</h4>
                  <div className="time-slots">
                    {slots.map((time, index) => (
                      <button
                        key={`${activeDay}-${index}`}
                        className={`time-slot ${schedule[activeDay].includes(time) ? "selected" : ""}`}
                        onClick={() => toggleTimeSlot(activeDay, time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="selected-slots">
              <h4>Selected Time Slots</h4>
              <div className="selected-slots-list">
                {schedule[activeDay].length > 0 ? (
                  schedule[activeDay].map((time, index) => (
                    <div key={index} className="selected-slot">
                      <span>{time}</span>
                      <button className="remove-slot-btn" onClick={() => toggleTimeSlot(activeDay, time)}>
                        <FaMinus />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="no-slots">No time slots selected for {activeDay}</p>
                )}
              </div>
            </div>
          </div>

          <div className="schedule-summary">
            <h3>Weekly Schedule Summary</h3>
            <div className="summary-grid">
              {daysOfWeek.map((day) => (
                <div key={day} className="summary-day">
                  <h4>{day}</h4>
                  <div className="summary-slots">
                    {schedule[day].length > 0 ? (
                      schedule[day].map((time, index) => (
                        <div key={index} className="summary-slot">
                          {time}
                        </div>
                      ))
                    ) : (
                      <p className="no-slots">Not available</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="save-btn" onClick={handleSubmit}>
              <FaSave className="btn-icon" /> Save Schedule
            </button>
            <Link to="/counselor/dashboard" className="cancel-btn">
              Cancel
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

