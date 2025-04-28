import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuditPlanDetails from "./AuditPlanDetails";
import "../assets/styles/AuditPlanCreation.css";

const AuditPlanCreation = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [auditPlans, setAuditPlans] = useState([]);
  const [auditors, setAuditors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = () => {
      try {
        const storedDepartments = JSON.parse(localStorage.getItem("departments")) || [];
        const storedPlans = JSON.parse(localStorage.getItem("auditPlans")) || [];
        const storedAuditors = JSON.parse(localStorage.getItem("auditors")) || [];
        
        setDepartments(storedDepartments);
        setAuditPlans(storedPlans);
        setAuditors(storedAuditors);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    
    loadData();
    const handleStorageChange = () => loadData();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const countPlansForDepartment = (deptName) => {
    return auditPlans.filter(plan => plan.department === deptName).length;
  };

  const hasAuditors = (departmentName) => {
    return auditors.some(auditor => auditor.department === departmentName);
  };

  const handlePlansUpdate = (updatedPlans) => {
    setAuditPlans(updatedPlans);
    localStorage.setItem("auditPlans", JSON.stringify(updatedPlans));
  };

  return (
    <div className="audit-plan-container">
      <h2 className="page-title">Audit Plan Creation</h2>

      {!selectedDepartment ? (
        <>
          {departments.length > 0 ? (
            <div className="department-grid">
              {departments.map((dept, index) => (
                <div key={index} className="department-card">
                  <h3>{dept.name}</h3>
                  <div className="department-stats">
                    <div className="stat-item">
                      <span className="stat-label">Audit Plans:</span>
                      <span className="stat-value">{countPlansForDepartment(dept.name)}</span>
                    </div>
                  </div>
                  <button
                    className={`view-details-btn ${!hasAuditors(dept.name) ? 'disabled' : ''}`}
                    onClick={() => hasAuditors(dept.name) && setSelectedDepartment(dept)}
                    disabled={!hasAuditors(dept.name)}
                    title={!hasAuditors(dept.name) ? "No auditors assigned to this department" : ""}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data-msg">No departments available. Please add departments first.</p>
          )}
        </>
      ) : (
        <AuditPlanDetails 
          department={selectedDepartment} 
          onClose={() => setSelectedDepartment(null)}
          onPlansUpdate={handlePlansUpdate}
          initialPlans={auditPlans}
        />
      )}
    </div>
  );
};

export default AuditPlanCreation;