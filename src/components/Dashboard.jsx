import { useState } from "react";
import "../assets/styles/Dashboard.css";

const Dashboard = () => {
  const [showAuditPlan, setShowAuditPlan] = useState(false);
  const [showAuditCheckList, setShowAuditCheckList] = useState(false);

  return (
    <>
      <div className="container-fluid main_body">
        <div className="top_bar_nav">
          <h2>LLS Audit Management System</h2>
        </div>
        <div className="row main_child">
          <div className="side_bar col-3">
            <button className="main_btn">Auditor List</button>
            <button className="main_btn">Department List</button>

            {/* Audit Plan Section */}
            <button
              id="Audit_plan"
              onClick={() => setShowAuditPlan(!showAuditPlan)}
              className="main_btn"
            >
              Audit Plan
            </button>
            {showAuditPlan && (
              <div className="plan_div">
                <button className="sub_btn">Audit Plan Creation</button>
                <button className="sub_btn">Audit Plan Sheet</button>
                <button className="sub_btn">Audit Plan Intimation Mail</button>
              </div>
            )}

            {/* Audit Check List Section */}
            <button
              className="main_btn"
              onClick={() => setShowAuditCheckList(!showAuditCheckList)}
            >
              Audit Check List
            </button>
            {showAuditCheckList && (
              <div className="plan_div">
                <button className="sub_btn">Audit Observation</button>
                <button className="sub_btn">Audit NC Closer</button>
                <button className="sub_btn">Audit NC Approval</button>
              </div>
            )}

            <button className="main_btn">Audit Summary Report</button>
            <button className="main_btn">ISO 9001-2015 Manual</button>
          </div>
          <div className="child_body col-9"></div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
