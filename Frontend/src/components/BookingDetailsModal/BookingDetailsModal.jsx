import React from 'react'
import { 
  FaTimes, 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaVideo, 
  FaPhone, 
  FaUser,
  FaDollarSign,
  FaFileAlt
} from 'react-icons/fa'
import './BookingDetailsModal.css'

const BookingDetailsModal = ({ booking, isOpen, onClose, onCancel, onReschedule }) => {
  if (!isOpen || !booking) return null

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Booking Details</h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          {/* Counselor Information */}
          <div className="detail-section">
            <h3>Counselor Information</h3>
            <div className="counselor-info">
              <img
                src={booking.counselor_id?.image || "/placeholder.svg"}
                alt={booking.counselor_id?.name || "Counselor"}
                className="counselor-avatar-large"
                onError={(e) => {
                  e.target.src = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/depositphotos_65103937-stock-illustration-male-avatar-profile-picture-vector.jpg-sGxy88AMCTZclrYwVI5URVtYVKxafN.jpeg"
                }}
              />
              <div className="counselor-details-large">
                <h4>{booking.counselor_id?.name || "Unknown Counselor"}</h4>
                <p className="specialty">{booking.counselor_id?.specialty || "General Counseling"}</p>
                {booking.counselor_id?.rating && (
                  <p className="rating">Rating: {booking.counselor_id.rating}/5</p>
                )}
              </div>
            </div>
          </div>

          {/* Booking Information */}
          <div className="detail-section">
            <h3>Booking Information</h3>
            <div className="booking-info-grid">
              <div className="info-item">
                <FaCalendarAlt className="info-icon" />
                <div>
                  <label>Date</label>
                  <span>{booking.date}</span>
                </div>
              </div>
              <div className="info-item">
                <FaClock className="info-icon" />
                <div>
                  <label>Time</label>
                  <span>{booking.time}</span>
                </div>
              </div>
              <div className="info-item">
                <FaMapMarkerAlt className="info-icon" />
                <div>
                  <label>Location</label>
                  <span>{booking.location}</span>
                </div>
              </div>
              <div className="info-item">
                {booking.type === "Video Call" ? (
                  <FaVideo className="info-icon" />
                ) : (
                  <FaPhone className="info-icon" />
                )}
                <div>
                  <label>Type</label>
                  <span>{booking.type}</span>
                </div>
              </div>
              {booking.duration && (
                <div className="info-item">
                  <FaClock className="info-icon" />
                  <div>
                    <label>Duration</label>
                    <span>{booking.duration} minutes</span>
                  </div>
                </div>
              )}
              {booking.price && (
                <div className="info-item">
                  <FaDollarSign className="info-icon" />
                  <div>
                    <label>Price</label>
                    <span>${booking.price}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Topic and Notes */}
          <div className="detail-section">
            <h3>Session Details</h3>
            <div className="session-details">
              <div className="detail-item">
                <label>Topic:</label>
                <p>{booking.topic}</p>
              </div>
              {booking.notes && (
                <div className="detail-item">
                  <label>Notes:</label>
                  <p>{booking.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Status and Actions */}
          <div className="detail-section">
            <div className="status-actions">
              <div className={`booking-status-large ${getStatusClass(booking.status)}`}>
                {booking.status}
              </div>
              <div className="modal-actions">
                {booking.status === "Scheduled" && (
                  <>
                    <button 
                      className="reschedule-btn"
                      onClick={() => onReschedule(booking)}
                    >
                      Reschedule
                    </button>
                    <button 
                      className="cancel-btn"
                      onClick={() => onCancel(booking._id)}
                    >
                      Cancel Booking
                    </button>
                  </>
                )}
                {booking.status === "Completed" && (
                  <button className="feedback-btn">
                    Leave Feedback
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Meeting Link */}
          {booking.meeting_link && booking.status === "Scheduled" && (
            <div className="detail-section">
              <h3>Meeting Link</h3>
              <div className="meeting-link">
                <a 
                  href={booking.meeting_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="meeting-link-btn"
                >
                  Join Meeting
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingDetailsModal
