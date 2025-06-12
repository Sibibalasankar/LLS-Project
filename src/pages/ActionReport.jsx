import React, { useState, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import NonConformityFormSection from './NonConformityFormSection';
import CorrectiveActionFormSection from './CorrectiveActionFormSection';
import ReportViewer from './ReportViewer';
import ReportList from './ReportList';

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

const ActionReport = () => {
  const [formData, dispatch] = useReducer(formReducer, INITIAL_FORM_DATA);
  const [savedReports, setSavedReports] = useLocalStorage('savedReports', []);
  const [departments, setDepartments] = useLocalStorage('departments', []);
  const [showForms, setShowForms] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [newDeptInput, setNewDeptInput] = useState('');
  const navigate = useNavigate();

  const handleAddNew = () => {
    dispatch({ type: ACTION_TYPES.RESET_FORM });
    setEditingIndex(null);
    setViewingReport(null);
    setShowForms(true);
  };

  const validateAuditCycleNo = (value) => {
    const pattern = /^(I|II|III|IV)\/\d{4}-(\d{2}|\d{4})$/;
    return pattern.test(value);
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
    setShowForms(false);
    navigate('/user-dashboard/user-audit-nc-closer');
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

export default ActionReport;