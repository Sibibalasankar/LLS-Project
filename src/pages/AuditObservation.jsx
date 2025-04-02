import { useState, useEffect } from 'react';
import { Card, CardContent } from "../components/card";
import { Button } from "../components/button";
import ObservationDetails from "../pages/Observationdetails";
import "../assets/styles/AuditObservation.css";

const AuditObservation = () => {
  const [departments, setDepartments] = useState([]);
  const [observationsCount, setObservationsCount] = useState({}); // Store count per department
  const [auditPlans, setAuditPlans] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    const loadData = () => {
      const storedDepartments = JSON.parse(localStorage.getItem('departments')) || [];
      const storedPlans = JSON.parse(localStorage.getItem('auditPlans')) || [];

      setDepartments(storedDepartments);
      setAuditPlans(storedPlans);

      // Load observation counts
      const counts = {};
      storedDepartments.forEach(dept => {
        const storedObservations = JSON.parse(localStorage.getItem(`observations_${dept.name}`)) || [];
        counts[dept.name] = storedObservations.length;
      });
      setObservationsCount(counts);
    };

    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const handleObservationUpdate = (deptName, count) => {
    setObservationsCount(prevCounts => ({
      ...prevCounts,
      [deptName]: count
    }));
  };

  return (
    <div className="audit-observation-container">
      <h2 className="page-title">Audit Observations</h2>

      {selectedDepartment ? (
        <ObservationDetails
          departmentName={selectedDepartment}
          onClose={() => setSelectedDepartment(null)}
          onObservationUpdate={handleObservationUpdate} // Pass update function
        />
      ) : (
        <div className="department-grid">
          {departments.map((dept) => {
            const plansCount = auditPlans.filter(plan => plan.department === dept.name).length;
            const obsCount = observationsCount[dept.name] || 0;

            return (
              <Card key={dept.name} className="department-card">
                <CardContent>
                  <h3>{dept.name}</h3>
                  <div className="department-stats">
                    <div className="stat-item">
                      <span className="stat-label">Audit Plans:</span>
                      <span className="stat-value">{plansCount}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Observations:</span>
                      <span className="stat-value">{obsCount}</span> {/* Updated Count */}
                    </div>
                  </div>
                  <Button 
                    onClick={() => setSelectedDepartment(dept.name)}
                    className={`view-btn ${plansCount === 0 ? 'disabled' : ''}`} 
                    disabled={plansCount === 0}
                  >
                    {plansCount > 0 ? (obsCount > 0 ? 'View Observations' : 'Add Observation') : 'No Audit Plan'}
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
