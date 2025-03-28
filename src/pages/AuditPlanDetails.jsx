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
      const assignedAuditor = auditorList.find((aud) => aud.department === department.name);
      if (assignedAuditor) {
        setAuditor(assignedAuditor.name);
        setFormData((prev) => ({ ...prev, auditor: assignedAuditor.name }));
        setIsAuditorAssigned(true);
        setErrorMessage("");
      } else {
        setAuditor("");
        setIsAuditorAssigned(false);
        setErrorMessage("No auditor assigned for this department. Please assign one before proceeding.");
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

    let updatedPlans;
    const formattedCycle = `${formData.auditCycle}/${currentYear}`;

    if (editIndex !== null) {
      updatedPlans = [...auditPlans];
      updatedPlans[editIndex] = { ...formData, department: department.name, formattedCycle };
    } else {
      updatedPlans = [...auditPlans, { ...formData, department: department.name, formattedCycle }];
    }

    setAuditPlans(updatedPlans);
    localStorage.setItem("auditPlans", JSON.stringify(updatedPlans));
    setShowForm(false);
    resetForm();
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData({ ...auditPlans[index] }); // Populate form with existing data
    setShowForm(true);
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
    setEditIndex(null);
  };

  return (
    <div className="audit-plan-container">
      <button onClick={() => (onClose ? onClose() : navigate("/audit-plan-creation"))} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors">
        ← Back
      </button>
      <h2>Audit Plan Details</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button className="add-btn mb-3" onClick={() => setShowForm(true)} disabled={!isAuditorAssigned}>
        Add Audit Plan
      </button>

      <table className="audit-table">
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
                  <button onClick={() => handleEdit(index)} className="edit-btn styled-btn">Edit</button>
                  <button onClick={() => setAuditPlans(auditPlans.filter((_, i) => i !== index))} className="delete-btn styled-btn">Delete</button>
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
              <select name="auditCycle" value={formData.auditCycle} onChange={handleChange} required>
                <option value="I">I</option>
                <option value="II">II</option>
                <option value="III">III</option>
                <option value="IV">IV</option>
                <option value="V">V</option>
              </select>

              <input type="text" name="department" value={department?.name || ""} readOnly />
              <input type="date" name="date" value={formData.date} onChange={handleChange} required />

              <select name="timeDuration" value={formData.timeDuration} onChange={handleChange}>
                <option value="">Select Time Duration</option>
                <option value="1 Month">1 Month</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
              </select>

              <div className="processes-container">
                <input type="text" placeholder="Add Process" value={newProcess} onChange={(e) => setNewProcess(e.target.value)} />
                <button type="button" className="add-process-btn" onClick={handleAddProcess}>+ Add</button>
                <ol>
                  {formData.processes.map((process, index) => (
                    <li key={index}>
                      {process} <button type="button" onClick={() => handleRemoveProcess(index)}>❌</button>
                    </li>
                  ))}
                </ol>
              </div>

              <input type="text" name="auditor" value={auditor} readOnly />
              <input type="text" name="auditees" placeholder="Auditee(s)" value={formData.auditees} onChange={handleChange} />
              <div className="form-buttons">
                <button type="button" className="close-btn" onClick={() => setShowForm(false)}>Close</button>
                <button type="submit" className="submit-btn" disabled={!isAuditorAssigned}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditPlanDetails;
