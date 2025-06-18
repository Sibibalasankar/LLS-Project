import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FiX, FiBell, FiCheck, FiRefreshCw, FiClock, FiLogIn } from 'react-icons/fi';
import "../assets/styles/NotificationPage.css";

const NotificationsPage = ({ onClose }) => {
  const [loginNotifications, setLoginNotifications] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const notificationRef = useRef(null);

  const fetchAllNotifications = useCallback(() => {
    try {
      setIsLoading(true);
      
      const rawLoginActivities = localStorage.getItem("userLoginActivities");
      let allLoginActivities = [];
      
      if (rawLoginActivities) {
        try {
          allLoginActivities = JSON.parse(rawLoginActivities);
          if (!Array.isArray(allLoginActivities)) {
            allLoginActivities = [];
          }
        } catch (parseError) {
          console.error("Failed to parse userLoginActivities:", parseError);
          allLoginActivities = [];
        }
      }

      const currentLoginNotifications = allLoginActivities
        .filter(activity => !activity.read)
        .map(activity => ({
          id: activity.timestamp || Date.now(),
          username: activity.username || 'Unknown User',
          department: activity.department || 'Unknown Department',
          role: activity.role || 'auditor',
          time: new Date(activity.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date(activity.timestamp || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          type: 'login'
        }));

      const historyItems = allLoginActivities
        .filter(activity => activity.read)
        .map(activity => ({
          id: activity.timestamp || Date.now(),
          username: activity.username || 'Unknown User',
          department: activity.department || 'Unknown Department',
          role: activity.role || 'auditor',
          time: new Date(activity.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date(activity.timestamp || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          type: 'login'
        }))
        .sort((a, b) => new Date(b.id) - new Date(a.id));

      setLoginNotifications(currentLoginNotifications);
      setHistory(historyItems);
      setError(null);
    } catch (error) {
      setError("Failed to load notifications");
      console.error("Notification error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add when component mounts
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    fetchAllNotifications();
    const interval = setInterval(fetchAllNotifications, 5000);
    return () => clearInterval(interval);
  }, [fetchAllNotifications]);

  const markAsRead = useCallback((id) => {
    try {
      const rawActivities = localStorage.getItem("userLoginActivities");
      let loginActivities = JSON.parse(rawActivities || "[]");
      
      const updatedActivities = loginActivities.map(activity => 
        activity.timestamp === id ? { ...activity, read: true } : activity
      );
      
      localStorage.setItem("userLoginActivities", JSON.stringify(updatedActivities));
      fetchAllNotifications();
    } catch (error) {
      console.error(`Error marking as read:`, error);
    }
  }, [fetchAllNotifications]);

  const markAllAsRead = useCallback(() => {
    try {
      const rawActivities = localStorage.getItem("userLoginActivities");
      let loginActivities = JSON.parse(rawActivities || "[]");
      
      const updatedActivities = loginActivities.map(activity => 
        loginNotifications.some(n => n.id === activity.timestamp) 
          ? { ...activity, read: true } 
          : activity
      );
      
      localStorage.setItem("userLoginActivities", JSON.stringify(updatedActivities));
      fetchAllNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  }, [loginNotifications, fetchAllNotifications]);

  const renderNotificationItem = (notification, isHistory = false) => (
    <div key={notification.id} className={`notification-item ${isHistory ? 'history-item' : ''}`}>
      <div className="notification-icon">
        <FiLogIn className="user-icon" />
      </div>
      <div className="notification-content">
        <div className="notification-header">
          <span className="username">{notification.username}</span>
          <span className="user-meta">
            {notification.role} · {notification.department}
          </span>
        </div>
        <p className="notification-message">
          Logged in to the system
        </p>
        <div className="notification-footer">
          <span className="notification-time">
            {notification.date} at {notification.time}
          </span>
          {!isHistory && (
            <button 
              onClick={() => markAsRead(notification.id)}
              className="ack-button"
            >
              <FiCheck /> Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="notification-backdrop">
        <div className="notification-container" ref={notificationRef}>
          <div className="notification-error">
            <FiX className="error-icon" />
            {error}
            <button onClick={fetchAllNotifications} className="refresh-button">
              <FiRefreshCw /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="notification-backdrop">
        <div className="notification-container" ref={notificationRef}>
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-backdrop">
      <div className="notification-container" ref={notificationRef}>
        <div className="notification-header">
          <div className="header-left">
            <div className="notification-title">
              <h2>Login Notifications</h2>
              {!showHistory && loginNotifications.length > 0 && (
                <span className="notification-badge">
                  {loginNotifications.length}
                </span>
              )}
            </div>
          </div>
          <div className="header-right">
            <div className="action-group">
              <button 
                onClick={fetchAllNotifications} 
                className="icon-button" 
                title="Refresh"
                aria-label="Refresh notifications"
              >
                <FiRefreshCw className="icon" />
              </button>
              {!showHistory && loginNotifications.length > 0 && (
                <button 
                  onClick={markAllAsRead} 
                  className="mark-all-button"
                  aria-label="Mark all as read"
                >
                  <FiCheck className="icon" /> Mark all
                </button>
              )}
              <button 
                onClick={() => setShowHistory(!showHistory)} 
                className={`history-button ${showHistory ? 'active' : ''}`}
                title={showHistory ? "Show current notifications" : "Show history"}
                aria-label={showHistory ? "Show current notifications" : "Show history"}
              >
                <FiClock className="icon" /> {showHistory ? "Current" : "History"}
              </button>
              <button 
                onClick={onClose} 
                className="icon-button close-button" 
                title="Close"
                aria-label="Close notifications"
              >
                <FiX className="icon" />
              </button>
            </div>
          </div>
        </div>

        <div className="notification-body">
          {showHistory ? (
            history.length > 0 ? (
              <div className="notification-list">
                {history.map(notification => renderNotificationItem(notification, true))}
              </div>
            ) : (
              <div className="empty-state">
                <FiClock className="empty-icon" />
                <p>No historical notifications</p>
                <small>Previously viewed notifications will appear here</small>
              </div>
            )
          ) : loginNotifications.length > 0 ? (
            <div className="notification-list">
              {loginNotifications.map(notification => renderNotificationItem(notification))}
            </div>
          ) : (
            <div className="empty-state">
              <FiCheck className="empty-icon" />
              <p>No new notifications</p>
              <small>You're all caught up!</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;