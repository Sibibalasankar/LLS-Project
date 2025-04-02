import { useState, useEffect } from 'react';
import { Card, CardContent } from "../components/card";
import { Button } from "../components/button";
import ObservationDetails from "./ObservationDetails"; // Import ObservationDetails component
import "../assets/styles/AuditObservation.css";

const AuditObservation = () => {
  const [departments, setDepartments] = useState([]);
  const [observations, setObservations] = useState([]);
  const [auditPlans, setAuditPlans] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null); // New state for selected department

  useEffect(() => {
    const loadData = () => {
      const storedDepartments = JSON.parse(localStorage.getItem('departments')) || [];
      const storedObservations = JSON.parse(localStorage.getItem('observations')) || [];
      const storedPlans = JSON.parse(localStorage.getItem('auditPlans')) || [];

      setDepartments(storedDepartments);
      setObservations(storedObservations);
      setAuditPlans(storedPlans);
    };

    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const getDepartmentStats = (deptName) => {
    const departmentPlans = auditPlans.filter(plan => plan.department === deptName);
    const departmentObservations = observations.filter(obs => obs.department === deptName);

    return {
      plansCount: departmentPlans.length,
      lastPlanDate: departmentPlans[0]?.date,
      observationsCount: departmentObservations.length,
      lastObservationDate: departmentObservations[0]?.date
    };
  };

  // Function to handle department selection
  const handleDepartmentClick = (deptName, plansCount) => {
    if (plansCount > 0) {
      setSelectedDepartment(deptName); // Set the selected department instead of navigating
    }
  };

  return (
    <div className="audit-observation-container">
      <h2 className="page-title">Audit Observations</h2>

      {/* If a department is selected, show ObservationDetails */}
      {selectedDepartment ? (
  <ObservationDetails 
    departmentName={selectedDepartment} 
    onClose={() => {
      console.log("Back button clicked, resetting selectedDepartment");
      setSelectedDepartment(null);
    }}
  />
) : (
  <div className="department-grid">

          {departments.map((dept) => {
            const stats = getDepartmentStats(dept.name);

            return (
              <Card key={dept.name} className="department-card">
                <CardContent>
                  <h3>{dept.name}</h3>
                  <div className="department-stats">
                    <div className="stat-item">
                      <span className="stat-label">Audit Plans:</span>
                      <span className="stat-value">{stats.plansCount}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Observations:</span>
                      <span className="stat-value">{stats.observationsCount}</span>
                    </div>
                    {stats.lastPlanDate && (
                      <div className="stat-item">
                        <span className="stat-label">Last Audit:</span>
                        <span className="stat-value">
                          {new Date(stats.lastPlanDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button 
                    onClick={() => handleDepartmentClick(dept.name, stats.plansCount)}
                    className={`view-btn ${stats.plansCount === 0 ? 'disabled' : ''}`} 
                    disabled={stats.plansCount === 0}
                  >
                    {stats.plansCount > 0 
                      ? (stats.observationsCount > 0 ? 'View Observations' : 'Add Observation') 
                      : 'No Audit Plan'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AuditObservation;
