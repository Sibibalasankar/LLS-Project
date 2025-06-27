import { useState, useEffect } from 'react';
import { Card, CardContent } from "../components/card";
import { Button } from "../components/button";
import ObservationDetails from "../pages/Observationdetails";
import "../assets/styles/AuditObservation.css";

const UserAuditObservation = () => {
  const [departments, setDepartments] = useState([]);
  const [observationsCount, setObservationsCount] = useState({});
  const [ncCount, setNcCount] = useState({});
  const [ofiCount, setOfiCount] = useState({});
  const [opCount, setOpCount] = useState({});
  const [auditPlans, setAuditPlans] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    const loadData = () => {
      const storedDepartments = JSON.parse(localStorage.getItem('departments')) || [];
      const storedPlans = JSON.parse(localStorage.getItem('auditPlans')) || [];
      const savedReports = JSON.parse(localStorage.getItem('savedReports')) || [];
      const allObservations = JSON.parse(localStorage.getItem('auditObservations')) || {};
      const userAuditDepartment = localStorage.getItem('userAuditDepartment');

      const updatedCounts = {};
      const updatedNcCounts = {};
      const updatedOfiCounts = {};
      const updatedOpCounts = {};

      // Only process the user's department
      const userDept = storedDepartments.find(dept => dept.name === userAuditDepartment);
      if (userDept) {
        const hasPlan = storedPlans.some(plan => plan.department === userDept.name);

        if (!hasPlan) {
          localStorage.removeItem(`observations_${userDept.name}`);
        }

        const deptObservations = Object.values(allObservations).flat().filter(obs =>
          obs.department === userDept.name
        );
        updatedCounts[userDept.name] = deptObservations.length;

        const deptNcCount = savedReports.filter(report =>
          report.dptname === userDept.name
        ).length;
        updatedNcCounts[userDept.name] = deptNcCount;

        const ofiCount = deptObservations.filter(obs => obs.result === "OFI").length;
        const opCount = deptObservations.filter(obs => obs.result === "O+").length;
        updatedOfiCounts[userDept.name] = ofiCount;
        updatedOpCounts[userDept.name] = opCount;
      }

      setDepartments([userDept].filter(Boolean)); // Only include the user's department if it exists
      setAuditPlans(storedPlans);
      setObservationsCount(updatedCounts);
      setNcCount(updatedNcCounts);
      setOfiCount(updatedOfiCounts);
      setOpCount(updatedOpCounts);
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
      <hr />

      {selectedDepartment ? (
        <ObservationDetails
          departmentName={selectedDepartment}
          onClose={() => setSelectedDepartment(null)}
          onObservationUpdate={handleObservationUpdate}
        />
      ) : (
        <div className="department-grid">
          {departments.map((dept) => {
            const plansCount = auditPlans.filter(plan => plan.department === dept.name).length;
            const obsCount = observationsCount[dept.name] || 0;
            const deptNcCount = ncCount[dept.name] || 0;
            const deptOfiCount = ofiCount[dept.name] || 0;
            const deptOpCount = opCount[dept.name] || 0;

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
                        <span className="stat-label">Total Observations:</span>
                        <span className="stat-value">{obsCount}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">NC Count:</span>
                        <span className="stat-value">{deptNcCount}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">OFI Count:</span>
                        <span className="stat-value">{deptOfiCount}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">O+ Count:</span>
                        <span className="stat-value">{deptOpCount}</span>
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