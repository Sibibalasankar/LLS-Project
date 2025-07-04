
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
        setAutoOpened(true);
      } else {
        // If no matching report found, create a new one with the provided NC number
        handleAddNewWithNCNumber(ncsNumberParam, departmentParam, auditCycleParam);
      }
    }
    // Case 2: Observation data from audit
    else if (!isAllDepartments && !autoOpened && departmentName && auditCycleNo && ncObservations.length > 0) {
      setAutoOpened(true);
      const matchingReports = savedReports.filter(report =>
        report.dptname === departmentName &&
        report.auditCycleNo === auditCycleNo
      );

      if (matchingReports.length > 0) {
        handleViewReport(matchingReports[0]);
      } else {
        handleAddNew();
      }
    }
  }, [ncsNumberParam, departmentParam, auditCycleParam, observationData, savedReports, autoOpened]);

  // Helper function to add new report with predefined NC number
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
  const mergeObservations = (fieldName) => {
    if (!ncObservations || ncObservations.length === 0) return '';
    return ncObservations.map(obs => obs[fieldName]).filter(Boolean).join('\n');
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

  // Extract data from observationData
  // Extract data from observationData
  const ncObservations = observationData?.observations || [];
  const departmentName = observationData?.department || '';
  const auditCycleNo = observationData?.auditCycleNo || '';
  const ncsNumber = observationData?.ncsNumber || '';
  const auditDate = observationData?.auditDate || new Date().toISOString().split('T')[0];

  // Get values from the first NC observation if available
  const firstObservation = ncObservations.length > 0 ? ncObservations[0] : {};
  const processActivity = firstObservation.processActivity || '';
  const potentialCauses = firstObservation.potentialCauses || '';
  const findings = firstObservation.findings || '';
  const isoClause = firstObservation.isoClause || '';
  const result = firstObservation.result || '';
  const auditorSignature = firstObservation.auditorSignature || '';
  const auditeeSignature = firstObservation.auditeeSignature || '';
  const auditorDesignation = firstObservation.auditorDesignation || '';
  const auditeeDesignation = firstObservation.auditeeDesignation || '';

  // Now initialize formData with all variables available
  const [formData, dispatch] = useReducer(formReducer, {
    ...INITIAL_FORM_DATA,
    dptname: departmentName,
    auditCycleNo: auditCycleNo,
    ncsNumber: generateNcNumber(),
    auditDate: auditDate,
    process: processActivity,
    nonConformityStatement: findings,
    objectiveEvidence: potentialCauses,
    isoClass: isoClause,
    auditor: auditorSignature,
    auditee: auditeeSignature,
    auditorDesignation: auditorDesignation,
    auditeeDesignation: auditeeDesignation
  });
  // Rest of your component code...
  // Filter reports by department and audit cycle
  const matchingReports = savedReports.filter(report =>
    report.dptname === departmentName &&
    report.auditCycleNo === auditCycleNo &&
    report.ncsNumber === ncsNumber
  );

  // Auto-open logic
  // Modify the auto-open logic
  useEffect(() => {
    if (!isAllDepartments && !autoOpened && departmentName && auditCycleNo && ncObservations.length > 0) {
      setAutoOpened(true);

      // Find reports that match any of the NC observations
      const matchingReports = savedReports.filter(report =>
        report.dptname === departmentName &&
        report.auditCycleNo === auditCycleNo
      );

      if (matchingReports.length > 0) {
        handleViewReport(matchingReports[0]);
      } else {
        handleAddNew();
      }
    }
  }, [departmentName, auditCycleNo, ncObservations, savedReports, autoOpened]);

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
            auditDate: auditDate,
            process: processActivity + '\n' + mergeObservations('processActivity'),
            requirement: mergeObservations('requirement'),
            nonConformityStatement: findings + '\n' + mergeObservations('findings'),
            objectiveEvidence: potentialCauses + '\n' + mergeObservations('objectiveEvidence'),
            isoClass: isoClause + '\n' + mergeObservations('isoClause'),
            potentialRisk: mergeObservations('potentialCauses'),
            auditor: auditorSignature,
            auditee: auditeeSignature,
            auditorDesignation: auditorDesignation,
            auditeeDesignation: auditeeDesignation
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
          auditDate: auditDate,
          process: processActivity + '\n' + mergeObservations('processActivity'),
          requirement: mergeObservations('requirement'),
          nonConformityStatement: findings + '\n' + mergeObservations('findings'),
          objectiveEvidence: potentialCauses + '\n' + mergeObservations('objectiveEvidence'),
          isoClass: isoClause + '\n' + mergeObservations('isoClause'),
          potentialRisk: mergeObservations('potentialCauses'),
          auditor: auditorSignature,
          auditee: auditeeSignature,
          auditorDesignation: auditorDesignation,
          auditeeDesignation: auditeeDesignation
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
            ncObservations={ncObservations} // ✅ Pass the observations list here
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