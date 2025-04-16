import React, { useState, useEffect } from 'react';

const ReportAndAuditNCCloser = () => {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    dptname: "",
    auditCycleNo: "",
    savedDate: ""
  });
  const [departments, setDepartments] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadData = () => {
      try {
        const storedDepartments = JSON.parse(localStorage.getItem("departments") || "[]");
        const storedReports = JSON.parse(localStorage.getItem("reports") || "[]");
        
        setDepartments(storedDepartments);
        setReports(storedReports);
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
      }
    };

    loadData();
    
    // Set up listener for storage changes
    const handleStorageChange = () => {
      loadData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleEvidenceUpload = (index, file) => {
    const updatedReports = [...reports];
    updatedReports[index].evidence = file.name; // Store just the filename
    updatedReports[index].status = "Submitted";
    
    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports));
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
        <h2>Non-Conformity Reports</h2>
      </div>

      {/* Filter Section */}
      <div className="document-card filter-section">
        <h3>Filter Reports</h3>
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

      {/* Reports Table */}
      {filteredReports.length > 0 ? (
        <table className="reports-table">
          <thead>
            <tr>
              <th>NCR Number</th>
              <th>Department</th>
              <th>Audit Cycle No.</th>
              <th>Audit Date</th>
              <th>Saved Date</th>
              <th>Evidence</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report, index) => (
              <tr key={index}>
                <td>{report.ncsNumber || 'N/A'}</td>
                <td>{report.dptname || 'N/A'}</td>
                <td>{report.auditCycleNo || 'N/A'}</td>
                <td>{report.auditDate || 'N/A'}</td>
                <td>{report.savedDate || 'N/A'}</td>
                <td>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleEvidenceUpload(index, e.target.files[0])}
                    disabled={report.status === "Submitted"}
                  />
                  {report.evidence && <span className="file-name">{report.evidence}</span>}
                </td>
                <td className={`status ${report.status?.toLowerCase() || 'pending'}`}>
                  {report.status || "Pending"}
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

export default ReportAndAuditNCCloser;