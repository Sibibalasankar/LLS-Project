import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/AuditPlanDetails.css";

const AuditPlanDetails = ({ department, onClose }) => {
  const navigate = useNavigate();
  const [auditPlans, setAuditPlans] = useState(() => {
    const savedPlans = localStorage.getItem("auditPlans");
    return savedPlans ? JSON.parse(savedPlans) : [];
  });
  const [auditor, setAuditor] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [currentYear, setCurrentYear] = useState("");
  const [newProcess, setNewProcess] = useState(""); // For adding new processes
  const [formData, setFormData] = useState({
    auditCycle: "I",
    date: "",
    timeDuration: "",
    processes: [],
    auditor: "",
    auditees: "",
  });
  const [isAuditorAssigned, setIsAuditorAssigned] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const year = new Date().getFullYear();
    setCurrentYear(`${year}-${year + 1}`);
  }, []);

  useEffect(() => {
    if (department) {
      const auditorList = JSON.parse(localStorage.getItem("auditors")) || [];
      const assignedAuditor = auditorList.find(
        (aud) => aud.department === department.name
      );
      if (assignedAuditor) {
        setAuditor(assignedAuditor.name);
        setFormData((prev) => ({ ...prev, auditor: assignedAuditor.name }));
        setIsAuditorAssigned(true);
        setErrorMessage("");
      } else {
        setAuditor("");
        setIsAuditorAssigned(false);
        setErrorMessage(
          "No auditor assigned for this department. Please assign one before proceeding."
        );
      }
    }
  }, [department]);

  useEffect(() => {
    localStorage.setItem("auditPlans", JSON.stringify(auditPlans));
  }, [auditPlans]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddProcess = () => {
    if (newProcess.trim()) {
      setFormData((prev) => ({
        ...prev,
        processes: [...prev.processes, newProcess.trim()],
      }));
      setNewProcess(""); // Clear input after adding
    }
  };

  const handleRemoveProcess = (index) => {
    setFormData((prev) => ({
      ...prev,
      processes: prev.processes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!department || !formData.date || !isAuditorAssigned) {
      alert("Cannot save. An auditor must be assigned before proceeding.");
      return;
    }

    if (
      !window.confirm(
        editIndex !== null
          ? "Are you sure you want to update this audit plan?"
          : "Are you sure you want to add this audit plan?"
      )
    ) {
      return; // If user cancels, do nothing
    }

    let updatedPlans;
    const formattedCycle = `${formData.auditCycle}/${currentYear}`;

    if (editIndex !== null) {
      updatedPlans = [...auditPlans];
      updatedPlans[editIndex] = {
        ...formData,
        department: department.name,
        formattedCycle,
      };
    } else {
      updatedPlans = [
        ...auditPlans,
        { ...formData, department: department.name, formattedCycle },
      ];
    }

    setAuditPlans(updatedPlans);
    localStorage.setItem("auditPlans", JSON.stringify(updatedPlans));
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData({ ...auditPlans[index] }); // Populate form with existing data
    setShowForm(true);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("audit-plan-table");
    if (!printContent) {
      alert("Audit Plan Table not found!");
      return;
    }

    // Clone the table to manipulate it without affecting the original
    const clonedTable = printContent.cloneNode(true);

    // Remove the last column (Action column) from the header and all rows
    const headers = clonedTable.querySelectorAll("thead th");
    if (headers.length) headers[headers.length - 1].remove(); // Remove "Action" column header

    clonedTable.querySelectorAll("tbody tr").forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length) cells[cells.length - 1].remove(); // Remove "Action" column data
    });

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Audit Plan</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h5{
               background-color: #FFC000;
               padding: 10px;
               border-top: 1px solid black; 
               border-bottom: 1px solid black;
               text-align: center;
             }
          </style>
        </head>
        <body>
          <h2>Audit Plan Details</h2>
          <h5 className="iso_title mb-4">
        INTERNAL AUDIT SCHEDULE - ISO 9001:2015
      </h5>
          ${clonedTable.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };
  const resetForm = () => {
    setFormData({
      auditCycle: "I",
      date: "",
      timeDuration: "",
      processes: [],
      auditor: auditor,
      auditees: "",
    });
    setNewProcess(""); // Ensure new process input is cleared
    setEditIndex(null);
  };

  return (
    <div className="audit-plan-container">
      <center className="mb-4"> <h2>Audit Plan Details</h2></center>
      <h5 className="iso_title mb-4">
        INTERNAL AUDIT SCHEDULE - ISO 9001:2015
      </h5>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="header-buttons">
        <button
          onClick={() =>
            onClose ? onClose() : navigate("/audit-plan-creation")
          }
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
        >
          ← Back
        </button>
        <div className="two_btns">
          <button
            className="add-btn mb-3"
            onClick={() => setShowForm(true)}
            disabled={!isAuditorAssigned}
          >
            Add Audit Plan
          </button>
          <button className="print-btn mb-3" onClick={handlePrint}>
            🖨️ Print
          </button>
        </div>
      </div>

      <table id="audit-plan-table" className="audit-table">
        <thead>
          <tr>
            <th>Audit Cycle No</th>
            <th>Department</th>
            <th>Date</th>
            <th>Time Duration</th>
            <th>Processes</th>
            <th>Auditor (Lead)</th>
            <th>Auditee(s)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {auditPlans
            .filter((plan) => plan.department === department?.name)
            .map((plan, index) => (
              <tr key={index}>
                <td>{plan.formattedCycle}</td>
                <td>{plan.department}</td>
                <td>{plan.date}</td>
                <td>{plan.timeDuration}</td>
                <td>
                  <ol>
                    {plan.processes.map((process, i) => (
                      <li key={i}>{process}</li>
                    ))}
                  </ol>
                </td>
                <td>{plan.auditor}</td>
                <td>{plan.auditees}</td>
                <td>
                  <button
                    onClick={() => handleEdit(index)}
                    className="edit-btn styled-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this audit plan?"
                        )
                      ) {
                        setAuditPlans(auditPlans.filter((_, i) => i !== index));
                      }
                    }}
                    className="delete-btn styled-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {showForm && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h3>{editIndex !== null ? "Edit Audit Plan" : "Add Audit Plan"}</h3>
            <form onSubmit={handleSubmit}>
              <select
                name="auditCycle"
                value={formData.auditCycle}
                onChange={handleChange}
                required
              >
                <option value="I">I</option>
                <option value="II">II</option>
                <option value="III">III</option>
                <option value="IV">IV</option>
                <option value="V">V</option>
              </select>

              <input
                type="text"
                name="department"
                value={department?.name || ""}
                readOnly
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />

              <select
                name="timeDuration"
                value={formData.timeDuration}
                onChange={handleChange}
              >
                <option value="">Select Time Duration</option>
                <option value="1 Hrs">1 Hrs</option>
                <option value="2 Hrs">2 Hrs</option>
                <option value="3 Hrs">3 Hrs</option>
                <option value="4 Hrs">4 Hrs</option>
                <option value="5 Hrs">5 Hrs</option>
              </select>

              <div className="processes-container">
                <input
                  type="text"
                  placeholder="Add Process"
                  value={newProcess}
                  onChange={(e) => setNewProcess(e.target.value)}
                />
                <button
                  type="button"
                  className="edit-btn"
                  onClick={handleAddProcess}
                >
                  + Add
                </button>
                <ol>
                  {formData.processes.map((process, index) => (
                    <li key={index}>
                      {process}{" "}
                      <button
                        type="button"
                        onClick={() => handleRemoveProcess(index)}
                      >
                        ❌
                      </button>
                    </li>
                  ))}
                </ol>
              </div>

              <input type="text" name="auditor" value={auditor} readOnly />
              <input
                type="text"
                name="auditees"
                placeholder="Auditee(s)"
                value={formData.auditees}
                onChange={handleChange}
              />
              <div className="form-buttons">
                <button
                  type="button"
                  className="close-btns"
                  onClick={() => setShowForm(false)}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="submit-btns"
                  disabled={!isAuditorAssigned}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditPlanDetails;
