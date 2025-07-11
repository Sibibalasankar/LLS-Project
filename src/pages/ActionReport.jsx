
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
  activities: [{ activity: "", target: "", status: "" }],
  auditorSignature: "",
  auditeeSignature: "",
  rootCauses: ["", "", "", "", ""],
  correctiveActions: [{
    activity: "",
    responsible: "",
    changes: "",
    target: "",
    status: ""
  }],
  closingType: "",         // for radio button a)
  similarNcLocation: "",   // for text input b)

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
          { activity: "", target: "", status: "" }
        ]
      };
    case ACTION_TYPES.ADD_CORRECTIVE_ACTION_ROW:
      return {
        ...state,
        correctiveActions: [
          ...state.correctiveActions,
          { activity: "", responsible: "", changes: "", target: "", status: "" }
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

const ActionReport = ({ isAllDepartments = false }) => {
  // Get data from URL query parameters
  const queryParams = new URLSearchParams(window.location.search);
  const dataParam = queryParams.get('data');
  const ncsNumberParam = queryParams.get('ncsNumber');
  const departmentParam = queryParams.get('department');
  const auditCycleParam = queryParams.get('auditCycle');
  const readOnly = queryParams.get('readOnly') === 'true';

  const observationData = dataParam ? JSON.parse(decodeURIComponent(dataParam)) : null;
  const userView = queryParams.get('userView') === 'true';

  // First, declare all variables and hooks
  const [savedReports, setSavedReports] = useLocalStorage('savedReports', []);
  const [showForms, setShowForms] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [autoOpened, setAutoOpened] = useState(false);
  const navigate = useNavigate();
  // Extract data from observationData
  // Extract data from observationData
  const departmentName = observationData?.department || '';
  const auditCycleNo = observationData?.auditCycleNo || '';
  const ncsNumber = observationData?.ncsNumber || '';
  const auditDate = observationData?.auditDate || new Date().toISOString().split('T')[0];
  const singleObservation = observationData?.observation || {};

  useEffect(() => {
    if (autoOpened) return;

    // Case 1: Direct NC number access
    if (ncsNumberParam && !observationData) {
      const matchingReport = savedReports.find(report =>
        report.ncsNumber === ncsNumberParam &&
        (!departmentParam || report.dptname === departmentParam) &&
        (!auditCycleParam || report.auditCycleNo === auditCycleParam)
      );

      if (matchingReport) {
        setViewingReport(matchingReport);
      } else {
        handleAddNewWithNCNumber(ncsNumberParam, departmentParam, auditCycleParam);
      }

      setAutoOpened(true); // ✅ set this inside both conditions
    }
    // Case 2: Single observation from audit
    else if (observationData && singleObservation.id) {
      const existing = savedReports.find(report =>
        report.observationId === singleObservation.id
      );

      if (existing) {
        setViewingReport(existing);
      } else {
        handleAddNew(); // ✅ Only generate form once
      }

      setAutoOpened(true); // ✅ Prevent reinitializing again
    }
  }, [
    autoOpened,
    ncsNumberParam,
    departmentParam,
    auditCycleParam,
    observationData,
    singleObservation.id,
    savedReports
  ]);

  const handleAddNewWithNCNumber = (ncsNumber, department, auditCycle) => {
    clearDraft(draftKey);
    dispatch({
      type: ACTION_TYPES.RESET_FORM,
      payload: {
        ...INITIAL_FORM_DATA,
        dptname: department || '',
        auditCycleNo: auditCycle || '',
        ncsNumber: ncsNumber,
        auditDate: new Date().toISOString().split('T')[0]
      }
    });
    setEditingIndex(null);
    setViewingReport(null);
    setShowForms(true);
  };

  // Then define helper functions
  const generateNcNumber = () => {
    const year = new Date().getFullYear();
    const existingNcs = savedReports
      .filter(report => typeof report.ncsNumber === 'string' && report.ncsNumber.startsWith(year.toString()))
      .map(report => parseInt(report.ncsNumber.replace(year.toString(), '')))
      .filter(num => !isNaN(num));

    const nextSequence = existingNcs.length > 0 ? Math.max(...existingNcs) + 1 : 1;
    return `${year}${nextSequence.toString().padStart(3, '0')}`;
  };



  const getInitialFormData = () => ({
    ...INITIAL_FORM_DATA,
    dptname: departmentName,
    auditCycleNo: auditCycleNo,
    ncsNumber: generateNcNumber(),
    auditDate: singleObservation.auditDate || auditDate,
    process: singleObservation.processActivity || '',
    requirement: '',
    nonConformityStatement: singleObservation.findings || '',
    objectiveEvidence: singleObservation.potentialCauses || '',
    isoClass: singleObservation.isoClause || '',
    potentialRisk: singleObservation.potentialCauses || '',
    auditor: singleObservation.auditorSignature || '',
    auditee: singleObservation.auditeeSignature || '',
    auditorDesignation: singleObservation.auditorDesignation || '',
    auditeeDesignation: singleObservation.auditeeDesignation || '',
    observationId: singleObservation.id || ''
  });

  const [formData, dispatch] = useReducer(formReducer, INITIAL_FORM_DATA);
  useEffect(() => {
    if (singleObservation?.id && !autoOpened) {
      dispatch({
        type: "SET_FORM", payload: {
          ...INITIAL_FORM_DATA,
          dptname: departmentName,
          auditCycleNo: auditCycleNo,
          ncsNumber: generateNcNumber(),
          auditDate: singleObservation.auditDate || auditDate,
          process: singleObservation.processActivity || '',
          requirement: '',
          nonConformityStatement: singleObservation.findings || '',
          objectiveEvidence: singleObservation.potentialCauses || '',
          isoClass: singleObservation.isoClause || '',
          potentialRisk: singleObservation.potentialCauses || '',
          auditor: singleObservation.auditorSignature || '',
          auditee: singleObservation.auditeeSignature || '',
          auditorDesignation: singleObservation.auditorDesignation || '',
          auditeeDesignation: singleObservation.auditeeDesignation || '',
          observationId: singleObservation.id || ''
        }
      });
    }
  }, [singleObservation, autoOpened]);

  // Rest of your component code...
  // Filter reports by department and audit cycle
  const matchingReports = savedReports.filter(report =>
    report.dptname === departmentName &&
    report.auditCycleNo === auditCycleNo &&
    report.ncsNumber === ncsNumber
  );

  // Auto-open logic

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
            ncsNumber: newNcNumber,
            auditDate: singleObservation.auditDate || auditDate,
            process: singleObservation.processActivity || '',
            requirement: '',
            nonConformityStatement: singleObservation.findings || '',
            objectiveEvidence: singleObservation.potentialCauses || '',
            isoClass: singleObservation.isoClause || '',
            potentialRisk: singleObservation.potentialCauses || '',
            auditor: singleObservation.auditorSignature || '',
            auditee: singleObservation.auditeeSignature || '',
            auditorDesignation: singleObservation.auditorDesignation || '',
            auditeeDesignation: singleObservation.auditeeDesignation || '',
            observationId: singleObservation.id || ''
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
          ncsNumber: newNcNumber,
          auditDate: singleObservation.auditDate || auditDate,
          process: singleObservation.processActivity || '',
          requirement: '',
          nonConformityStatement: singleObservation.findings || '',
          objectiveEvidence: singleObservation.potentialCauses || '',
          isoClass: singleObservation.isoClause || '',
          potentialRisk: singleObservation.potentialCauses || '',
          auditor: singleObservation.auditorSignature || '',
          auditee: singleObservation.auditeeSignature || '',
          auditorDesignation: singleObservation.auditorDesignation || '',
          auditeeDesignation: singleObservation.auditeeDesignation || '',
          observationId: singleObservation.id || ''
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
    ncsNumber: formData.ncsNumber || ncsNumber // Use param fallback
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

  // ✅ Force it to show the updated report again (not list)
  setViewingReport(reportToSave);
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
            singleObservation={singleObservation}
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
          hideBackButton={userView} // ✅ Correct prop name
        />


      ) : (
        <ReportList
          reports={isAllDepartments ? savedReports : savedReports.filter(report =>
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