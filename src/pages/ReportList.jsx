import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ReportList = ({ reports, onView, onEdit, onDelete, onAddNew }) => {
  const [filters, setFilters] = useState({
    dptname: "",
    auditCycleNo: "",
    savedDate: ""
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const storedDepartments = JSON.parse(localStorage.getItem("departments") || "[]");
    setDepartments(storedDepartments);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredReports = reports.filter(report => {
    return (
      (filters.dptname === "" || report.dptname === filters.dptname) &&
      (filters.auditCycleNo === "" ||
        report.auditCycleNo?.toLowerCase().includes(filters.auditCycleNo.toLowerCase())) &&
      (filters.savedDate === "" ||
        new Date(report.auditDate).toISOString().split('T')[0] === filters.savedDate)
    );
  });

  return (
    <div className="saved-reports-container">
      <div className="report-list-header">
        <h2>Saved Action Reports</h2>
        <button type="button" className="add-btn mb-3" onClick={onAddNew}>
          Add New Action Report
        </button>
      </div>

      <div className="document-card filter-section">
        <h3>Filter Action Reports</h3>
        <div className="filter-row">
          <div className="filter-field">
            <label>Department</label>
            <select
              name="dptname"
              value={filters.dptname}
              onChange={handleFilterChange}
            >
              <option value="">All Departments</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-field">
            <label>Audit Cycle No.</label>
            <input
              type="text"
              name="auditCycleNo"
              value={filters.auditCycleNo}
              onChange={handleFilterChange}
              placeholder="I/2025-26"
            />
          </div>
          <div className="filter-field">
            <label>Audit Date</label>
            <input
              type="date"
              name="savedDate"
              value={filters.savedDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {filteredReports.length > 0 ? (
        <table className="reports-table">
          <thead>
            <tr>
              <th>NCR Number</th>
              <th>Department</th>
              <th>Audit Cycle No.</th>
              <th>Audit Date</th>
              <th>Saved Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report, index) => (
              <tr key={report.id}>
                <td>{report.ncsNumber}</td>
                <td>{report.dptname}</td>
                <td>{report.auditCycleNo}</td>
                <td>{report.auditDate}</td>
                <td>{report.savedDate}</td>
                <td className="action-btns">
                  <button className="btn btn-primary btn-sm" onClick={() => onView(report)}>View</button>
                  <button className="btn btn-warning btn-sm text-white" onClick={() => onEdit(index)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-reports">
          <p>No reports found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

ReportList.propTypes = {
  reports: PropTypes.array.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddNew: PropTypes.func.isRequired
};

export default ReportList;