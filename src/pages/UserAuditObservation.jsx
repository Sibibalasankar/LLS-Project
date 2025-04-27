// src/pages/UserAuditObservation.jsx
import { useState, useEffect } from 'react';
import { Card, CardContent } from "../components/card";
import { Button } from "../components/button";
import UserObservationDetails from "../pages/UserObservationDetails";
import "../assets/styles/AuditObservation.css";

const UserAuditObservation = () => {
  const [departments, setDepartments] = useState([]);
  const [observationsCount, setObservationsCount] = useState({});
  const [ncCount, setNcCount] = useState({});
  const [auditPlans, setAuditPlans] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [userDepartment, setUserDepartment] = useState('');

  useEffect(() => {
    const loadData = () => {
      const storedDepartments = JSON.parse(localStorage.getItem('departments')) || [];
      const storedPlans = JSON.parse(localStorage.getItem('auditPlans')) || [];
      const savedReports = JSON.parse(localStorage.getItem('savedReports')) || [];
      const userDept = localStorage.getItem('userDepartment') || '';

      const updatedCounts = {};
      const updatedNcCounts = {};

      storedDepartments.forEach(dept => {
        const hasPlan = storedPlans.some(plan => plan.department === dept.name);

        if (!hasPlan) {
          localStorage.removeItem(`observations_${dept.name}`);
        }

        const deptObservations = JSON.parse(localStorage.getItem(`observations_${dept.name}`)) || [];
        updatedCounts[dept.name] = deptObservations.length;

        const deptNcCount = savedReports.filter(report =>
          report.dptname === dept.name
        ).length;
        updatedNcCounts[dept.name] = deptNcCount;
      });

      setDepartments(storedDepartments);
      setAuditPlans(storedPlans);
      setObservationsCount(updatedCounts);
      setNcCount(updatedNcCounts);
      setUserDepartment(userDept);
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

  // Filter departments to only show the user's department
  const filteredDepartments = departments.filter(dept => dept.name === userDepartment);

  return (
    <div className="audit-observation-container">
      <h2 className="page-title">User Audit Observations</h2>

      {selectedDepartment ? (
        <UserObservationDetails
          departmentName={selectedDepartment}
          onClose={() => setSelectedDepartment(null)}
          onObservationUpdate={handleObservationUpdate}
        />
      ) : (
        <div className="department-grid">
          {filteredDepartments.map((dept) => {
            const plansCount = auditPlans.filter(plan => plan.department === dept.name).length;
            const obsCount = observationsCount[dept.name] || 0;
            const deptNcCount = ncCount[dept.name] || 0;

            return (
              <Card key={dept.name} className="department-card">
                <CardContent className="card-content">
                  <div className="card-body">
                    <h3 className="department-title">{dept.name}</h3>
                    <div className="department-stats">
                      <div className="stat-item">
                        <span className="stat-label">Audit Plans:</span>
                        <span className="stat-value">{plansCount}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Observations:</span>
                        <span className="stat-value">{obsCount}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">NC Count:</span>
                        <span className="stat-value">{deptNcCount}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      if (plansCount > 0) {
                        setSelectedDepartment(dept.name);
                      }
                    }}
                    className={`view-btn ${plansCount === 0 ? 'disabled' : ''}`}
                    disabled={plansCount === 0}
                  >
                    {plansCount > 0
                      ? obsCount > 0
                        ? 'View Observations'
                        : 'Add Observation'
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

export default UserAuditObservation;