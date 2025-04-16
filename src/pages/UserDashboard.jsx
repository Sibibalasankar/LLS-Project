import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Dashboard.css"; // Reusing the same style as the admin Dashboard

// Import user-related pages
import AuditObservation from "./AuditObservation";
import AuditNCCloser from "../pages/AuditNCCloser";
import AuditNCApproval from "../pages/AuditNCApproval";
import AuditPlanSheet from "./AuditPlanSheet";
import AuditIntimationMail from "./AuditIntimationMail";
import ISOManual from "../pages/ISOManual";
import companyLogo from "../assets/images/lls_logo.png";

const UserDashboard = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const navigate = useNavigate();
  const WelcomeMessage = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
  
      return () => clearInterval(intervalId); // Cleanup
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
  
      const approved = requests.some(req => 
        req.username === currentUser && req.status === "approved"
      );
  
      if (!approved) {
        // prevent double alerts
        if (!window.hasAlerted) {
          alert("You don't have approved access yet");
          window.hasAlerted = true;
        }
        navigate("/user-login");
      }
    };
  
    checkAccess();
    const interval = setInterval(checkAccess, 5000);
    return () => clearInterval(interval);
  }, [navigate]);
  

  return (
    <div className="dashboard-container">
      {/* Top Navigation Bar */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <img src={companyLogo} alt="Company Logo" className="header-logo" />
            <h1 className="header-title">LLS Audit Management System</h1>
          </div>
          <button className="logout-btn" onClick={() => navigate("/login")}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* Sidebar Navigation */}
        <nav className="dashboard-sidebar">
          <div className="sidebar-menu">
            <button
              className={`menu-btn ${activeComponent === "audit-plan-sheet" ? "active" : ""}`}
              onClick={() => setActiveComponent("audit-plan-sheet")}
            >
              Audit Plan Sheet
            </button>
           
            <button
              className={`menu-btn ${activeComponent === "audit-observation" ? "active" : ""}`}
              onClick={() => setActiveComponent("audit-observation")}
            >
              Audit Observation
            </button>
            <button
              className={`menu-btn ${activeComponent === "audit-nc-closer" ? "active" : ""}`}
              onClick={() => setActiveComponent("audit-nc-closer")}
            >
              Audit NC Closer
            </button>
            <button
              className={`menu-btn ${activeComponent === "audit-nc-approval" ? "active" : ""}`}
              onClick={() => setActiveComponent("audit-nc-approval")}
            >
              Audit NC Approval
            </button>
            <button
              className={`menu-btn ${activeComponent === "iso-manual" ? "active" : ""}`}
              onClick={() => setActiveComponent("iso-manual")}
            >
              ISO 9001-2015 Manual
            </button>
          </div>
        </nav>

        {/* Main Content Display */}
        <main className="dashboard-content">
          {activeComponent === "audit-plan-sheet" && <AuditPlanSheet />}
          {activeComponent === "audit-intimation-mail" && <AuditIntimationMail />}
          {activeComponent === "audit-observation" && <AuditObservation />}
          {activeComponent === "audit-nc-closer" && <AuditNCCloser />}
          {activeComponent === "audit-nc-approval" && <AuditNCApproval />}
          {activeComponent === "iso-manual" && <ISOManual />}

          {!activeComponent && (
  <WelcomeMessage />
)}

        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
