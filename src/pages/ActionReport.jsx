import React, { useState, useEffect, useReducer } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import companyLogo from "../assets/images/lls_logo.png";
import "../assets/styles/ActionReport.css";
import 'bootstrap/dist/css/bootstrap.min.css';


// Constants for initial state and action types
const INITIAL_FORM_DATA = {
  auditCycleNo: "",
  dptname: "",
  ncsNumber: "",
  auditDate: new Date().toISOString().split('T')[0],
  process: "",
  auditor: "",
  auditee: "",
  requirement: "",
  nonConformityStatement: "",
  objectiveEvidence: "",
  isoClass: "",
  potentialRisk: "",
  connection: "",
  activities: [{ slNo: "", activity: "", target: "", status: "" }],
  auditorSignature: "",
  auditeeSignature: "",
  rootCauses: ["", "", "", "", ""],
  correctiveActions: [{
    slNo: "",
    activity: "",
    responsible: "",
    changes: "",
    target: "",
    status: ""
  }],
  followUpObservation: "",
  followUpEvidence: "",
  closingStatus: "",
  verifiedBy: "QMS Coordinator",
  approvedBy: "Head-QA"
};

const ACTION_TYPES = {
  UPDATE_FIELD: 'UPDATE_FIELD',
  UPDATE_ROOT_CAUSE: 'UPDATE_ROOT_CAUSE',
  UPDATE_ACTIVITY: 'UPDATE_ACTIVITY',
  UPDATE_CORRECTIVE_ACTION: 'UPDATE_CORRECTIVE_ACTION',
  ADD_ACTIVITY_ROW: 'ADD_ACTIVITY_ROW',
  ADD_CORRECTIVE_ACTION_ROW: 'ADD_CORRECTIVE_ACTION_ROW',
  RESET_FORM: 'RESET_FORM',
  LOAD_FORM: 'LOAD_FORM'
};

// Reducer for form state management
const formReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_FIELD:
      return { ...state, [action.field]: action.value };

    case ACTION_TYPES.UPDATE_ROOT_CAUSE:
      const newRootCauses = [...state.rootCauses];
      newRootCauses[action.index] = action.value;
      return { ...state, rootCauses: newRootCauses };

    case ACTION_TYPES.UPDATE_ACTIVITY:
      const newActivities = [...state.activities];
      newActivities[action.index][action.field] = action.value;
      return { ...state, activities: newActivities };

    case ACTION_TYPES.UPDATE_CORRECTIVE_ACTION:
      const newCorrectiveActions = [...state.correctiveActions];
      newCorrectiveActions[action.index][action.field] = action.value;
      return { ...state, correctiveActions: newCorrectiveActions };

    case ACTION_TYPES.ADD_ACTIVITY_ROW:
      return {
        ...state,
        activities: [
          ...state.activities,
          { slNo: "", activity: "", target: "", status: "" }
        ]
      };

    case ACTION_TYPES.ADD_CORRECTIVE_ACTION_ROW:
      return {
        ...state,
        correctiveActions: [
          ...state.correctiveActions,
          { slNo: "", activity: "", responsible: "", changes: "", target: "", status: "" }
        ]
      };

    case ACTION_TYPES.RESET_FORM:
      return { ...INITIAL_FORM_DATA, auditDate: new Date().toISOString().split('T')[0] };

    case ACTION_TYPES.LOAD_FORM:
      return { ...action.payload };

    default:
      return state;
  }
};

// Custom hook for localStorage persistence
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  };

  return [storedValue, setValue];
};

// Sub-components for better organization
const NonConformityFormSection = ({ formData, dispatch }) => {
  const handleChange = (e) => {
    dispatch({
      type: ACTION_TYPES.UPDATE_FIELD,
      field: e.target.name,
      value: e.target.value
    });
  };

  const handleActivityChange = (index, field, value) => {
    dispatch({
      type: ACTION_TYPES.UPDATE_ACTIVITY,
      index,
      field,
      value
    });
  };

  const addActivityRow = () => {
    dispatch({ type: ACTION_TYPES.ADD_ACTIVITY_ROW });
  };
  const validateAuditCycleNo = (value) => {
    const pattern = /^(I|II|III|IV)\/\d{4}-(\d{2}|\d{4})$/;
    return pattern.test(value);
  };
  const [filters, setFilters] = useState({
    dptname: "",
    auditCycleNo: "",
    savedDate: ""
  });

  const [departments, setDepartments] = useState([]);

  // Load departments from localStorage on component mount
  useEffect(() => {
    const storedDepartments = JSON.parse(localStorage.getItem("departments") || "[]");
    setDepartments(storedDepartments);
  }, []);

  return (
    <div className="audit-form-container">
      <div className="form-section document-format">
        <div className="form-header">
          <h1 className="document-title">Internal Audit Non-Conformity and Corrective Action Report</h1>
        </div>

        <div className="document-card">
          <table className="document-header-table">
            <tbody>
              <tr>
                <td colSpan={3}>
                  <label>AUDIT CYCLE NO.</label>
                  <div className="form-field">
                    <input
                      type="text"
                      name="auditCycleNo"
                      value={formData.auditCycleNo}
                      onChange={(e) => {
                        dispatch({
                          type: ACTION_TYPES.UPDATE_FIELD,
                          field: e.target.name,
                          value: e.target.value
                        });
                      }}
                      placeholder="I/2025-26 or II/2026-2027"
                      className={formData.auditCycleNo && !validateAuditCycleNo(formData.auditCycleNo) ? "invalid-input" : ""}
                    />
                    {formData.auditCycleNo && !validateAuditCycleNo(formData.auditCycleNo) && (
                      <span className="validation-error">Format should be like I/2025-26 or II/2026-2027</span>
                    )}
                  </div>
                </td>

              </tr>
              <tr>
                <td width="33%">
                  <label>DEPT</label>
                  <div className="form-field">
                    <select
                      name="dptname"
                      value={formData.dptname}
                      onChange={handleChange}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept, index) => (
                        <option key={index} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td width="33%">
                  <label>NCS. NO.</label>
                  <div className="form-field">
                    <input type="text" name="ncsNumber" value={formData.ncsNumber} onChange={handleChange} />
                  </div>
                </td>
                <td width="33%">
                  <label>AUDIT DATE</label>
                  <div className="form-field">
                    <input type="date" name="auditDate" value={formData.auditDate} onChange={handleChange} />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <label>PROCESS</label>
                  <div className="form-field">
                    <input type="text" name="process" value={formData.process} onChange={handleChange} />
                  </div>
                </td>
                <td>
                  <label>AUDITOR/DEPT.</label>
                  <div className="form-field">
                    <input type="text" name="auditor" value={formData.auditor} onChange={handleChange} />
                  </div>
                </td>
                <td>
                  <label>AUDITEE</label>
                  <div className="form-field">
                    <input type="text" name="auditee" value={formData.auditee} onChange={handleChange} />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="document-card">
          <div className="document-field">
            <label>REQUIREMENT (ISO 9001 STD / Quality manual / SOP / Dept.'s Documented Information)</label>
            <textarea name="requirement" value={formData.requirement} onChange={handleChange} rows={3} />
          </div>
        </div>

        <div className="document-card">
          <div className="document-field">
            <label>NONCONFORMITY STATEMENT</label>
            <textarea name="nonConformityStatement" value={formData.nonConformityStatement} onChange={handleChange} rows={3} />
          </div>
        </div>

        <div className="document-card">
          <div className="document-field">
            <label>OBJECTIVE EVIDENCE</label>
            <textarea name="objectiveEvidence" value={formData.objectiveEvidence} onChange={handleChange} rows={3} />
          </div>
        </div>

        <div className="form-row">
          <div className="document-card form-col">
            <div className="document-field">
              <label>ISO 9001-2018: OVIS CLASS NO. & DISCIPLINE</label>
              <input type="text" name="isoClass" value={formData.isoClass} onChange={handleChange} />
            </div>
          </div>

          <div className="document-card form-col">
            <div className="document-field">
              <label>POTENTIAL RISK</label>
              <input type="text" name="potentialRisk" value={formData.potentialRisk} onChange={handleChange} />
            </div>
          </div>


        </div>

        <div className="document-card table-card">
          <label htmlFor="">CORREACTION</label>
          <table className="document-table">
            <thead>
              <tr>
                <th width="10%">SL No.</th>
                <th width="40%">Activity</th>
                <th width="25%">Target</th>
                <th width="25%">Status</th>
              </tr>
            </thead>
            <tbody>
              {formData.activities.map((activity, index) => (
                <tr key={index}>
                  <td>
                    <input type="text" value={activity.slNo}
                      onChange={(e) => handleActivityChange(index, 'slNo', e.target.value)} />
                  </td>
                  <td>
                    <input type="text" value={activity.activity}
                      onChange={(e) => handleActivityChange(index, 'activity', e.target.value)} />
                  </td>
                  <td>
                    <input type="text" value={activity.target}
                      onChange={(e) => handleActivityChange(index, 'target', e.target.value)} />
                  </td>
                  <td>
                    <input type="text" value={activity.status}
                      onChange={(e) => handleActivityChange(index, 'status', e.target.value)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" className="add-row-btn" onClick={addActivityRow}>
            <span className="icon">+</span> Add Row
          </button>
        </div>
      </div>
    </div>
  );
};

const CorrectiveActionFormSection = ({ formData, dispatch }) => {
  const handleChange = (e) => {
    dispatch({
      type: ACTION_TYPES.UPDATE_FIELD,
      field: e.target.name,
      value: e.target.value
    });
  };

  const handleRootCauseChange = (index, value) => {
    dispatch({
      type: ACTION_TYPES.UPDATE_ROOT_CAUSE,
      index,
      value
    });
  };

  const handleCorrectiveActionChange = (index, field, value) => {
    dispatch({
      type: ACTION_TYPES.UPDATE_CORRECTIVE_ACTION,
      index,
      field,
      value
    });
  };

  const addCorrectiveActionRow = () => {
    dispatch({ type: ACTION_TYPES.ADD_CORRECTIVE_ACTION_ROW });
  };

  return (

    <div className="form-section document-format">
      {/* Previous sections would go here */}
      <div className="form-header">
        <h1 className="document-title">Internal Audit Non-Conformity and Corrective Action Report</h1>
      </div>

      {/* Root Causes Section */}
      <div className="document-card">
        <div className="document-field">
          <label className="section-label">ROOT CAUSE(S)</label>
          <div className="root-cause-grid">
            {[0, 1, 2, 3, 4].map((index) => (
              <div key={index} className="root-cause-item">
                <label>Why {index + 1}</label>
                <input
                  type="text"
                  className="root-cause-input"
                  value={formData.rootCauses[index] || ""}
                  onChange={(e) => handleRootCauseChange(index, e.target.value)}
                  placeholder={`Enter root cause #${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Corrective Actions Section */}
      <div className="document-card">
        <div className="document-field">
          <label className="section-label">  ACTION</label>
          <div className="table-responsive">
            <table className="document-table corrective-actions-table">
              <thead>
                <tr>
                  <th width="10%">SL No.</th>
                  <th width="25%">Activity</th>
                  <th width="15%">Responsible</th>
                  <th width="25%">Changes to be made in FMEA/ROAR/OMS Doc. Info.</th>
                  <th width="15%">Target/Completion</th>
                  <th width="10%">Status</th>
                </tr>
              </thead>
              <tbody>
                {formData.correctiveActions.map((action, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        value={action.slNo}
                        onChange={(e) => handleCorrectiveActionChange(index, 'slNo', e.target.value)}
                        className="table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={action.activity}
                        onChange={(e) => handleCorrectiveActionChange(index, 'activity', e.target.value)}
                        className="table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={action.responsible}
                        onChange={(e) => handleCorrectiveActionChange(index, 'responsible', e.target.value)}
                        className="table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={action.changes}
                        onChange={(e) => handleCorrectiveActionChange(index, 'changes', e.target.value)}
                        className="table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={action.target}
                        onChange={(e) => handleCorrectiveActionChange(index, 'target', e.target.value)}
                        className="table-input"
                      />
                    </td>
                    <td>
                      <select
                        value={action.status}
                        onChange={(e) => handleCorrectiveActionChange(index, 'status', e.target.value)}
                        className="status-select"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Verified">Verified</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" className="add-row-btn primary-btn" onClick={addCorrectiveActionRow}>
            <span className="btn-icon">+</span> Add Corrective Action
          </button>
        </div>
      </div>

      {/* Follow-up Sections */}
      <div className="form-row">
        <div className="document-card form-col">
          <div className="document-field">
            <label className="section-label">FOLLOW-UP AUDIT OBSERVATION</label>
            <textarea
              name="followUpObservation"
              value={formData.followUpObservation}
              onChange={handleChange}
              rows={3}
              className="form-textarea"
              placeholder="Enter follow-up observations..."
            />
          </div>
        </div>

        <div className="document-card form-col">
          <div className="document-field">
            <label className="section-label">OBJECTIVE EVIDENCE</label>
            <textarea
              name="followUpEvidence"
              value={formData.followUpEvidence}
              onChange={handleChange}
              rows={3}
              className="form-textarea"
              placeholder="Provide objective evidence..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportViewer = ({ report, onEdit, onBack }) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = document.querySelector('.tabls_data').innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Report Print</title>
          <style>
            /* Base styles */
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              font-size: 12pt;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color: #333;
              background-color: white !important;
            }
            
            /* Page layout */
            @page {
              size: A4;
              margin: 1mm;
            }
            
            .print-page {
              width: 210mm;
              min-height: 297mm;
              page-break-after: always;
              margin: 0 auto;
              padding: 15mm;
              box-sizing: border-box;
              background: white;
            }
            
            .print-page:last-child {
              page-break-after: auto;
            }
            
            /* Tables */
            table {
              width: 100%;
              border-collapse: collapse;
              page-break-inside: avoid;
            }
            
            th, td {
              border: 1px solid #000 !important;
              padding: 8px 12px;
              text-align: left;
              vertical-align: top;
              word-wrap: break-word;
            }
            
            th {
              background-color: #2c3e50 !important;
              color: white !important;
              font-weight: normal;
            }
            
            td {
              background-color: white !important;
            }
            
            /* Document header */
            .head_title_logo {
              display: flex;
              justify-content: space-evenly;
              align-items: center;
              padding: 5px;
              border: 1px solid black;
              font-weight: bold;
            }
            
            .img_logo {
              width: 50px;
              padding: 5px;
            }
            
            .document-title {
              text-align: center;
              font-size: 19px !important;
              border-right: 1px solid black;
              border-left: 1px solid black;
              padding: 10px 30px;
              color: #2c3e50;
              margin-bottom: 5px;
            }
            
            /* Document sections */
            .document-section-title {
              text-align: center;
              font-weight: bold;
              font-size: 13px;
            }
            
            .document-section-title p {
              margin-bottom: 0px;
              margin-top: 0px;
            }
            
            /* Signature lines */
            .signature_line {
              display: flex;
              justify-content: space-between;
              margin-bottom: 0px;
              font-size: 12px;
            }
            
            .signature_line p {
              margin-top: 40px;
              margin-bottom: 0px;
              font-weight: bold;
            }
            
            /* ISO line */
            .iso_line {
              font-size: 12px;
              margin-bottom: 0px;
              padding: 0px;
            }
            
            /* Text center */
            .text_cen {
              text-align: center;
            }
            
            /* Follow up split */
            .follow_split {
              display: flex;
              justify-content: space-around;
            }
            
            .follow_split_left, .follow_split_right {
              width: 100%;
              text-align: center;
              text-decoration: underline;
              padding: 5px;
            }
            
            .follow_split_left {
              border-right: 1px solid black;
              border-collapse: collapse;
            }
            
            strong {
              text-decoration: underline;
            }
            
            /* End content */
            .end_content {
              display: flex;
              justify-content: space-between;
              font-size: 15px;
            }
            
            .end_content p {
              margin-bottom: 0;
              font-weight: bold;
              font-size: 10px;
            }
            
            /* Document footer */
            .document-footer {
              text-align: end;
              font-size: 12px;
              margin-bottom: 0px;
            }
            
            .document-footer p {
              margin-bottom: 0px;
            }
            
            /* Root cause section */
            .root-cause-section {
              width: 100%;
            }
            
            .section-header {
              font-weight: bold;
              margin-bottom: 8px;
              text-align: left;
            }
            
            .divider {
              border: none;
              border-top: 1px solid #000;
              margin: 5px 0 10px 0;
            }
            
            .root-cause-table {
              width: 100%;
              border-collapse: collapse;
            }
            
            .root-cause-row {
              border-bottom: 1px solid #eee;
            }
            
            .root-cause-row:last-child {
              border-bottom: none;
            }
            
            .root-cause-label {
              padding: 6px 0;
              width: 15%;
              font-weight: 500;
              vertical-align: top;
            }
            
            .root-cause-value {
              padding: 6px 0 6px 10px;
              width: 85%;
            }
            
            /* Column width adjustments */
            .document-table th:nth-child(1),
            .document-table td:nth-child(1) {
              width: 10%;
              text-align: center;
            }
            
            .document-table th:nth-child(2),
            .document-table td:nth-child(2) {
              width: 25%;
            }
            
            .document-table th:nth-child(3),
            .document-table td:nth-child(3) {
              width: 15%;
            }
            
            .document-table th:nth-child(4),
            .document-table td:nth-child(4) {
              width: 25%;
            }
            
            .document-table th:nth-child(5),
            .document-table td:nth-child(5) {
              width: 15%;
              text-align: center;
            }
            
            .document-table th:nth-child(6),
            .document-table td:nth-child(6) {
              width: 10%;
              text-align: center;
            }
            
            /* Utility classes */
            .no-print {
              display: none !important;
            }
            
            .mb-0 {
              margin-bottom: 0 !important;
            }
            
            /* Print-specific adjustments */
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              
              .print-page {
                padding: 15mm;
              }
              
              .document-title {
                font-size: 16px !important;
              }
              
              .document-header-table {
                font-size: 12px !important;
              }
              
              .document-table th, 
              .document-table td {
                font-size: 11px !important;
              }
              
              .root-cause-table td {
                font-size: 10px !important;
              }
              
              .signature_line p {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 200);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };
  const handleDownloadPDF = async (report) => {
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.innerHTML = document.querySelector('.tabls_data').innerHTML;
    document.body.appendChild(tempDiv);

    const loadScript = (src) => new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

    try {
      await Promise.all([
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
      ]);

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Process each page
      const pages = tempDiv.querySelectorAll('.print-page');

      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], {
          scale: 2,
          logging: false,
          useCORS: true,
          scrollX: 0,
          scrollY: 0,
          backgroundColor: '#FFFFFF',
          ignoreElements: (element) => element.classList.contains('no-print')
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pdf.internal.pageSize.getWidth() - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      }

      // Generate dynamic filename
      const departmentName = report.dptname.replace(/[^a-zA-Z0-9]/g, '_');
      const auditCycle = report.auditCycleNo.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `Action_Report_${departmentName}_${auditCycle}_${new Date().toISOString().slice(0, 10)}.pdf`;

      pdf.save(fileName);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      document.body.removeChild(tempDiv);
    }
  }


  return (
    <div className="document-format">
      <div className="tabls_data">
        <div className="print-page page-1">

          <table className="document-header-table">
            <tbody>
              <tr>
                <td colSpan={3}>
                  <div
                    className="head_title_logo"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px',
                      border: '1px solid black', // one clean border around all
                    }}
                  >
                    <img
                      src={companyLogo}
                      alt="Company Logo"
                      className="img_logo"
                      style={{ height: '60px', objectFit: 'contain' }}
                    />

                    <h1 className="document-title" style={{ textAlign: "center", fontSize: "19px", borderRight: "1px solid black", borderLeft: "1px solid black", padding: "10px 30px" }}>

                      Internal Audit Non Conformity and Corrective Action Report
                    </h1>

                    <div
                      style={{
                        fontSize: '15px',
                        textAlign: 'right',
                        minWidth: '120px',
                        lineHeight: '1.2',
                      }}
                    >
                      <strong>Audit cycle No:</strong><br />
                      <span>{report.auditCycleNo}</span>
                    </div>
                  </div>
                </td>

              </tr>
              <tr>
                <td width="33%"><strong>DEPT</strong>: {report.dptname}</td>
                <td width="33%"><strong>NCS. NO.</strong>: {report.ncsNumber}</td>
                <td width="33%"><strong>AUDIT DATE</strong>: {report.auditDate}</td>
              </tr>
              <tr>
                <td><strong>PROCESS</strong>: {report.process}</td>
                <td><strong>AUDITOR/DEPT.</strong>: {report.auditor}</td>
                <td><strong>AUDITEE</strong>: {report.auditee}</td>
              </tr>
              <tr>
                <td colSpan={3}>
                  <p><strong>REQUIREMENT (ISO 9001 STD / Quality manual / SOP / Dept.'s Documented Information):</strong></p>
                  <p>{report.requirement}</p>
                </td>
              </tr>
              <tr>
                <td className='tbl_data' colSpan={2}>
                  <p><strong>NONCONFORMITY STATEMENT</strong></p>
                  <p>{report.nonConformityStatement}</p>
                </td>
                <td className='tbl_data'>
                  <p><strong>OBJECTIVE EVIDENCE</strong></p>
                  <p>{report.objectiveEvidence}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className='iso_line'><strong>ISO 9001-2018: OVIS CLASS NO. & DISCIPLINE</strong></p>
                </td>
                <td colSpan={2}><p>{report.isoClass}</p></td>
              </tr>
              <tr>
                <td colSpan={3}>
                  <div className='signature_line mb-0'>
                    <p>DATE: {report.auditDate}</p>
                    <p>SIGNATURE OF AUDITOR: </p>
                  </div>
                </td>

              </tr>
              <tr>
                <td colSpan={3} className="document-section-title">
                  <p className='mb-0'>TO BE FILLED BY AUDITEE</p>
                </td>
              </tr>
              <tr>
                <td className="document-field">
                  <p><strong>POTENTIAL RISK</strong></p>
                  <p>{report.potentialRisk}</p>
                </td>
                <td colSpan={2}>
                  <p><strong>CORRECTION</strong></p>
                  <table className="document-table">
                    <thead>
                      <tr>
                        <th width="10%">SLno.</th>
                        <th width="40%">Activity</th>
                        <th width="25%">Target</th>
                        <th width="25%">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.activities.map((activity, index) => (
                        <tr key={index}>
                          <td>{activity.slNo}</td>
                          <td>{activity.activity}</td>
                          <td>{activity.target}</td>
                          <td>{activity.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>

                <td colSpan={3}>
                  <div className='signature_line mb-0'>
                    <p>DATE: {report.auditDate}</p>
                    <p>SIGNATURE OF AUDITEE: {report.auditeeSignature}</p>
                  </div>
                </td>
              </tr>

            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>
                  <div className="document-footer">
                    P.T.O  LLS1/TQM/QA/06/01/00/R03-00-03.05.2022
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>


        <div className="print-page page-2">

          <table className="document-header-table mt-3">

            <tbody>
              <tr>
                <td colSpan={3}>
                  <div
                    className="head_title_logo"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px',
                      border: '1px solid black', // one clean border around all
                    }}
                  >
                    <img
                      src={companyLogo}
                      alt="Company Logo"
                      className="img_logo"
                      style={{ height: '60px', objectFit: 'contain' }}
                    />

                    <h1 className="document-title" style={{ textAlign: "center", fontSize: "20px", borderLeft: "1px solid black", padding: "10px 30px" ,marginRight:"180px"}}>

                      Internal Audit Non Conformity and Corrective Action Report
                    </h1>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="document-section-title">TO BE FILLED BY AUDITEE</td>
              </tr>
              <tr>
                <td>
                  <div className="root-cause-section">
                    <p className="section-header"><strong>ROOT CAUSE(S)</strong></p>
                    <hr className="divider" />
                    <table className="root-cause-table">
                      <tbody>
                        {[0, 1, 2, 3, 4].map((index) => (
                          <tr key={index} className="root-cause-row">
                            <td className="root-cause-label">Why {index + 1}</td>
                            <td className="root-cause-value">
                              {report.rootCauses[index] || ""}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <p className='text_cen'><strong>CORRECTIVE ACTION</strong></p><hr />
                  <table className="document-table">
                    <thead>
                      <tr>
                        <th width="10%">SL no.</th>
                        <th width="25%">Activity</th>
                        <th width="15%">Resp.</th>
                        <th width="25%">Changes to be made in FMEA/ROAR/OMS Doc. Info.</th>
                        <th width="15%">Target/Resp.</th>
                        <th width="10%">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.correctiveActions.map((action, index) => (
                        <tr key={index}>
                          <td>{action.slNo}</td>
                          <td>{action.activity}</td>
                          <td>{action.responsible}</td>
                          <td>{action.changes}</td>
                          <td>{action.target}</td>
                          <td>{action.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <div className='signature_line mb-0'>
                    <p>DATE: {report.auditDate}</p>
                    <p>SIGNATURE OF AUDITEE: {report.auditeeSignature}</p>
                  </div>

                </td>
              </tr>
              <tr>
                <td className="document-section-title ">
                  <p >TO BE FILLED BY AUDITOR</p>
                </td>
              </tr>
              <tr>
                <td><div className='follow_split'>
                  <div className='follow_split_left'>
                    <p><strong>FOLLOW-UP AUDIT OBSERVATION</strong></p>
                    <p>{report.followUpObservation}</p></div><div className='follow_split_right'>
                    <p><strong>OBJECTIVE EVIDENCE</strong></p>
                    <p>{report.followUpEvidence}</p></div></div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className='signature_line mb-0'>
                    <p>DATE: {report.auditDate}</p>
                    <p>SIGNATURE OF AUDITOR: </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <p><strong>NCS. CLOSING STATUS</strong></p>

                  "a) Closed / Mixed Re-Action":<br />
                  "b) Amid similar nonconformity exist, could potentially occur at:"
                </td>
              </tr>
              <tr>
                <td><div className="end_content">
                  <p>DATE: {report.auditDate}</p>
                  <p>
                    Verified by: {report.verifiedBy}<br /></p>
                  <p>
                    Approved by: {report.approvedBy}<br /></p>
                </div>

                </td>
              </tr>
              <tr>
                <td>
                  <p className='document-footer '>
                    LLS3/TQ3A/QA/6/5/0/8/04-00-03-2022
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="form-buttons no-print">
        <button type="button" className="submit-btns" style={{ width: "100px" }} onClick={onEdit}>Edit</button>
        <button type="button" className="delete-btn" onClick={onBack}>Back to Reports</button>
        <div className="action-buttons">
          <button
            className="print-btns"
            onClick={handlePrint}
            title="Print Report"
          >
            <i className="fas fa-print" style={{ marginRight: '8px' }}></i>
            Print Report
          </button>

          <button
            className="download-pdf-btn"
            onClick={() => handleDownloadPDF(report)}
            title="Download PDF Report"
          >
            <i className="fas fa-file-pdf" style={{ marginRight: '8px' }}></i>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

const ReportList = ({ reports, onView, onEdit, onDelete, onAddNew }) => {
  const [filters, setFilters] = useState({
    dptname: "",
    auditCycleNo: "",
    savedDate: ""
  });

  // State to hold departments from localStorage
  const [departments, setDepartments] = useState([]);

  // Load departments from localStorage on component mount
  useEffect(() => {
    const storedDepartments = JSON.parse(localStorage.getItem("departments") || "[]");
    setDepartments(storedDepartments);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredReports = reports.filter(report => {
    return (
      (filters.dptname === "" ||
        report.dptname === filters.dptname) &&
      (filters.auditCycleNo === "" ||
        report.auditCycleNo?.toLowerCase().includes(filters.auditCycleNo.toLowerCase())) &&
      (filters.savedDate === "" ||
        new Date(report.auditDate).toISOString().split('T')[0] === filters.savedDate)
    );
  });

  return (
    <div className="saved-reports-container">
      <div className="report-list-header">
        <h2>Saved Action Reports</h2>
        <button type="button" className="add-btn mb-3" onClick={onAddNew}>
          Add New Action Report
        </button>
      </div>

      {/* Filter Section */}
      <div className="document-card filter-section">
        <h3>Filter Action Reports</h3>
        <div className="filter-row">
          <div className="filter-field">
            <label>Department</label>
            <select
              name="dptname"
              value={filters.dptname}
              onChange={handleFilterChange}
            >
              <option value="">All Departments</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-field">
            <label>Audit Cycle No.</label>
            <input
              type="text"
              name="auditCycleNo"
              value={filters.auditCycleNo}
              onChange={handleFilterChange}
              placeholder="I/2025-26"
            />
          </div>
          <div className="filter-field">
            <label>Audit Date</label>
            <input
              type="date"
              name="savedDate"
              value={filters.savedDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {filteredReports.length > 0 ? (
        <table className="reports-table">
          <thead>
            <tr>
              <th>NRS Number</th>
              <th>Department</th>
              <th>Audit Cycle No.</th>
              <th>Audit Date</th>
              <th>Saved Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report, index) => (
              <tr key={report.id}>
                <td>{report.ncsNumber}</td>
                <td>{report.dptname}</td>
                <td>{report.auditCycleNo}</td>
                <td>{report.auditDate}</td>
                <td>{report.savedDate}</td>
                <td className="action-btns">
                  <button className="btn btn-primary btn-sm" onClick={() => onView(report)}>View</button>
                  <button className="btn btn-warning btn-sm text-white" onClick={() => onEdit(index)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-reports">
          <p>No reports found matching your filters.</p>
        </div>
      )}
    </div>
  );
};
// Main component
const NewActionForm = () => {
  const [formData, dispatch] = useReducer(formReducer, INITIAL_FORM_DATA);
  const [savedReports, setSavedReports] = useLocalStorage('savedReports', []);
  const [departments, setDepartments] = useLocalStorage('departments', []); // Add this line
  const [showForms, setShowForms] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [newDeptInput, setNewDeptInput] = useState('');

  // Initialize form with observation data if available

  const handleAddDepartment = () => {
    if (newDeptInput.trim() && !departments.includes(newDeptInput.trim())) {
      setDepartments([...departments, newDeptInput.trim()]);
      setNewDeptInput('');
    }
  };

  const handleAddNew = () => {
    dispatch({ type: ACTION_TYPES.RESET_FORM });
    setEditingIndex(null);
    setViewingReport(null);
    setShowForms(true);
  };

  const handleSave = () => {
    if (!validateAuditCycleNo(formData.auditCycleNo)) {
      alert('Please enter a valid Audit Cycle Number in format I/2025-26 or II/2026-2027');
      return;
    }
    const newReport = {
      ...formData,
      id: Date.now(),
      savedDate: new Date().toLocaleString()
    };

    if (editingIndex !== null) {
      const updatedReports = [...savedReports];
      updatedReports[editingIndex] = newReport;
      setSavedReports(updatedReports);
    } else {
      setSavedReports([...savedReports, newReport]);
    }

    setShowForms(false);
  };

  const handleEdit = (index) => {
    dispatch({
      type: ACTION_TYPES.LOAD_FORM,
      payload: savedReports[index]
    });
    setEditingIndex(index);
    setViewingReport(null);
    setShowForms(true);
  };

  const handleCancel = () => {
    setShowForms(false);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      const updatedReports = savedReports.filter((_, i) => i !== index);
      setSavedReports(updatedReports);
    }
  };

  const handleViewReport = (report) => {
    setViewingReport(report);
    setShowForms(false);
  };
  // State to hold all reports
  const [reports, setReports] = useState(() => {
    const savedReports = localStorage.getItem("actionReports");
    return savedReports ? JSON.parse(savedReports) : [];
  });





  const handleBackToList = () => {
    setViewingReport(null);
  };
  const validateAuditCycleNo = (value) => {
    const pattern = /^(I|II|III|IV)\/\d{4}-(\d{2}|\d{4})$/;
    return pattern.test(value);
  };

  return (
    <div className="action-report-container">
      {showForms ? (
        <>
          <NonConformityFormSection formData={formData} dispatch={dispatch} />
          <CorrectiveActionFormSection formData={formData} dispatch={dispatch} />
          <div className="form-buttons">
            <button type="button" className="save-btn" onClick={handleSave}>
              {editingIndex !== null ? 'Update Report' : 'Save Reports'}
            </button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
          </div>
        </>
      ) : viewingReport ? (
        <ReportViewer
          report={viewingReport}
          onEdit={() => {
            const index = savedReports.findIndex(r => r.id === viewingReport.id);
            handleEdit(index);
          }}
          onBack={handleBackToList}
        />
      ) : (
        <ReportList
          reports={savedReports}
          onView={handleViewReport}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddNew={handleAddNew}
        />
      )}
    </div>
  );
};

// PropTypes for type checking
NonConformityFormSection.propTypes = {
  formData: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

CorrectiveActionFormSection.propTypes = {
  formData: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

ReportViewer.propTypes = {
  report: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired
};

ReportList.propTypes = {
  reports: PropTypes.array.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddNew: PropTypes.func.isRequired
};

export default NewActionForm;