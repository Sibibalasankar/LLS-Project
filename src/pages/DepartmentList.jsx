import { useState, useEffect } from "react";
import axios from "axios";
import "../assets/styles/DepartmentList.css";

const DepartmentList = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({ Department: "", email: "" });

  useEffect(() => {
    fetchDepartment();
  }, []);

  const fetchDepartment = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/departments");
      setDepartmentData(res.data);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.Department.trim() || !formData.email.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      if (editingIndex !== null) {
        const dept = departmentData[editingIndex];
        await axios.put(`http://localhost:3001/api/departments/${dept.id}`, formData);
        alert("Department updated successfully!");
      } else {
        await axios.post("http://localhost:3001/api/departments", formData);
        alert("Department added successfully!");
      }

      fetchDepartment();
      setShowForm(false);
      setEditingIndex(null);
      setFormData({ Department: "", email: "" });
    } catch (err) {
      alert("Error saving department");
      console.error(err);
    }
  };

  const handleEdit = (index) => {
    setFormData(departmentData[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = async (index) => {
    const dept = departmentData[index];
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${dept.Department}?\n\nAuditee Email: ${dept.email || "N/A"}`
    );

    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/api/departments/${dept.id}`);
        fetchDepartment();
        alert("Department deleted successfully!");
      } catch (err) {
        alert("Failed to delete department");
      }
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

  return (
    <div className="department-list-container">
      <h2>Department List</h2>

      <div className="department-list-header">
        <button className="add-btn" onClick={() => setShowForm(true)}>Add Department</button>
        <button className="print-btn" onClick={handlePrint}>🖨️ Print</button>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departmentData.map((dept, index) => (
                <tr key={dept.id}>
                  <td>{index + 1}</td>
                  <td>{dept.Department}</td>
                  <td>{dept.email || "N/A"}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(index)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(index)}>Delete</button>
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
                name="Department"
                value={formData.Department}
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
                    const isConfirmed = window.confirm("Are you sure you want to cancel? Unsaved changes will be lost.");
                    if (isConfirmed) {
                      setShowForm(false);
                      setFormData({ Department: "", email: "" });
                      setEditingIndex(null);
                    }
                  }}
                >
                  Close
                </button>
                <button type="submit" className="submit-btns">
                  {editingIndex !== null ? "Update" : "Add"}
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
