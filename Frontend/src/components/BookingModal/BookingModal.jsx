import React from 'react';
import { 
  FaTimes, 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaVideo,
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
  FaEdit,
  FaCheck,
  FaBan,
  FaSpinner
} from 'react-icons/fa';
import './BookingModal.css';

const BookingModal = ({ booking, isOpen, onClose, onStatusChange, onEdit, actionLoading = false }) => {
  if (!isOpen || !booking) return null;

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#ff9800',
      'Approved': '#4caf50',
      'Payment Pending': '#f44336',
      'Payment Failed': '#e91e63',
      'Scheduled': '#2196f3',
      'Cancelled': '#9e9e9e',
      'Completed': '#4caf50',
      'Rescheduled': '#ff5722'
    };
    return colors[status] || '#9e9e9e';
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(booking._id, newStatus);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(booking);
    }
  };

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal">
        <div className="booking-modal-header">
          <h2>Booking Details</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="booking-modal-content">
          <div className="booking-info-section">
            <div className="booking-status-header">
              <div 
                className="status-indicator"
                style={{ backgroundColor: getStatusColor(booking.status) }}
              >
                {booking.status}
              </div>
              <div className="booking-id">
                Booking #{booking._id?.slice(-8)}
              </div>
            </div>

            <div className="booking-details-grid">
              <div className="detail-item">
                <FaCalendarAlt className="detail-icon" />
                <div className="detail-content">
                  <div className="detail-label">Date</div>
                  <div className="detail-value">{formatDate(booking.date)}</div>
                </div>
              </div>

              <div className="detail-item">
                <FaClock className="detail-icon" />
                <div className="detail-content">
                  <div className="detail-label">Time</div>
                  <div className="detail-value">{booking.time}</div>
                </div>
              </div>

              <div className="detail-item">
                <FaUser className="detail-icon" />
                <div className="detail-content">
                  <div className="detail-label">Client</div>
                  <div className="detail-value">{booking.user_id?.username || 'Unknown User'}</div>
                </div>
              </div>

              <div className="detail-item">
                <FaEnvelope className="detail-icon" />
                <div className="detail-content">
                  <div className="detail-label">Email</div>
                  <div className="detail-value">{booking.user_id?.email || 'No email'}</div>
                </div>
              </div>

              <div className="detail-item">
                {booking.type === 'Video Call' ? (
                  <FaVideo className="detail-icon" />
                ) : (
                  <FaPhone className="detail-icon" />
                )}
                <div className="detail-content">
                  <div className="detail-label">Type</div>
                  <div className="detail-value">{booking.type}</div>
                </div>
              </div>

              <div className="detail-item">
                <FaMapMarkerAlt className="detail-icon" />
                <div className="detail-content">
                  <div className="detail-label">Location</div>
                  <div className="detail-value">{booking.location}</div>
                </div>
              </div>
            </div>

            <div className="booking-topic-section">
              <h3>Session Topic</h3>
              <p>{booking.topic}</p>
            </div>

            {booking.notes && (
              <div className="booking-notes-section">
                <h3>Notes</h3>
                <p>{booking.notes}</p>
              </div>
            )}

            <div className="booking-timestamps">
              <div className="timestamp-item">
                <span className="timestamp-label">Created:</span>
                <span className="timestamp-value">
                  {new Date(booking.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              {booking.updatedAt && (
                <div className="timestamp-item">
                  <span className="timestamp-label">Last Updated:</span>
                  <span className="timestamp-value">
                    {new Date(booking.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="booking-modal-actions">
          <div className="action-buttons">
            <button className="edit-btn" onClick={handleEdit}>
              <FaEdit /> Edit
            </button>

            {booking.status === 'Pending' && (
              <>
                <button 
                  className="approve-btn"
                  onClick={() => handleStatusChange('Approved')}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <><FaSpinner className="btn-spinner" /> Processing...</>
                  ) : (
                    <><FaCheck /> Approve</>
                  )}
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => handleStatusChange('Cancelled')}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <><FaSpinner className="btn-spinner" /> Processing...</>
                  ) : (
                    <><FaBan /> Reject</>
                  )}
                </button>
              </>
            )}

            {booking.status === 'Approved' && (
              <button 
                className="complete-btn"
                onClick={() => handleStatusChange('Completed')}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <><FaSpinner className="btn-spinner" /> Processing...</>
                ) : (
                  <><FaCheck /> Mark as Completed</>
                )}
              </button>
            )}

            {booking.status === 'Payment Pending' && (
              <button 
                className="confirm-payment-btn"
                onClick={() => handleStatusChange('Scheduled')}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <><FaSpinner className="btn-spinner" /> Processing...</>
                ) : (
                  <><FaCheck /> Confirm Payment</>
                )}
              </button>
            )}

            {(booking.status === 'Scheduled' || booking.status === 'Approved') && (
              <button 
                className="cancel-btn"
                onClick={() => handleStatusChange('Cancelled')}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <><FaSpinner className="btn-spinner" /> Processing...</>
                ) : (
                  <><FaBan /> Cancel</>
                )}
              </button>
            )}
          </div>

          <button className="close-modal-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
