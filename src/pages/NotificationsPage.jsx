import React, { useEffect, useState, useCallback } from 'react';
import { FiX, FiBell, FiCheck, FiRefreshCw, FiKey, FiClock } from 'react-icons/fi';
import "../assets/styles/NotificationPage.css";

const NotificationsPage = ({ onClose }) => {
  const [passwordResetNotifications, setPasswordResetNotifications] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const fetchAllNotifications = useCallback(() => {
    try {
      setIsLoading(true);
      
      // Fetch all password reset requests (both read and unread)
      const rawPasswordRequests = localStorage.getItem("passwordResetRequests");
      let allPasswordResetRequests = [];
      
      if (rawPasswordRequests) {
        try {
          allPasswordResetRequests = JSON.parse(rawPasswordRequests);
          if (!Array.isArray(allPasswordResetRequests)) {
            allPasswordResetRequests = [];
          }
        } catch (parseError) {
          console.error("Failed to parse passwordResetRequests:", parseError);
          allPasswordResetRequests = [];
        }
      }

      // Separate into current notifications and history
      const currentPasswordNotifications = allPasswordResetRequests
        .filter(request => !request.read && request.type === "passwordReset")
        .map(request => ({
          id: request.timestamp || Date.now(),
          username: request.username || 'Unknown User',
          time: new Date(request.timestamp || Date.now()).toLocaleTimeString(),
          date: new Date(request.timestamp || Date.now()).toLocaleDateString(),
          status: request.status || 'pending',
          type: 'passwordReset'
        }));

      const historyItems = allPasswordResetRequests
        .filter(request => request.read)
        .map(request => ({
          id: request.timestamp || Date.now(),
          username: request.username || 'Unknown User',
          time: new Date(request.timestamp || Date.now()).toLocaleTimeString(),
          date: new Date(request.timestamp || Date.now()).toLocaleDateString(),
          status: request.status || 'pending',
          type: 'passwordReset'
        }))
        .sort((a, b) => new Date(b.id) - new Date(a.id)); // Sort by most recent

      setPasswordResetNotifications(currentPasswordNotifications);
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
    fetchAllNotifications();
    const interval = setInterval(fetchAllNotifications, 5000);
    return () => clearInterval(interval);
  }, [fetchAllNotifications]);

  const updateRequestStatus = useCallback((id, status, type) => {
    try {
      const rawRequests = localStorage.getItem("passwordResetRequests");
      let passwordResetRequests = JSON.parse(rawRequests || "[]");
      
      const updatedRequests = passwordResetRequests.map(request => 
        request.timestamp === id ? { ...request, status, read: true } : request
      );
      
      localStorage.setItem("passwordResetRequests", JSON.stringify(updatedRequests));
      
      // Refresh all notifications after update
      fetchAllNotifications();
    } catch (error) {
      console.error(`Error updating request status:`, error);
    }
  }, [fetchAllNotifications]);

  const handleApprove = useCallback((id, type) => {
    updateRequestStatus(id, "approved", type);
    alert(`Request approved! User has been notified.`);
  }, [updateRequestStatus]);

  const handleReject = useCallback((id, type) => {
    updateRequestStatus(id, "rejected", type);
    alert(`Request rejected. User has been notified.`);
  }, [updateRequestStatus]);

  const markAllAsRead = useCallback(() => {
    try {
      // Mark password reset requests as read
      const rawPasswordRequests = localStorage.getItem("passwordResetRequests");
      let passwordResetRequests = JSON.parse(rawPasswordRequests || "[]");
      
      const updatedPasswordRequests = passwordResetRequests.map(request => 
        passwordResetNotifications.some(n => n.id === request.timestamp) ? { ...request, read: true } : request
      );
      
      localStorage.setItem("passwordResetRequests", JSON.stringify(updatedPasswordRequests));
      
      // Refresh all notifications
      fetchAllNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  }, [passwordResetNotifications, fetchAllNotifications]);

  const renderNotificationItem = (notification, isHistory = false) => (
    <div key={notification.id} className="notification-item">
      <div className="notification-user">
        <FiKey className="user-icon" />
        <span className="username">{notification.username}</span>
        <span className={`status-badge ${notification.status}`}>
          {notification.status}
        </span>
      </div>
      <div className="notification-content">
        <p className="notification-message">
          Requested password reset
        </p>
        <div className="notification-footer">
          <span className="notification-time">
            {notification.date} at {notification.time}
          </span>
          {!isHistory && (
            <div className="notification-actions">
              <button 
                onClick={() => handleApprove(notification.id, notification.type)}
                className="approve-button"
              >
                <FiCheck /> Approve
              </button>
              <button 
                onClick={() => handleReject(notification.id, notification.type)}
                className="reject-button"
              >
                <FiX /> Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="notification-container">
        <div className="notification-error">
          <FiX className="error-icon" />
          {error}
          <button onClick={fetchAllNotifications} className="refresh-button">
            <FiRefreshCw /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="notification-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="notification-container">
      <div className="notification-header">
        <div className="header-left">
          <div className="notification-title">
            <FiBell className="bell-icon" />
            <h2>Notifications</h2>
            {!showHistory && (passwordResetNotifications.length > 0) && (
              <span className="notification-badge">
                {passwordResetNotifications.length}
              </span>
            )}
          </div>
        </div>
        <div className="header-right">
          <div className="action-group">
            <button onClick={fetchAllNotifications} className="icon-button" title="Refresh">
              <FiRefreshCw className="icon" />
            </button>
            {!showHistory && (passwordResetNotifications.length > 0) && (
              <button onClick={markAllAsRead} className="mark-all-button">
                <FiCheck className="icon" /> Mark all
              </button>
            )}
            <button 
              onClick={() => setShowHistory(!showHistory)} 
              className="history-button"
              title={showHistory ? "Show current notifications" : "Show history"}
            >
              <FiClock className="icon" /> {showHistory ? "Current" : "History"}
            </button>
            <button onClick={onClose} className="icon-button close-button" title="Close">
              <FiX className="icon" />
            </button>
          </div>
        </div>
      </div>

      <div className="notification-body">
        {showHistory ? (
          history.length > 0 ? (
            history.map(notification => renderNotificationItem(notification, true))
          ): (
            <div className="empty-state">
              <p>No historical notifications found</p>
            </div>
          )
        ) : passwordResetNotifications.length > 0 ? (
          passwordResetNotifications.map(notification => renderNotificationItem(notification))
        ) : (
          <div className="empty-state">
            <p>No new notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;