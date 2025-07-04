import { useState, useEffect } from 'react';
import { Card, CardContent } from "../components/card";
import { Button } from "../components/button";
import ObservationDetails from "../pages/Observationdetails";
import "../assets/styles/AuditObservation.css";

const AuditObservation = () => {
  const [departments, setDepartments] = useState([]);
  const [observationsCount, setObservationsCount] = useState({});
  const [ncCount, setNcCount] = useState({});
  const [ofiCount, setOfiCount] = useState({});
  const [opCount, setOpCount] = useState({});
  const [auditPlans, setAuditPlans] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // New filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('All'); // All, Assigned, NotAssigned

  const loadData = () => {
  const storedDepartments = JSON.parse(localStorage.getItem('departments')) || [];
  const storedPlans = JSON.parse(localStorage.getItem('auditPlans')) || [];
  const savedReports = JSON.parse(localStorage.getItem('savedReports')) || [];
  const allObservations = JSON.parse(localStorage.getItem('auditObservations')) || {};

  const updatedCounts = {};
  const updatedNcCounts = {};
  const updatedOfiCounts = {};
  const updatedOpCounts = {};

  storedDepartments.forEach(dept => {
    const hasPlan = storedPlans.some(plan => plan.department === dept.name);

    if (!hasPlan) {
      localStorage.removeItem(`observations_${dept.name}`);
    }

    const deptObservations = Object.values(allObservations).flat().filter(obs =>
      obs.department === dept.name
    );

    updatedCounts[dept.name] = deptObservations.length;

    const deptNcCount = deptObservations.filter(obs => obs.result === "NC").length;
    updatedNcCounts[dept.name] = deptNcCount;

    const ofiCount = deptObservations.filter(obs => obs.result === "OFI").length;
    const opCount = deptObservations.filter(obs => obs.result === "O+").length;

    updatedOfiCounts[dept.name] = ofiCount;
    updatedOpCounts[dept.name] = opCount;
  });

  setDepartments(storedDepartments);
  setAuditPlans(storedPlans);
  setObservationsCount(updatedCounts);
  setNcCount(updatedNcCounts);
  setOfiCount(updatedOfiCounts);
  setOpCount(updatedOpCounts);
};

useEffect(() => {
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

  // Filter departments based on search and planFilter
  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase());
    const plansCount = auditPlans.filter(plan => plan.department === dept.name).length;
    const matchesPlan = planFilter === 'All'
      || (planFilter === 'Assigned' && plansCount > 0)
      || (planFilter === 'NotAssigned' && plansCount === 0);

    return matchesSearch && matchesPlan;
  });

  return (
    <div className="audit-observation-container">
      <h2 className="page-title">Audit Observations</h2>
      <hr />

      {/* Filters */}
      {!selectedDepartment && (   // Hide filters when inside a department
        <div className="filters-container">
          <input
            type="text"
            placeholder="Search Department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="filter-select"
          >
            <option value="All">All Departments</option>
            <option value="Assigned">Audit Plan Assigned</option>
            <option value="NotAssigned">No Audit Plan</option>
          </select>
        </div>
      )}


      {selectedDepartment ? (
        <ObservationDetails
  departmentName={selectedDepartment}
  onClose={() => setSelectedDepartment(null)}
  onObservationUpdate={handleObservationUpdate}
  onDataChanged={loadData} // Pass this new prop
/>

      ) : (
        <div className="department-grid">
          {filteredDepartments.map((dept) => {
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

export default AuditObservation;
