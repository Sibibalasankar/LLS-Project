import { useState, useEffect } from "react";
import "../assets/styles/AuditPlanCreation.css"
import AuditPlanDetails from "./AuditPlanDetails";

const AuditPlanCreation = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    // Fetch department list from localStorage
    const storedDepartments = JSON.parse(localStorage.getItem("departments")) || [];
    setDepartments(storedDepartments);
  }, []);

  return (
    <div className="audit-plan-container">
      <h2>Audit Plan Creation</h2>

      {/* Show department list when no department is selected */}
      {!selectedDepartment ? (
        <div>
          <ul className="department-list">
            {departments.length > 0 ? (
              departments.map((dept, index) => (
                <li
                  key={index}
                  className="department-item"
                  onClick={() => setSelectedDepartment(dept)}
                >
                  {dept.name}
                </li>
              ))
            ) : (
              <p>No departments available. Please add departments first.</p>
            )}
          </ul>
        </div>
      ) : (
        // Show AuditPlanDetails in the same div when a department is selected
        <AuditPlanDetails department={selectedDepartment} onBack={() => setSelectedDepartment(null)} />
      )}
    </div>
  );
};

export default AuditPlanCreation;
