import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/card";
import { Button } from "../components/button";
import UserObservations from "./UserObservations ";
import { FiEye, FiArrowLeft } from "react-icons/fi"; // Only Eye and Back icon needed
import "../assets/styles/ObservationDetails.css";


const ObservationDetails = ({ departmentName, onClose }) => {
  const [observations, setObservations] = useState([]);
  const [viewObservationId, setViewObservationId] = useState(null);

  useEffect(() => {
    const storedObservations = JSON.parse(localStorage.getItem(`observations_${departmentName}`)) || [];
    setObservations(storedObservations);
  }, [departmentName]);

  const handleGoToObservation = (id) => {
    setViewObservationId(id);
  };

  const handleBackToDepartments = () => {
    onClose();
  };

  if (viewObservationId !== null) {
    return (
      <UserObservations 
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
          <h2 className="department-title">
            <span className="dept-name">{departmentName}</span>
            <span className="observation-count">
              {observations.length} observation{observations.length !== 1 ? 's' : ''}
            </span>
          </h2>
          <div className="action-buttons">
            <Button
              variant="outline"
              onClick={handleBackToDepartments}
              className="back-btn"
              icon={<FiArrowLeft size={16} />}
            >
              Back to Departments
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {observations.map((obs, index) => (
                    <tr key={obs.id}>
                      <td className="serial-number">{index + 1}</td>
                      <td className="observation-name">Observation {obs.number}</td>
                      <td className="action-buttons-cell">
                        <Button
                          variant="primary"
                          onClick={() => handleGoToObservation(obs.id)}
                          className="view-btn"
                          icon={<FiEye size={16} />}
                        >
                          View
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
              <p>There are currently no observations available for this department.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ObservationDetails;
