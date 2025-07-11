import React from 'react';
import PropTypes from 'prop-types';

const CorrectiveActionFormSection = ({ formData, dispatch }) => {
  const handleChange = (e) => {
    dispatch({
      type: 'UPDATE_FIELD',
      field: e.target.name,
      value: e.target.value
    });
  };

  const currentUserRole = localStorage.getItem("userRole");
  const isAuditee = currentUserRole === "auditee";
  const canEditAll = currentUserRole === "admin" || currentUserRole === "auditor";

  const handleRootCauseChange = (index, value) => {
    if (isAuditee || canEditAll) {
      dispatch({
        type: 'UPDATE_ROOT_CAUSE',
        index,
        value
      });
    }
  };

  const handleCorrectiveActionChange = (index, field, value) => {
    if (isAuditee || canEditAll) {
      dispatch({
        type: 'UPDATE_CORRECTIVE_ACTION',
        index,
        field,
        value
      });
    }
  };

  const addCorrectiveActionRow = () => {
    if (isAuditee || canEditAll) {
      dispatch({ type: 'ADD_CORRECTIVE_ACTION_ROW' });
    }
  };

  return (
    <div className="form-section document-format">
      <div className="form-header">
        <h1 className="document-title">Internal Audit Non-Conformity and Corrective Action Report</h1>
      </div>

      {/* ROOT CAUSE(S) */}
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
                  readOnly={!isAuditee && !canEditAll}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACTION TABLE */}
      <div className="document-card">
        <div className="document-field">
          <label className="section-label">ACTION</label>
          <div className="table-responsive">
            <table className="document-table corrective-actions-table">
              <thead>
                <tr>
                  <th width="10%">SL No.</th>
                  <th width="25%">Activity</th>
                  <th width="15%">Responsible</th>
                  <th width="25%">Changes to be made in FMEA/ROAR/OMS Doc. Info.</th>
                  <th width="15%">Target Date</th>
                  <th width="10%">Status</th>
                </tr>
              </thead>
              <tbody>
                {formData.correctiveActions.map((action, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <input
                        type="text"
                        value={action.activity}
                        onChange={(e) => handleCorrectiveActionChange(index, 'activity', e.target.value)}
                        className="table-input"
                        readOnly={!isAuditee && !canEditAll}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={action.responsible}
                        onChange={(e) => handleCorrectiveActionChange(index, 'responsible', e.target.value)}
                        className="table-input"
                        readOnly={!isAuditee && !canEditAll}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={action.changes}
                        onChange={(e) => handleCorrectiveActionChange(index, 'changes', e.target.value)}
                        className="table-input"
                        readOnly={!isAuditee && !canEditAll}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={action.target}
                        onChange={(e) => handleCorrectiveActionChange(index, 'target', e.target.value)}
                        className="table-input"
                        readOnly={!isAuditee && !canEditAll}
                      />
                    </td>
                    <td>
                      <select
                        value={action.status}
                        onChange={(e) => handleCorrectiveActionChange(index, 'status', e.target.value)}
                        className="status-select"
                        disabled={!isAuditee && !canEditAll}
                      >
                        <option value="">Select Status</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(isAuditee || canEditAll) && (
            <button type="button" className="add-row-btn primary-btn" onClick={addCorrectiveActionRow}>
              <span className="btn-icon">+</span> Add Corrective Action
            </button>
          )}
        </div>
      </div>

      {/* FOLLOW-UP */}
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
              readOnly={!canEditAll}
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
              readOnly={!canEditAll}
            />
          </div>
        </div>
      </div>

      {/* ADMIN ONLY */}
      <div className="document-card">
        {currentUserRole === "admin" ? (
          <>
            <div className="document-field">
              <label><strong>a) Closed / Need Re-Action:</strong></label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="closingType"
                    value="Closed"
                    checked={formData.closingType === "Closed"}
                    onChange={handleChange}
                  /> Closed
                </label>
                <label style={{ marginLeft: "1rem" }}>
                  <input
                    type="radio"
                    name="closingType"
                    value="Mixed Re-Action"
                    checked={formData.closingType === "Mixed Re-Action"}
                    onChange={handleChange}
                  /> Need Re-Action
                </label>
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'UPDATE_FIELD', field: 'closingType', value: '' })}
                  className="clear-btn"
                  style={{ marginLeft: '1rem', fontSize: '0.85rem' }}
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="document-field" style={{ marginTop: '1rem' }}>
              <label><strong>b) Arrest similar nonconformity exist, could potentially occur at:</strong></label>
              <div style={{ display: "flex", gap: "1rem" }}>
                <input
                  type="text"
                  name="similarNcLocation"
                  value={formData.similarNcLocation}
                  onChange={handleChange}
                  placeholder="Enter the possible location or area..."
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'UPDATE_FIELD', field: 'similarNcLocation', value: '' })}
                  className="clear-btn"
                  style={{ fontSize: '0.85rem' }}
                >
                  Clear
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="document-field">
              <label><strong>a) Closed / Need Re-Action:</strong></label>
              <p>{formData.closingType || "Not updated"}</p>
            </div>
            <div className="document-field" style={{ marginTop: '1rem' }}>
              <label><strong>b) Arrest similar nonconformity exist, could potentially occur at:</strong></label>
              <p>{formData.similarNcLocation || "Not updated"}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

CorrectiveActionFormSection.propTypes = {
  formData: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default CorrectiveActionFormSection;
