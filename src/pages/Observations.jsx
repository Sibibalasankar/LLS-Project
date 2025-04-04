import React, { useState, useEffect } from "react";
import "../assets/styles/Observation.css";
import { Button } from "../components/button";
import companylogo from "../assets/images/lls_logo.png";

const Observations = ({ observationId: propObservationId, onBack }) => {
  const [observations, setObservations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [observationId, setObservationId] = useState(null);
  const [currentObservation, setCurrentObservation] = useState({
    id: "",
    slNo: "",
    processActivity: "",
    potentialCauses: "",
    findings: "",
    isoClause: "",
    result: "",
    riskLevel: "Medium",
    auditCycleNo: "I",
    auditDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    correctiveAction: "",
    status: "Open",
    auditorSignature: "",
    auditorDesignation: "",
    auditeeSignature: "",
    auditeeDesignation: "",
    department: "Quality Management System",
  });

  // ISO clauses options
  const isoClauses = [
    "4.1", "4.2", "4.3", "4.4", 
    "5.1", "5.2", "5.3", 
    "6.1", "6.2", 
    "7.1", "7.2", "7.3", "7.4", "7.5",
    "8.1", "8.2", "8.3", "8.4", "8.5", "8.6", "8.7",
    "9.1", "9.2", "9.3",
    "10.1", "10.2"
  ];

  // Initialize observationId from props or localStorage
  useEffect(() => {
    if (propObservationId) {
      localStorage.setItem("currentObservationId", propObservationId);
      setObservationId(propObservationId);
    } else {
      const storedId = localStorage.getItem("currentObservationId");
      if (storedId) {
        setObservationId(storedId);
      }
    }
  }, [propObservationId]);

  // Load observations from localStorage when observationId is set
  useEffect(() => {
    if (observationId) {
      const storedObservations = JSON.parse(localStorage.getItem("auditObservations")) || {};
      setObservations(storedObservations[observationId] || []);
    }
  }, [observationId]);

  // Save observations to localStorage whenever they change
  useEffect(() => {
    if (observationId) {
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

  const handleResultChange = (e) => {
    const { value, checked } = e.target;
    setCurrentObservation(prev => ({
      ...prev,
      result: checked ? value : ""
    }));
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
      riskLevel: "Medium",
      auditCycleNo: "I",
      auditDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      correctiveAction: "",
      status: "Open",
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
          <div className="form-row">
            <div className="form-group">
              <label>
                SL No:
                <input 
                  type="number" 
                  name="slNo" 
                  value={currentObservation.slNo} 
                  onChange={handleInputChange} 
                  required 
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Department:
                <input 
                  type="text" 
                  name="department" 
                  value={currentObservation.department} 
                  onChange={handleInputChange} 
                  readOnly
                />
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>
              Process / Activity:
              <textarea 
                name="processActivity" 
                value={currentObservation.processActivity} 
                onChange={handleInputChange} 
                required 
                rows={3}
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Potential Uncertainties / Causes:
              <textarea 
                name="potentialCauses" 
                value={currentObservation.potentialCauses} 
                onChange={handleInputChange} 
                 
                rows={3}
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Findings:
              <textarea 
                name="findings" 
                value={currentObservation.findings} 
                onChange={handleInputChange} 
                required 
                rows={4}
              />
            </label>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                ISO 9001 Clause:
                <select 
                  name="isoClause" 
                  value={currentObservation.isoClause} 
                  onChange={handleInputChange}
                >
                  <option value="">Select Clause</option>
                  {isoClauses.map(clause => (
                    <option key={clause} value={clause}>{clause}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-group">
              <label>
                Audit Cycle No:
                <input 
                  type="text" 
                  name="auditCycleNo" 
                  value={currentObservation.auditCycleNo} 
                  onChange={handleInputChange} 
                  required 
                />
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Result:</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="result"
                  value="0+"
                  checked={currentObservation.result === "0+"}
                  onChange={handleResultChange}
                />
                <span>0+ (Observation Positive)</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="result"
                  value="NC"
                  checked={currentObservation.result === "NC"}
                  onChange={handleResultChange}
                />
                <span>NC (Non-Conformity)</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="result"
                  value="OFI"
                  checked={currentObservation.result === "OFI"}
                  onChange={handleResultChange}
                />
                <span>OFI (Opportunity For Improvement)</span>
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Audit Date:
                <input 
                  type="date" 
                  name="auditDate" 
                  value={currentObservation.auditDate} 
                  onChange={handleInputChange} 
                  required 
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Due Date:
                <input 
                  type="date" 
                  name="dueDate" 
                  value={currentObservation.dueDate} 
                  onChange={handleInputChange} 
                />
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>
              Corrective Action:
              <textarea 
                name="correctiveAction" 
                value={currentObservation.correctiveAction} 
                onChange={handleInputChange} 
                rows={3}
              />
            </label>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Auditor Signature:
                <input 
                  type="text" 
                  name="auditorSignature" 
                  value={currentObservation.auditorSignature} 
                  onChange={handleInputChange} 
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Auditor Designation:
                <input 
                  type="text" 
                  name="auditorDesignation" 
                  value={currentObservation.auditorDesignation} 
                  onChange={handleInputChange} 
                />
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Auditee Signature:
                <input 
                  type="text" 
                  name="auditeeSignature" 
                  value={currentObservation.auditeeSignature} 
                  onChange={handleInputChange} 
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Auditee Designation:
                <input 
                  type="text" 
                  name="auditeeDesignation" 
                  value={currentObservation.auditeeDesignation} 
                  onChange={handleInputChange} 
                />
              </label>
            </div>
          </div>

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