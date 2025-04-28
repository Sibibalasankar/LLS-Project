import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/card";
import { Button } from "../components/button";
import Observations from "./Observations";
import { FiEye, FiTrash2, FiPlus, FiArrowLeft } from "react-icons/fi";
import "../assets/styles/ObservationDetails.css";

const ObservationDetails = ({ departmentName, onClose, onObservationUpdate }) => {
  const [observations, setObservations] = useState([]);
  const [viewObservationId, setViewObservationId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [auditCycleData, setAuditCycleData] = useState({});

  useEffect(() => {
    const storedObservations = JSON.parse(localStorage.getItem(`observations_${departmentName}`)) || [];
    setObservations(storedObservations);

    // Load audit cycle data from all observations
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

  const handleAddObservation = () => {
    const stored = JSON.parse(localStorage.getItem(`observations_${departmentName}`)) || [];

    const newObservation = {
      id: Date.now(),
      number: stored.length + 1,
      department: departmentName,
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
            <Button
              variant="outline"
              onClick={handleBackToDepartments}
              className="back-btn"
              icon={<FiArrowLeft size={16} />}
            >
              Departments
            </Button>
            <Button
              onClick={handleAddObservation}
              className="submit-btn primary"
              icon={<FiPlus size={16} />}
            >
              Add Observation
            </Button>
          </div>
        </div>
      </div>

      <Card className="observation-list-card">
        <CardContent>
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
                  {observations.map((obs, index) => (
                    <tr key={obs.id} className="observation-row">
                      <td className="serial-number">{index + 1}</td>
                      <td className="observation-name">Observation {index + 1}</td>
                      <td className="audit-cycle-no">
                        <span className={`cycle-tag ${auditCycleData[obs.id] === "Not set" ? 'not-set' : ''}`}>
                          {auditCycleData[obs.id] || "Not set"}
                        </span>
                      </td>
                      <td className="action-buttons-cell">
                        <Button
                          variant="primary"
                          onClick={() => handleGoToObservation(obs.id)}
                          className="view-btn"
                          icon={<FiEye size={16} />}
                        >
                          View
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteObservation(obs.id)}
                          className="delete-btn"
                          icon={<FiTrash2 size={16} />}
                          loading={isDeleting}
                        >
                          Delete
                        </Button>
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
              <Button
                onClick={handleAddObservation}
                className="submit-btn primary"
                icon={<FiPlus size={16} />}
              >
                Add First Observation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ObservationDetails;  