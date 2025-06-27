import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSave, FaTimes, FaCheck, FaPrint, FaPlus } from "react-icons/fa";
import { saveDraft, loadDraft, clearDraft } from "../utils/draftUtils";
import "../assets/styles/DepartmentList.css";

const DepartmentList = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", dept: "" });
const departments = [
  "Quality Management System",
  "Marketing - Industrial Automation",
  "Marketing - Textile Automation",
  "Marketing - Trading",
  "Project Management",
  "Design - Industrial Automation",
  "Design - Textile Automation",
  "Design - Controls",
  "Planning and Engineering Innovation",
  "Supply Chain Management",
  "Machining Division (MD)",
  "Sheet Metal Division (SMD)",
  "Powder Coating",
  "Product Assembly",
  "Project Assembly",
  "Quality - Inward",
  "Quality - SMD",
  "Quality - Machining Division",
  "Quality - Assembly",
  "Stores",
  "Customer Service Department",
  "Human Resources",
  "Total Plant Maintenance"
];

  // Load departments from localStorage on mount
  useEffect(() => {
    const storedDepartments = JSON.parse(localStorage.getItem("departments") || "[]");
    const storedDeptMap = new Map(storedDepartments.map(dept => [dept.name, dept]));
    const updatedDepartments = departments.map(name => storedDeptMap.get(name) || { name, email: "" });

    storedDepartments.forEach(dept => {
      if (!departments.includes(dept.name)) {
        updatedDepartments.push(dept);
      }
    });

    setDepartmentData(updatedDepartments);
    localStorage.setItem("departments", JSON.stringify(updatedDepartments));
  }, []);

  const saveToLocalStorage = (departments) => {
    localStorage.setItem("departments", JSON.stringify(departments));
  };

  const handleChange = (e) => {
    const updatedFormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedFormData);
    saveDraft("departmentDraft", updatedFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Please fill in all fields");
      return;
    }

    let updatedDepartments = [...departmentData];
    let message = "";

    if (editingIndex !== null) {
      updatedDepartments[editingIndex] = formData;
      setEditingIndex(null);
      message = "Department updated successfully!";
    } else {
      updatedDepartments.push(formData);
      message = "Department added successfully!";
    }

    setDepartmentData(updatedDepartments);
    saveToLocalStorage(updatedDepartments);
    setShowForm(false);
    setFormData({ name: "", email: "", dept: "" });
    clearDraft("departmentDraft");
    alert(message);
  };

  const handleEdit = (index) => {
    setFormData(departmentData[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const departmentToDelete = departmentData[index];
    const isConfirmed = window.confirm(`Are you sure you want to delete ${departmentToDelete.name}?\n\nAuditee Email: ${departmentToDelete.email || "N/A"}`);
    if (isConfirmed) {
      const updatedDepartments = departmentData.filter((_, i) => i !== index);
      setDepartmentData(updatedDepartments);
      saveToLocalStorage(updatedDepartments);
      alert("Department deleted successfully!");
    }
  };

  const handlePrint = () => {
    const tableContent = document.querySelector(".department-table");
    if (!tableContent) return;

    const clonedTable = tableContent.cloneNode(true);
    clonedTable.querySelectorAll("tr").forEach((row) => {
      if (row.lastElementChild) row.removeChild(row.lastElementChild);
    });

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Department List</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f4f4f4; }
            tbody tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h2>Department List</h2>
          ${clonedTable.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleFormOpen = () => {
    const draft = loadDraft("departmentDraft");
    if (draft) {
      const isConfirmed = window.confirm("You have unsaved draft data. Do you want to continue editing it?");
      if (isConfirmed) {
        setFormData(draft);
      }
    }
    setShowForm(true);
  };

  return (
    <div className="department-list-container">
      <h2>Department List</h2>

      <div className="department-list-header">
        <button className="add-btn no-print" onClick={handleFormOpen} title="Add Department">
          <FaPlus />
        </button>

        <button className="print-btn no-print" onClick={handlePrint} title="Print Department List">
          <FaPrint />
        </button>
      </div>

      <div className="department-table-wrapper">
        {departmentData.length === 0 ? (
          <p>No departments available. Add one!</p>
        ) : (
          <table className="department-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Department Name</th>
                <th>Auditee Email</th>
                <th className="no-print">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departmentData.map((dept, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{dept.name}</td>
                  <td>{dept.email || "N/A"}</td>
                  <td className="no-print">
                    <button className="dept-edit-btns" onClick={() => handleEdit(index)} title="Edit Department">
                      <FaEdit />
                    </button>
                    <button className="dept-delete-btns" onClick={() => handleDelete(index)} title="Delete Department">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h3>{editingIndex !== null ? "Edit Department" : "Add Department"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Department Name"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Auditee Email"
                required
              />
              <div className="form-buttons">
                <button
                  type="button"
                  className="close-btns"
                  onClick={() => {
                    const isConfirmed = window.confirm("Are you sure you want to cancel? Any unsaved changes will be lost.");
                    if (isConfirmed) {
                      setShowForm(false);
                      clearDraft("departmentDraft");
                      setFormData({ name: "", email: "", dept: "" });
                      setEditingIndex(null);
                    }
                  }}
                  title="close form"
                >
                  <FaTimes />
                </button>
                <button type="submit" className="submit-btns" title="Save Department">
                  {editingIndex !== null ? <FaSave /> : <FaCheck />}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;
