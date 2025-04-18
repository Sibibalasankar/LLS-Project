import { useState, useEffect } from "react";
import axios from "axios";
import "../assets/styles/DepartmentList.css";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({ Department: "", email: "" });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Department.trim() || !formData.email.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      if (editingDepartment) {
        await axios.put(
          `http://localhost:3001/api/departments/${editingDepartment.id}`,
          formData
        );
        alert("Department updated successfully!");
      } else {
        await axios.post("http://localhost:3001/api/departments", formData);
        alert("Department added successfully!");
      }

      fetchDepartments();
      handleCloseForm();
    } catch (error) {
      console.error("Error saving department:", error);
      alert("Failed to save department. Try again.");
    }
  };

  const handleEdit = (dept) => {
    setFormData({ Department: dept.Department, email: dept.email });
    setEditingDepartment(dept);
    setShowForm(true);
  };

  const handleDelete = async (dept) => {
    const confirmed = window.confirm(
      `Delete ${dept.Department}?\nAuditee Email: ${dept.email || "N/A"}`
    );
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:3001/api/departments/${dept.id}`);
      alert("Department deleted successfully!");
      fetchDepartments();
    } catch (error) {
      alert("Failed to delete department.");
      console.error(error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({ Department: "", email: "" });
    setEditingDepartment(null);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=800,height=600");
    const tableHTML = document.querySelector(".department-table")?.outerHTML;

    if (!tableHTML) return;

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
          ${tableHTML}
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
        {departments.length === 0 ? (
          <p>No departments available.</p>
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
              {departments.map((dept, index) => (
                <tr key={dept.id}>
                  <td>{index + 1}</td>
                  <td>{dept.Department}</td>
                  <td>{dept.email || "N/A"}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(dept)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(dept)}>Delete</button>
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
            <h3>{editingDepartment ? "Edit Department" : "Add Department"}</h3>
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
                <button type="button" className="close-btns" onClick={handleCloseForm}>
                  Close
                </button>
                <button type="submit" className="submit-btns">
                  {editingDepartment ? "Update" : "Add"}
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
