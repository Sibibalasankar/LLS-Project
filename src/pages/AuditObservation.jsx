import { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "../assets/styles/AuditObservation.css";

const AuditObservation = () => {
  // State management
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [observations, setObservations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentObservation, setCurrentObservation] = useState({
    id: "",
    slNo: "",
    processActivity: "",
    potentialCauses: "",
    findings: "",
    isoClause: "",
    result: "",
    auditCycleNo: "",
    auditDate: "",
    auditorSignature: "",
    auditorDesignation: "",
    auditeeSignature: "",
    auditeeDesignation: "",
    department: "",
  });

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      const storedDepartments =
        JSON.parse(localStorage.getItem("departments")) || [];
      const storedPlans = JSON.parse(localStorage.getItem("auditPlans")) || [];
      setDepartments(storedDepartments);

      if (selectedDepartment) {
        const departmentPlans = storedPlans.filter(
          (plan) => plan.department === selectedDepartment.name
        );
        const departmentObservations = departmentPlans.flatMap(
          (plan) => plan.observations || []
        );
        setObservations(departmentObservations);
      }
    };

    loadData();
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, [selectedDepartment]);

  // Department selection
  const handleDepartmentSelect = (dept) => {
    setSelectedDepartment(dept);
    resetForm();
  };
  // Function to generate PDF from observation
  const downloadObservationPDF = (observation) => {
    // Create a temporary div to hold our PDF content
    const pdfContent = document.createElement("div");
    pdfContent.style.position = "absolute";
    pdfContent.style.left = "-9999px";
    pdfContent.innerHTML = `
    <div id="pdf-content" style="width: 800px; font-family: Arial, sans-serif; padding: 20px;">
      <div style="text-align: center; margin-bottom: 5px; font-size: 18px;">
        Audit Observation Sheet
      </div>
      <div style="text-align: center; text-decoration: underline; margin-bottom: 15px; font-size: 16px;">
        RISK BASED INTERNAL AUDIT OBSERVATION SHEET
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
        <tr>
          <td style="padding: 8px; text-align: left; border: none;">
            <strong>Dept:</strong> ${
              observation.department || "Quality Management System"
            }
          </td>
          <td style="padding: 8px; text-align: left; border: none;">
            <strong>Audit Cycle no.:</strong> ${observation.auditCycleNo || "I"}
          </td>
          <td style="padding: 8px; text-align: left; border: none;">
            <strong>Audit Date:</strong> ${
              observation.auditDate || "2025-04-01"
            }
          </td>
        </tr>
      </table>
      
      <table style="width: 100%; border-collapse: collapse; border: 1px solid black; margin-bottom: 15px;">
        <thead>
          <tr>
            <th style="border: 1px solid black; padding: 8px; width: 5%;">SL no.</th>
            <th style="border: 1px solid black; padding: 8px; width: 20%;">Process / Activity</th>
            <th style="border: 1px solid black; padding: 8px; width: 25%;">Potential Uncertainties / Potential Causes Of Uncertainties</th>
            <th style="border: 1px solid black; padding: 8px; width: 25%;">Findings and Supporting Objective evidence(s)</th>
            <th style="border: 1px solid black; padding: 8px; width: 10%;">ISO 9001 Clause</th>
            <th style="border: 1px solid black; padding: 8px; width: 15%;">Result * (0+/ NC / OFI)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid black; padding: 8px;">${
              observation.slNo || ""
            }</td>
            <td style="border: 1px solid black; padding: 8px;">${
              observation.processActivity || ""
            }</td>
            <td style="border: 1px solid black; padding: 8px;">${
              observation.potentialCauses || ""
            }</td>
            <td style="border: 1px solid black; padding: 8px;">${
              observation.findings || ""
            }</td>
            <td style="border: 1px solid black; padding: 8px;">${
              observation.isoClause || ""
            }</td>
            <td style="border: 1px solid black; padding: 8px;">
              ${observation.result === "0+" ? "0+" : ""}
              ${observation.result === "NC" ? "NC" : ""}
              ${observation.result === "OFI" ? "OFI" : ""}
            </td>
          </tr>
        </tbody>
      </table>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
        <tr>
          <td style="width: 25%; vertical-align: top; padding: 8px;">
            <strong>RISK:</strong>
            <ul style="margin: 5px 0 0 15px; padding-left: 15px;">
              <li>0+ = Observation Positive (OMS)</li>
              <li>NC = NON CONFORMITY (OMS not Effective)</li>
              <li>OFI = Opportunity For Improvement</li>
            </ul>
          </td>
          <td style="width: 18.75%; vertical-align: top; padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 5px;">Signature of the Auditor</div>
          </td>
          <td style="width: 18.75%; vertical-align: top; padding: 8px;">
            <div>${observation.auditorSignature || "________________"}</div>
          </td>
          <td style="width: 18.75%; vertical-align: top; padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 5px;">Signature of the Auditee</div>
          </td>
          <td style="width: 18.75%; vertical-align: top; padding: 8px;">
            <div>${observation.auditeeSignature || "________________"}</div>
          </td>
        </tr>
        <tr>
          <td></td>
          <td style="vertical-align: top; padding: 8px;">
            <div>Name & Designation:</div>
          </td>
          <td style="vertical-align: top; padding: 8px;">
            <div>${observation.auditorDesignation || "________________"}</div>
          </td>
          <td style="vertical-align: top; padding: 8px;">
            <div>Name / Designation:</div>
          </td>
          <td style="vertical-align: top; padding: 8px;">
            <div>${observation.auditeeDesignation || "________________"}</div>
          </td>
        </tr>
      </table>
      
      <div style="margin-top: 20px; font-size: 12px; text-align: right;">
        <p>LLS1/TQM/QA/06/01/00/R04-00-01/08/2023</p>
      </div>
    </div>
  `;

    document.body.appendChild(pdfContent);

    // Use html2canvas to capture the content
    html2canvas(pdfContent.querySelector("#pdf-content")).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save(
        `Audit_Observation_${observation.department || "QMS"}_${
          observation.slNo || "1"
        }.pdf`
      );

      // Clean up
      document.body.removeChild(pdfContent);
    });
  };
  // Form handling
  const handleAddObservation = () => {
    setCurrentObservation({
      id: generateId(),
      slNo: observations.length + 1,
      processActivity: "",
      potentialCauses: "",
      findings: "",
      isoClause: "",
      result: "",
      auditCycleNo: "",
      auditDate: new Date().toISOString().split("T")[0],
      auditorSignature: "",
      auditorDesignation: "",
      auditeeSignature: "",
      auditeeDesignation: "",
      department: selectedDepartment.name,
    });
    setShowForm(true);
    setIsEditing(false);
  };

  const handleEditObservation = (observation) => {
    setCurrentObservation(observation);
    setShowForm(true);
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentObservation((prev) => ({ ...prev, [name]: value }));
  };

  // Data operations
  const saveObservation = () => {
    const storedPlans = JSON.parse(localStorage.getItem("auditPlans")) || [];
    let updatedPlans = [...storedPlans];

    // Find or create plan for the department
    let departmentPlan = updatedPlans.find(
      (plan) => plan.department === selectedDepartment.name
    );

    if (!departmentPlan) {
      departmentPlan = {
        department: selectedDepartment.name,
        observations: [],
      };
      updatedPlans.push(departmentPlan);
    }

    // Update or add observation
    if (isEditing) {
      departmentPlan.observations = departmentPlan.observations.map((obs) =>
        obs.id === currentObservation.id ? currentObservation : obs
      );
    } else {
      departmentPlan.observations = [
        ...departmentPlan.observations,
        currentObservation,
      ];
    }

    localStorage.setItem("auditPlans", JSON.stringify(updatedPlans));
    setObservations(departmentPlan.observations);
    resetForm();
  };

  const handleDeleteObservation = (id) => {
    if (window.confirm("Are you sure you want to delete this observation?")) {
      const storedPlans = JSON.parse(localStorage.getItem("auditPlans")) || [];
      const updatedPlans = storedPlans.map((plan) => {
        if (plan.department === selectedDepartment.name) {
          return {
            ...plan,
            observations: plan.observations.filter((obs) => obs.id !== id),
          };
        }
        return plan;
      });

      localStorage.setItem("auditPlans", JSON.stringify(updatedPlans));
      setObservations(
        updatedPlans.find((plan) => plan.department === selectedDepartment.name)
          ?.observations || []
      );
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setCurrentObservation({
      id: "",
      slNo: "",
      processActivity: "",
      potentialCauses: "",
      findings: "",
      isoClause: "",
      result: "",
      auditCycleNo: "",
      auditDate: "",
      auditorSignature: "",
      auditorDesignation: "",
      auditeeSignature: "",
      auditeeDesignation: "",
      department: "",
    });
  };

  // Function to open observation sheet in new tab
  const openObservationSheet = (observation) => {
    const observationWindow = window.open("", "_blank", "width=800,height=600");
    observationWindow.document.write(`
      <html>
        <head>
          <title>Audit Observation Sheet</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            .main-title {
              font-size: 18px;
              text-align: center;
              margin-bottom: 5px;
            }
            .sub-title {
              font-size: 16px;
              text-align: center;
              text-decoration: underline;
              margin-top: 0;
              margin-bottom: 15px;
            }
            .header-table, .footer-table {
              width: 100%;
              border-collapse: collapse;
            }
            .header-table td, .footer-table td {
              padding: 8px;
              text-align: left;
              vertical-align: top;
              border: none;
            }
            .observation-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
            }
            .observation-table, .observation-table th, .observation-table td {
              border: 1px solid black;
            }
            .observation-table th, .observation-table td {
              padding: 8px;
              text-align: left;
              vertical-align: top;
            }
            .observation-table th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            .risk-cell {
              width: 25%;
              white-space: nowrap;
              font-size: 11px;
              padding-right: 15px;
            }
            .signature-label-cell {
              width: 18.75%;
            }
            .signature-value-cell {
              width: 18.75%;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              text-align: right;
            }
            .risk-list {
              margin: 5px 0 0 0;
              padding-left: 15px;
            }
            .risk-list li {
              margin-bottom: 2px;
              line-height: 1.2;
            }
            .signature-label {
              font-weight: bold;
              margin-bottom: 5px;
            }
          </style>
        </head>
        <body>
          <table class="observation-table">
            <tr>
              <td colspan="6" style="border: none; padding-bottom: 0;">
                <div class="main-title">Audit Observation Sheet</div>
                <div class="sub-title">RISK BASED INTERNAL AUDIT OBSERVATION SHEET</div>
              </td>
            </tr>
            <tr>
              <td colspan="6" style="border-left: none; border-right: none; border-top: none; padding: 5px;">
                <table class="header-table">
                  <tr>
                    <td><strong>Dept:</strong> ${
                      observation.department || "Quality Management System"
                    }</td>
                    <td><strong>Audit Cycle no.:</strong> ${
                      observation.auditCycleNo || "I"
                    }</td>
                    <td><strong>Audit Date:</strong> ${
                      observation.auditDate || "2025-04-01"
                    }</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <th width="5%">SL no.</th>
              <th width="20%">Process / Activity</th>
              <th width="25%">Potential Uncertainties / Potential Causes Of Uncertainties</th>
              <th width="25%">Findings and Supporting Objective evidence(s)</th>
              <th width="10%">ISO 9001 Clause</th>
              <th width="15%">Result * (0+/ NC / OFI)</th>
            </tr>
            <tr>
              <td>${observation.slNo || ""}</td>
              <td>${observation.processActivity || ""}</td>
              <td>${observation.potentialCauses || ""}</td>
              <td>${observation.findings || ""}</td>
              <td>${observation.isoClause || ""}</td>
              <td>
                ${observation.result === "0+" ? "0+" : ""}
                ${observation.result === "NC" ? "NC" : ""}
                ${observation.result === "OFI" ? "OFI" : ""}
              </td>
            </tr>
            <tr>
              <td colspan="6" style="border-left: none; border-right: none; border-bottom: none; padding: 5px;">
                <table class="footer-table">
                  <tr>
                    <td rowspan="2" class="risk-cell">
                      <strong>RISK:</strong>
                      <ul class="risk-list">
                        <li>0+ = Observation Positive (OMS)</li>
                        <li>NC = NON CONFORMITY (OMS not Effective)</li>
                        <li>OFI = Opportunity For Improvement</li>
                      </ul>
                    </td>
                    <td class="signature-label-cell">
                      <div class="signature-label">Signature of the Auditor</div>
                    </td>
                    <td class="signature-value-cell">
                      <div>${
                        observation.auditorSignature || "________________"
                      }</div>
                    </td>
                    <td class="signature-label-cell">
                      <div class="signature-label">Signature of the Auditee</div>
                    </td>
                    <td class="signature-value-cell">
                      <div>${
                        observation.auditeeSignature || "________________"
                      }</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="signature-label-cell">
                      <div>Name & Designation:</div>
                    </td>
                    <td class="signature-value-cell">
                      <div>${
                        observation.auditorDesignation || "________________"
                      }</div>
                    </td>
                    <td class="signature-label-cell">
                      <div>Name / Designation:</div>
                    </td>
                    <td class="signature-value-cell">
                      <div>${
                        observation.auditeeDesignation || "________________"
                      }</div>
                    </td>
                  </tr>
                </table>
                <div class="footer">
                  <p>LLS1/TQM/QA/06/01/00/R04-00-01/08/2023</p>
                </div>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `);
    observationWindow.document.close();
  };
  return (
    <div className="audit-observation-container">
      <h2 className="page-title">
        RISK BASED INTERNAL AUDIT OBSERVATION SHEET
      </h2>

      {!selectedDepartment ? (
        <div className="department-grid">
          {departments.map((dept, index) => (
            <div key={index} className="department-card card-animation">
              <h3>{dept.name}</h3>
              <p className="dept-description">
                {dept.description || "No description available"}
              </p>
              <button
                className="view-observations-btn"
                onClick={() => handleDepartmentSelect(dept)}
              >
                View Observations
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="audit-header">
            <div>
              <h3>Dept: {selectedDepartment.name}</h3>
              <p>Audit Cycle No: {observations[0]?.auditCycleNo || "N/A"}</p>
              <p>Audit Date: {observations[0]?.auditDate || "N/A"}</p>
            </div>
            <div className="header-actions">
              <button
                className="back-btn"
                onClick={() => setSelectedDepartment(null)}
              >
                &larr; Back to Departments
              </button>
              {!showForm && (
                <button className="add-btn" onClick={handleAddObservation}>
                  + Add Observation
                </button>
              )}
            </div>
          </div>

          {showForm && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveObservation();
              }}
              className="observation-form"
            >
              <h4>{isEditing ? "Edit Observation" : "Add New Observation"}</h4>

              <div className="form-row">
                <div className="form-group">
                  <label>Audit Cycle No:</label>
                  <input
                    type="text"
                    name="auditCycleNo"
                    value={currentObservation.auditCycleNo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Audit Date:</label>
                  <input
                    type="date"
                    name="auditDate"
                    value={currentObservation.auditDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Sl.No:</label>
                  <input
                    type="number"
                    name="slNo"
                    value={currentObservation.slNo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Process/Activity:</label>
                  <input
                    type="text"
                    name="processActivity"
                    value={currentObservation.processActivity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Potential Uncertainties/Causes:</label>
                <textarea
                  name="potentialCauses"
                  value={currentObservation.potentialCauses}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Findings and Evidence:</label>
                <textarea
                  name="findings"
                  value={currentObservation.findings}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>ISO 9001 Clause:</label>
                  <input
                    type="text"
                    name="isoClause"
                    value={currentObservation.isoClause}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Result:</label>
                  <select
                    name="result"
                    value={currentObservation.result}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="0+">0+ (Open Observation Positive)</option>
                    <option value="NC">NC (Non-Conformity)</option>
                    <option value="OFI">
                      OFI (Opportunity For Improvement)
                    </option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Auditor Signature:</label>
                  <input
                    type="text"
                    name="auditorSignature"
                    value={currentObservation.auditorSignature}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Auditor Designation:</label>
                  <input
                    type="text"
                    name="auditorDesignation"
                    value={currentObservation.auditorDesignation}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Auditee Signature:</label>
                  <input
                    type="text"
                    name="auditeeSignature"
                    value={currentObservation.auditeeSignature}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Auditee Designation:</label>
                  <input
                    type="text"
                    name="auditeeDesignation"
                    value={currentObservation.auditeeDesignation}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {isEditing ? "Update Observation" : "Save Observation"}
                </button>
              </div>
            </form>
          )}

          {/* Update the actions column in your table */}
      {observations.length > 0 ? (
        <div className="observations-table">
          <table>
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>Process/Activity</th>
                <th>Findings</th>
                <th>ISO Clause</th>
                <th>Result</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {observations.map((obs) => (
                <tr key={obs.id}>
                  <td>{obs.slNo}</td>
                  <td>{obs.processActivity}</td>
                  <td>{obs.findings}</td>
                  <td>{obs.isoClause}</td>
                  <td>
                    <span className={`result-${obs.result}`}>
                      {obs.result === "0+" && "Open Observation Positive"}
                      {obs.result === "NC" && "Non-Conformity"}
                      {obs.result === "OFI" && "Opportunity For Improvement"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="view-btn"
                        onClick={() => openObservationSheet(obs)}
                      >
                        Open Sheet
                      </button>
                      <button 
                        className="download-btn"
                        onClick={() => downloadObservationPDF(obs)}
                      >
                        Download PDF
                      </button>
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditObservation(obs)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteObservation(obs.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

              <div className="signature-section">
                <div className="signature-box">
                  <p>Signature of the Auditor:</p>
                  <p className="signature-name">
                    {observations[0]?.auditorDesignation || "N/A"}
                  </p>
                </div>
                <div className="signature-box">
                  <p>Signature of the Auditee:</p>
                  <p className="signature-name">
                    {observations[0]?.auditeeDesignation || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="no-data-msg">
              {showForm ? "" : "No observations found for this department."}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AuditObservation;
