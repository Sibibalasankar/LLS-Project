import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuditPlanDetails from "./AuditPlanDetails";
import "../assets/styles/AuditPlanCreation.css"; // Ensure correct path

const AuditPlanCreation = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedDepartments = JSON.parse(localStorage.getItem("departments")) || [];
    setDepartments(storedDepartments);
  }, []);

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
                  <button
                    className="view-details-btn"
                    onClick={() => setSelectedDepartment(dept)}
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
        <AuditPlanDetails department={selectedDepartment} onClose={() => setSelectedDepartment(null)} />
      )}
    </div>
  );
};

export default AuditPlanCreation;
