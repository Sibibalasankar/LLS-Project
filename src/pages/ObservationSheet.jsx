import React, { useEffect, useState } from "react";
import "../assets/styles/ObservationSheet.css";
import companylogo from "../assets/images/lls_logo.png";

const ObservationSheet = () => {
  const [observations, setObservations] = useState([]);
  const [department, setDepartment] = useState("N/A");
  const [auditCycleNo, setAuditCycleNo] = useState("N/A");
  const [auditDate, setAuditDate] = useState("N/A");
  const [auditorInfo, setAuditorInfo] = useState({ name: "N/A", designation: "N/A" });
  const [auditeeInfo, setAuditeeInfo] = useState({ name: "N/A", designation: "N/A" });

  useEffect(() => {
    const observationId = localStorage.getItem("currentObservationId");
    const allObservations = JSON.parse(localStorage.getItem("auditObservations")) || {};
    const departmentObservations = allObservations[observationId] || [];

    if (departmentObservations.length > 0) {
      setDepartment(departmentObservations[0].department || "N/A");
      setAuditCycleNo(departmentObservations[0].auditCycleNo || "N/A");
      setAuditDate(departmentObservations[0].auditDate || "N/A");
      setAuditorInfo({
        name: departmentObservations[0].auditorSignature || "N/A",
        designation: departmentObservations[0].auditorDesignation || "N/A"
      });
      setAuditeeInfo({
        name: departmentObservations[0].auditeeSignature || "N/A",
        designation: departmentObservations[0].auditeeDesignation || "N/A"
      });
    }

    setObservations(departmentObservations);
  }, []);

  return (
    <table className="observation-table m-2 ">
      <thead>
        {/* Logo and Title Row */}
        <tr className="main_top">
          <td colSpan="6" style={{ border: 'none', padding:10 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ width: '100px', border: 'none', verticalAlign: 'middle' }}>
                    <img src={companylogo} alt="Company Logo" style={{ maxWidth: '100px', maxHeight: '60px' }} />
                  </td>
                  <td style={{ border: 'none', textAlign: 'center', verticalAlign: 'middle' }}>
                    <div className="sub-title">RISK BASED INTERNAL AUDIT OBSERVATION SHEET</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
  
        {/* Department Info Row */}
        <tr>
          <td colSpan="6" style={{ borderLeft: 'none', borderRight: 'none', borderTop: 'none', padding: '5px' }}>
            <table className="header-table">
              <tbody>
                <tr>
                  <td><strong>Dept:</strong> {department}</td>
                  <td><strong>Audit Cycle no.:</strong> {auditCycleNo}</td>
                  <td><strong>Audit Date:</strong> {auditDate}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
  
        {/* Table Headers */}
        <tr>
          <th width="5%">SL no.</th>
          <th width="20%">Process / Activity</th>
          <th width="25%">Potential Uncertainties / Potential Causes Of Uncertainties</th>
          <th width="25%">Findings and Supporting Objective evidence(s)</th>
          <th width="10%">ISO 9001 Clause</th>
          <th width="15%">Result * (0+/ NC / OFI)</th>
        </tr>
      </thead>
  
      <tbody>
        {/* Observation Rows */}
        {observations.length > 0 ? (
          observations.map((observation) => (
            <tr key={observation.id}>
              <td>{observation.slNo || ""}</td>
              <td>{observation.processActivity || ""}</td>
              <td>{observation.potentialCauses || ""}</td>
              <td>{observation.findings || ""}</td>
              <td>{observation.isoClause || ""}</td>
              <td>{Array.isArray(observation.result) ? observation.result.join(", ") : observation.result}</td>
              </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6">No observations to display</td>
          </tr>
        )}
      </tbody>
  
      <tfoot>
        {/* Footer Section */}
        <tr>
          <td colSpan="6" style={{ borderLeft: 'none', borderRight: 'none', borderBottom: 'none', padding: '5px' }}>
            <table className="footer-table">
              <tbody>
                <tr>
                  <td rowSpan="2" className="risk-cell">
                    <strong>Note:</strong>
                    <ul className="risk-list">
                      <li>0+ = Observation Positive (OMS)</li>
                      <li>NC = NON CONFORMITY (OMS not Effective)</li>
                      <li>OFI = Opportunity For Improvement</li>
                    </ul>
                  </td>
                  <td className="signature-label-cell">
                    <div className="signature-label">Signature of the Auditor</div>
                  </td>
                  <td className="signature-value-cell">
                    <div></div>
                  </td>
                  <td className="signature-label-cell">
                    <div className="signature-label">Signature of the Auditee</div>
                  </td>
                  <td className="signature-value-cell">
                    <div></div>
                  </td>
                </tr>
                <tr>
                  <td className="signature-label-cell">
                    <div className="signature-label">Auditor Name & Designation:</div>
                  </td>
                  <td className="signature-value-cell">
                    <div>{auditorInfo.name} & {auditorInfo.designation}</div>
                  </td>
                  <td className="signature-label-cell">
                    <div className="signature-label">Auditee Name / Designation:</div>
                  </td>
                  <td className="signature-value-cell">
                    <div>{auditeeInfo.name} & {auditeeInfo.designation}</div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="footer">
              <p>LLS1/TQM/QA/06/01/00/R04-00-01/08/2023</p>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  );
  
};

export default ObservationSheet;