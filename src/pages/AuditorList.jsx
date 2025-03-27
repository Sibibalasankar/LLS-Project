import { useState, useEffect } from "react";
import "../assets/styles/AuditorList.css";

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

const designations = [
  "Auditor",
  "Senior Auditor",
  "Lead Auditor",
  "Quality Inspector",
  "Project Manager",
  "Operations Manager",
  "Supervisor",
  "Technician",
  "Engineer",
];

const AuditorList = () => {
  const [auditors, setAuditors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    employeeNumber: "",
    certifiedDate: "",
    mailID: "",
    designation: "",
    department: "",
  });

  const [filters, setFilters] = useState({ department: "", designation: "" });

  useEffect(() => {
    // Load auditors from localStorage on page load
    const storedAuditors = JSON.parse(localStorage.getItem("auditors")) || [];
    setAuditors(storedAuditors);
  }, []);

  const saveToLocalStorage = (auditors) => {
    localStorage.setItem("auditors", JSON.stringify(auditors));
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredAuditors = auditors.filter(
    (auditor) =>
      (filters.department === "" ||
        auditor.department === filters.department) &&
      (filters.designation === "" ||
        auditor.designation === filters.designation)
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedAuditors;
    if (editingIndex !== null) {
      updatedAuditors = auditors.map((auditor, index) =>
        index === editingIndex ? formData : auditor
      );
      setEditingIndex(null);
    } else {
      updatedAuditors = [...auditors, formData];
    }
    setAuditors(updatedAuditors);
    saveToLocalStorage(updatedAuditors);
    setShowForm(false);
    setFormData({
      name: "",
      employeeNumber: "",
      certifiedDate: "",
      mailID: "",
      designation: "",
      department: "",
    });
  };

  const handleEdit = (index) => {
    setFormData(auditors[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const updatedAuditors = auditors.filter((_, i) => i !== index);
    setAuditors(updatedAuditors);
    saveToLocalStorage(updatedAuditors);
  };

  const printTable = () => {
    const table = document.querySelector(".auditor-table").cloneNode(true);

    // Remove the last column (Actions) from the table header
    table.querySelectorAll("th:last-child").forEach((th) => th.remove());

    // Remove the last column (Actions) from each row
    table.querySelectorAll("tr").forEach((row) => {
      row.querySelectorAll("td:last-child").forEach((td) => td.remove());
    });

    const printWindow = window.open("", "_blank");
    printWindow.document.write("<html><head><title>Print Table</title>");
    printWindow.document.write(
      "<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid black; padding: 8px; text-align: left; }</style>"
    );
    printWindow.document.write("</head><body>");
    printWindow.document.write(table.outerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="auditor-list-container">
       <h2>Auditor List</h2>
      <div className="auditor-list-header">
       
        <button className="add-btn">Add Auditor</button>
        <button className="print-btn" onClick={printTable}>
          Print Table
        </button>
      </div>

      {/* Filter Section */}
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

        <select
          name="designation"
          value={filters.designation}
          onChange={handleFilterChange}
        >
          <option value="">All Designations</option>
          {designations.map((designation, index) => (
            <option key={index} value={designation}>
              {designation}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="auditor-table-wrapper">
        <table className="auditor-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Employee Number</th>
              <th>Certified Date</th>
              <th>Mail ID</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAuditors.length > 0 ? (
              filteredAuditors.map((auditor, index) => (
                <tr key={index}>
                  <td>{auditor.name}</td>
                  <td>{auditor.employeeNumber}</td>
                  <td>{auditor.certifiedDate}</td>
                  <td>{auditor.mailID}</td>
                  <td>{auditor.department}</td>
                  <td>{auditor.designation}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-records">
                  No Records
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Popup Form */}
      {showForm && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h3>{editingIndex !== null ? "Edit Auditor" : "Add Auditor"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
              />
              <input
                type="text"
                name="employeeNumber"
                value={formData.employeeNumber}
                onChange={handleChange}
                placeholder="Employee Number"
                required
              />
              <input
                type="date"
                name="certifiedDate"
                value={formData.certifiedDate}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="mailID"
                value={formData.mailID}
                onChange={handleChange}
                placeholder="Mail ID"
                required
              />

              <div className="form-buttons">
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowForm(false)}
                >
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

export default AuditorList;
