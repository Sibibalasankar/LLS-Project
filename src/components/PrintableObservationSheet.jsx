// PrintableObservationSheet.js
import React from "react";
import companylogo from "../assets/images/lls_logo.png";

const PrintableObservationSheet = ({ observations, departmentName }) => {
  if (!observations || observations.length === 0) {
    return <div>No observations to display</div>;
  }

  // Get common information from the first observation
  const firstObservation = observations[0];

  return (
    <div className="printable-sheet" style={{ padding: "20px", fontFamily: "Arial" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <img src={companylogo} alt="Company Logo" style={{ height: "80px", marginRight: "20px" }} />
        <h1 style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold" }}>
          RISK BASED INTERNAL AUDIT OBSERVATION SHEET
        </h1>
      </div>

      {/* Header information */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <div><strong>Dept.:</strong> {firstObservation.department}</div>
        <div><strong>Audit Cycle no.:</strong> {firstObservation.auditCycleNo}</div>
        <div><strong>Audit Date:</strong> {firstObservation.auditDate}</div>
      </div>

      {/* Auditor/Auditee information */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <strong>Auditor:</strong> {firstObservation.auditorSignature}<br />
          <strong>Designation:</strong> {firstObservation.auditorDesignation}
        </div>
        <div>
          <strong>Auditee:</strong> {firstObservation.auditeeSignature}<br />
          <strong>Designation:</strong> {firstObservation.auditeeDesignation}
        </div>
      </div>

      {/* Observations table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Sl.no.</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Process / Activity</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Potential Uncertainties / Potential Causes</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Findings and Supporting Evidence</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>ISO 9001 Clause</th>
            <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Result</th>
          </tr>
        </thead>
        <tbody>
          {observations.map((obs) => (
            <tr key={obs.id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{obs.slNo}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{obs.processActivity}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{obs.potentialCauses}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{obs.findings}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{obs.isoClause}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{obs.result}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer with signatures */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "50px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ borderTop: "1px solid #000", width: "200px", marginBottom: "5px" }}></div>
          <strong>Auditor Signature</strong>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ borderTop: "1px solid #000", width: "200px", marginBottom: "5px" }}></div>
          <strong>Auditee Signature</strong>
        </div>
      </div>
    </div>
  );
};

export default PrintableObservationSheet;