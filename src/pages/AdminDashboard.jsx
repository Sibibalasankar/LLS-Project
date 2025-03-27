import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Dashboard.css";

// Import all pages
import AuditorList from "./AuditorList";
import DepartmentList from "./DepartmentList";
import AuditPlanCreation from "./AuditPlanCreation";
import AuditPlanSheet from "./AuditPlanSheet";
import AuditIntimationMail from "./AuditIntimationMail";
import AuditObservation from "./AuditObservation";
import AuditNCCloser from "./AuditNCCloser";
import AuditNCApproval from "./AuditNCApproval";
import AuditSummary from "./AuditSummary";
import ISOManual from "./ISOManual";

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const [showAuditPlan, setShowAuditPlan] = useState(false);
  const [showAuditCheckList, setShowAuditCheckList] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="container-fluid main_body">
      <div className="top_bar_nav">
        <h2 className="title_company">LLS Audit Management System</h2>
        <button className="logout_btn" onClick={() => navigate("/login")}>
          Log out
        </button>
      </div>

      <div className="row main_child">
        {/* Sidebar */}
        <div className="side_bar col-3">
          <button className="main_btn" onClick={() => setActiveComponent("auditor-list")}>
            Auditor List
          </button>
          <button className="main_btn" onClick={() => setActiveComponent("department-list")}>
            Department List
          </button>

          {/* Audit Plan Section */}
          <button onClick={() => setShowAuditPlan(!showAuditPlan)} className="main_btn">
            Audit Plan
          </button>
          {showAuditPlan && (
            <div className="plan_div">
              <button className="sub_btn" onClick={() => setActiveComponent("audit-plan-creation")}>
                Audit Plan Creation
              </button>
              <button className="sub_btn" onClick={() => setActiveComponent("audit-plan-sheet")}>
                Audit Plan Sheet
              </button>
              <button className="sub_btn" onClick={() => setActiveComponent("audit-intimation-mail")}>
                Audit Plan Intimation Mail
              </button>
            </div>
          )}

          {/* Audit Check List Section */}
          <button onClick={() => setShowAuditCheckList(!showAuditCheckList)} className="main_btn">
            Audit Check List
          </button>
          {showAuditCheckList && (
            <div className="plan_div">
              <button className="sub_btn" onClick={() => setActiveComponent("audit-observation")}>
                Audit Observation
              </button>
              <button className="sub_btn" onClick={() => setActiveComponent("audit-nc-closer")}>
                Audit NC Closer
              </button>
              <button className="sub_btn" onClick={() => setActiveComponent("audit-nc-approval")}>
                Audit NC Approval
              </button>
            </div>
          )}

          <button className="main_btn" onClick={() => setActiveComponent("audit-summary")}>
            Audit Summary Report
          </button>
          <button className="main_btn" onClick={() => setActiveComponent("iso-manual")}>
            ISO 9001-2015 Manual
          </button>
        </div>

        {/* Content Display */}
        <div className="child_body col-9">
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
          
          {!activeComponent && <p>Welcome to the Audit Management System. Select an option from the sidebar.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
