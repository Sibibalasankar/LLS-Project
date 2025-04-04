import React, { useState, useEffect } from "react";
import "../assets/styles/Observation.css";
import ReactDOM from "react-dom";
import { Button } from "../components/button";
import companylogo from "../assets/images/lls_logo.png";

const Observations = ({ observationId: propObservationId, departmentName, onBack }) => {
  const [observations, setObservations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [observationId, setObservationId] = useState(null);
  const [auditorInfo, setAuditorInfo] = useState({ name: "", designation: "" });
  const [auditeeInfo, setAuditeeInfo] = useState({ name: "", designation: "" });
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
    department: departmentName || ""
  });

  const auditCycleOptions = ["I", "II", "III", "IV", "V"];

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
      const obs = storedObservations[observationId] || [];
      setObservations(obs);

      // If there are existing observations, set the auditor and auditee info from the first one
      if (obs.length > 0) {
        setAuditorInfo({
          name: obs[0].auditorSignature,
          designation: obs[0].auditorDesignation
        });
        setAuditeeInfo({
          name: obs[0].auditeeSignature,
          designation: obs[0].auditeeDesignation
        });
      }
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
    const newObservation = {
      id: "",
      slNo: getNextSlNo(),
      processActivity: "",
      potentialCauses: "",
      findings: "",
      isoClause: "",
      result: "",
      auditCycleNo: "I",
      auditDate: new Date().toISOString().split("T")[0],
      auditorSignature: auditorInfo.name || "",
      auditorDesignation: auditorInfo.designation || "",
      auditeeSignature: auditeeInfo.name || "",
      auditeeDesignation: auditeeInfo.designation || "",
      department: departmentName || "",
    };

    setCurrentObservation(newObservation);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Update auditor and auditee info if this is the first observation
    if (observations.length === 0) {
      setAuditorInfo({
        name: currentObservation.auditorSignature,
        designation: currentObservation.auditorDesignation
      });
      setAuditeeInfo({
        name: currentObservation.auditeeSignature,
        designation: currentObservation.auditeeDesignation
      });
    }

    // For subsequent observations, use the stored auditor and auditee info
    const observationToSave = currentObservation.id
      ? currentObservation
      : {
        ...currentObservation,
        id: generateId(),
        slNo: currentObservation.slNo || getNextSlNo(),
        auditorSignature: observations.length > 0 ? auditorInfo.name : currentObservation.auditorSignature,
        auditorDesignation: observations.length > 0 ? auditorInfo.designation : currentObservation.auditorDesignation,
        auditeeSignature: observations.length > 0 ? auditeeInfo.name : currentObservation.auditeeSignature,
        auditeeDesignation: observations.length > 0 ? auditeeInfo.designation : currentObservation.auditeeDesignation,
      };

    const updatedObservations = currentObservation.id
      ? observations.map((obs) => (obs.id === currentObservation.id ? observationToSave : obs))
      : [...observations, observationToSave];

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
  // Add this function to your Observations component



  return (
    <div className="observations-container">
      <div className="header-with-logo">
        <img src={companylogo} alt="Company Logo" className="company-logo" />
        <h2 className="page-title">RISK BASED INTERNAL AUDIT OBSERVATION SHEET</h2>
      </div>

      {/* Header information row */}
      <div className="audit-info-row">
        <div className="audit-info-item">
          <strong>Dept.:</strong> {currentObservation.department}
        </div>
        <div className="audit-info-item">
          <strong>Audit Cycle no.:</strong> {currentObservation.auditCycleNo}
        </div>
        <div className="audit-info-item">
          <strong>Audit Date:</strong> {currentObservation.auditDate}
        </div>
      </div>

      <div className="observations-table-container">
        <table className="observations-table">
          <thead>
            <tr>
              <th>Sl.no.</th>
              <th>Process / Activity</th>
              <th>Potential Uncertainties / Potential Causes of Uncertainties</th>
              <th>Findings and Supporting Objective evidence(s)</th>
              <th>ISO 9001 Clause</th>
              <th>Result * (0+/ NC / OFI)</th>
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
                Audit Cycle No:
                <select
                  name="auditCycleNo"
                  value={currentObservation.auditCycleNo}
                  onChange={handleInputChange}
                  required
                >
                  {auditCycleOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>
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
                <input
                  type="text"
                  name="isoClause"
                  value={currentObservation.isoClause}
                  onChange={handleInputChange}
                  placeholder="Enter ISO 9001 Clause"
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

          {/* Only show auditor/auditee fields if this is the first observation */}
          {observations.length === 0 && (
            <div className="form-row">
              <div className="form-group">
                <label>
                  Auditor Name:
                  <input
                    type="text"
                    name="auditorSignature"
                    value={currentObservation.auditorSignature}
                    onChange={handleInputChange}
                    required={observations.length === 0}
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
                    required={observations.length === 0}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>
                  Auditee Name:
                  <input
                    type="text"
                    name="auditeeSignature"
                    value={currentObservation.auditeeSignature}
                    onChange={handleInputChange}
                    required={observations.length === 0}
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
                    required={observations.length === 0}
                  />
                </label>
              </div>
            </div>
          )}

          <div className="form-buttons">
            <button type="submit" className="save-btn">Save Observation</button>
            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}
      <div className="signatures-summary">
        <div className="signature-info">
          <div>
            <strong>Auditor:</strong> {auditorInfo.name} ({auditorInfo.designation})
          </div>
          <div>
            <strong>Auditee:</strong> {auditeeInfo.name} ({auditeeInfo.designation})
          </div>
        </div>
      </div>


      <div className="button-group">
        <Button onClick={onBack} className="button back-btn">Back to Dashboard</Button>
        <Button onClick={handleCreate} className="button create-btn">
          {observations.length > 0 ? "Add Observation" : "Create Observation"}
        </Button>
        <Button
          className="open-sheet-btn"
          onClick={() => window.open('/audit-report', '_blank')}
        >
          Open Record
        </Button>

      </div>

    </div>
  );
};

export default Observations;