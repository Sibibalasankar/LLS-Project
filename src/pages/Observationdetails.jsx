import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/card";
import { Button } from "../components/button";
import Observations from "./Observations";
import "../assets/styles/ObservationDetails.css";

const ObservationDetails = ({ departmentName, onClose }) => {
  const [observations, setObservations] = useState([]);
  const [viewObservationId, setViewObservationId] = useState(null);

  // Load observations on mount
  useEffect(() => {
    const storedObservations = JSON.parse(localStorage.getItem(`observations_${departmentName}`)) || [];
    setObservations(storedObservations);
  }, [departmentName]);

  const handleAddObservation = () => {
    const stored = JSON.parse(localStorage.getItem(`observations_${departmentName}`)) || [];

    const newObservation = {
      id: Date.now(),
      number: stored.length + 1,
      department: departmentName,
    };

    const updated = [...stored, newObservation];

    // Save to localStorage immediately
    localStorage.setItem(`observations_${departmentName}`, JSON.stringify(updated));

    // Update state
    setObservations(updated);
  };

  const handleDeleteObservation = (id) => {
    const observationToDelete = observations.find(obs => obs.id === id);
    if (!observationToDelete) return;

    if (window.confirm(`Are you sure you want to delete Observation ${observationToDelete.number}?`)) {
      const updatedObservations = observations
        .filter(obs => obs.id !== id)
        .map((obs, index) => ({
          ...obs,
          number: index + 1,
        }));

      // Save to localStorage immediately
      localStorage.setItem(`observations_${departmentName}`, JSON.stringify(updatedObservations));

      setObservations(updatedObservations);
      alert(`Observation ${observationToDelete.number} deleted.`);
    }
  };

  const handleGoToObservation = (id) => {
    const observation = observations.find(obs => obs.id === id);
    if (observation && window.confirm(`Open Observation ${observation.number}?`)) {
      setViewObservationId(id);
    }
  };

  const handleBackToDepartments = () => {
    if (window.confirm("Return to departments list?")) {
      onClose();
    }
  };

  if (viewObservationId !== null) {
    return (
      <Observations 
        observationId={viewObservationId} 
        departmentName={departmentName}  // Add this line
        onBack={() => setViewObservationId(null)} 
      />
    );
  }

  return (
    <div className="observation-details">
      <div className="detail-header">
        <h3>Observations for {departmentName}</h3>
        <Button
          variant="outline"
          onClick={handleBackToDepartments}
          className="back-btn"
          style={{ backgroundColor: "#007BFF", color: "#fff" }}
        >
          Back to Departments
        </Button>
      </div>

      <div className="observation-list-container">
        <Card className="observation-list" style={{ width: "100%" }}>
          <CardContent style={{ padding: 0 }}>
            <div className="observation-table-wrapper" style={{ width: "100%", overflowX: "auto" }}>
              <table className="observation-table" style={{ width: "100%", tableLayout: "fixed" }}>
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>S. No</th>
                    <th style={{ width: "30%" }}>Observation</th>
                    <th style={{ width: "40%" }}>Actions</th>
                    <th style={{ width: "20%" }}>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {observations.map((obs, index) => (
                    <tr key={obs.id}>
                      <td>{index + 1}</td>
                      <td>Observation {obs.number}</td>
                      <td>
                        <Button
                          variant="outline"
                          className="observation_btn"
                          onClick={() => handleGoToObservation(obs.id)}
                          style={{ backgroundColor: "#28A745", color: "#fff" }}
                        >
                          Go to Observation
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteObservation(obs.id)}
                          className="delete-btn"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {observations.length === 0 && (
                <p className="no-observations-msg">No observations added yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Button
        onClick={handleAddObservation}
        className="add-observation-btn mt-4"
        style={{ backgroundColor: "#FFC107", color: "#000" }}
      >
        Add
      </Button>
    </div>
  );
};

export default ObservationDetails;
