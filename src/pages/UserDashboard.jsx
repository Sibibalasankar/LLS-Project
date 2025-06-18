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
    department: "",
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

    return (
      <div className="welcome-container">
        <div className="welcome-header">
          <h1>Welcome back, <span className="highlight">{employeeData.empName}</span></h1>
          {employeeData.designation && (
            <p className="designation"> ( {employeeData.designation} )</p>
          )}
        </div>
        
        <div className="employee-info-grid">
          <div className="info-card">
            <span className="info-label">Employee ID</span>
            <span className="info-value">{employeeData.empId}</span>
          </div>
          <div className="info-card">
            <span className="info-label">Department</span>
            <span className="info-value">{employeeData.department}</span>
          </div>
          <div className="info-card">
            <span className="info-label">Certified Since</span>
            <span className="info-value">
              {employeeData.certifiedDate || "Not certified"}
            </span>
          </div>
        </div>

        <div className="time-display">
          <span className="date">📅 {currentTime.toLocaleDateString()}</span>
          <span className="time">⏰ {currentTime.toLocaleTimeString()}</span>
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

      // Fetch from userCredentials where employee data is stored
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
          department: employee.department,
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
                {employeeData.department}
                {employeeData.designation && ` • ${employeeData.designation}`}
              </p>
            </div>
          </div>
          
          <div className="header-right">
            <div className="user-profile">
              <span className="user-name">{employeeData.empName}</span>
              <span className="user-id">{employeeData.empId}</span>
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