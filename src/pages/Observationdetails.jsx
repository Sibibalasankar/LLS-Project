import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/card";
import Observations from "./Observations";
import { FiEye, FiTrash2, FiPlus, FiArrowLeft } from "react-icons/fi";
import "../assets/styles/ObservationDetails.css";

const ObservationDetails = ({ departmentName, onClose, onObservationUpdate }) => {
  const [observations, setObservations] = useState([]);
  const [viewObservationId, setViewObservationId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [auditCycleData, setAuditCycleData] = useState({});
  const [auditCycleFilter, setAuditCycleFilter] = useState("");
  const userRole = localStorage.getItem('userRole');
  const isAuditee = userRole === 'auditee';

  useEffect(() => {
    const storedObservations = JSON.parse(localStorage.getItem(`observations_${departmentName}`)) || [];
    setObservations(storedObservations);

    const allObservations = JSON.parse(localStorage.getItem("auditObservations")) || {};
    const cycleData = {};

    storedObservations.forEach(obs => {
      if (allObservations[obs.id] && allObservations[obs.id].length > 0) {
        cycleData[obs.id] = allObservations[obs.id][0].auditCycleNo;
      } else {
        cycleData[obs.id] = "Not set";
      }
    });

    setAuditCycleData(cycleData);
  }, [departmentName]);
  const getNextAuditCycle = () => {
    const cycles = ["I", "II", "III", "IV", "V"];
    const currentYear = new Date().getFullYear();
    const yearRange = `${currentYear}-${currentYear + 1}`;

    const usedCycles = observations
      .map(obs => (obs.auditCycleNo ? obs.auditCycleNo.split('/')[0] : null))
      .filter(cycle => cycle);

    const nextCycle = cycles.find(cycle => !usedCycles.includes(cycle)) || "I";

    return `${nextCycle}/${yearRange}`;
  };




  const handleAddObservation = () => {
    const stored = JSON.parse(localStorage.getItem(`observations_${departmentName}`)) || [];
    const nextCycle = getNextAuditCycle();

    const newObservation = {
      id: Date.now(),
      number: stored.length + 1,
      department: departmentName,
      auditCycleNo: nextCycle // ✅ already correct
    };

    const updated = [...stored, newObservation];
    localStorage.setItem(`observations_${departmentName}`, JSON.stringify(updated));
    setObservations(updated);
    onObservationUpdate(departmentName, updated.length);
  };


  const handleDeleteObservation = async (id) => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    const updatedObservations = observations
      .filter(obs => obs.id !== id)
      .map((obs, index) => ({
        ...obs,
        number: index + 1,
      }));

    localStorage.setItem(`observations_${departmentName}`, JSON.stringify(updatedObservations));
    setObservations(updatedObservations);
    onObservationUpdate(departmentName, updatedObservations.length);

    const allObservations = JSON.parse(localStorage.getItem("auditObservations")) || {};
    delete allObservations[id];
    localStorage.setItem("auditObservations", JSON.stringify(allObservations));

    if (typeof onDataChanged === 'function') {
      onDataChanged();
    }

    setIsDeleting(false);
  };

  const handleGoToObservation = (id) => {
    setViewObservationId(id);
  };

  const handleBackToDepartments = () => {
    onClose();
  };

  if (viewObservationId !== null) {
    return (
     <Observations
  observationId={viewObservationId}
  departmentName={departmentName}
  auditCycleNo={observations.find(o => o.id === viewObservationId)?.auditCycleNo} // Pass correct cycle
  onBack={() => setViewObservationId(null)}
/>


    );
  }

  return (
    <div className="observation-details-container">
      <div className="detail-header">
        <div className="header-content">
          <div className="title-wrapper">
            <h2 className="department-title">
              <span className="dept-name">{departmentName}</span>
              <span className="observation-count">
                {observations.length} observation{observations.length !== 1 ? 's' : ''}
              </span>
            </h2>
            <p className="department-subtitle">Manage all observations for this department</p>
          </div>
          <div className="action-buttons">
            <button className="icon-button" onClick={handleBackToDepartments} title="Back to Departments">
              <FiArrowLeft size={20} />
            </button>
            {!isAuditee && (
              <button className="icon-button add-buttonss" onClick={handleAddObservation} title="Add Observation">
                <FiPlus size={50} />
              </button>
            )}
          </div>
        </div>
      </div>

      <Card className="observation-list-card">
        <CardContent>

          {/* Audit Cycle Filter */}
          <div className="audit-cycle-filter mb-3">
            <label className="filter-label">Filter by Audit Cycle:</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Enter Audit Cycle No (e.g. I/)"
              value={auditCycleFilter}
              onChange={(e) => setAuditCycleFilter(e.target.value)}
            />
          </div>

          {observations.length > 0 ? (
            <div className="observation-table-container">
              <table className="observation-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Observation</th>
                    <th>Audit Cycle</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {observations
                    .filter(obs =>
                      auditCycleFilter === "" ||
                      (auditCycleData[obs.id] || "").toLowerCase().startsWith(auditCycleFilter.trim().toLowerCase())
                    )
                    .map((obs, index) => (
                      <tr key={obs.id} className="observation-row">
                        <td className="serial-number">{index + 1}</td>
                        <td className="observation-name">Observation {index + 1}</td>
                        <td className="audit-cycle-no">
                          <span className={`cycle-tag ${auditCycleData[obs.id] === "Not set" ? 'not-set' : ''}`}>
                            {obs.auditCycleNo || "Not set"}
                          </span>
                        </td>
                        <td className="action-buttons-cell">
                          <button
                            className="icon-button view-button"
                            onClick={() => handleGoToObservation(obs.id)}
                            title="View Observation"
                          >
                            <FiEye size={18} />
                          </button>
                          {!isAuditee && (
                            <button
                              className="icon-button delete-button"
                              onClick={() => handleDeleteObservation(obs.id)}
                              title="Delete Observation"
                              disabled={isDeleting}
                            >
                              <FiTrash2 size={18} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No Observations Found</h3>
              <p>You haven't added any observations for this department yet.</p>
              {!isAuditee && (
                <button
                  className="icon-button add-buttons"
                  onClick={handleAddObservation}
                  title="Add First Observation"
                >
                  <FiPlus size={20} />
                </button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ObservationDetails;
