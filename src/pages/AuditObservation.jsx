import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "../components/card";
import { Button } from "../components/button";
import "../assets/styles/AuditObservation.css";

const AuditObservation = () => {
  const [departments, setDepartments] = useState([]);
  const [observations, setObservations] = useState([]);
  const [auditPlans, setAuditPlans] = useState([]);
  const navigate = useNavigate();

  // Load all necessary data
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

    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Get data counts for departments
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

  return (
    <div className="audit-observation-container">
      <h2 className="page-title">Audit Observations</h2>
      
      {departments.length > 0 ? (
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
                    onClick={() => navigate(`/observation-details/${dept.name}`)}
                    className="view-btn"
                  >
                    {stats.observationsCount > 0 ? 'View Observations' : 'Add Observation'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <p className="no-data-msg">No departments available. Please add departments first.</p>
      )}
    </div>
  );
};

export default AuditObservation;