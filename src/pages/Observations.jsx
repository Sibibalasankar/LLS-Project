import React, { useState, useEffect } from "react";
import "../assets/styles/Observation.css";
import { Button } from "../components/button";
import companylogo from "../assets/images/lls_logo.png";

const Observations = ({ observationId, onBack }) => {
  const [observations, setObservations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentObservation, setCurrentObservation] = useState({
    id: "",
    slNo: "",
    processActivity: "",
    potentialCauses: "",
    findings: "",
    isoClause: "",
    result: "",
    auditCycleNo: "I",
    auditDate: new Date().toISOString().split("T")[0],
    auditorSignature: "",
    auditorDesignation: "",
    auditeeSignature: "",
    auditeeDesignation: "",
    department: "Quality Management System",
  });

  // Load observations for the current observationId
  useEffect(() => {
    if (observationId) {
      const storedObservations = JSON.parse(localStorage.getItem("auditObservations")) || {};
      setObservations(storedObservations[observationId] || []);
    }
  }, [observationId]);

  // Update storage only when observations change
  useEffect(() => {
    if (observationId && observations.length > 0) {
      const allObservations = JSON.parse(localStorage.getItem("auditObservations")) || {};
      allObservations[observationId] = observations;
      localStorage.setItem("auditObservations", JSON.stringify(allObservations));
    }
  }, [observations, observationId]);

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentObservation((prev) => ({ ...prev, [name]: value }));
  };

  const getNextSlNo = () => (observations.length === 0 ? 1 : Math.max(...observations.map((o) => Number(o.slNo) || 0)) + 1);

  const handleCreate = () => {
    setCurrentObservation({
      id: "",
      slNo: getNextSlNo(),
      processActivity: "",
      potentialCauses: "",
      findings: "",
      isoClause: "",
      result: "",
      auditCycleNo: "I",
      auditDate: new Date().toISOString().split("T")[0],
      auditorSignature: "",
      auditorDesignation: "",
      auditeeSignature: "",
      auditeeDesignation: "",
      department: "Quality Management System",
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedObservations = currentObservation.id
      ? observations.map((obs) => (obs.id === currentObservation.id ? currentObservation : obs))
      : [...observations, { ...currentObservation, id: generateId(), slNo: currentObservation.slNo || getNextSlNo() }];

    setObservations(updatedObservations);
    setShowForm(false);
  };

  const handleEdit = (observation) => {
    setCurrentObservation(observation);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this observation?")) {
      setObservations(observations.filter((obs) => obs.id !== id));
    }
  };

  return (
    <div className="observations-container">
      <div className="header-with-logo">
        <img src={companylogo} alt="Company Logo" className="company-logo" />
        <h2 className="page-title">RISK BASED INTERNAL AUDIT OBSERVATION SHEET</h2>
      </div>

      <div className="observations-table-container">
        <table className="observations-table">
          <thead>
            <tr>
              <th>SL no.</th>
              <th>Process / Activity</th>
              <th>Potential Uncertainties / Causes</th>
              <th>Findings</th>
              <th>ISO 9001 Clause</th>
              <th>Result</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {observations.length > 0 ? (
              observations.map((obs) => (
                <tr key={obs.id}>
                  <td>{obs.slNo}</td>
                  <td>{obs.processActivity}</td>
                  <td>{obs.potentialCauses}</td>
                  <td>{obs.findings}</td>
                  <td>{obs.isoClause}</td>
                  <td>{obs.result}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(obs)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(obs.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="empty-table-message">
                <td colSpan="7">No observations found for this audit. Create a new one.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="observation-form">
          <label>
            Process / Activity:
            <input type="text" name="processActivity" value={currentObservation.processActivity} onChange={handleInputChange} required />
          </label>
          <label>
            Potential Uncertainties / Causes:
            <input type="text" name="potentialCauses" value={currentObservation.potentialCauses} onChange={handleInputChange} required />
          </label>
          <label>
            Findings:
            <input type="text" name="findings" value={currentObservation.findings} onChange={handleInputChange} required />
          </label>
          <label>
            ISO 9001 Clause:
            <input type="text" name="isoClause" value={currentObservation.isoClause} onChange={handleInputChange} />
          </label>
          <label>
            Result:
            <input type="text" name="result" value={currentObservation.result} onChange={handleInputChange} required />
          </label>
          <div className="form-buttons">
            <button type="submit" className="save-btn">Save Observation</button>
            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="button-group">
        <Button onClick={onBack} className="button back-btn">Back to Dashboard</Button>
        <Button onClick={handleCreate} className="button create-btn">
          {observations.length > 0 ? "Add Observation" : "Create Observation"}
        </Button>
      </div>
    </div>
  );
};

export default Observations;
