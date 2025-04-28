import React, { useState, useEffect } from "react";
import "../assets/styles/Observation.css";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import companylogo from "../assets/images/lls_logo.png";

const Observations = ({ observationId: propObservationId, departmentName, onBack }) => {
  const [observations, setObservations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [observationId, setObservationId] = useState(null);
  const [auditorInfo, setAuditorInfo] = useState({ name: "", designation: "" });
  const [auditeeInfo, setAuditeeInfo] = useState({ name: "", designation: "" });

  // Get current and next year for audit cycle format
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const yearFormat = `${currentYear}-${nextYear}`;

  const [currentObservation, setCurrentObservation] = useState({
    id: "",
    slNo: "",
    processActivity: "",
    potentialCauses: "",
    findings: "",
    isoClause: "",
    result: "",
    auditCycleNo: `I/${yearFormat}`,
    auditDate: new Date().toISOString().split("T")[0],
    auditorSignature: "",
    auditorDesignation: "",
    auditeeSignature: "",
    auditeeDesignation: "",
    department: departmentName || ""
  });

  const auditCycleOptions = ["I", "II", "III", "IV", "V"];
  const [actionObservation, setActionObservation] = useState(null);
  const [showActionForm, setShowActionForm] = useState(false);

  const navigate = useNavigate();

  const handleOpenActionForm = (observation) => {
    const url = `/admin-dashboard/action-report?data=${encodeURIComponent(JSON.stringify(observation))}`;
    window.open(url, "_blank");
  };
  const handleCloseActionForm = () => {
    setShowActionForm(false);
    setActionObservation(null);
  };

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
    setCurrentObservation((prev) => ({
      ...prev,
      result: e.target.value
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
      auditCycleNo: `I/${yearFormat}`,
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
          <strong>Audit Cycle no.:</strong> {observations.length > 0 ? currentObservation.auditCycleNo : "-"}
        </div>
        <div className="audit-info-item">
          <strong>Audit Date:</strong> {observations.length > 0 ? currentObservation.auditDate : "-"}
        </div>
      </div>

      <div className="observations-table-container p-3">
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
                  <td className="btns_td">
                    <button className="edit-btn" onClick={() => handleEdit(obs)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(obs.id)}>Delete</button>
                    {obs.result === "NC" && (
                      <button
                        className="action-form-btn"
                        onClick={() => handleOpenActionForm(obs)}
                      >
                        Action
                      </button>
                    )}
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

      {/* Action Form Modal */}
      {showActionForm && actionObservation && (
        <div className="action-form-overlay">
          <div className="action-form-modal">
            <h3>Action Plan for Observation #{actionObservation.slNo}</h3>
            <form>
              <div className="form-group">
                <label>Corrective Action:</label>
                <textarea rows={4} placeholder="Enter corrective action..." />
              </div>
              <div className="form-group">
                <label>Responsible Person:</label>
                <input type="text" placeholder="Enter name..." />
              </div>
              <div className="form-group">
                <label>Target Completion Date:</label>
                <input type="date" />
              </div>

              <div className="form-buttons">
                <button type="submit" className="save-btn">Save Action</button>
                <button type="button" className="cancel-btn" onClick={handleCloseActionForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Observation Form Modal */}
      {showForm && (
        <div className="observation-form-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="observation-form-modal">
            <button 
              className="close-modal-btn" 
              onClick={() => setShowForm(false)}
              aria-label="Close form"
            >
              &times;
            </button>
            <h3>{currentObservation.id ? "Edit Observation" : "Add New Observation"}</h3>
            <form onSubmit={handleSubmit} className="observation-form">
              <div className="form-row">
                <div className="form-group">
                  <label>
                    Audit Cycle No:
                    <select
                      name="auditCycleNo"
                      value={currentObservation.auditCycleNo.split('/')[0]}
                      onChange={(e) => {
                        const cyclePrefix = e.target.value;
                        setCurrentObservation(prev => ({
                          ...prev,
                          auditCycleNo: `${cyclePrefix}/${yearFormat}`
                        }));
                      }}
                      required
                    >
                      {auditCycleOptions.map(option => (
                        <option key={option} value={option}>{option}/{yearFormat}</option>
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
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="result"
                      value="O+"
                      checked={currentObservation.result === "O+"}
                      onChange={handleResultChange}
                    />
                    <span className="radiotext">0+ (Observation Positive)</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="result"
                      value="NC"
                      checked={currentObservation.result === "NC"}
                      onChange={handleResultChange}
                    />
                    <span className="radiotext">NC (Non-Conformity)</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="result"
                      value="OFI"
                      checked={currentObservation.result === "OFI"}
                      onChange={handleResultChange}
                    />
                    <span className="radiotext">OFI (Opportunity For Improvement)</span>
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
          </div>
        </div>
      )}

      <div className="signatures-summary">
        <div className="signature-info">
          <div className="audit-info-item">
            <strong>Auditor:</strong> {auditorInfo.name ? `${auditorInfo.name} (${auditorInfo.designation})` : "-"}
          </div>
          <div className="audit-info-item">
            <strong>Auditee:</strong> {auditeeInfo.name ? `${auditeeInfo.name} (${auditeeInfo.designation})` : "-"}
          </div>
        </div>
      </div>

      <div className="button-group">
        <Button onClick={onBack} className="button back-btn" style={{ width: "200px" }}>
          Back to Dashboard
        </Button>
        <Button onClick={handleCreate} className="button create-btn" style={{ width: "200px" }}>
          {observations.length > 0 ? "Add Observation" : "Create Observation"}
        </Button>
        <Button className="button open-sheet-btn" style={{ width: "200px" }}
          onClick={() => window.open('/audit-report', '_blank')}
        >
          Open Record
        </Button>
      </div>
    </div>
  );
};

export default Observations;