import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaPrint, FaEdit, FaCheck, FaTrash, FaPlusCircle, FaTimes, FaSave } from "react-icons/fa";
import { saveDraft, loadDraft, clearDraft } from "../utils/draftUtils";
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
  const [newProcess, setNewProcess] = useState("");
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
        setFormData((prev) => ({
          ...prev,
          auditor: assignedAuditor.name,
          auditees: assignedAuditor.certifiedOnName,
        }));
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
      setNewProcess("");
    }
  };

  const handleRemoveProcess = (index) => {
    setFormData((prev) => ({
      ...prev,
      processes: prev.processes.filter((_, i) => i !== index),
    }));
  };

  const handleFormOpen = () => {
    const draft = loadDraft("auditPlanDraft");
    if (draft) {
      if (window.confirm("A draft is available. Do you want to load it?")) {
        setFormData(draft);
      } else {
        resetForm(); // Open a fresh form if user cancels
      }
    } else {
      resetForm(); // No draft exists, open fresh form
    }
    setShowForm(true); // Always open form
  };


  const handleSaveDraft = () => {
    saveDraft("auditPlanDraft", formData);
    alert("Draft saved successfully!");
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
      return;
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
    clearDraft("auditPlanDraft");
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData({ ...auditPlans[index] });
    setShowForm(true);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this audit plan?")) {
      const updatedPlans = [...auditPlans];
      updatedPlans.splice(index, 1);
      setAuditPlans(updatedPlans);
      localStorage.setItem("auditPlans", JSON.stringify(updatedPlans));
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById("audit-plan-table");
    if (!printContent) {
      alert("Audit Plan Table not found!");
      return;
    }

    const clonedTable = printContent.cloneNode(true);

    const headers = clonedTable.querySelectorAll("thead th");
    if (headers.length) headers[headers.length - 1].remove();

    clonedTable.querySelectorAll("tbody tr").forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length) cells[cells.length - 1].remove();
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
        h5 {
          background-color: #FFC000;
          padding: 10px;
          border-top: 1px solid black; 
          border-bottom: 1px solid black;
          text-align: center;
        }
        .right-footer {
          text-align: right;
          margin-top: 20px;
          font-size: 14px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <h2>Audit Plan Details</h2>
      <h5 class="iso_title mb-4">
        INTERNAL AUDIT SCHEDULE - ISO 9001:2015
      </h5>
      ${clonedTable.outerHTML}
      <div class="right-footer">
       LLS1/TQM/QA/06/02/00/R02-00-03.05.2022
      </div>
    </body>
  </html>
`);


    printWindow.document.close();
    printWindow.print();
  };

  const resetForm = () => {
    setFormData((prev) => ({
      ...prev,
      auditCycle: "I",
      date: "",
      timeDuration: "",
      processes: [],
    }));
    setNewProcess("");
    setEditIndex(null);
  };

  return (
    <div className="audit-plan-container">
      <center className="mb-4"><h2>Audit Plan Details</h2></center>
      <h5 className="iso_title mb-4">
        INTERNAL AUDIT SCHEDULE - ISO 9001:2015
      </h5>

      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <div className="header-buttons mb-4">
        <button
          onClick={() => onClose ? onClose() : navigate("/audit-plan-creation")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
          title="Back"
        >
          <FaArrowLeft />
        </button>

        <div className="two_btns flex gap-2">
          <button
            className="add-btn mb-3"
            onClick={handleFormOpen}
            disabled={!isAuditorAssigned}
            title="Add Audit Plan"
          >
            <FaPlus />
          </button>
          <button
            className="print-btn mb-3"
            onClick={handlePrint}
            title="Print Audit Plan"
          >
            <FaPrint />
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
            .map((plan, originalIndex) => ({ plan, originalIndex }))
            .filter(({ plan }) => plan.department === department?.name)
            .map(({ plan, originalIndex }) => (
              <tr key={originalIndex}>
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
                    onClick={() => handleEdit(originalIndex)}
                    className="auditdetail-edit-btns styled-btn"
                    title="Edit Audit Plan"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(originalIndex)}
                    className="auditdetail-delete-btns styled-btn"
                    title="Delete Audit Plan"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="document-footer">
        LLS1/TQM/QA/06/02/00/R02-00-03.05.2022
      </div>
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
                  className="auditdetail-edit-btns"
                  onClick={handleAddProcess}
                  title="Add Process"
                >
                  <FaPlusCircle />
                </button>
                <ol>
                  {formData.processes.map((process, index) => (
                    <li key={index}>
                      {process}{" "}
                      <button
                        type="button"
                        onClick={() => handleRemoveProcess(index)}
                        title="Remove Process"
                      >
                        <FaTimes />
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
                  className="icon-btn save-draft-btn"
                  onClick={handleSaveDraft}
                  title="Save Draft"
                >
                  <FaSave />
                </button>
                <button
                  type="button"
                  className="icon-btn close-btns"
                  onClick={() => setShowForm(false)}
                  title="Close"
                >
                  <FaTimes />
                </button>
                <button
                  type="submit"
                  className="icon-btn submit-btns"
                  disabled={!isAuditorAssigned}
                  title="Submit Audit Plan"
                >
                  <FaCheck />
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
