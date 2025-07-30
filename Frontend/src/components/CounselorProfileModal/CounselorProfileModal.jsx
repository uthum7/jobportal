import React, { useState } from "react";
import { FaStar, FaTimes, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import "./CounselorProfileModal.css";

const CounselorProfileModal = ({ counselor, isOpen, onClose, onBooking }) => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    topic: "",
    location: "",
    type: "Consultation",
    notes: "",
    duration: 60,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (onBooking) {
      onBooking(counselor._id, bookingData);
    }
    setShowBookingForm(false);
    setBookingData({
      date: "",
      time: "",
      topic: "",
      location: "",
      type: "Consultation",
      notes: "",
      duration: 60,
    });
  };

  const renderAvailability = (availability) => {
    if (!availability || !Array.isArray(availability)) return "Not specified";
    return availability.join(", ");
  };

  if (!isOpen || !counselor) return null;

return (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
                <h2>Counselor Profile</h2>
                <button className="close-button" onClick={onClose}>
                    <FaTimes />
                </button>
            </div>

            <div className="modal-body">
                {!showBookingForm ? (
                    <div className="counselor-details">
                        <div className="counselor-info-section">
                            <div className="counselor-avatar-large">
                                <img
                                    src={counselor.image || "/placeholder.svg"}
                                    alt={counselor.name}
                                    onError={(e) => {
                                        e.target.src =
                                            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/depositphotos_65103937-stock-illustration-male-avatar-profile-picture-vector.jpg-sGxy88AMCTZclrYwVI5URVtYVKxafN.jpeg";
                                    }}
                                />
                            </div>
                            <div className="counselor-basic-info">
                                <h3>{counselor.name}</h3>
                                <p className="specialty">{counselor.specialty}</p>
                                <div className="rating-section">
                                    <div className="stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                className="star-icon"
                                                color={star <= Math.round(counselor.rating) ? "#FFD700" : "#ccc"}
                                            />
                                        ))}
                                    </div>
                                    <span className="rating-text">
                                        {counselor.rating} ({counselor.reviews} reviews)
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="counselor-details-section">
                            <div className="detail-item">
                                <FaCalendarAlt className="detail-icon" />
                                <div>
                                    <strong>Availability:</strong>
                                    <p>{renderAvailability(counselor.availability)}</p>
                                </div>
                            </div>

                            <div className="detail-item">
                                <FaUser className="detail-icon" />
                                <div>
                                    <strong>Experience:</strong>
                                    <p>{counselor.experience || "Not specified"}</p>
                                </div>
                            </div>

                            <div className="detail-item">
                                <FaClock className="detail-icon" />
                                <div>
                                    <strong>Session Duration:</strong>
                                    <p>60 minutes (typical)</p>
                                </div>
                            </div>

                            <div className="detail-item">
                                <FaMapMarkerAlt className="detail-icon" />
                                <div>
                                    <strong>Location:</strong>
                                    <p>Online & In-person consultations available</p>
                                </div>
                            </div>

                            {counselor.bio && (
                                <div className="detail-item">
                                    <div>
                                        <strong>About:</strong>
                                        <p>{counselor.bio}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-actions">
                            <button
                                className="book-appointment-btn"
                                onClick={() => setShowBookingForm(true)}
                            >
                                Book Appointment
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="booking-form-section">
                        <h3>Book Appointment with {counselor.name}</h3>
                        <form onSubmit={handleBookingSubmit}>
                            <div className="form-group">
                                <label htmlFor="date">Date:</label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={bookingData.date}
                                    onChange={handleInputChange}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="time">Time:</label>
                                <select
                                    id="time"
                                    name="time"
                                    value={bookingData.time}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select time</option>
                                    <option value="09:00">9:00 AM</option>
                                    <option value="10:00">10:00 AM</option>
                                    <option value="11:00">11:00 AM</option>
                                    <option value="12:00">12:00 PM</option>
                                    <option value="13:00">1:00 PM</option>
                                    <option value="14:00">2:00 PM</option>
                                    <option value="15:00">3:00 PM</option>
                                    <option value="16:00">4:00 PM</option>
                                    <option value="17:00">5:00 PM</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="topic">Topic/Issue:</label>
                                <input
                                    type="text"
                                    id="topic"
                                    name="topic"
                                    value={bookingData.topic}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Resume Review, Career Guidance"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="type">Session Type:</label>
                                <select
                                    id="type"
                                    name="type"
                                    value={bookingData.type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select type</option>
                                    <option value="Video Call">Video Call</option>
                                    <option value="Phone Call">Phone Call</option>
                                    <option value="In-Person">In-Person</option>
                                    <option value="Chat">Chat</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="location">Location:</label>
                                <input
                                    id="location"
                                    name="location"
                                    value={bookingData.location}
                                    onChange={handleInputChange}
                                    required
                                >
                        
                                </input>
                            </div>

                            <div className="form-group">
                                <label htmlFor="duration">Duration (minutes):</label>
                                <select
                                    id="duration"
                                    name="duration"
                                    value={bookingData.duration}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value={30}>30 minutes</option>
                                    <option value={60}>60 minutes</option>
                                    <option value={90}>90 minutes</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="notes">Additional Notes:</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={bookingData.notes}
                                    onChange={handleInputChange}
                                    placeholder="Any specific requirements or information..."
                                    rows="3"
                                />
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowBookingForm(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="submit-btn">
                                    Confirm Booking
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    </div>
);
};

export default CounselorProfileModal;
