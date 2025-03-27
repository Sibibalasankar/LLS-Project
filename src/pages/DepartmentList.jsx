import { useState, useEffect } from "react";
import "../assets/styles/DepartmentList.css";

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
  "Total Plant Maintenance",
];

const DepartmentList = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const storedDepartments = JSON.parse(localStorage.getItem("departments")) || [];
    setDepartmentData(storedDepartments);
  }, []);

  const saveToLocalStorage = (departments) => {
    localStorage.setItem("departments", JSON.stringify(departments));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedDepartments;
    if (editingIndex !== null) {
      updatedDepartments = departmentData.map((dept, index) =>
        index === editingIndex ? formData : dept
      );
      setEditingIndex(null);
    } else {
      updatedDepartments = [...departmentData, formData];
    }
    setDepartmentData(updatedDepartments);
    saveToLocalStorage(updatedDepartments);
    setShowForm(false);
    setFormData({ name: "", email: "" });
  };

  const handleEdit = (index) => {
    setFormData(departmentData[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const updatedDepartments = departmentData.filter((_, i) => i !== index);
    setDepartmentData(updatedDepartments);
    saveToLocalStorage(updatedDepartments);
  };

  const handlePrint = () => {
    const tableContent = document.querySelector(".department-table").cloneNode(true);
  
    // Remove the "Actions" column
    tableContent.querySelectorAll("tr").forEach((row) => {
      row.removeChild(row.lastElementChild);
    });
  
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Department List</title>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #f4f4f4;
            }
            tbody tr:nth-child(even) {
              background-color: #f9f9f9;
            }
          </style>
        </head>
        <body>
          <h2>Department List</h2>
          ${tableContent.outerHTML}
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
        <button className="add-btn" onClick={() => setShowForm(true)}>
          Add Department
        </button>
        <button className="print-btn" onClick={handlePrint}>
          Print Table
        </button>
      </div>

      <div className="department-table-wrapper">
        <table className="department-table">
          <thead>
            <tr>
              <th>Department Name</th>
              <th>Auditor Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, index) => (
              <tr key={index}>
                <td>{dept}</td>
                <td>{departmentData[index]?.email || "N/A"}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(index)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(index)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                placeholder="Auditor Email"
                required
              />
              <div className="form-buttons">
                <button type="button" className="close-btn" onClick={() => setShowForm(false)}>
                  Close
                </button>
                <button type="submit" className="submit-btn">
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
