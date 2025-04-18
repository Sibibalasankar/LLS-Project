import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Dashboard.css";
import AuditObservation from "./AuditObservation";
import UserAuditNcCloser from "../pages/UserAuditNcCloser";
import AuditNCApproval from "../pages/AuditNcApproval";
import AuditPlanSheet from "./AuditPlanSheet";
import ISOManual from "../pages/ISOManual";
import companyLogo from "../assets/images/lls_logo.png";
import AuditNcUserView from "../pages/AuditNcUserView"; // ✅ added

const UserDashboard = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [accessApproved, setAccessApproved] = useState(true);
  const [userPermissions, setUserPermissions] = useState([]);
  const [userDepartment, setUserDepartment] = useState("");
  const navigate = useNavigate();

  const WelcomeMessage = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(intervalId);
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

  useEffect(() => {
    const checkAccess = () => {
      const requests = JSON.parse(localStorage.getItem("accessRequests") || "[]");
      const currentUser = localStorage.getItem("currentUser");

      if (!currentUser) {
        alert("No user found in session.");
        navigate("/user-login");
        return;
      }

      const approved = requests.some(
        (req) => req.username === currentUser && req.status === "approved"
      );

      if (!approved) {
        if (!window.hasAlerted) {
          alert("You don't have approved access yet");
          window.hasAlerted = true;
        }
        navigate("/user-login");
      } else {
        const permissions = JSON.parse(localStorage.getItem("userPermissions") || "[]");
        const department = localStorage.getItem("userDepartment") || "";
        setUserPermissions(permissions);
        setUserDepartment(department);
      }
    };

    checkAccess();
    const interval = setInterval(checkAccess, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  if (!accessApproved) {
    return (
      <div className="waiting-message">
        <h3>Your request is pending admin approval.</h3>
        <p>Please wait... You will be redirected when access is granted.</p>
      </div>
    );
  }

  const renderComponent = () => {
    switch (activeComponent) {
      case "audit-plan-sheet":
        return userPermissions.includes("auditPlanSheet") && <AuditPlanSheet />;
      case "audit-observation":
        return userPermissions.includes("auditObservation") && <AuditObservation />;
      case "audit-nc-closer":
        return userPermissions.includes("auditNCCloser") && <UserAuditNcCloser />;
      case "user-audit-nc-view":
        return userPermissions.includes("auditNCApproval") && <AuditNCApproval />;
      case "iso-manual":
        return userPermissions.includes("isoManual") && <ISOManual />;
      case "user-nc-user-view":
        return userPermissions.includes("auditNcUserView") && <AuditNcUserView />; // ✅
      default:
        return <WelcomeMessage />;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <img src={companyLogo} alt="Company Logo" className="header-logo" />
            <div>
              <h1 className="header-title">LLS Audit Management System</h1>
              {userDepartment && (
                <p className="department-info" style={{ fontSize: "14px", color: "#ccc" }}>
                  Department: {userDepartment}
                </p>
              )}
            </div>
          </div>
          <button className="logout-btn" onClick={() => navigate("/login")}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-main">
        <nav className="dashboard-sidebar">
          <div className="sidebar-menu">
            {userPermissions.includes("auditPlanSheet") && (
              <button
                className={`menu-btn ${activeComponent === "audit-plan-sheet" ? "active" : ""}`}
                onClick={() => setActiveComponent("audit-plan-sheet")}
              >
                Audit Plan Sheet
              </button>
            )}
            {userPermissions.includes("auditObservation") && (
              <button
                className={`menu-btn ${activeComponent === "audit-observation" ? "active" : ""}`}
                onClick={() => setActiveComponent("audit-observation")}
              >
                Audit Observation
              </button>
            )}
            {userPermissions.includes("auditNCCloser") && (
              <button
                className={`menu-btn ${activeComponent === "audit-nc-closer" ? "active" : ""}`}
                onClick={() => setActiveComponent("audit-nc-closer")}
              >
                Audit NC Closer
              </button>
            )}
            {userPermissions.includes("auditNCApproval") && (
              <button
                className={`menu-btn ${activeComponent === "user-audit-nc-view" ? "active" : ""}`}
                onClick={() => setActiveComponent("user-audit-nc-view")}
              >
                Audit NC Approval
              </button>
            )}
            {userPermissions.includes("isoManual") && (
              <button
                className={`menu-btn ${activeComponent === "iso-manual" ? "active" : ""}`}
                onClick={() => setActiveComponent("iso-manual")}
              >
                ISO 9001-2015 Manual
              </button>
            )}
            {userPermissions.includes("auditNcUserView") && (
              <button
                className={`menu-btn ${activeComponent === "audit-nc-user-view" ? "active" : ""}`}
                onClick={() => navigate("/user-dashboard/user-audit-nc-view")} // Navigate to Audit NC User View
              >
                View Action Reports
              </button>
            )}
          </div>
        </nav>

        <main className="dashboard-content">{renderComponent()}</main>
      </div>
    </div>
  );
};

export default UserDashboard;
