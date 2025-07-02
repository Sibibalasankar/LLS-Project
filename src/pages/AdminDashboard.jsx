import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Dashboard.css";

// Import all pages
import AuditorList from "./AuditorList";
import ActionReport from "./ActionReport";
import DepartmentList from "./DepartmentList";
import AuditPlanCreation from "./AuditPlanCreation";
import AuditPlanSheet from "./AuditPlanSheet";
import AuditIntimationMail from "./AuditIntimationMail";
import AuditObservation from "./AuditObservation";
import AuditNCCloser from "./AuditNcCloser";
import AuditNCApproval from "./AuditNcApproval";
import AuditSummary from "./AuditSummary";
import ISOManual from "./IsoManual";
import companyLogo from "../assets/images/lls_logo.png";
import NotificationsPage from "./NotificationsPage";
import UserProfile from "./UserProfile";

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [showAuditPlan, setShowAuditPlan] = useState(false);
  const [showAuditCheckList, setShowAuditCheckList] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const resetToWelcome = () => {
    setActiveComponent(null);
    setShowAuditPlan(false);
    setShowAuditCheckList(false);
    setShowNotifications(false);
  };

  const WelcomeMessage = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
      const handleViewChange = (e) => {
        setActiveComponent(e.detail);
      };

      window.addEventListener("changeDashboardView", handleViewChange);
      return () => window.removeEventListener("changeDashboardView", handleViewChange);
    }, []);


    const formattedDate = currentTime.toLocaleDateString();
    const formattedTime = currentTime.toLocaleTimeString();

    return (
      <div className="welcome-message">
        <h2>Welcome to the Audit Management System</h2>
        <p>Select an option from the sidebar to get started</p>
        <p className="datetime-info">
          📅 {formattedDate} | ⏰ {formattedTime}
        </p>
      </div>
    );
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (hasUnreadNotifications && !showNotifications) {
      setHasUnreadNotifications(false);
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuItemClick = (component) => {
    setActiveComponent(component);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const notificationInterval = setInterval(() => {
      const newNotification = {
        message: "New notification received!",
        timestamp: new Date().toLocaleTimeString(),
      };
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        newNotification,
      ]);
      setHasUnreadNotifications(true);
    }, 30000);

    return () => clearInterval(notificationInterval);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      navigate("/login");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
              <i className="bi bi-list"></i>
            </button>
            <img src={companyLogo} alt="Company Logo" className="header-logo" />
            <h1
              className="header-title"
              onClick={resetToWelcome}
              style={{ cursor: "pointer" }}
            >
              LLS Audit Management System
            </h1>
          </div>
          <div className="header-right">
            <div className="icon-container" onClick={() => handleMenuItemClick("user-profile")}>
              <i className="bi bi-person-circle header-icons" style={{ cursor: "pointer" }}></i>
            </div>

            <div className="notification-icon-container" onClick={toggleNotifications}>
              <i className="bi bi-bell notification-icon"></i>
              {hasUnreadNotifications && <span className="notification-badge"></span>}
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-main">
        <nav className={`dashboard-sidebars ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          <div className="sidebar-menu">
            <button
              className={`menu-btn ${activeComponent === "auditor-list" ? "active" : ""}`}
              onClick={() => handleMenuItemClick("auditor-list")}
            >
              Auditor List
            </button>
            <button
              className={`menu-btn ${activeComponent === "department-list" ? "active" : ""}`}
              onClick={() => handleMenuItemClick("department-list")}
            >
              Department List
            </button>

            <div className="menu-section">
              <button
                className={`menu-btn ${showAuditPlan ? "active" : ""}`}
                onClick={() => setShowAuditPlan(!showAuditPlan)}
              >
                Audit Plan {showAuditPlan ? '🔽' : '▶'}
              </button>
              {showAuditPlan && (
                <div className="submenu">
                  <button
                    className={`submenu-btn ${activeComponent === "audit-plan-creation" ? "active" : ""}`}
                    onClick={() => handleMenuItemClick("audit-plan-creation")}
                  >
                    Audit Plan Creation
                  </button>
                  <button
                    className={`submenu-btn ${activeComponent === "audit-plan-sheet" ? "active" : ""}`}
                    onClick={() => handleMenuItemClick("audit-plan-sheet")}
                  >
                    Audit Plan Sheet
                  </button>
                  <button
                    className={`submenu-btn ${activeComponent === "audit-intimation-mail" ? "active" : ""}`}
                    onClick={() => handleMenuItemClick("audit-intimation-mail")}
                  >
                    Audit Intimation Mail
                  </button>
                </div>
              )}
            </div>

            <div className="menu-section">
              <button
                className={`menu-btn ${showAuditCheckList ? "active" : ""}`}
                onClick={() => setShowAuditCheckList(!showAuditCheckList)}
              >
                Audit Check List {showAuditCheckList ? '🔽' : '▶'}
              </button>
              {showAuditCheckList && (
                <div className="submenu">
                  <button
                    className={`submenu-btn ${activeComponent === "audit-observation" ? "active" : ""}`}
                    onClick={() => handleMenuItemClick("audit-observation")}
                  >
                    Audit Observation
                  </button>
                  <button
                    className={`submenu-btn ${activeComponent === "audit-nc-closer" ? "active" : ""}`}
                    onClick={() => handleMenuItemClick("audit-nc-closer")}
                  >
                    Audit NC Closer
                  </button>
                  <button
                    className={`submenu-btn ${activeComponent === "audit-nc-approval" ? "active" : ""}`}
                    onClick={() => handleMenuItemClick("audit-nc-approval")}
                  >
                    Audit NC Approval
                  </button>
                </div>
              )}
            </div>

            <button
              className={`menu-btn ${activeComponent === "audit-summary" ? "active" : ""}`}
              onClick={() => handleMenuItemClick("audit-summary")}
            >
              Audit Summary Report
            </button>
             <button
              className={`menu-btn ${activeComponent === "action-report" ? "active" : ""}`}
              onClick={() => handleMenuItemClick("action-report")}
            >
             All Department NC
            </button>
            <button
              className={`menu-btn ${activeComponent === "iso-manual" ? "active" : ""}`}
              onClick={() => handleMenuItemClick("iso-manual")}
            >
              ISO 9001-2015 Manual
            </button>
           

            <div className="mobile-menu-items">
              <div className="mobile-menu-item" onClick={() => handleMenuItemClick("user-profile")}>
                <i className="bi bi-person-circle"></i>
                <span>Profile</span>
              </div>

              <div className="mobile-menu-item" onClick={toggleNotifications}>
                <i className="bi bi-bell"></i>
                <span>Notifications</span>
                {hasUnreadNotifications && <span className="notification-badge"></span>}
              </div>

              <div className="mobile-menu-item" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right"></i>
                <span>Logout</span>
              </div>
            </div>
          </div>
        </nav>

        <main className="dashboard-content">
          {activeComponent === "auditor-list" && <AuditorList />}
          {activeComponent === "department-list" && <DepartmentList />}
          {activeComponent === "audit-plan-creation" && <AuditPlanCreation />}
          {activeComponent === "audit-plan-sheet" && <AuditPlanSheet />}
          {activeComponent === "audit-intimation-mail" && <AuditIntimationMail />}
          {activeComponent === "audit-observation" && <AuditObservation />}
          {activeComponent === "audit-nc-closer" && <AuditNCCloser />}
          {activeComponent === "audit-nc-approval" && <AuditNCApproval />}
          {activeComponent === "audit-summary" && <AuditSummary />}
          {activeComponent === "iso-manual" && <ISOManual />}
          {activeComponent === "user-profile" && <UserProfile />}
          {activeComponent === "action-report" && <ActionReport isAllDepartments={true} />
}


          {!activeComponent && !showNotifications && <WelcomeMessage />}
        </main>

        {showNotifications && (
          <div className="notification-panel">
            <NotificationsPage
              notifications={notifications}
              onClose={() => setShowNotifications(false)}
              onNewNotification={() => setHasUnreadNotifications(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
