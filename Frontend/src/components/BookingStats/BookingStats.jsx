import React from 'react';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaTimesCircle,
  FaHourglassHalf,
  FaDollarSign,
  FaUsers
} from 'react-icons/fa';
import './BookingStats.css';

const BookingStats = ({ bookings = [] }) => {
  // Calculate statistics
  const totalBookings = bookings.length;
  
  const statusCounts = bookings.reduce((acc, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    {
      label: 'Total Bookings',
      value: totalBookings,
      icon: FaCalendarAlt,
      color: '#007bff',
      bgColor: '#e3f2fd'
    },
    {
      label: 'Pending',
      value: statusCounts['Pending'] || 0,
      icon: FaHourglassHalf,
      color: '#ff9800',
      bgColor: '#fff3e0'
    },
    {
      label: 'Approved',
      value: statusCounts['Approved'] || 0,
      icon: FaCheckCircle,
      color: '#4caf50',
      bgColor: '#e8f5e8'
    },
    {
      label: 'Scheduled',
      value: statusCounts['Scheduled'] || 0,
      icon: FaClock,
      color: '#2196f3',
      bgColor: '#e3f2fd'
    },
    {
      label: 'Completed',
      value: statusCounts['Completed'] || 0,
      icon: FaUsers,
      color: '#4caf50',
      bgColor: '#e8f5e8'
    },
    {
      label: 'Cancelled',
      value: statusCounts['Cancelled'] || 0,
      icon: FaTimesCircle,
      color: '#9e9e9e',
      bgColor: '#f5f5f5'
    },
    {
      label: 'Payment Pending',
      value: statusCounts['Payment Pending'] || 0,
      icon: FaDollarSign,
      color: '#f44336',
      bgColor: '#ffebee'
    },
    {
      label: 'Rescheduled',
      value: statusCounts['Rescheduled'] || 0,
      icon: FaExclamationTriangle,
      color: '#ff5722',
      bgColor: '#fff3e0'
    }
  ];

  return (
    <div className="booking-stats">
      <h3>Booking Statistics</h3>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="stat-card"
            style={{ backgroundColor: stat.bgColor }}
          >
            <div className="stat-icon-container">
              <stat.icon 
                className="stat-icon"
                style={{ color: stat.color }}
              />
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingStats;
