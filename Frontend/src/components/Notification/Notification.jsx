import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import './Notification.css';

const Notification = ({ message, type = 'success', onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onClose) onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!message) return null;

  return (
    <div className={`notification ${type} ${isVisible ? 'show' : 'hide'}`}>
      <div className="notification-icon">
        {type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
      </div>
      <div className="notification-message">
        {message}
      </div>
      <button className="notification-close" onClick={() => setIsVisible(false)}>
        <FaTimes />
      </button>
    </div>
  );
};

export default Notification;
