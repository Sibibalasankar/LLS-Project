import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const NonConformityFormSection = ({ formData, dispatch, departmentName, singleObservation }) => {
  const [departments, setDepartments] = useState([]);

  const currentUserRole = localStorage.getItem("userRole");
  const isAuditee = currentUserRole === "auditee";
  const canEditAll = currentUserRole === "admin" || currentUserRole === "auditor";

  useEffect(() => {
    const storedDepartments = JSON.parse(localStorage.getItem("departments") || "[]");
    setDepartments(storedDepartments);
  }, []);

  const handleChange = (e) => {
    if (canEditAll) {
      dispatch({
        type: 'UPDATE_FIELD',
        field: e.target.name,
        value: e.target.value
      });
    }
  };

  const handleActivityChange = (index, field, value) => {
    if (isAuditee || canEditAll) {
      dispatch({
        type: 'UPDATE_ACTIVITY',
        index,
        field,
        value
      });
    }
  };

  const addActivityRow = () => {
    if (isAuditee || canEditAll) {
      dispatch({ type: 'ADD_ACTIVITY_ROW' });
    }
  };

  const validateAuditCycleNo = (value) => {
    const pattern = /^(I|II|III|IV)\/\d{4}-(\d{2}|\d{4})$/;
    return pattern.test(value);
  };

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
                      onChange={handleChange}
                      placeholder="I/2025-26 or II/2026-2027"
                      className={formData.auditCycleNo && !validateAuditCycleNo(formData.auditCycleNo) ? "invalid-input" : ""}
                      readOnly={!canEditAll}
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
                      value={formData.dptname || departmentName || ''}
                      onChange={handleChange}
                      disabled={!!departmentName || !canEditAll}
                    >
                      {departmentName ? (
                        <option value={departmentName}>{departmentName}</option>
                      ) : (
                        <>
                          <option value="">Select Department</option>
                          {departments.map((dept, index) => (
                            <option key={index} value={dept.name}>
                              {dept.name}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  </div>
                </td>
                <td width="33%">
                  <label>NCR. NO.</label>
                  <div className="form-field">
                    <input
                      type="text"
                      name="ncsNumber"
                      value={formData.ncsNumber}
                      onChange={handleChange}
                      readOnly={!canEditAll}
                    />
                  </div>
                </td>
                <td width="33%">
                  <label>AUDIT DATE</label>
                  <div className="form-field">
                    <input
                      type="date"
                      name="auditDate"
                      value={formData.auditDate}
                      onChange={handleChange}
                      readOnly={!canEditAll}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <label>PROCESS</label>
                  <div className="form-field">
                    <textarea
                      name="process"
                      value={Array.isArray(formData.process) ? formData.process.join('\n') : formData.process}
                      onChange={handleChange}
                      rows={3}
                      readOnly={!canEditAll}
                    />
                  </div>
                </td>

                <td>
                  <label>AUDITOR/DEPT.</label>
                  <div className="form-field">
                    <input
                      type="text"
                      name="auditor"
                      value={formData.auditor}
                      onChange={handleChange}
                      readOnly
                    />
                  </div>
                </td>
                <td>
                  <label>AUDITEE</label>
                  <div className="form-field">
                    <input
                      type="text"
                      name="auditee"
                      value={formData.auditee}
                      onChange={handleChange}
                      readOnly
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="document-card">
          <div className="document-field">
            <label>REQUIREMENT</label>
            <textarea
              name="requirement"
              value={formData.requirement}
              onChange={handleChange}
              rows={3}
              readOnly={!canEditAll}
            />
          </div>
        </div>

        <div className="document-card">
          <div className="document-field">
            <label>NONCONFORMITY STATEMENT</label>
            <textarea
              name="nonConformityStatement"
              value={formData.nonConformityStatement}
              onChange={handleChange}
              rows={3}
              readOnly={!canEditAll}
            />
          </div>
        </div>

        <div className="document-card">
          <div className="document-field">
            <label>OBJECTIVE EVIDENCE</label>
            <textarea
              name="objectiveEvidence"
              value={formData.objectiveEvidence}
              onChange={handleChange}
              rows={3}
              readOnly={!canEditAll}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="document-card form-col">
            <div className="document-field">
              <label>ISO 9001-2018: OVIS CLASS NO. & DISCIPLINE</label>
              <textarea
                name="isoClass"
                value={formData.isoClass}
                onChange={handleChange}
                rows={2}
                readOnly={!canEditAll}
              />
            </div>
          </div>

          <div className="document-card form-col">
            <div className="document-field">
              <label>POTENTIAL RISK</label>
              <textarea
                name="potentialRisk"
                value={formData.potentialRisk}
                onChange={handleChange}
                rows={2}
                readOnly={!canEditAll}
              />
            </div>
          </div>
        </div>

        {/* CORRECTION TABLE (Editable by Auditee or All) */}
        <div className="document-card table-card">
          <label htmlFor="">CORRECTION</label>
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
                    <input type="text" value={index + 1} readOnly />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={activity.activity}
                      onChange={(e) => handleActivityChange(index, 'activity', e.target.value)}
                      readOnly={!isAuditee && !canEditAll}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={activity.target}
                      onChange={(e) => handleActivityChange(index, 'target', e.target.value)}
                      readOnly={!isAuditee && !canEditAll}
                    />
                  </td>
                  <td>
                    <select
                      value={activity.status}
                      onChange={(e) => handleActivityChange(index, 'status', e.target.value)}
                      disabled={!isAuditee && !canEditAll}
                    >
                      <option value="">Select Status</option>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Close">Close</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(isAuditee || canEditAll) && (
            <button type="button" className="add-row-btn" onClick={addActivityRow}>
              <span className="icon">+</span> Add Row
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

NonConformityFormSection.propTypes = {
  formData: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  departmentName: PropTypes.string,
  singleObservation: PropTypes.object
};

export default NonConformityFormSection;
