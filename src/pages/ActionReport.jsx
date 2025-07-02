
import React, { useState, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NonConformityFormSection from './NonConformityFormSection';
import CorrectiveActionFormSection from './CorrectiveActionFormSection';
import ReportViewer from './ReportViewer';
import ReportList from './ReportList';
import { saveDraft, loadDraft, clearDraft } from '../utils/draftUtils';

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

const draftKey = 'actionReportDraft';

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
      return { ...action.payload };
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
  // Get data from URL query parameters
  const queryParams = new URLSearchParams(window.location.search);
  const dataParam = queryParams.get('data');
  const observationData = dataParam ? JSON.parse(decodeURIComponent(dataParam)) : null;
  
  // Extract needed fields from observation data with consistent naming
  const departmentName = observationData?.department || '';
  const auditCycleNo = observationData?.auditCycleNo || '';
  const ncsNumber = observationData?.ncsNumber || ''; // Changed from ncsNumberParam to ncsNumber
  const slNo = observationData?.slNo || '';
  const processActivity = observationData?.processActivity || '';
  const potentialCauses = observationData?.potentialCauses || '';
  const findings = observationData?.findings || '';
  const isoClause = observationData?.isoClause || '';
  const result = observationData?.result || '';
  const auditorSignature = observationData?.auditorSignature || '';
  const auditeeSignature = observationData?.auditeeSignature || '';
  const auditDate = observationData?.auditDate || new Date().toISOString().split('T')[0];


const [formData, dispatch] = useReducer(formReducer, {
  ...INITIAL_FORM_DATA,
  dptname: departmentName,
  auditCycleNo: auditCycleNo,
  ncsNumber: '',
  auditDate: auditDate,
  process: processActivity,
  nonConformityStatement: findings,
  objectiveEvidence: potentialCauses,
  isoClass: isoClause,
  auditor: auditorSignature,
  auditee: auditeeSignature
});
  const [savedReports, setSavedReports] = useLocalStorage('savedReports', []);
  const [showForms, setShowForms] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [autoOpened, setAutoOpened] = useState(false);
  const navigate = useNavigate();
const generateNcNumber = () => {
  const year = new Date().getFullYear();

  const existingNcs = savedReports
    .filter(report => typeof report.ncsNumber === 'string' && report.ncsNumber.startsWith(year.toString()))
    .map(report => parseInt(report.ncsNumber.replace(year.toString(), '')))
    .filter(num => !isNaN(num));

  const nextSequence = existingNcs.length > 0 ? Math.max(...existingNcs) + 1 : 1;

  return `${year}${nextSequence.toString().padStart(3, '0')}`;
};

  // Filter reports by department and audit cycle
  const matchingReports = savedReports.filter(report => 
    report.dptname === departmentName && 
    report.auditCycleNo === auditCycleNo &&
    report.ncsNumber === ncsNumber
  );

  // Auto-open logic
  useEffect(() => {
    if (!autoOpened && departmentName && auditCycleNo && ncsNumber) {
      setAutoOpened(true);
      
      if (matchingReports.length > 0) {
        // If matching report exists, view it
        handleViewReport(matchingReports[0]);
      } else {
        // If no matching report, create new one with observation data
        handleAddNew();
      }
    }
  }, [departmentName, auditCycleNo, ncsNumber, savedReports, autoOpened]);

const handleAddNew = () => {
  const savedDraft = loadDraft(draftKey);
  const newNcNumber = generateNcNumber();

  if (savedDraft) {
    if (window.confirm('A draft was found. Do you want to continue editing the draft?')) {
      dispatch({ type: ACTION_TYPES.LOAD_FORM, payload: savedDraft });
    } else {
      clearDraft(draftKey);
      dispatch({
        type: ACTION_TYPES.RESET_FORM,
        payload: {
          ...INITIAL_FORM_DATA,
          dptname: departmentName,
          auditCycleNo: auditCycleNo,
          ncsNumber: newNcNumber, // ✅ Correctly added here
          auditDate: auditDate,
          process: processActivity,
          nonConformityStatement: findings,
          objectiveEvidence: potentialCauses,
          isoClass: isoClause,
          auditor: auditorSignature,
          auditee: auditeeSignature
        }
      });
    }
  } else {
    dispatch({
      type: ACTION_TYPES.RESET_FORM,
      payload: {
        ...INITIAL_FORM_DATA,
        dptname: departmentName,
        auditCycleNo: auditCycleNo,
        ncsNumber: newNcNumber, // ✅ Correctly added here
        auditDate: auditDate,
        process: processActivity,
        nonConformityStatement: findings,
        objectiveEvidence: potentialCauses,
        isoClass: isoClause,
        auditor: auditorSignature,
        auditee: auditeeSignature
      }
    });
  }

  setEditingIndex(null);
  setViewingReport(null);
  setShowForms(true);
};

  const validateAuditCycleNo = (value) => {
    const pattern = /^(I|II|III|IV)\/\d{4}-(\d{2}|\d{4})$/;
    return pattern.test(value);
  };

  const validateForm = () => {
    if (!formData.dptname) return 'Department is required';
    if (!formData.auditCycleNo) return 'Audit Cycle Number is required';
    if (!validateAuditCycleNo(formData.auditCycleNo)) {
      return 'Please enter a valid Audit Cycle Number in format I/2025-26 or II/2026-2027';
    }
    return null;
  };

   const handleSave = () => {
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    const reportToSave = {
      ...formData,
      id: formData.id || Date.now(),
      savedDate: new Date().toLocaleString(),
      dptname: formData.dptname || departmentName,
      ncsNumber: formData.ncsNumber || ncsNumber // Use ncsNumber here instead of ncsNumberParam
    };

    let updatedReports;
    if (editingIndex !== null) {
      updatedReports = [...savedReports];
      updatedReports[editingIndex] = reportToSave;
    } else {
      updatedReports = [...savedReports, reportToSave];
    }

    setSavedReports(updatedReports);
    localStorage.setItem('latestAuditReport', JSON.stringify(reportToSave));
    clearDraft(draftKey);
    setShowForms(false);
    alert('Report saved successfully!');
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
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      clearDraft(draftKey);
      setShowForms(false);
    }
  };

  const handleDelete = (index) => {
  if (window.confirm("Are you sure you want to delete this report?")) {
    const updatedReports = savedReports.filter((_, i) => i !== index);
    setSavedReports(updatedReports);

    // If the deleted report is currently being viewed, clear it
    if (viewingReport && savedReports[index].id === viewingReport.id) {
      setViewingReport(null);
    }
  }
};

  const handleSaveDraft = () => {
    saveDraft(draftKey, formData);
    alert('Draft saved successfully!');
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
          <NonConformityFormSection
            formData={formData}
            dispatch={dispatch}
            departmentName={departmentName}
          />
          <CorrectiveActionFormSection formData={formData} dispatch={dispatch} />
          <div className="form-buttons">
            <button type="button" className="save-btn" onClick={handleSave}>
              {editingIndex !== null ? 'Update Report' : 'Save Report'}
            </button>
            <button type="button" className="nc-btn" onClick={handleSaveDraft}>
              Save Draft
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
        />
      ) : (
        <ReportList
          reports={savedReports.filter(report => 
            departmentName ? report.dptname === departmentName : true
          )}
          onView={handleViewReport}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddNew={handleAddNew}
          currentDepartment={departmentName}
        />
      )}
    </div>
  );
};

export default ActionReport;