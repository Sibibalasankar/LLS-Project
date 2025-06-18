import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/UserDashboard.css";
import AuditObservation from "./UserAuditObservation";
import UserAuditNcCloser from "../pages/UserAuditNcCloser";
import UserAuditPlanSheet from "./UserAuditPlanSheet";
import ISOManual from "../pages/IsoManual";
import companyLogo from "../assets/images/lls_logo.png";
import AuditNcUserView from "../pages/AuditNcUserView";

const UserDashboard = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [employeeData, setEmployeeData] = useState({
    empName: "",
    empId: "",
    designation: "",
    department: "", // Allocated department
    loginDepartment: "", // Department selected during login
    certifiedDate: ""
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const WelcomeMessage = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
      const intervalId = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(intervalId);
    }, []);

    const formatDate = (dateString) => {
      if (!dateString) return "Not certified";
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    return (
      <div className="welcome-container">
        <div className="welcome-header">
          <h1>Welcome back, <span className="highlight">{employeeData.empName}</span></h1>
          {employeeData.designation && (
            <p className="designation">({employeeData.designation})</p>
          )}
        </div>

        <div className="employee-info-grid">
          <div className="info-card">
            <span className="info-label">Employee ID</span>
            <span className="info-value">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#2e3191" />
              </svg>
              {employeeData.empId}
            </span>
          </div>
          <div className="info-card">
            <span className="info-label">Department</span>
            <span className="info-value">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM8 18H5V16H8V18ZM8 13H5V11H8V13ZM8 8H5V6H8V8ZM13.5 18H10.5V16H13.5V18ZM13.5 13H10.5V11H13.5V13ZM13.5 8H10.5V6H13.5V8ZM19 18H16V16H19V18ZM19 13H16V11H19V13ZM19 8H16V6H19V8Z" fill="#2e3191" />
              </svg>
              {employeeData.department} {/* Allocated department */}
              {employeeData.department !== employeeData.loginDepartment &&
                ` (Logged in as: ${employeeData.loginDepartment})`}
            </span>
          </div>
          <div className="info-card">
            <span className="info-label">Certified Since</span>
            <span className="info-value">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.2 16.2L17 14.9L12.5 12.2V7Z" fill="#2e3191" />
              </svg>
              {formatDate(employeeData.certifiedDate)}
            </span>
          </div>
        </div>

        <div className="time-display">
          <span className="date">{currentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
          <span className="time">{currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}</span>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const loadEmployeeData = () => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) {
        navigate("/user-login");
        return;
      }

      const allEmployees = JSON.parse(localStorage.getItem("userCredentials") || "[]");
      const employee = allEmployees.find(emp =>
        emp.username === currentUser.username ||
        emp.empId === currentUser.empId
      );

      if (employee) {
        setEmployeeData({
          empName: employee.empName,
          empId: employee.empId,
          designation: employee.designation,
          department: employee.department, // Allocated department
          loginDepartment: currentUser.loginDepartment || currentUser.department, // Fallback to department if loginDepartment doesn't exist
          certifiedDate: employee.certifiedDate
        });
        setUserPermissions(employee.permissions || []);

        // Update localStorage for backward compatibility
        localStorage.setItem("userDepartment", employee.department || "");
      } else {
        navigate("/user-login");
      }
    };

    loadEmployeeData();
  }, [navigate]);

  const renderComponent = () => {
    switch (activeComponent) {
      case "audit-plan-sheet":
        return userPermissions.includes("auditPlanSheet") ? (
          <UserAuditPlanSheet />
        ) : (
          <PermissionDenied feature="Audit Plan Sheet" />
        );
      case "audit-observation":
        return userPermissions.includes("auditObservation") ? (
          <AuditObservation />
        ) : (
          <PermissionDenied feature="Audit Observation" />
        );
      case "audit-nc-closer":
        return userPermissions.includes("auditNCCloser") ? (
          <UserAuditNcCloser />
        ) : (
          <PermissionDenied feature="Audit NC Closer" />
        );
      case "user-audit-nc-view":
        return userPermissions.includes("auditNCApproval") ? (
          <AuditNcUserView />
        ) : (
          <PermissionDenied feature="Audit NC Approval" />
        );
      case "iso-manual":
        return userPermissions.includes("isoManual") ? (
          <ISOManual />
        ) : (
          <PermissionDenied feature="ISO Manual" />
        );
      default:
        return <WelcomeMessage />;
    }
  };

  const PermissionDenied = ({ feature }) => (
    <div className="permission-denied">
      <div className="denied-icon">🚫</div>
      <h3>Access Restricted</h3>
      <p>You don't have permission to access {feature}.</p>
      <button
        className="back-button"
        onClick={() => setActiveComponent(null)}
      >
        Return to Dashboard
      </button>
    </div>
  );

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userPermissions");
    localStorage.removeItem("userDepartment");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <img src={companyLogo} alt="Company Logo" className="header-logo" />
            <div className="header-titles">
              <h1 className="header-title">LLS Audit Management System</h1>
              <p className="header-subtitle">
                {employeeData.loginDepartment} {/* Login department shown here */}
                {employeeData.department !== employeeData.loginDepartment &&
                  ` (Allocated: ${employeeData.department})`}
                {employeeData.designation && ` • ${employeeData.designation}`}
              </p>
            </div>
          </div>

          <div className="header-right">
            <div className="user-profile">
              <span className="user-name">{employeeData.empName}</span>
              <span className="user-id">( {employeeData.empId} )</span>
            </div>
            <button
              className="logout-btn"
              onClick={handleLogout}
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-main">
        <nav className={`dashboard-sidebar ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          <div className="sidebar-menu">
            <button
              className={`menu-btn ${!activeComponent ? "active" : ""}`}
              onClick={() => {
                setActiveComponent(null);
                setIsMobileMenuOpen(false);
              }}
            >
              Dashboard Home
            </button>

            {userPermissions.includes("auditPlanSheet") && (
              <button
                className={`menu-btn ${activeComponent === "audit-plan-sheet" ? "active" : ""}`}
                onClick={() => {
                  setActiveComponent("audit-plan-sheet");
                  setIsMobileMenuOpen(false);
                }}
              >
                Audit Plan Sheet
              </button>
            )}

            {userPermissions.includes("auditObservation") && (
              <button
                className={`menu-btn ${activeComponent === "audit-observation" ? "active" : ""}`}
                onClick={() => {
                  setActiveComponent("audit-observation");
                  setIsMobileMenuOpen(false);
                }}
              >
                Audit Observation
              </button>
            )}

            {userPermissions.includes("auditNCCloser") && (
              <button
                className={`menu-btn ${activeComponent === "audit-nc-closer" ? "active" : ""}`}
                onClick={() => {
                  setActiveComponent("audit-nc-closer");
                  setIsMobileMenuOpen(false);
                }}
              >
                Audit NC Closer
              </button>
            )}

            {userPermissions.includes("auditNCApproval") && (
              <button
                className={`menu-btn ${activeComponent === "user-audit-nc-view" ? "active" : ""}`}
                onClick={() => {
                  setActiveComponent("user-audit-nc-view");
                  setIsMobileMenuOpen(false);
                }}
              >
                Audit NC Approval
              </button>
            )}

            {userPermissions.includes("isoManual") && (
              <button
                className={`menu-btn ${activeComponent === "iso-manual" ? "active" : ""}`}
                onClick={() => {
                  setActiveComponent("iso-manual");
                  setIsMobileMenuOpen(false);
                }}
              >
                ISO 9001-2015 Manual
              </button>
            )}
          </div>
        </nav>

        <main className="dashboard-content">
          {renderComponent()}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;