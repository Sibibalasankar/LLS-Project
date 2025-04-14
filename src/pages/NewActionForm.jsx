import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import companyLogo from "../assets/images/lls_logo.png";
import "../assets/styles/ActionReport.css";

const NewActionForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { observation } = location.state || {};

    // Initialize form data from observation if available
    const initialFormData = {
        dept: observation?.department || "",
        ncsNumber: "",
        auditDate: new Date().toISOString().split('T')[0],
        process: observation?.processActivity || "",
        auditor: "",
        auditee: "",
        requirement: "",
        nonConformityStatement: "",
        objectiveEvidence: observation?.findings || "",
        isoClass: observation?.isoClause || "",
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

    const [formData, setFormData] = useState(initialFormData);
    const [savedReports, setSavedReports] = useState([]);
    const [showForms, setShowForms] = useState(false);
    const [showAddButton, setShowAddButton] = useState(true);
    const [editingIndex, setEditingIndex] = useState(null);
    const [viewingReport, setViewingReport] = useState(null);

    // Handlers for all fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRootCauseChange = (index, value) => {
        const newRootCauses = [...formData.rootCauses];
        newRootCauses[index] = value;
        setFormData(prev => ({ ...prev, rootCauses: newRootCauses }));
    };

    const handleActivityChange = (index, field, value) => {
        const newActivities = [...formData.activities];
        newActivities[index][field] = value;
        setFormData(prev => ({ ...prev, activities: newActivities }));
    };

    const handleCorrectiveActionChange = (index, field, value) => {
        const newActions = [...formData.correctiveActions];
        newActions[index][field] = value;
        setFormData(prev => ({ ...prev, correctiveActions: newActions }));
    };

    const addActivityRow = () => {
        setFormData(prev => ({
            ...prev,
            activities: [
                ...prev.activities,
                { slNo: "", activity: "", target: "", status: "" }
            ]
        }));
    };

    const addCorrectiveActionRow = () => {
        setFormData(prev => ({
            ...prev,
            correctiveActions: [
                ...prev.correctiveActions,
                { slNo: "", activity: "", responsible: "", changes: "", target: "", status: "" }
            ]
        }));
    };

    const handleAddNew = () => {
        setFormData(initialFormData);
        setEditingIndex(null);
        setViewingReport(null);
        setShowForms(true);
        setShowAddButton(false);
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
        setShowAddButton(true);
    };

    const handleEdit = (index) => {
        setFormData(savedReports[index]);
        setEditingIndex(index);
        setViewingReport(null);
        setShowForms(true);
        setShowAddButton(false);
    };

    const handleCancel = () => {
        setShowForms(false);
        setShowAddButton(true);
    };

    const handleDelete = (index) => {
        const updatedReports = savedReports.filter((_, i) => i !== index);
        setSavedReports(updatedReports);
    };

    const handleViewReport = (report) => {
        setViewingReport(report);
        setShowForms(false);
        setShowAddButton(false);
    };

    const handleBackToList = () => {
        setViewingReport(null);
        setShowAddButton(true);
    };

    return (
        <div className="action-report-container">
            {showAddButton && (
                <div className="add-button-container">
                    <button type="button" className="add-btn" onClick={handleAddNew}>
                        Add New Action Report
                    </button>
                </div>
            )}

            {showForms ? (
                <>
                    {/* Non-conformity Report Form */}
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

                    {/* Corrective Action Report Form */}
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

                    <div className="form-buttons">
                        <button type="button" className="save-btn" onClick={handleSave}>
                            {editingIndex !== null ? 'Update Report' : 'Save Reports'}
                        </button>
                        <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
                    </div>
                </>
            ) : viewingReport ? (
                // View Mode - Display single report
                <div className="document-format">
                    <div className='head_title_logo'>
                        <img src={companyLogo} alt="" className='img_logo' />
                        <h1 className="document-title">Internal Audit Non Conformity and Corrective Action Report</h1>
                    </div>
                    <table className="document-header-table">
                        <tbody>
                            <tr>
                                <td width="33%"><strong>DEPT</strong>: {viewingReport.dept}</td>
                                <td width="33%"><strong>NCS. NO.</strong>: {viewingReport.ncsNumber}</td>
                                <td width="33%"><strong>AUDIT DATE</strong>: {viewingReport.auditDate}</td>
                            </tr>
                            <tr>
                                <td><strong>PROCESS</strong>: {viewingReport.process}</td>
                                <td><strong>AUDITOR/DEPT.</strong>: {viewingReport.auditor}</td>
                                <td><strong>AUDITEE</strong>: {viewingReport.auditee}</td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <p><strong>REQUIREMENT (ISO 9001 STD / Quality manual / SOP / Dept.'s Documented Information):</strong></p>
                                    <p>{viewingReport.requirement}</p>
                                </td>
                            </tr>
                            <tr>
                                <td className='tbl_data' colSpan={2}>
                                    <p><strong>NONCONFORMITY STATEMENT</strong></p>
                                    <p>{viewingReport.nonConformityStatement}</p>
                                </td>
                                <td className='tbl_data'>
                                    <p><strong>OBJECTIVE EVIDENCE</strong></p>
                                    <p>{viewingReport.objectiveEvidence}</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p><strong>ISO 9001-2018: OVIS CLASS NO. & DISCIPLINE</strong></p>
                                    <p>{viewingReport.isoClass}</p>
                                </td>
                                <td colSpan={2}></td>
                            </tr>
                            <tr>
                                <td className='tbl_data2'>DATE: {viewingReport.auditDate}</td>
                                <td colSpan={2}>SIGNATURE OF AUDITOR: {viewingReport.auditorSignature}</td>
                            </tr>
                            <tr>
                                <td colSpan={3} className="document-section-title">
                                    <p>TO BE FILLED BY AUDITEE</p>
                                </td>
                            </tr>
                            <tr>
                                <td className="document-field">
                                    <p><strong>POTENTIAL RISK</strong></p>
                                    <p>{viewingReport.potentialRisk}</p>
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
                                            {viewingReport.activities.map((activity, index) => (
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
                                <td>DATE: {viewingReport.auditDate}</td>
                                <td colSpan={2}>SIGNATURE OF AUDITEE: {viewingReport.auditeeSignature}</td>
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
                                    {viewingReport.rootCauses.map((cause, index) => (
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
                                            {viewingReport.correctiveActions.map((action, index) => (
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
                                    DATE: {viewingReport.auditDate}<br />
                                    SIGNATURE OF AUDITEE: {viewingReport.auditeeSignature}
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
                                    <p>{viewingReport.followUpObservation}</p>
                                    <p><strong>OBJECTIVE EVIDENCE</strong></p>
                                    <p>{viewingReport.followUpEvidence}</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>DATE: {viewingReport.auditDate}</p>
                                    <p>SIGNATURE OF AUDITOR: {viewingReport.auditorSignature}</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p><strong>NCS. CLOSING STATUS</strong></p>
                                    <p>{viewingReport.closingStatus === "Closed"
                                        ? "a) Closed / Mixed Re-Action"
                                        : "b) Amid similar nonconformity exist, could potentially occur at:"}</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Verified by: {viewingReport.verifiedBy}<br />
                                    Approved by: {viewingReport.approvedBy}<br />
                                    LLS3/TQ3A/QA/6/5/0/8/04-00-03-2022
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="form-buttons">
                        <button type="button" className="edit-btn" onClick={() => {
                            const index = savedReports.findIndex(r => r.id === viewingReport.id);
                            handleEdit(index);
                        }}>Edit</button>
                        <button type="button" className="back-btn" onClick={handleBackToList}>Back to Reports</button>
                    </div>
                </div>
            ) : (
                // List Mode - Display saved reports
                <div className="saved-reports-container">
                    <h2>Saved Action Reports</h2>
                    {savedReports.length > 0 ? (
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
                                {savedReports.map((report, index) => (
                                    <tr key={report.id}>
                                        <td>{report.ncsNumber}</td>
                                        <td>{report.dept}</td>
                                        <td>{report.auditDate}</td>
                                        <td>{report.savedDate}</td>
                                        <td>
                                            <button onClick={() => handleViewReport(report)}>View</button>
                                            <button onClick={() => handleEdit(index)}>Edit</button>
                                            <button onClick={() => handleDelete(index)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No reports saved yet.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default NewActionForm;