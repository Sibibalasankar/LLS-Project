import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "../components/card";
import { Button } from "../components/button";

const ObservationDetails = () => {
  const { departmentName } = useParams();
  const navigate = useNavigate();
  const [observations, setObservations] = useState([]);
  const [newObservation, setNewObservation] = useState({
    title: '',
    description: '',
    severity: 'medium'
  });

  useEffect(() => {
    const storedObservations = JSON.parse(localStorage.getItem('observations')) || [];
    setObservations(storedObservations.filter(obs => obs.department === departmentName));
  }, [departmentName]);

  const handleAddObservation = (e) => {
    e.preventDefault();
    const observationToAdd = {
      ...newObservation,
      department: departmentName,
      date: new Date().toISOString(),
      id: Date.now()
    };

    const updatedObservations = [...observations, observationToAdd];
    setObservations(updatedObservations);
    localStorage.setItem('observations', JSON.stringify(updatedObservations));
    setNewObservation({ title: '', description: '', severity: 'medium' });
  };

  return (
    <div className="observation-detail-view">
      <div className="detail-header">
        <h3>Observations for {departmentName}</h3>
        <Button 
          variant="outline" 
          onClick={() => navigate('/audit-observation')}
          className="back-btn"
        >
          Back to Departments
        </Button>
      </div>

      <div className="observation-list">
        <h4>Existing Observations</h4>
        {observations.length > 0 ? (
          observations.map((obs) => (
            <Card key={obs.id} className="observation-item">
              <CardContent>
                <div className="observation-header">
                  <div>
                    <strong>{obs.title}</strong>
                    <span className={`severity-badge ${obs.severity}`}>
                      {obs.severity}
                    </span>
                  </div>
                  <small>{new Date(obs.date).toLocaleDateString()}</small>
                </div>
                <p className="observation-desc">{obs.description}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="no-observations-msg">No observations recorded yet</p>
        )}
      </div>

      <Card className="add-observation-form">
        <CardContent>
          <h4>Add New Observation</h4>
          <form onSubmit={handleAddObservation}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={newObservation.title}
                onChange={(e) => 
                  setNewObservation({...newObservation, title: e.target.value})
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newObservation.description}
                onChange={(e) => 
                  setNewObservation({...newObservation, description: e.target.value})
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Severity</label>
              <select
                value={newObservation.severity}
                onChange={(e) =>
                  setNewObservation({...newObservation, severity: e.target.value})
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <Button type="submit" className="submit-btn">
              Save Observation
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ObservationDetails;