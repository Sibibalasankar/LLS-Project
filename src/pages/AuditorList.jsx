import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSave, FaTimes, FaCheck, FaPrint, FaPlus } from "react-icons/fa";
import { saveDraft, loadDraft, clearDraft } from "../utils/draftUtils";
import "../assets/styles/AuditorList.css";

const AuditorList = () => {
  const [auditors, setAuditors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [availableAuditees, setAvailableAuditees] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    employeeNumber: "",
    department: "",
    certifiedOnName: "",
  });
  const [filters, setFilters] = useState({ department: "" });
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  useEffect(() => {
    const storedAuditors = JSON.parse(localStorage.getItem("auditors")) || [];
    setAuditors(storedAuditors);

    const storedDepartments = JSON.parse(localStorage.getItem("departments")) || [];
    setDepartments(storedDepartments.map((dept) => dept.name));

    const draft = loadDraft("auditorListDraft");
    if (draft) {
      setFormData(draft.formData);
      setEditingIndex(draft.editingIndex);
      setAvailableAuditees(draft.availableAuditees || []);
    }
  }, []);

  useEffect(() => {
    if (formData.employeeNumber && formData.employeeNumber.length >= 3) {
      const storedUsers = JSON.parse(localStorage.getItem("userCredentials")) || [];
      const foundUser = storedUsers.find(
        (user) => user.empId === formData.employeeNumber
      );
      if (foundUser) {
        setFormData((prev) => ({
          ...prev,
          name: foundUser.empName
        }));
      }
    }
  }, [formData.employeeNumber]);

  const saveToLocalStorage = (auditors) => {
    localStorage.setItem("auditors", JSON.stringify(auditors));
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredAuditors = auditors.filter(
    (auditor) =>
      (filters.department === "" || auditor.department === filters.department)
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "department") {
      const storedUsers = JSON.parse(localStorage.getItem("userCredentials")) || [];
      const filteredEmployees = storedUsers.filter(user => user.department === value);
      setAvailableAuditees(filteredEmployees);

      if (filteredEmployees.length === 1) {
        setFormData((prev) => ({
          ...prev,
          certifiedOnName: filteredEmployees[0].empName
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          certifiedOnName: ""
        }));
      }
    }
  };

  const handleEmployeeNumberBlur = () => {
    if (formData.employeeNumber) {
      const storedUsers = JSON.parse(localStorage.getItem("userCredentials")) || [];
      const foundUser = storedUsers.find(
        (user) => user.empId === formData.employeeNumber
      );
      if (foundUser) {
        setFormData((prev) => ({
          ...prev,
          name: foundUser.empName
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedAuditors;
    if (editingIndex !== null) {
      updatedAuditors = auditors.map((auditor, index) =>
        index === editingIndex ? formData : auditor
      );
      setEditingIndex(null);
      alert("Auditor updated successfully!");
    } else {
      updatedAuditors = [...auditors, formData];
      alert("Auditor added successfully!");
    }
    setAuditors(updatedAuditors);
    saveToLocalStorage(updatedAuditors);
    clearDraft("auditorListDraft");
    setShowForm(false);
    setFormData({
      name: "",
      employeeNumber: "",
      department: "",
      certifiedOnName: "",
    });
    setAvailableAuditees([]);
  };

  const handleDelete = (index) => {
    const auditorToDelete = auditors[index];
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${auditorToDelete.name} (Employee #: ${auditorToDelete.employeeNumber})?`
    );

    if (isConfirmed) {
      const updatedAuditors = auditors.filter((_, i) => i !== index);
      setAuditors(updatedAuditors);
      saveToLocalStorage(updatedAuditors);
      alert("Auditor deleted successfully!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveDraft = () => {
    saveDraft("auditorListDraft", { formData, editingIndex, availableAuditees });
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 2000);
  };

  return (
    <div className="auditor-list-container">
      <h2>Auditor List</h2>
      <div className="auditor-list-header">
        <button className="icon-btn add-btn" onClick={() => setShowForm(true)}>
          <FaPlus />
        </button>
        <button className="icon-btn print-btn" onClick={handlePrint}>
          <FaPrint />
        </button>
      </div>

      <div className="filter-container">
        <select
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
        >
          <option value="">All Departments</option>
          {departments.map((dept, index) => (
            <option key={index} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <div className="auditor-table-wrapper">
        <table className="auditor-table">
          <thead>
            <tr>
              <th>S.no</th>
              <th>Employee Number</th>
              <th>Auditor Name</th>
              <th>Department to Audit</th>
              <th>Auditee</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAuditors.length > 0 ? (
              filteredAuditors.map((auditor, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{auditor.employeeNumber}</td>
                  <td>{auditor.name}</td>
                  <td>{auditor.department}</td>
                  <td>{auditor.certifiedOnName}</td>
                  <td>
                    <button
                      className="icon-btn edit-btns"
                      onClick={() => {
                        setEditingIndex(index);
                        setFormData(auditor);

                        const storedUsers = JSON.parse(localStorage.getItem("userCredentials")) || [];
                        const filteredEmployees = storedUsers.filter(user => user.department === auditor.department);
                        setAvailableAuditees(filteredEmployees);

                        setShowForm(true);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="icon-btn delete-btns"
                      onClick={() => handleDelete(index)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-records">
                  No Records
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h3>{editingIndex !== null ? "Edit Auditor" : "Add Auditor"}</h3>

            {isDraftSaved && <div className="draft-toast">✔️ Draft Saved</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Employee Number</label>
                <input
                  type="text"
                  name="employeeNumber"
                  value={formData.employeeNumber}
                  onChange={handleChange}
                  onBlur={handleEmployeeNumberBlur}
                  placeholder="Employee Number"
                  required
                />
              </div>

              <div className="form-group">
                <label>Auditor Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Auditor Name"
                  required
                  className={formData.employeeNumber && formData.name ? "auto-filled" : ""}
                />
              </div>

              <div className="form-group">
                <label>Department to Audit</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select Department to Audit</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Auditee Name</label>
                {availableAuditees.length > 1 ? (
                  <select
                    name="certifiedOnName"
                    value={formData.certifiedOnName}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select Auditee</option>
                    {availableAuditees.map((employee, index) => (
                      <option key={index} value={employee.empName}>
                        {employee.empName} ({employee.empId})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="certifiedOnName"
                    value={formData.certifiedOnName}
                    onChange={handleChange}
                    placeholder="Auditee Name"
                    required
                    readOnly={availableAuditees.length === 1}
                  />
                )}
              </div>

              <div className="form-buttons">
                <button
                  type="button"
                  className="icon-btn save-draft-btn"
                  onClick={handleSaveDraft}
                >
                  <FaSave />
                </button>

                <button
                  type="button"
                  className="icon-btn close-btns"
                  onClick={() => {
                    const isConfirmed = window.confirm("Are you sure you want to cancel? Any unsaved changes will be lost.");
                    if (isConfirmed) {
                      setShowForm(false);
                      setAvailableAuditees([]);
                    }
                  }}
                >
                  <FaTimes />
                </button>

                <button type="submit" className="icon-btn submit-btns">
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

export default AuditorList;
