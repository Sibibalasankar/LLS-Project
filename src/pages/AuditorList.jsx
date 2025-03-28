import { useState, useEffect } from "react";
import "../assets/styles/AuditorList.css";

const designations = [
  "Auditor", "Senior Auditor", "Lead Auditor", "Quality Inspector", 
  "Project Manager", "Operations Manager", "Supervisor", "Technician", "Engineer"
];

const AuditorList = () => {
  const [auditors, setAuditors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "", employeeNumber: "", certifiedDate: "", mailID: "",
    designation: "", department: ""
  });

  const [filters, setFilters] = useState({ department: "", designation: "" });

  useEffect(() => {
    const storedAuditors = JSON.parse(localStorage.getItem("auditors")) || [];
    setAuditors(storedAuditors);

    const storedDepartments = JSON.parse(localStorage.getItem("departments")) || [];
    setDepartments(storedDepartments.map(dept => dept.name));
  }, []);

  const saveToLocalStorage = (auditors) => {
    localStorage.setItem("auditors", JSON.stringify(auditors));
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredAuditors = auditors.filter(auditor =>
    (filters.department === "" || auditor.department === filters.department) &&
    (filters.designation === "" || auditor.designation === filters.designation)
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
    setFormData({ name: "", employeeNumber: "", certifiedDate: "", mailID: "", designation: "", department: "" });
  };

  const handleDelete = (index) => {
    const updatedAuditors = auditors.filter((_, i) => i !== index);
    setAuditors(updatedAuditors);
    saveToLocalStorage(updatedAuditors);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="auditor-list-container">
      <h2>Auditor List</h2>
      <div className="auditor-list-header">
        <button className="add-btn" onClick={() => setShowForm(true)}>Add Auditor</button>
        <button className="print-btn" onClick={handlePrint}>Print</button>
      </div>

      {/* Filter Section */}
      <div className="filter-container">
        <select name="department" value={filters.department} onChange={handleFilterChange}>
          <option value="">All Departments</option>
          {departments.map((dept, index) => (
            <option key={index} value={dept}>{dept}</option>
          ))}
        </select>

        <select name="designation" value={filters.designation} onChange={handleFilterChange}>
          <option value="">All Designations</option>
          {designations.map((designation, index) => (
            <option key={index} value={designation}>{designation}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="auditor-table-wrapper">
        <table className="auditor-table">
          <thead>
            <tr>
              <th>S.No</th> {/* ✅ Added Serial Number Column */}
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
                  <td>{index + 1}</td> {/* ✅ Auto-incrementing Serial Number */}
                  <td>{auditor.name}</td>
                  <td>{auditor.employeeNumber}</td>
                  <td>{auditor.certifiedDate}</td>
                  <td>{auditor.mailID}</td>
                  <td>{auditor.department}</td>
                  <td>{auditor.designation}</td>
                  <td>
                    <button 
                      className="edit-btn" 
                      onClick={() => {
                        setEditingIndex(index);
                        setFormData(auditor);
                        setShowForm(true);
                      }}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(index)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-records">No Records</td>
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
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
              <input type="text" name="employeeNumber" value={formData.employeeNumber} onChange={handleChange} placeholder="Employee Number" required />
              <input type="date" name="certifiedDate" value={formData.certifiedDate} onChange={handleChange} required />
              <input type="email" name="mailID" value={formData.mailID} onChange={handleChange} placeholder="Mail ID" required />

              {/* Dynamic Department Dropdown */}
              <select name="department" value={formData.department} onChange={handleChange} required>
                <option value="" disabled>Select Department</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>{dept}</option>
                ))}
              </select>

              {/* Designation Dropdown */}
              <select name="designation" value={formData.designation} onChange={handleChange} required>
                <option value="" disabled>Select Designation</option>
                {designations.map((designation, index) => (
                  <option key={index} value={designation}>{designation}</option>
                ))}
              </select>

              <div className="form-buttons">
                <button type="button" className="close-btn" onClick={() => setShowForm(false)}>Close</button>
                <button type="submit" className="submit-btn">{editingIndex !== null ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditorList;
