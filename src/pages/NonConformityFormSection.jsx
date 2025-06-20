import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const NonConformityFormSection = ({ formData, dispatch }) => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const storedDepartments = JSON.parse(localStorage.getItem("departments") || "[]");
    setDepartments(storedDepartments);
  }, []);

  const handleChange = (e) => {
    dispatch({
      type: 'UPDATE_FIELD',
      field: e.target.name,
      value: e.target.value
    });
  };

  const handleActivityChange = (index, field, value) => {
    dispatch({
      type: 'UPDATE_ACTIVITY',
      index,
      field,
      value
    });
  };

  const addActivityRow = () => {
    dispatch({ type: 'ADD_ACTIVITY_ROW' });
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
                      onChange={(e) => {
                        dispatch({
                          type: 'UPDATE_FIELD',
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
                  <label>NCR. NO.</label>
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

NonConformityFormSection.propTypes = {
  formData: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default NonConformityFormSection;