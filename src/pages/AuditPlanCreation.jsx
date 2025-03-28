import { useState, useEffect } from "react";
import "../assets/styles/AuditPlanCreation.css";
import AuditPlanDetails from "./AuditPlanDetails";
import { useNavigate } from "react-router-dom";  // ✅ Add this import


const AuditPlanCreation = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    // Fetch department list from localStorage
    const storedDepartments = JSON.parse(localStorage.getItem("departments")) || [];
    setDepartments(storedDepartments);
  }, []);
  const navigate = useNavigate();

const handleDepartmentClick = (dept) => {
  navigate("/audit-plan/details", { state: { department: dept } });
};


  return (
    <div className="audit-plan-container">
      <h2>Audit Plan Creation</h2>

      {/* If no department is selected, show list */}
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
        // Show AuditPlanDetails inside the same page when a department is selected
        <AuditPlanDetails department={selectedDepartment} onClose={() => setSelectedDepartment(null)} />
      )}

    </div>
  );
};

export default AuditPlanCreation;
