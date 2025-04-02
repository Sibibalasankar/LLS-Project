import { useState } from 'react';
import { Card, CardContent } from "../components/card";
import { Button } from "../components/button";
import "../assets/styles/ObservationDetails.css";

const ObservationDetails = ({ departmentName, onClose }) => {
  const [observations, setObservations] = useState([]);

  const handleAddObservation = () => {
    const newObservation = {
      id: Date.now(),
      number: observations.length + 1,
    };
    setObservations([...observations, newObservation]);
  };

  const handleDeleteObservation = (id) => {
    setObservations(observations.filter(obs => obs.id !== id));
  };

  return (
    <div className="observation-details">
      <div className="detail-header">
        <h3>Observations for {departmentName}</h3>
        <Button variant="outline" onClick={onClose} className="back-btn" style={{ backgroundColor: '#007BFF', color: '#fff' }}>
          Back to Departments
        </Button>
      </div>

      <div className="observation-list-container">
        <Card className="observation-list" style={{ width: '100%' }}>
          <CardContent style={{ padding: 0 }}>
            <div className="observation-table-wrapper" style={{ width: '100%', overflowX: 'auto' }}>
              <table className="observation-table" style={{ width: '100%', tableLayout: 'fixed' }}>
                <thead>
                  <tr>
                    <th style={{ width: '10%' }}>S. No</th>
                    <th style={{ width: '50%' }}>Observation</th>
                    <th style={{ width: '20%' }}>Go to Observation</th>
                    <th style={{ width: '20%' }}>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {observations.map((obs, index) => (
                    <tr key={obs.id}>
                      <td>{index + 1}</td>
                      <td>Observation {obs.number}</td>
                      <td>
                        <Button variant="outline" style={{ backgroundColor: '#28A745', color: '#fff' }}>Go to Observation</Button>
                      </td>
                      <td>
                        <Button variant="destructive" onClick={() => handleDeleteObservation(obs.id)} style={{ backgroundColor: '#DC3545', color: '#fff' }}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {observations.length === 0 && <p className="no-observations-msg">No observations added yet</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={handleAddObservation} className="add-observation-btn" style={{ backgroundColor: '#FFC107', color: '#000' }}>
        Add Observation
      </Button>
    </div>
  );
};

export default ObservationDetails;
