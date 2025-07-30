import React, { useState, useEffect } from 'react';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaVideo,
  FaPhone,
  FaMapMarkerAlt,
  FaPlus
} from 'react-icons/fa';
import './Calendar.css';

const Calendar = ({ bookings = [], onDateSelect, onBookingClick, onCreateBooking }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'month', 'week', 'day'
  const [selectedDate, setSelectedDate] = useState(null);

  // Status colors mapping
  const statusColors = {
    'Pending': '#ff9800',
    'Approved': '#4caf50',
    'Payment Pending': '#f44336',
    'Payment Failed': '#e91e63',
    'Scheduled': '#2196f3',
    'Cancelled': '#9e9e9e',
    'Completed': '#4caf50',
    'Rescheduled': '#ff5722'
  };

  // Get calendar data based on current view
  const getCalendarData = () => {
    if (view === 'month') {
      return getMonthData();
    } else if (view === 'week') {
      return getWeekData();
    } else {
      return getDayData();
    }
  };

  const getMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getWeekData = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const getDayData = () => {
    return [new Date(currentDate)];
  };

  // Get bookings for a specific date
  const getBookingsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate.toISOString().split('T')[0] === dateStr;
    });
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (timeStr) => {
    return timeStr;
  };

  // Navigation functions
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const handleBookingClick = (booking) => {
    if (onBookingClick) {
      onBookingClick(booking);
    }
  };

  const renderMonthView = () => {
    const days = getCalendarData();
    const monthYear = currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });

    return (
      <div className="calendar-month">
        <div className="calendar-header">
          <div className="calendar-navigation">
            <button className="nav-btn" onClick={goToPrevious}>
              <FaChevronLeft />
            </button>
            <h2 className="calendar-title">{monthYear}</h2>
            <button className="nav-btn" onClick={goToNext}>
              <FaChevronRight />
            </button>
          </div>
          <div className="calendar-controls">
            <button className="today-btn" onClick={goToToday}>
              Today
            </button>
            <div className="view-selector">
              <button 
                className={`view-btn ${view === 'month' ? 'active' : ''}`}
                onClick={() => setView('month')}
              >
                Month
              </button>
              <button 
                className={`view-btn ${view === 'week' ? 'active' : ''}`}
                onClick={() => setView('week')}
              >
                Week
              </button>
              <button 
                className={`view-btn ${view === 'day' ? 'active' : ''}`}
                onClick={() => setView('day')}
              >
                Day
              </button>
            </div>
          </div>
        </div>

        <div className="calendar-grid">
          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          
          <div className="calendar-days">
            {days.map((day, index) => {
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = day.toDateString() === new Date().toDateString();
              const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
              const dayBookings = getBookingsForDate(day);

              return (
                <div
                  key={index}
                  className={`calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${
                    isToday ? 'today' : ''
                  } ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="day-number">{day.getDate()}</div>
                  <div className="day-bookings">
                    {dayBookings.slice(0, 3).map((booking, bIndex) => (
                      <div
                        key={bIndex}
                        className="booking-item"
                        style={{ backgroundColor: statusColors[booking.status] }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookingClick(booking);
                        }}
                      >
                        <span className="booking-time">{formatTime(booking.time)}</span>
                        <span className="booking-client">{booking.user_id?.username || 'Unknown'}</span>
                      </div>
                    ))}
                    {dayBookings.length > 3 && (
                      <div className="booking-more">+{dayBookings.length - 3} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getWeekData();
    const weekStart = days[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const weekEnd = days[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    return (
      <div className="calendar-week">
        <div className="calendar-header">
          <div className="calendar-navigation">
            <button className="nav-btn" onClick={goToPrevious}>
              <FaChevronLeft />
            </button>
            <h2 className="calendar-title">{weekStart} - {weekEnd}</h2>
            <button className="nav-btn" onClick={goToNext}>
              <FaChevronRight />
            </button>
          </div>
          <div className="calendar-controls">
            <button className="today-btn" onClick={goToToday}>
              Today
            </button>
            <div className="view-selector">
              <button 
                className={`view-btn ${view === 'month' ? 'active' : ''}`}
                onClick={() => setView('month')}
              >
                Month
              </button>
              <button 
                className={`view-btn ${view === 'week' ? 'active' : ''}`}
                onClick={() => setView('week')}
              >
                Week
              </button>
              <button 
                className={`view-btn ${view === 'day' ? 'active' : ''}`}
                onClick={() => setView('day')}
              >
                Day
              </button>
            </div>
          </div>
        </div>

        <div className="week-grid">
          <div className="week-header">
            {days.map((day, index) => {
              const isToday = day.toDateString() === new Date().toDateString();
              return (
                <div 
                  key={index} 
                  className={`week-day-header ${isToday ? 'today' : ''}`}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="day-name">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className="day-number">{day.getDate()}</div>
                </div>
              );
            })}
          </div>

          <div className="week-body">
            {days.map((day, index) => {
              const dayBookings = getBookingsForDate(day);
              return (
                <div key={index} className="week-day-column">
                  {dayBookings.map((booking, bIndex) => (
                    <div
                      key={bIndex}
                      className="week-booking-item"
                      style={{ backgroundColor: statusColors[booking.status] }}
                      onClick={() => handleBookingClick(booking)}
                    >
                      <div className="booking-time">{formatTime(booking.time)}</div>
                      <div className="booking-client">{booking.user_id?.username || 'Unknown'}</div>
                      <div className="booking-topic">{booking.topic}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const day = currentDate;
    const dayBookings = getBookingsForDate(day);
    const dayStr = formatDate(day);

    return (
      <div className="calendar-day-view">
        <div className="calendar-header">
          <div className="calendar-navigation">
            <button className="nav-btn" onClick={goToPrevious}>
              <FaChevronLeft />
            </button>
            <h2 className="calendar-title">{dayStr}</h2>
            <button className="nav-btn" onClick={goToNext}>
              <FaChevronRight />
            </button>
          </div>
          <div className="calendar-controls">
            <button className="today-btn" onClick={goToToday}>
              Today
            </button>
            <div className="view-selector">
              <button 
                className={`view-btn ${view === 'month' ? 'active' : ''}`}
                onClick={() => setView('month')}
              >
                Month
              </button>
              <button 
                className={`view-btn ${view === 'week' ? 'active' : ''}`}
                onClick={() => setView('week')}
              >
                Week
              </button>
              <button 
                className={`view-btn ${view === 'day' ? 'active' : ''}`}
                onClick={() => setView('day')}
              >
                Day
              </button>
            </div>
          </div>
        </div>

        <div className="day-view-content">
          <div className="day-bookings-list">
            {dayBookings.length > 0 ? (
              dayBookings.map((booking, index) => (
                <div
                  key={index}
                  className="day-booking-card"
                  style={{ borderLeft: `4px solid ${statusColors[booking.status]}` }}
                  onClick={() => handleBookingClick(booking)}
                >
                  <div className="booking-header">
                    <span className="booking-time">
                      <FaClock /> {formatTime(booking.time)}
                    </span>
                    <span className={`booking-status status-${booking.status.toLowerCase().replace(' ', '-')}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="booking-details">
                    <div className="booking-client">
                      <FaUser /> {booking.user_id?.username || 'Unknown User'}
                    </div>
                    <div className="booking-topic">{booking.topic}</div>
                    <div className="booking-type">
                      {booking.type === 'Video Call' ? <FaVideo /> : <FaPhone />}
                      {booking.type}
                    </div>
                    <div className="booking-location">
                      <FaMapMarkerAlt /> {booking.location}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-bookings">
                <FaCalendarAlt className="no-bookings-icon" />
                <h3>No bookings for this day</h3>
                <p>Your schedule is free!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <div className="calendar-legend">
        <h4>Status Legend:</h4>
        <div className="legend-items">
          {Object.entries(statusColors).map(([status, color]) => (
            <div key={status} className="legend-item">
              <div 
                className="legend-color"
                style={{ backgroundColor: color }}
              ></div>
              <span className="legend-label">{status}</span>
            </div>
          ))}
        </div>
      </div>

      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}
    </div>
  );
};

export default Calendar;
