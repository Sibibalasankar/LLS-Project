import React, { useState, useEffect } from "react";
import "../assets/styles/Observation.css";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import companylogo from "../assets/images/lls_logo.png";

const UserObservations = ({ observationId: propObservationId, departmentName, onBack }) => {
  const [observations, setObservations] = useState([]);
  const [observationId, setObservationId] = useState(null);
  const [auditorInfo, setAuditorInfo] = useState({ name: "", designation: "" });
  const [auditeeInfo, setAuditeeInfo] = useState({ name: "", designation: "" });

  const navigate = useNavigate();

  const handleOpenRecord = () => {
    if (observationId) {
      const url = `/audit-report?observationId=${observationId}`;
      window.open(url, "_blank");
    } else {
      alert("No audit record found to open");
    }
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

  return (
    <div className="observations-container">
      <div className="header-with-logo">
        <img src={companylogo} alt="Company Logo" className="company-logo" />
        <h2 className="page-title">RISK BASED INTERNAL AUDIT OBSERVATION SHEET</h2>
      </div>

      {/* Header information row */}
      <div className="audit-info-row">
        <div className="audit-info-item">
          <strong>Dept.:</strong> {observations.length > 0 ? observations[0].department : departmentName || "-"}
        </div>
        <div className="audit-info-item">
          <strong>Audit Cycle no.:</strong> {observations.length > 0 ? observations[0].auditCycleNo : "-"}
        </div>
        <div className="audit-info-item">
          <strong>Audit Date:</strong> {observations.length > 0 ? observations[0].auditDate : "-"}
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
                  <td>{Array.isArray(obs.result) ? obs.result.join(", ") : obs.result}</td>
                </tr>
              ))
            ) : (
              <tr className="empty-table-message">
                <td colSpan="6">No observations found for this audit.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
        <Button onClick={onBack} className="button back-btn">Back </Button>
        <Button
          onClick={handleOpenRecord}
          className="open-sheet-btn"
        >
          Open Record
        </Button>
      </div>
    </div>
  );
};

export default UserObservations;