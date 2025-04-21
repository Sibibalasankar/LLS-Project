import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "../components/card";
import Observations from "./Observations";

const ObservationDetails = ({ departmentName, onClose, onObservationUpdate }) => {
  const [observations, setObservations] = useState([]);
  const [viewObservationId, setViewObservationId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  const fetchObservations = useCallback(() => {
    setIsLoading(true);
    const storedObservations = JSON.parse(localStorage.getItem(`observations_${departmentName}`)) || [];
    setObservations(storedObservations);
    setIsLoading(false);
  }, [departmentName]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
    fetchObservations();
  }, [departmentName, fetchObservations]);

  const handleAddObservation = () => {
    const stored = JSON.parse(localStorage.getItem(`observations_${departmentName}`)) || [];
    const newObservation = {
      id: Date.now(),
      number: stored.length + 1,
      department: departmentName,
      createdAt: new Date().toISOString()
    };

    const updated = [...stored, newObservation];
    localStorage.setItem(`observations_${departmentName}`, JSON.stringify(updated));
    setObservations(updated);
    onObservationUpdate(departmentName, updated.length);
  };

  const handleDeleteObservation = (id) => {
    if (!window.confirm("Are you sure you want to delete this observation? This action cannot be undone.")) {
      return;
    }

    const updatedObservations = observations
      .filter(obs => obs.id !== id)
      .map((obs, index) => ({
        ...obs,
        number: index + 1,
      }));

    localStorage.setItem(`observations_${departmentName}`, JSON.stringify(updatedObservations));
    setObservations(updatedObservations);
    onObservationUpdate(departmentName, updatedObservations.length);
  };

  const handleGoToObservation = (id) => {
    setViewObservationId(id);
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
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <h2 className="mb-3 mb-md-0 text-primary">{departmentName} Observations</h2>
        <div className="d-flex gap-2">
          <button
            onClick={onClose}
            className="btn btn-outline-secondary"
          >
            <i className="bi bi-arrow-left me-1"></i> Back to Departments
          </button>
          {userRole === "admin" && (
            <button
              onClick={handleAddObservation}
              className="btn btn-success"
            >
              <i className="bi bi-plus-lg me-1"></i> Add New
            </button>
          )}
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent>
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading observations...</p>
            </div>
          ) : observations.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-binoculars fs-1 text-muted"></i>
              <p className="text-muted mt-3">No observations found for this department</p>
              {userRole === "admin" && (
                <button
                  onClick={handleAddObservation}
                  className="btn btn-primary mt-2"
                >
                  Create First Observation
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th scope="col" style={{ width: '10%' }}>#</th>
                    <th scope="col" style={{ width: '30%' }}>Observation</th>
                    <th scope="col" style={{ width: '20%' }}>Created</th>
                    <th scope="col" style={{ width: '40%' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {observations.map((obs, index) => (
                    <tr key={obs.id}>
                      <th scope="row">{index + 1}</th>
                      <td>Observation {obs.number}</td>
                      <td>{new Date(obs.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => handleGoToObservation(obs.id)}
                            className="btn btn-primary btn-sm"
                          >
                            <i className="bi bi-eye me-1"></i> View
                          </button>
                          {userRole === "admin" && (
                            <button
                              onClick={() => handleDeleteObservation(obs.id)}
                              className="btn btn-danger btn-sm"
                            >
                              <i className="bi bi-trash me-1"></i> Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ObservationDetails;
