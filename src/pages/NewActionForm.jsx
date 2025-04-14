import React, { useState, useEffect, useReducer } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import companyLogo from "../assets/images/lls_logo.png";
import "../assets/styles/ActionReport.css";

// Constants for initial state and action types
const INITIAL_FORM_DATA = {
  dept: "",
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
  verifiedBy: "OMS Coordinator",
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

  return (
    <div className="form-section document-format">
      <h1 className="document-title">Internal Audit Non conformity and Corrective Action Report</h1>

      <table className="document-header-table">
        <tbody>
          <tr>
            <td width="33%"><strong>DEFT</strong>: {formData.dept}</td>
            <td width="33%"><strong>NCS. NO.</strong>:
              <input type="text" name="ncsNumber" value={formData.ncsNumber} onChange={handleChange} />
            </td>
            <td width="33%"><strong>AUDIT DATE</strong>:
              <input type="date" name="auditDate" value={formData.auditDate} onChange={handleChange} />
            </td>
          </tr>
          <tr>
            <td><strong>PROCESS</strong>:
              <input type="text" name="process" value={formData.process} onChange={handleChange} />
            </td>
            <td><strong>AUDITOR/DEFT.</strong>:
              <input type="text" name="auditor" value={formData.auditor} onChange={handleChange} />
            </td>
            <td><strong>AUDITEE</strong>:
              <input type="text" name="auditee" value={formData.auditee} onChange={handleChange} />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="document-field">
        <p><strong>REQUIREMENT (ISO 9001 STD / Quality manual / SOP / Dept.'s Documented Information):</strong></p>
        <textarea name="requirement" value={formData.requirement} onChange={handleChange} rows={3} />
      </div>

      <div className="document-field">
        <p><strong>NONCONFORMITY STATEMENT</strong></p>
        <textarea name="nonConformityStatement" value={formData.nonConformityStatement} onChange={handleChange} rows={3} />
      </div>

      <div className="document-field">
        <p><strong>OBJECTIVE EVIDENCE</strong></p>
        <textarea name="objectiveEvidence" value={formData.objectiveEvidence} onChange={handleChange} rows={3} />
      </div>

      <div className="document-field">
        <p><strong>ISO 9001-2018: OVIS CLASS NO. & DISCIPLION</strong></p>
        <input type="text" name="isoClass" value={formData.isoClass} onChange={handleChange} />
      </div>

      <div className="signature-line">
        <div>
          <p>DATE: {formData.auditDate}</p>
          <p>SIGNATURE OF AUDITOR:
            <input type="text" name="auditorSignature" value={formData.auditorSignature} onChange={handleChange} />
          </p>
        </div>
      </div>

      <div className="document-section-title">
        <p>TO BE FILLED BY AUDITEE</p>
      </div>

      <div className="document-field">
        <p><strong>POTENTIAL RISK</strong></p>
        <input type="text" name="potentialRisk" value={formData.potentialRisk} onChange={handleChange} />
      </div>

      <div className="document-field">
        <p><strong>CONNECTION</strong></p>
        <input type="text" name="connection" value={formData.connection} onChange={handleChange} />
      </div>

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
      <button type="button" className="add-row-btn" onClick={addActivityRow}>Add Row</button>

      <div className="signature-line">
        <div>
          <p>DATE: {formData.auditDate}</p>
          <p>SIGNATURE OF AUDITEE:
            <input type="text" name="auditeeSignature" value={formData.auditeeSignature} onChange={handleChange} />
          </p>
        </div>
      </div>

      <div className="document-footer">
        <p>9.T.O</p>
        <p>LLS3/TQ3A/QA/6/5/0/8/04-00-03-2022</p>
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
      <h1 className="document-title">Internal Audit Non-conformity and Corrective Action Report</h1>

      <div className="document-section-title">
        <p>TO BE FILLED BY AUDITEE</p>
      </div>

      <div className="document-field">
        <p><strong>ROOT CAUSE(S)</strong></p>
        {[0, 1, 2, 3, 4].map((index) => (
          <div key={index} className="root-cause-item">
            <p>Why {index + 1}</p>
            <input type="text"
              value={formData.rootCauses[index] || ""}
              onChange={(e) => handleRootCauseChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="document-field">
        <p><strong>CORRECTIVE ACTION</strong></p>
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
            {formData.correctiveActions.map((action, index) => (
              <tr key={index}>
                <td>
                  <input type="text" value={action.slNo}
                    onChange={(e) => handleCorrectiveActionChange(index, 'slNo', e.target.value)} />
                </td>
                <td>
                  <input type="text" value={action.activity}
                    onChange={(e) => handleCorrectiveActionChange(index, 'activity', e.target.value)} />
                </td>
                <td>
                  <input type="text" value={action.responsible}
                    onChange={(e) => handleCorrectiveActionChange(index, 'responsible', e.target.value)} />
                </td>
                <td>
                  <input type="text" value={action.changes}
                    onChange={(e) => handleCorrectiveActionChange(index, 'changes', e.target.value)} />
                </td>
                <td>
                  <input type="text" value={action.target}
                    onChange={(e) => handleCorrectiveActionChange(index, 'target', e.target.value)} />
                </td>
                <td>
                  <input type="text" value={action.status}
                    onChange={(e) => handleCorrectiveActionChange(index, 'status', e.target.value)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="add-row-btn" onClick={addCorrectiveActionRow}>Add Row</button>
      </div>

      <div className="signature-line">
        <div>
          <p>DATE: {formData.auditDate}</p>
          <p>SIGNATURE OF AUDITEE:
            <input type="text" name="auditeeSignature" value={formData.auditeeSignature} onChange={handleChange} />
          </p>
        </div>
      </div>

      <div className="document-section-title">
        <p>TO BE FILLED BY AUDITOR</p>
      </div>

      <div className="document-field">
        <p><strong>FOLLOW-UP AUDIT OBSERVATION</strong></p>
        <textarea name="followUpObservation" value={formData.followUpObservation} onChange={handleChange} rows={3} />
      </div>

      <div className="document-field">
        <p><strong>OBJECTIVE EVIDENCE</strong></p>
        <textarea name="followUpEvidence" value={formData.followUpEvidence} onChange={handleChange} rows={3} />
      </div>

      <div className="document-field">
        <p><strong>NCS. CLOSING STATUS</strong></p>
        <div className="radio-group">
          <label>
            <input type="radio" name="closingStatus" value="Closed"
              checked={formData.closingStatus === "Closed"} onChange={handleChange} />
            a) Closed / Mixed Re-Action
          </label>
          <label>
            <input type="radio" name="closingStatus" value="Similar nonconformity exists"
              checked={formData.closingStatus === "Similar nonconformity exists"} onChange={handleChange} />
            b) Amid similar nonconformity exist, could potentially occur at:
          </label>
        </div>
      </div>

      <div className="signature-line">
        <div>
          <p>DATE: {formData.auditDate}</p>
          <p>SIGNATURE OF AUDITOR:
            <input type="text" name="auditorSignature" value={formData.auditorSignature} onChange={handleChange} />
          </p>
        </div>
      </div>

      <div className="document-footer">
        <p>Verified by: {formData.verifiedBy}</p>
        <p>Approved by: {formData.approvedBy}</p>
        <p>LLS3/TQ3A/QA/6/5/0/8/04-00-03-2022</p>
      </div>
    </div>
  );
};

const ReportViewer = ({ report, onEdit, onBack }) => {
  return (
    <div className="document-format">
      <div className='head_title_logo'>
        <img src={companyLogo} alt="Company Logo" className='img_logo' />
        <h1 className="document-title">Internal Audit Non Conformity and Corrective Action Report</h1>
      </div>
      <table className="document-header-table">
        <tbody>
          <tr>
            <td width="33%"><strong>DEPT</strong>: {report.dept}</td>
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
              <p><strong>ISO 9001-2018: OVIS CLASS NO. & DISCIPLINE</strong></p>
              <p>{report.isoClass}</p>
            </td>
            <td colSpan={2}></td>
          </tr>
          <tr>
            <td className='tbl_data2'>DATE: {report.auditDate}</td>
            <td colSpan={2}>SIGNATURE OF AUDITOR: {report.auditorSignature}</td>
          </tr>
          <tr>
            <td colSpan={3} className="document-section-title">
              <p>TO BE FILLED BY AUDITEE</p>
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
            <td>DATE: {report.auditDate}</td>
            <td colSpan={2}>SIGNATURE OF AUDITEE: {report.auditeeSignature}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}>
              <div className="document-footer">
                9.T.O LLS3/TQ3A/QA/6/5/0/8/04-00-03-2022
              </div>
            </td>
          </tr>
        </tfoot>
      </table>

      <h1 className="document-title">Internal Audit Non-Conformity and Corrective Action Report</h1>

      <table className="document-header-table">
        <tbody>
          <tr>
            <td className="document-section-title">TO BE FILLED BY AUDITEE</td>
          </tr>
          <tr>
            <td>
              <p><strong>ROOT CAUSE(S)</strong></p>
              {report.rootCauses.map((cause, index) => (
                cause && <p key={index}>Why {index + 1}: {cause}</p>
              ))}
            </td>
          </tr>
          <tr>
            <td>
              <p><strong>CORRECTIVE ACTION</strong></p>
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
              DATE: {report.auditDate}<br />
              SIGNATURE OF AUDITEE: {report.auditeeSignature}
            </td>
          </tr>
          <tr>
            <td className="document-section-title">
              <p>TO BE FILLED BY AUDITOR</p>
            </td>
          </tr>
          <tr>
            <td>
              <p><strong>FOLLOW-UP AUDIT OBSERVATION</strong></p>
              <p>{report.followUpObservation}</p>
              <p><strong>OBJECTIVE EVIDENCE</strong></p>
              <p>{report.followUpEvidence}</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>DATE: {report.auditDate}</p>
              <p>SIGNATURE OF AUDITOR: {report.auditorSignature}</p>
            </td>
          </tr>
          <tr>
            <td>
              <p><strong>NCS. CLOSING STATUS</strong></p>
              <p>{report.closingStatus === "Closed"
                ? "a) Closed / Mixed Re-Action"
                : "b) Amid similar nonconformity exist, could potentially occur at:"}</p>
            </td>
          </tr>
          <tr>
            <td>
              Verified by: {report.verifiedBy}<br />
              Approved by: {report.approvedBy}<br />
              LLS3/TQ3A/QA/6/5/0/8/04-00-03-2022
            </td>
          </tr>
        </tbody>
      </table>

      <div className="form-buttons">
        <button type="button" className="edit-btn" onClick={onEdit}>Edit</button>
        <button type="button" className="back-btn" onClick={onBack}>Back to Reports</button>
      </div>
    </div>
  );
};

const ReportList = ({ reports, onView, onEdit, onDelete, onAddNew }) => {
  return (
    <div className="saved-reports-container">
      <div className="report-list-header">
        <h2>Saved Action Reports</h2>
        <button type="button" className="add-btn" onClick={onAddNew}>
          Add New Action Report
        </button>
      </div>
      {reports.length > 0 ? (
        <table className="reports-table">
          <thead>
            <tr>
              <th>NCS Number</th>
              <th>Department</th>
              <th>Audit Date</th>
              <th>Saved Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={report.id}>
                <td>{report.ncsNumber}</td>
                <td>{report.dept}</td>
                <td>{report.auditDate}</td>
                <td>{report.savedDate}</td>
                <td className="action-buttons">
                  <button onClick={() => onView(report)}>View</button>
                  <button onClick={() => onEdit(index)}>Edit</button>
                  <button onClick={() => onDelete(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-reports">
          <p>No reports saved yet.</p>
        </div>
      )}
    </div>
  );
};

// Main component
const ActionReport = () => {
  const location = useLocation();
  const [formData, dispatch] = useReducer(formReducer, INITIAL_FORM_DATA);
  const [savedReports, setSavedReports] = useLocalStorage('savedReports', []);
  const [showForms, setShowForms] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);

  // Initialize form with observation data if available
  useEffect(() => {
    if (location.state?.observation) {
      const { observation } = location.state;
      dispatch({
        type: ACTION_TYPES.LOAD_FORM,
        payload: {
          ...INITIAL_FORM_DATA,
          dept: observation.department || "",
          process: observation.processActivity || "",
          objectiveEvidence: observation.findings || "",
          isoClass: observation.isoClause || "",
          auditDate: new Date().toISOString().split('T')[0]
        }
      });
    }
  }, [location.state]);

  const handleAddNew = () => {
    dispatch({ type: ACTION_TYPES.RESET_FORM });
    setEditingIndex(null);
    setViewingReport(null);
    setShowForms(true);
  };

  const handleSave = () => {
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

export default ActionReport;