import React, { useState, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import companyLogo from "../assets/images/lls_logo.png";
import "../assets/styles/ActionReport.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import ReportViewer from './ReportViewer';
import NonConformityFormSection from './NonConformityFormSection';
import CorrectiveActionFormSection from './CorrectiveActionFormSection';
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

// Sub-components remain the same (NonConformityFormSection, CorrectiveActionFormSection, ReportViewer)

const ReportList = ({ reports, onView, onEdit, onDelete, onAddNew }) => {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [decisions, setDecisions] = useState({});
  const [filter, setFilter] = useState('');
  const [userAuditDepartment, setUserAuditDepartment] = useState('');

  useEffect(() => {
    const dept = localStorage.getItem('userAuditDepartment');
    if (dept) {
      setUserAuditDepartment(dept);
    }
  }, []);

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || {};
    const storedDecisions = JSON.parse(localStorage.getItem('adminDecisions')) || {};

    const filteredFiles = {};
    for (const [reportId, file] of Object.entries(storedFiles)) {
      if (storedDecisions[reportId] !== 'approved' && storedDecisions[reportId] !== 'redo') {
        filteredFiles[reportId] = file;
      }
    }

    setUploadedFiles(filteredFiles);
    setDecisions(storedDecisions);
  }, []);

  const handleFileChange = (e, reportId) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const report = reports.find(r => r.id === reportId);
      const updated = {
        ...uploadedFiles,
        [reportId]: {
          name: file.name,
          url: url,
          ncsNumber: report?.ncsNumber || '',
          auditCycleNo: report?.auditCycleNo || '',
          department: report?.dptname || ''
        },
      };
      setUploadedFiles(updated);
      updateLocalStorage(updated);
    }
  };

  const handleClearUpload = (reportId) => {
    const updated = { ...uploadedFiles };
    delete updated[reportId];
    setUploadedFiles(updated);
    updateLocalStorage(updated);
    const fileInput = document.getElementById(`file-upload-${reportId}`);
    if (fileInput) fileInput.value = '';
  };

  const updateLocalStorage = (files) => {
    localStorage.setItem('uploadedFiles', JSON.stringify(files));
  };

  const getStatus = (reportId) => {
    return decisions[reportId] === 'approved' ? 'Completed' : 'Pending';
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-success';
      case 'pending': return 'bg-warning text-dark';
      default: return 'bg-secondary';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredReports = reports.filter(report =>
    report.dptname === userAuditDepartment && (
      report.ncsNumber.toLowerCase().includes(filter.toLowerCase()) ||
      report.dptname.toLowerCase().includes(filter.toLowerCase()) ||
      report.auditCycleNo.toString().includes(filter)
    )
  );

  return (
    <div className="container-fluid p-4">
      <div className="card shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Audit Reports</h5>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search reports..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="align-middle">NCR Number</th>
                  <th className="align-middle">Department</th>
                  <th className="align-middle text-center">Audit Cycle</th>
                  <th className="align-middle">Audit Date</th>
                  <th className="align-middle">Actions</th>
                  <th className="align-middle">Evidence</th>
                  <th className="align-middle">Clear</th>
                  <th className="align-middle text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => {
                    const fileData = uploadedFiles[report.id];
                    const status = getStatus(report.id);
                    return (
                      <tr
                        key={report.id}
                        className={status === 'Completed' ? "table-success" : ""}
                      >
                        <td className="align-middle font-monospace fw-semibold">{report.ncsNumber}</td>
                        <td className="align-middle">{report.dptname}</td>
                        <td className="align-middle text-center">{report.auditCycleNo}</td>
                        <td className="align-middle">{formatDate(report.auditDate)}</td>
                        <td className="align-middle">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => {
                              const url = `/admin-dashboard/action-report?ncsNumber=${encodeURIComponent(report.ncsNumber)}&department=${encodeURIComponent(report.dptname)}&auditCycle=${encodeURIComponent(report.auditCycleNo)}&userView=true`;
                              window.open(url, '_blank'); // 👉 This will open in a new tab
                            }}
                            title="View details"
                          >
                            <i className="bi bi-eye-fill me-1"></i> View
                          </button>

                        </td>
                        <td className="align-middle">
                          <div className="input-group-sm int-box">
                            {fileData ? (
                              <>
                                <a
                                  href={fileData.url}
                                  download={fileData.name}
                                  className="form-control text-success text-decoration-none"
                                  title="Click to download"
                                >
                                  {fileData.name}
                                </a>
                                <span className="input-group-text text-success">
                                  <i className="bi bi-check-circle-fill"></i>
                                </span>
                              </>
                            ) : (
                              <input
                                type="file"
                                className="form-control"
                                onChange={(e) => handleFileChange(e, report.id)}
                                accept=".pdf,.doc,.docx,.jpg,.png"
                                id={`file-upload-${report.id}`}
                                disabled={status === 'Completed'}
                              />
                            )}
                          </div>
                        </td>
                        <td className="align-middle">
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleClearUpload(report.id)}
                            disabled={!fileData}
                            title="Clear uploaded file"
                          >
                            <i className="bi bi-trash-fill me-1"></i> Clear
                          </button>
                        </td>
                        <td className="align-middle text-center">
                          <span className={`badge ${getStatusBadgeClass(status)}`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted">
                      No reports found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-footer bg-white d-flex justify-content-between align-items-center">
          <small className="text-muted">
            Showing {filteredReports.length} of {reports.length} reports
          </small>
        </div>
      </div>
    </div>
  );
};

const NewActionForm = () => {
  const [formData, dispatch] = useReducer(formReducer, INITIAL_FORM_DATA);
  const [savedReports, setSavedReports] = useLocalStorage('savedReports', []);
  const [departments, setDepartments] = useLocalStorage('departments', []);
  const [showForms, setShowForms] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [newDeptInput, setNewDeptInput] = useState('');
  const navigate = useNavigate();

  const validateAuditCycleNo = (value) => {
    const pattern = /^(I|II|III|IV)\/\d{4}-(\d{2}|\d{4})$/;
    return pattern.test(value);
  };

  const generateNcNumber = () => {
    const year = new Date().getFullYear();
    const existingNcs = savedReports
      .filter(report => typeof report.ncsNumber === 'string' && report.ncsNumber.startsWith(year.toString()))
      .map(report => parseInt(report.ncsNumber.replace(year.toString(), '')))
      .filter(num => !isNaN(num));

    const nextSequence = existingNcs.length > 0 ? Math.max(...existingNcs) + 1 : 1;
    return `${year}${nextSequence.toString().padStart(3, '0')}`;
  };

  const handleAddNew = () => {
    dispatch({
      type: ACTION_TYPES.RESET_FORM,
      payload: {
        ...INITIAL_FORM_DATA,
        ncsNumber: generateNcNumber(),
        auditDate: new Date().toISOString().split('T')[0]
      }
    });
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
    id: editingIndex !== null ? savedReports[editingIndex].id : Date.now(),
    savedDate: new Date().toLocaleString()
  };

  let updatedReports;

  if (editingIndex !== null) {
    updatedReports = [...savedReports];
    updatedReports[editingIndex] = newReport;
    setSavedReports(updatedReports);
  } else {
    updatedReports = [...savedReports, newReport];
    setSavedReports(updatedReports);
  }

  localStorage.setItem('latestAuditReport', JSON.stringify(newReport));

  // 👉 Set the report to view
  setViewingReport(newReport);

  // 👉 Hide the form
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

  const handleBackToList = () => {
    setViewingReport(null);
  };

  return (
    <div className="action-report-container">
      {showForms ? (
        <>
          <NonConformityFormSection formData={formData} dispatch={dispatch} />
          <CorrectiveActionFormSection formData={formData} dispatch={dispatch} />
          <div className="form-buttons">
            <button type="button" className="save-btn" onClick={handleSave}>
              {editingIndex !== null ? 'Update Report' : 'Save Report'}
            </button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
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
          hideBackButton={true} // Pass this to hide the button
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

export default NewActionForm;