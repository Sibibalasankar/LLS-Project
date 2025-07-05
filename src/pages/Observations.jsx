import React, { useState, useEffect } from "react";
import "../assets/styles/Observation.css";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import companylogo from "../assets/images/lls_logo.png";
import { FiEdit, FiTrash2, FiFileText, FiArrowLeft, FiPlus, FiFolder } from "react-icons/fi";
import { saveDraft, loadDraft, clearDraft } from "../utils/draftUtils";

const Observations = ({ observationId: propObservationId, departmentName, auditCycleNo: propAuditCycleNo, onBack }) => {
  const [observations, setObservations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [observationId, setObservationId] = useState(null);
  const [availableAuditors, setAvailableAuditors] = useState([]);
  const [availableAuditees, setAvailableAuditees] = useState([]);
  const userRole = localStorage.getItem('userRole');
  const canEdit = userRole === 'admin' || userRole === 'auditor';

  // Get current and next year for audit cycle format
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const yearFormat = `${currentYear}-${nextYear}`;
  const isoClauseOptions = [
  { value: "1", label: "1 – Scope" },
  { value: "2", label: "2 – Normative references" },
  { value: "3", label: "3 – Terms and definitions" },
  { value: "4", label: "4 – Context of the organization" },
  { value: "4.1", label: "4.1 – Understanding the organization and its context" },
  { value: "4.2", label: "4.2 – Understanding the needs and expectations of interested parties" },
  { value: "4.3", label: "4.3 – Determining the scope of the quality management system" },
  { value: "4.4", label: "4.4 – Quality management system and its processes" },
  { value: "5", label: "5 – Leadership" },
  { value: "5.1", label: "5.1 – Leadership and commitment" },
  { value: "5.2", label: "5.2 – Policy" },
  { value: "5.3", label: "5.3 – Organizational roles, responsibilities and authorities" },
  { value: "6", label: "6 – Planning" },
  { value: "6.1", label: "6.1 – Actions to address risks and opportunities" },
  { value: "6.2", label: "6.2 – Quality objectives and planning to achieve them" },
  { value: "6.3", label: "6.3 – Planning of changes" },
  { value: "7", label: "7 – Support" },
  { value: "7.1", label: "7.1 – Resources" },
  { value: "7.2", label: "7.2 – Competence" },
  { value: "7.3", label: "7.3 – Awareness" },
  { value: "7.4", label: "7.4 – Communication" },
  { value: "7.5", label: "7.5 – Documented information" },
  { value: "8", label: "8 – Operation" },
  { value: "8.1", label: "8.1 – Operational planning and control" },
  { value: "8.2", label: "8.2 – Requirements for products and services" },
  { value: "8.3", label: "8.3 – Design and development" },
  { value: "8.4", label: "8.4 – Control of externally provided processes, products and services" },
  { value: "8.5", label: "8.5 – Production and service provision" },
  { value: "8.6", label: "8.6 – Release of products and services" },
  { value: "8.7", label: "8.7 – Control of nonconforming outputs" },
  { value: "9", label: "9 – Performance evaluation" },
  { value: "9.1", label: "9.1 – Monitoring, measurement, analysis and evaluation" },
  { value: "9.2", label: "9.2 – Internal audit" },
  { value: "9.3", label: "9.3 – Management review" },
  { value: "10", label: "10 – Improvement" },
  { value: "10.1", label: "10.1 – General" },
  { value: "10.2", label: "10.2 – Nonconformity and corrective action" },
  { value: "10.3", label: "10.3 – Continual improvement" },
];

  const [currentObservation, setCurrentObservation] = useState({
    id: "",
    slNo: "",
    processActivity: "",
    potentialCauses: "",
    findings: "",
    isoClause: "",
    result: "",
    auditCycleNo: `I/${yearFormat}`,
    auditDate: new Date().toISOString().split("T")[0],
    auditorSignature: "",
    auditorDesignation: "",
    auditeeSignature: "",
    auditeeDesignation: "",
    department: departmentName || ""
  });

  const auditCycleOptions = ["I", "II", "III", "IV", "V"];
  const [actionObservation, setActionObservation] = useState(null);
  const [showActionForm, setShowActionForm] = useState(false);
  const firstObservation = observations[0] || null;
  const isFirstObservation = observations.length === 0;
  const [auditCycleNo, setAuditCycleNo] = useState(propAuditCycleNo || "");

  const navigate = useNavigate();

  const getNcObservations = () => {
    return observations.filter(obs => obs.result === "NC");
  };

  const handleOpenActionForm = () => {
    const ncObservations = getNcObservations();
    if (ncObservations.length === 0) {
      alert("No NC observations found!");
      return;
    }

    const url = `/admin-dashboard/action-report?data=${encodeURIComponent(JSON.stringify({
      observations: ncObservations,
      department: departmentName,
      auditCycleNo: ncObservations[0].auditCycleNo,
      auditorName: ncObservations[0].auditorSignature,
      auditorDesignation: ncObservations[0].auditorDesignation,
      auditeeName: ncObservations[0].auditeeSignature,
      auditeeDesignation: ncObservations[0].auditeeDesignation
    }))}`;
    window.open(url, "_blank");
  };
  const handleCloseActionForm = () => {
    setShowActionForm(false);
    setActionObservation(null);
  };

  // Initialize observationId from props or localStorage
  useEffect(() => {
    if (propObservationId) {
      localStorage.setItem("currentObservationId", propObservationId);
      setObservationId(propObservationId);
    } else {
      const storedId = localStorage.getItem("currentObservationId");
      if (storedId) {
        setObservationId(storedId);
      }
    }
  }, [propObservationId]);

  // Load observations from localStorage when observationId is set
  useEffect(() => {
    if (observationId) {
      const storedObservations = JSON.parse(localStorage.getItem("auditObservations")) || {};
      const obs = storedObservations[observationId] || [];
      setObservations(obs);

      const departmentObservations = JSON.parse(localStorage.getItem(`observations_${departmentName}`)) || [];
      const matched = departmentObservations.find(o => o.id.toString() === observationId.toString());

      if (matched && matched.auditCycleNo) {
        setAuditCycleNo(matched.auditCycleNo);
        setCurrentObservation(prev => ({
          ...prev,
          auditCycleNo: matched.auditCycleNo
        }));
      }
    }
  }, [observationId, departmentName]);


  // Save observations to localStorage whenever they change
  useEffect(() => {
    if (observationId) {
      const allObservations = JSON.parse(localStorage.getItem("auditObservations")) || {};
      allObservations[observationId] = observations;
      localStorage.setItem("auditObservations", JSON.stringify(allObservations));
    }
  }, [observations, observationId]);

  // Load auditors and auditees for the current department
  useEffect(() => {
    if (departmentName) {
      // Load from department mapping first
      const departmentMapping = JSON.parse(localStorage.getItem("departmentMapping")) || {};
      const mappedData = departmentMapping[departmentName];

      if (mappedData) {
        setAvailableAuditors([{ name: mappedData.auditor, designation: "Auditor" }]);
        setAvailableAuditees([{ name: mappedData.auditee, designation: "Auditee" }]);
        return;
      }

      // Fallback to auditor list if no mapping found
      const storedAuditors = JSON.parse(localStorage.getItem("auditors")) || [];
      const departmentAuditors = storedAuditors.filter(
        (auditor) => auditor.department === departmentName
      );

      if (departmentAuditors.length > 0) {
        setAvailableAuditors(departmentAuditors.map(a => ({
          name: a.name,
          designation: "Auditor"
        })));

        // Get unique auditees from the auditors' certifiedOnName field
        const auditees = departmentAuditors.reduce((acc, auditor) => {
          if (auditor.certifiedOnName && !acc.some(a => a.name === auditor.certifiedOnName)) {
            acc.push({ name: auditor.certifiedOnName, designation: "Auditee" });
          }
          return acc;
        }, []);

        setAvailableAuditees(auditees);
      }
    }
  }, [departmentName]);

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);
  const getNextAuditCycleNo = () => {
    const cycles = ["I", "II", "III", "IV", "V"];
    // Get all used cycles from current observations
    const usedCycles = observations.map(obs => obs.auditCycleNo.split('/')[0]);

    // Find the first unused cycle
    for (let cycle of cycles) {
      if (!usedCycles.includes(cycle)) {
        return `${cycle}/${yearFormat}`;
      }
    }

    // Fallback if all cycles are used
    return `I/${yearFormat}`;
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentObservation((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResultChange = (e) => {
    setCurrentObservation((prev) => ({
      ...prev,
      result: e.target.value
    }));
  };

  const getNextSlNo = () => (observations.length === 0 ? 1 : Math.max(...observations.map((o) => Number(o.slNo) || 0)) + 1);
  const handleCreate = () => {
    const draftKey = `observationDraft_${observationId}`;
    const savedDraft = loadDraft(draftKey);

    if (savedDraft) {
      setCurrentObservation(savedDraft);
    } else {
      const newObservation = {
        id: "",
        slNo: getNextSlNo(),
        processActivity: "",
        potentialCauses: "",
        findings: "",
        isoClause: "",
        result: "",
        auditCycleNo: auditCycleNo, // ✅ use the correct cycle passed from parent
        auditDate: observations.length > 0 ? observations[0].auditDate : new Date().toISOString().split("T")[0],
        auditorSignature: availableAuditors.length === 1 ? availableAuditors[0].name : "",
        auditorDesignation: "Auditor",
        auditeeSignature: availableAuditees.length === 1 ? availableAuditees[0].name : "",
        auditeeDesignation: "Auditee",
        department: departmentName || "",
      };

      setCurrentObservation(newObservation);
    }

    setShowForm(true);
  };


  const handleSaveDraft = () => {
    const draftKey = `observationDraft_${observationId}`;
    saveDraft(draftKey, currentObservation);
    alert('Draft Saved!');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const observationToSave = currentObservation.id
      ? currentObservation
      : {
        ...currentObservation,
        id: generateId(),
        slNo: currentObservation.slNo || getNextSlNo()
      };

    const updatedObservations = currentObservation.id
      ? observations.map((obs) => (obs.id === currentObservation.id ? observationToSave : obs))
      : [...observations, observationToSave];

    setObservations(updatedObservations);
    setShowForm(false);
  };

  const handleEdit = (observation) => {
    setCurrentObservation(observation);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this observation?")) {
      setObservations(observations.filter((obs) => obs.id !== id));
    }
    const draftKey = `observationDraft_${observationId}`;
    clearDraft(draftKey);
  };

  return (
    <div className="observations-container">
      <div className="header-with-logo">
        <img src={companylogo} alt="Company Logo" className="company-logo" />
        <h2 className="page-title">RISK BASED INTERNAL AUDIT OBSERVATION SHEET</h2>
      </div>

      {/* Header information row */}
      <div className="audit-info-row">
        <div className="audit-info-item">
          <strong>Dept.:</strong> {currentObservation.department}
        </div>
        <div className="audit-info-item">
          <strong>Audit Cycle no.:</strong> {auditCycleNo}
        </div>
        <div className="audit-info-item">
          <strong>Audit Date:</strong> {observations.length > 0 ? observations[0].auditDate : "-"}        </div>
      </div>

      <div className="observations-table-container p-3">
        <table className="observations-table">
          <thead>
            <tr>
              <th>Sl.no.</th>
              <th>Process / Activity</th>
              <th>Potential Uncertainties / Potential Causes of Uncertainties</th>
              <th>Findings and Supporting Objective evidence(s)</th>
              <th>ISO 9001 Clause</th>
              <th>Result * (0+/ NC / OFI)</th>
              {canEdit && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {observations.length > 0 ? (
              observations.map((obs) => (
                <tr key={obs.id}>
                  <td>{obs.slNo}</td>
                  <td>{obs.processActivity}</td>
                  <td>{obs.potentialCauses}</td>
                  <td>{obs.findings}</td>
                  <td>{obs.isoClause}</td>
                  <td>{obs.result}</td>
                  {canEdit && (
                    <td className="btns_td">
                      <td className="btns_td">
                        <button className="icon-btns" onClick={() => handleEdit(obs)} title="Edit Observation">
                          <FiEdit size={20} />
                        </button>
                        <button className="icon-btns" onClick={() => handleDelete(obs.id)} title="Delete Observation">
                          <FiTrash2 size={20} />
                        </button>
                      </td>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr className="empty-table-message">
                <td colSpan={userRole !== 'auditee' ? "7" : "6"}>No observations found for this audit. Create a new one.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Action Form Modal */}
      {showActionForm && actionObservation && (
        <div className="action-form-overlay">
          <div className="action-form-modal">
            <h3>Action Plan for Observation #{actionObservation.slNo}</h3>
            <form>
              <div className="form-group">
                <label>Corrective Action:</label>
                <textarea rows={4} placeholder="Enter corrective action..." />
              </div>
              <div className="form-group">
                <label>Responsible Person:</label>
                <input type="text" placeholder="Enter name..." />
              </div>
              <div className="form-group">
                <label>Target Completion Date:</label>
                <input type="date" />
              </div>

              <div className="form-buttons">
                <button type="submit" className="save-btn">Save Action</button>
                <button type="button" className="cancel-btn" onClick={handleCloseActionForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Observation Form Modal */}
      {showForm && (
        <div className="observation-form-overlay" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="observation-form-modal">
            <button
              className="close-modal-btn"
              onClick={() => setShowForm(false)}
              aria-label="Close form"
            >
              &times;
            </button>
            <h3>{currentObservation.id ? "Edit Observation" : "Add New Observation"}</h3>
            <form onSubmit={handleSubmit} className="observation-form">
              <div className="form-row">
                <div className="form-group">
                  <label>
                    Audit Cycle No:
                    <input
                      type="text"
                      name="auditCycleNo"
                      value={currentObservation.auditCycleNo}
                      readOnly
                    />
                  </label>

                </div>
                <div className="form-group">
                  <label>
                    Audit Date:
                    <input
                      type="date"
                      name="auditDate"
                      value={currentObservation.auditDate}
                      onChange={handleInputChange}
                      required
                      readOnly={!isFirstObservation} // Lock after first observation
                    />

                  </label>
                </div>

                <div className="form-group">
                  <label>
                    Department:
                    <input
                      type="text"
                      name="department"
                      value={currentObservation.department}
                      onChange={handleInputChange}
                      readOnly
                    />

                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>
                  Process / Activity:
                  <textarea
                    name="processActivity"
                    value={currentObservation.processActivity}
                    onChange={handleInputChange}
                    required
                    rows={3}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>
                  Potential Uncertainties / Causes:
                  <textarea
                    name="potentialCauses"
                    value={currentObservation.potentialCauses}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>
                  Findings:
                  <textarea
                    name="findings"
                    value={currentObservation.findings}
                    onChange={handleInputChange}
                    required
                    rows={4}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>
                  ISO 9001 Clause:
                  <select
                    name="isoClause"
                    value={currentObservation.isoClause}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Select Clause --</option>
                    {isoClauseOptions.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>


              <div className="form-group">
                <label>Result:</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="result"
                      value="O+"
                      checked={currentObservation.result === "O+"}
                      onChange={handleResultChange}
                    />
                    <span className="radiotext">0+ (Observation Positive)</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="result"
                      value="NC"
                      checked={currentObservation.result === "NC"}
                      onChange={handleResultChange}
                    />
                    <span className="radiotext">NC (Non-Conformity)</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="result"
                      value="OFI"
                      checked={currentObservation.result === "OFI"}
                      onChange={handleResultChange}
                    />
                    <span className="radiotext">OFI (Opportunity For Improvement)</span>
                  </label>
                </div>
              </div>

              {/* Only show auditor/auditee fields if this is the first observation */}
              {observations.length === 0 && (
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Auditor Name:
                      {availableAuditors.length > 1 ? (
                        <select
                          name="auditorSignature"
                          value={currentObservation.auditorSignature}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Auditor</option>
                          {availableAuditors.map((auditor, index) => (
                            <option key={index} value={auditor.name}>
                              {auditor.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          name="auditorSignature"
                          value={currentObservation.auditorSignature || (availableAuditors.length === 1 ? availableAuditors[0].name : "")}
                          onChange={handleInputChange}
                          required
                          readOnly={availableAuditors.length === 1}
                        />
                      )}
                    </label>
                  </div>

                  <div className="form-group">
                    <label>
                      Auditor Designation:
                      <select
                        name="auditorDesignation"
                        value={currentObservation.auditorDesignation}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Designation</option>
                        <option value="Manager">Manager</option>
                        <option value="Engineer">Engineer</option>
                        <option value="Technician">Technician</option>
                        <option value="Supervisor">Supervisor</option>
                        <option value="Analyst">Analyst</option>
                        <option value="Executive">Executive</option>
                      </select>

                    </label>
                  </div>

                  <div className="form-group">
                    <label>
                      Auditee Name:
                      {availableAuditees.length > 1 ? (
                        <select
                          name="auditeeSignature"
                          value={currentObservation.auditeeSignature}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Auditee</option>
                          {availableAuditees.map((auditee, index) => (
                            <option key={index} value={auditee.name}>
                              {auditee.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          name="auditeeSignature"
                          value={currentObservation.auditeeSignature || (availableAuditees.length === 1 ? availableAuditees[0].name : "")}
                          onChange={handleInputChange}
                          required
                          readOnly={availableAuditees.length === 1}
                        />
                      )}
                    </label>
                  </div>

                  <div className="form-group">
                    <label>
                      Auditee Designation:
                      <select
                        name="auditeeDesignation"
                        value={currentObservation.auditeeDesignation}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Designation</option>
                        <option value="Manager">Manager</option>
                        <option value="Engineer">Engineer</option>
                        <option value="Technician">Technician</option>
                        <option value="Supervisor">Supervisor</option>
                        <option value="Analyst">Analyst</option>
                        <option value="Executive">Executive</option>
                      </select>

                    </label>
                  </div>
                </div>
              )}
              {canEdit && (
                <div className="form-buttons">
                  <button type="submit" className="save-btn">Save Observation</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="button" className="nc-btn" onClick={handleSaveDraft}>Save Draft</button>
                </div>
              )}

            </form>
          </div>
        </div>
      )}

      <div className="signatures-summary">
        <div className="signature-info">
          <div className="audit-info-item">
            <strong>Auditee:</strong> {observations.length > 0 ? `${observations[0].auditeeSignature} (${observations[0].auditeeDesignation})` : "-"}
          </div>
          <div className="audit-info-item">
            <strong>Auditee:</strong> {observations.length > 0 ? `${observations[0].auditeeSignature} (${observations[0].auditeeDesignation})` : "-"}
          </div>
        </div>
      </div>

      <div className="button-groups">
        <Button onClick={onBack} className="button back-btn icon-btns" title="Back to Dashboard">
          <FiArrowLeft size={22} />Back
        </Button>

        {canEdit && (
          <Button onClick={handleCreate} className="button create-btn icon-btns" title="Add Observation">
            <FiPlus size={22} />Add
          </Button>
        )}


        <Button className="button open-sheet-btn icon-btns" title="Open Record"
          onClick={() => window.open('/audit-report', '_blank')}
        >
          <FiFolder size={22} />Open Record
        </Button>
        {getNcObservations().length > 0 && (
          <div className="nc-action-button-container">
            <Button
              onClick={handleOpenActionForm}
              className="button action-report-btn"
            >
              <FiFileText size={20} /> Generate Action Report for NCs
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Observations;