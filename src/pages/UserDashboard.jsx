import { useState, useEffect } from "react";
import AuditPlanDetails from "./AuditPlanDetails";

const AuditPlanCreation = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    const storedDepartments = JSON.parse(localStorage.getItem("departments")) || [];
    setDepartments(storedDepartments);
  }, []);

  return (
    <div className="audit-plan-container">
      <h2>Audit Plan Creation</h2>

      {/* Show department list only if no department is selected */}
      {!selectedDepartment ? (
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
      ) : (
        // Render AuditPlanDetails inside this page
        <AuditPlanDetails department={selectedDepartment} onBack={() => setSelectedDepartment(null)} />
      )}
    </div>
  );
};

export default AuditPlanCreation;
 