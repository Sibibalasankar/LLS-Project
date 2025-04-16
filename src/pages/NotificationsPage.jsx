import React, { useEffect, useState, useCallback } from 'react';
import { FiX, FiBell, FiCheck, FiRefreshCw, FiUser } from 'react-icons/fi';
import "../assets/styles/NotificationPage.css";

const NotificationsPage = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(() => {
    try {
      setIsLoading(true);
      const rawRequests = localStorage.getItem("accessRequests");
      let accessRequests = [];
      
      if (rawRequests) {
        try {
          accessRequests = JSON.parse(rawRequests);
          if (!Array.isArray(accessRequests)) {
            accessRequests = [];
          }
        } catch (parseError) {
          console.error("Failed to parse accessRequests:", parseError);
          accessRequests = [];
        }
      }

      const formattedNotifications = accessRequests
        .filter(request => !request.read)
        .map(request => ({
          id: request.timestamp || Date.now(),
          username: request.username || 'Unknown User',
          department: request.department || 'unknown department',
          permissions: request.permissions?.join(', ') || 'no permissions specified',
          time: new Date(request.timestamp || Date.now()).toLocaleTimeString(),
          date: new Date(request.timestamp || Date.now()).toLocaleDateString(),
          status: request.status || 'pending'
        }));
      
      setNotifications(formattedNotifications);
      setError(null);
    } catch (error) {
      setError("Failed to load notifications");
      console.error("Notification error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const updateRequestStatus = useCallback((id, status) => {
    try {
      const rawRequests = localStorage.getItem("accessRequests");
      let accessRequests = JSON.parse(rawRequests || "[]");
      
      const updatedRequests = accessRequests.map(request => 
        request.timestamp === id ? { ...request, status, read: true } : request
      );
      
      localStorage.setItem("accessRequests", JSON.stringify(updatedRequests));
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      
      // In a real app, you would notify the user here
      console.log(`Request ${id} ${status}`);
    } catch (error) {
      console.error(`Error ${status.toLowerCase()} request:`, error);
    }
  }, []);

  const handleApprove = useCallback((id) => {
    updateRequestStatus(id, "approved");
    alert("Request approved! User has been notified.");
  }, [updateRequestStatus]);

  const handleReject = useCallback((id) => {
    updateRequestStatus(id, "rejected");
    alert("Request rejected. User has been notified.");
  }, [updateRequestStatus]);

  const markAllAsRead = useCallback(() => {
    try {
      const rawRequests = localStorage.getItem("accessRequests");
      let accessRequests = JSON.parse(rawRequests || "[]");
      
      const updatedRequests = accessRequests.map(request => 
        notifications.some(n => n.id === request.timestamp) ? { ...request, read: true } : request
      );
      
      localStorage.setItem("accessRequests", JSON.stringify(updatedRequests));
      setNotifications([]);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  }, [notifications]);

  if (error) {
    return (
      <div className="notification-container">
        <div className="notification-error">
          <FiX className="error-icon" />
          {error}
          <button onClick={fetchNotifications} className="refresh-button">
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
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </div>
        </div>
        <div className="header-right">
          <div className="action-group">
            <button onClick={fetchNotifications} className="icon-button" title="Refresh">
              <FiRefreshCw className="icon" />
            </button>
            {notifications.length > 0 && (
              <button onClick={markAllAsRead} className="mark-all-button">
                <FiCheck className="icon" /> Mark all
              </button>
            )}
            <button onClick={onClose} className="icon-button close-button" title="Close">
              <FiX className="icon" />
            </button>
          </div>
        </div>
      </div>

      <div className="notification-content-area">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <FiBell className="empty-icon" />
            <p>No new notifications</p>
            <small>You're all caught up!</small>
          </div>
        ) : (
          <div className="notification-list-container">
            <div className="notification-list">
              {notifications.map((notification) => (
                <div key={notification.id} className="notification-item">
                  <div className="notification-user">
                    <FiUser className="user-icon" />
                    <span className="username">{notification.username}</span>
                    <span className={`status-badge ${notification.status}`}>
                      {notification.status}
                    </span>
                  </div>
                  <div className="notification-content">
                    <p className="notification-message">
                      Requested access for <strong>{notification.permissions}</strong> in <strong>{notification.department}</strong>
                    </p>
                    <div className="notification-footer">
                      <span className="notification-time">
                        {notification.date} at {notification.time}
                      </span>
                      <div className="notification-actions">
                        <button 
                          onClick={() => handleApprove(notification.id)}
                          className="approve-button"
                        >
                          <FiCheck /> Approve
                        </button>
                        <button 
                          onClick={() => handleReject(notification.id)}
                          className="reject-button"
                        >
                          <FiX /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(NotificationsPage);