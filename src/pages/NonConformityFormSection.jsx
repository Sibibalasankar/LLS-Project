import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const NonConformityFormSection = ({ formData, dispatch, departmentName, ncObservations }) => {
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

  const mergeObservations = (fieldName) => {
    if (!ncObservations || ncObservations.length === 0) return '';
    return ncObservations.map(obs => obs[fieldName]).filter(Boolean).join('\n');
  };

  useEffect(() => {
    if (ncObservations && ncObservations.length > 0) {
      const fieldsToMerge = [
        { name: 'process', key: 'processActivity' },
        { name: 'requirement', key: 'requirement' },
        { name: 'nonConformityStatement', key: 'findings' },
        { name: 'objectiveEvidence', key: 'objectiveEvidence' },
        { name: 'isoClass', key: 'isoClause' },
        { name: 'potentialRisk', key: 'potentialCauses' },
        { name: 'auditor', key: 'auditorSignature' },
        { name: 'auditee', key: 'auditeeSignature' }
      ];

      fieldsToMerge.forEach(field => {
        if (!formData[field.name]) {
          // For auditor, we'll take the first unique value if there are multiple observations
          const allValues = ncObservations.map(obs => obs[field.key]).filter(Boolean);
          const uniqueValue = [...new Set(allValues)].join(' / '); // Join multiple values with slash
          handleChange({ target: { name: field.name, value: uniqueValue } });
        }
      });
    }
  }, [ncObservations]);

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
                      disabled={!!departmentName}
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
                    <textarea
                      name="process"
                      value={formData.process}
                      onChange={handleChange}
                      rows={3}
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
                      readOnly // Make it read-only if you don't want it to be editable
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="document-card">
          <div className="document-field">
            <label>REQUIREMENT (ISO 9001 STD / Quality manual / SOP / Dept.'s Documented Information)</label>
            <textarea
              name="requirement"
              value={formData.requirement}
              onChange={handleChange}
              rows={3}
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
              />
            </div>
          </div>
        </div>

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
                    <input
                      type="text"
                      value={index + 1} // Auto SL No.
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={activity.activity}
                      onChange={(e) => handleActivityChange(index, 'activity', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="date" // Calendar input
                      value={activity.target}
                      onChange={(e) => handleActivityChange(index, 'target', e.target.value)}
                    />
                  </td>
                  <td>
                    <select
                      value={activity.status}
                      onChange={(e) => handleActivityChange(index, 'status', e.target.value)}
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
  dispatch: PropTypes.func.isRequired,
  departmentName: PropTypes.string,
  ncObservations: PropTypes.array
};

export default NonConformityFormSection;
