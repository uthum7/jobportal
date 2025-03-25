"use client"

import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  FaStar,
  FaRegStar,
  FaCreditCard,
  FaPaypal,
  FaHome,
  FaUser,
  FaCalendarAlt,
  FaUsers,
  FaEnvelope,
  FaKey,
  FaTrashAlt,
  FaSignOutAlt,
} from "react-icons/fa"
import "./payment.css"

export default function Payment() {
  const { counselorId } = useParams()
  const [paymentMethod, setPaymentMethod] = useState("creditCard")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    agreeToTerms: false,
  })

  // This would normally come from an API call using the counselorId
  const counselor = {
    id: counselorId,
    name: "Tyrone Roberts",
    title: "Career Development Specialist",
    avatar: "/placeholder.svg?height=64&width=64",
    rating: 4.8,
    reviews: 24,
    sessionDate: "May 15, 2025",
    sessionTime: "10:00 AM - 11:00 AM",
    sessionFee: 75,
    platformFee: 5,
    tax: 8,
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, you would process the payment here
    // Then redirect to the invoice page
    window.location.href = `/counselee/invoice/${counselorId}`
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
        <div className="payment-container">
          <div className="payment-main">
            <h2>Payment Details</h2>

            <form className="payment-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Zip Code</label>
                  <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="existing-customer">
                Already have an account?{" "}
                <Link to="/signin" className="login-link">
                  Login
                </Link>
              </div>

              <h2>Payment Method</h2>

              <div className="payment-methods">
                <label className="payment-method">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="creditCard"
                    checked={paymentMethod === "creditCard"}
                    onChange={() => setPaymentMethod("creditCard")}
                  />
                  <FaCreditCard /> Credit Card
                </label>
                <label className="payment-method">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={() => setPaymentMethod("paypal")}
                  />
                  <FaPaypal /> PayPal
                </label>
              </div>

              {paymentMethod === "creditCard" && (
                <div className="card-details">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Name on Card</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  required
                />
                I agree to the terms and conditions
              </label>

              <button type="submit" className="confirm-pay-btn">
                Confirm & Pay
              </button>
            </form>
          </div>

          <div className="booking-summary">
            <div className="counselor-summary">
              <img src={counselor.avatar || "/placeholder.svg"} alt={counselor.name} className="counselor-avatar" />
              <div className="counselor-info">
                <h3>{counselor.name}</h3>
                <p>{counselor.title}</p>
                <div className="rating">{renderStars(counselor.rating)}</div>
              </div>
            </div>

            <div className="booking-details">
              <div className="detail-row">
                <span>Session Date:</span>
                <span>{counselor.sessionDate}</span>
              </div>
              <div className="detail-row">
                <span>Session Time:</span>
                <span>{counselor.sessionTime}</span>
              </div>
              <div className="detail-row">
                <span>Session Type:</span>
                <span>Video Call</span>
              </div>
            </div>

            <div className="fee-breakdown">
              <div className="fee-row">
                <span>Session Fee:</span>
                <span>${counselor.sessionFee}.00</span>
              </div>
              <div className="fee-row">
                <span>Platform Fee:</span>
                <span>${counselor.platformFee}.00</span>
              </div>
              <div className="fee-row">
                <span>Tax:</span>
                <span>${counselor.tax}.00</span>
              </div>
              <div className="fee-row total">
                <span>Total:</span>
                <span>${counselor.sessionFee + counselor.platformFee + counselor.tax}.00</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

