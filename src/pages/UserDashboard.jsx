import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Dashboard.css";

// Import user-related pages
import AuditObservation from "./AuditObservation";
import AuditNCCloser from "../pages/AuditNCCloser";
import AuditNCApproval from "../pages/AuditNCApproval";
import AuditPlanSheet from "./AuditPlanSheet";
import AuditIntimationMail from "./AuditIntimationMail";
import ISOManual from "../pages/ISOManual";

const UserDashboard = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="container-fluid main_body">
      <div className="top_bar_nav">
        <h2 className="title_company">Welcome to LLS Audit Management System</h2>
        <button className="logout_btn" onClick={() => navigate("/login")}>
          Log out
        </button>
      </div>

      <div className="row main_child">
        {/* Sidebar */}
        <div className="side_bar col-3">
          <button className="main_btn" onClick={() => setActiveComponent("audit-plan-sheet")}>
            Audit Plan Sheet
          </button>
          <button className="main_btn" onClick={() => setActiveComponent("audit-intimation-mail")}>
            Audit Plan Intimation Mail
          </button>
          <button className="main_btn" onClick={() => setActiveComponent("audit-observation")}>
            Audit Observation
          </button>
          <button className="main_btn" onClick={() => setActiveComponent("audit-nc-closer")}>
            Audit NC Closer
          </button>
          <button className="main_btn" onClick={() => setActiveComponent("audit-nc-approval")}>
            Audit NC Approval
          </button>
          <button className="main_btn" onClick={() => setActiveComponent("iso-manual")}>
            ISO 9001-2015 Manual
          </button>
        </div>

        {/* Content Display */}
        <div className="child_body col-9">
          {activeComponent === "audit-plan-sheet" && <AuditPlanSheet />}
          {activeComponent === "audit-intimation-mail" && <AuditIntimationMail />}
          {activeComponent === "audit-observation" && <AuditObservation />}
          {activeComponent === "audit-nc-closer" && <AuditNCCloser />}
          {activeComponent === "audit-nc-approval" && <AuditNCApproval />}
          {activeComponent === "iso-manual" && <ISOManual />}

          {!activeComponent && <p>Welcome to the User Dashboard. Select an option from the sidebar.</p>}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
