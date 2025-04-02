import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/card";
import { Button } from "../components/button";
import "../assets/styles/ObservationDetails.css";

const ObservationDetails = ({ departmentName, onClose }) => {
  const storageKey = `observations_${departmentName}`;
  const [observations, setObservations] = useState([]);

  // Load observations from localStorage on component mount
  useEffect(() => {
    const storedObservations = localStorage.getItem(storageKey);
    if (storedObservations) {
      setObservations(JSON.parse(storedObservations));
    }
  }, [departmentName]); // Ensure it updates if the department changes

  // Save observations to localStorage when they change
  useEffect(() => {
    if (observations.length > 0) { // Prevent empty overwrites
      localStorage.setItem(storageKey, JSON.stringify(observations));
    }
  }, [observations]);

  const handleAddObservation = () => {
    const newObservation = {
      id: Date.now(),
      number: observations.length + 1,
    };
    const updatedObservations = [...observations, newObservation];
    setObservations(updatedObservations);
    localStorage.setItem(storageKey, JSON.stringify(updatedObservations)); // Save immediately
  };

  const handleDeleteObservation = (id) => {
    const updatedObservations = observations.filter((obs) => obs.id !== id);
    setObservations(updatedObservations);
    localStorage.setItem(storageKey, JSON.stringify(updatedObservations)); // Save immediately
  };

  return (
    <div className="observation-details">
      <div className="detail-header">
        <h3>Observations for {departmentName}</h3>
        <Button
          variant="outline"
          onClick={onClose}
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
                    <th style={{ width: "40%" }}>Go to Observation</th>
                    <th style={{ width: "20%" }}>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {observations.map((obs, index) => (
                    <tr key={obs.id}>
                      <td>{index + 1}</td>
                      <td>Observation {obs.number}</td>
                      <td>
                        <Button variant="outline" className="observation_btn">
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
        Add Observation
      </Button>
    </div>
  );
};

export default ObservationDetails;
