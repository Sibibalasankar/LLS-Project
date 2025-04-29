import React, { useEffect, useState, useCallback } from 'react';
import { FiX, FiBell, FiCheck, FiRefreshCw, FiUser, FiKey, FiClock } from 'react-icons/fi';
import "../assets/styles/NotificationPage.css";

const NotificationsPage = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [passwordResetNotifications, setPasswordResetNotifications] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('access');
  const [showHistory, setShowHistory] = useState(false);

  const fetchAllNotifications = useCallback(() => {
    try {
      setIsLoading(true);
      
      // Fetch all access requests (both read and unread)
      const rawRequests = localStorage.getItem("accessRequests");
      let allAccessRequests = [];
      
      if (rawRequests) {
        try {
          allAccessRequests = JSON.parse(rawRequests);
          if (!Array.isArray(allAccessRequests)) {
            allAccessRequests = [];
          }
        } catch (parseError) {
          console.error("Failed to parse accessRequests:", parseError);
          allAccessRequests = [];
        }
      }

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
      const currentAccessNotifications = allAccessRequests
        .filter(request => !request.read && !request.type)
        .map(request => ({
          id: request.timestamp || Date.now(),
          username: request.username || 'Unknown User',
          department: request.department || 'unknown department',
          permissions: request.permissions?.join(', ') || 'no permissions specified',
          time: new Date(request.timestamp || Date.now()).toLocaleTimeString(),
          date: new Date(request.timestamp || Date.now()).toLocaleDateString(),
          status: request.status || 'pending',
          type: 'access'
        }));

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

      const historyItems = [
        ...allAccessRequests
          .filter(request => request.read)
          .map(request => ({
            id: request.timestamp || Date.now(),
            username: request.username || 'Unknown User',
            department: request.department || 'unknown department',
            permissions: request.permissions?.join(', ') || 'no permissions specified',
            time: new Date(request.timestamp || Date.now()).toLocaleTimeString(),
            date: new Date(request.timestamp || Date.now()).toLocaleDateString(),
            status: request.status || 'pending',
            type: 'access'
          })),
        ...allPasswordResetRequests
          .filter(request => request.read)
          .map(request => ({
            id: request.timestamp || Date.now(),
            username: request.username || 'Unknown User',
            time: new Date(request.timestamp || Date.now()).toLocaleTimeString(),
            date: new Date(request.timestamp || Date.now()).toLocaleDateString(),
            status: request.status || 'pending',
            type: 'passwordReset'
          }))
      ].sort((a, b) => new Date(b.id) - new Date(a.id)); // Sort by most recent

      setNotifications(currentAccessNotifications);
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
      if (type === 'access') {
        const rawRequests = localStorage.getItem("accessRequests");
        let accessRequests = JSON.parse(rawRequests || "[]");
        
        const updatedRequests = accessRequests.map(request => 
          request.timestamp === id ? { ...request, status, read: true } : request
        );
        
        localStorage.setItem("accessRequests", JSON.stringify(updatedRequests));
      } else if (type === 'passwordReset') {
        const rawRequests = localStorage.getItem("passwordResetRequests");
        let passwordResetRequests = JSON.parse(rawRequests || "[]");
        
        const updatedRequests = passwordResetRequests.map(request => 
          request.timestamp === id ? { ...request, status, read: true } : request
        );
        
        localStorage.setItem("passwordResetRequests", JSON.stringify(updatedRequests));
      }
      
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
      // Mark access requests as read
      const rawRequests = localStorage.getItem("accessRequests");
      let accessRequests = JSON.parse(rawRequests || "[]");
      
      const updatedAccessRequests = accessRequests.map(request => 
        notifications.some(n => n.id === request.timestamp) ? { ...request, read: true } : request
      );
      
      localStorage.setItem("accessRequests", JSON.stringify(updatedAccessRequests));
      
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
  }, [notifications, passwordResetNotifications, fetchAllNotifications]);

  const renderNotificationItem = (notification, isHistory = false) => (
    <div key={notification.id} className="notification-item">
      <div className="notification-user">
        {notification.type === 'access' ? <FiUser className="user-icon" /> : <FiKey className="user-icon" />}
        <span className="username">{notification.username}</span>
        <span className={`status-badge ${notification.status}`}>
          {notification.status}
        </span>
      </div>
      <div className="notification-content">
        <p className="notification-message">
          {notification.type === 'access' ? (
            <>Requested access for <strong>{notification.permissions}</strong> in <strong>{notification.department}</strong></>
          ) : (
            <>Requested password reset</>
          )}
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
            {!showHistory && (notifications.length + passwordResetNotifications.length > 0) && (
              <span className="notification-badge">
                {notifications.length + passwordResetNotifications.length}
              </span>
            )}
          </div>
        </div>
        <div className="header-right">
          <div className="action-group">
            <button onClick={fetchAllNotifications} className="icon-button" title="Refresh">
              <FiRefreshCw className="icon" />
            </button>
            {!showHistory && (notifications.length > 0 || passwordResetNotifications.length > 0) && (
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

      {showHistory ? (
        <div className="notification-content-area">
          {history.length === 0 ? (
            <div className="empty-state">
              <FiClock className="empty-icon" />
              <p>No notification history</p>
              <small>All caught up!</small>
            </div>
          ) : (
            <div className="notification-list-container">
              <div className="notification-list">
                {history.map(notification => renderNotificationItem(notification, true))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="notification-tabs">
            <button 
              className={`tab-button ${activeTab === 'access' ? 'active' : ''}`}
              onClick={() => setActiveTab('access')}
            >
              Access Requests
              {notifications.length > 0 && (
                <span className="tab-badge">{notifications.length}</span>
              )}
            </button>
            <button 
              className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              Password Resets
              {passwordResetNotifications.length > 0 && (
                <span className="tab-badge">{passwordResetNotifications.length}</span>
              )}
            </button>
          </div>

          <div className="notification-content-area">
            {activeTab === 'access' ? (
              notifications.length === 0 ? (
                <div className="empty-state">
                  <FiBell className="empty-icon" />
                  <p>No new access requests</p>
                  <small>You're all caught up!</small>
                </div>
              ) : (
                <div className="notification-list-container">
                  <div className="notification-list">
                    {notifications.map(notification => renderNotificationItem(notification))}
                  </div>
                </div>
              )
            ) : (
              passwordResetNotifications.length === 0 ? (
                <div className="empty-state">
                  <FiKey className="empty-icon" />
                  <p>No new password reset requests</p>
                  <small>You're all caught up!</small>
                </div>
              ) : (
                <div className="notification-list-container">
                  <div className="notification-list">
                    {passwordResetNotifications.map(notification => renderNotificationItem(notification))}
                  </div>
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(NotificationsPage);