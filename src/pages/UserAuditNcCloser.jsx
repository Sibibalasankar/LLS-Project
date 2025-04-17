import React, { useState, useEffect, useCallback } from 'react';
import "../assets/styles/UserAuditNcCloser.css"

const ReportAndAuditNCCloser = () => {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    dptname: "",
    auditCycleNo: ""
  });
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [reportToClear, setReportToClear] = useState(null);

  // Memoized data loading function
  const loadData = useCallback(() => {
    try {
      const storedData = JSON.parse(localStorage.getItem("reports") || "[]");
      const storedDepts = JSON.parse(localStorage.getItem("departments") || "[]");
      
      const sortedReports = [...storedData].sort((a, b) => 
        new Date(b.auditDate) - new Date(a.auditDate)
      );
      
      setReports(sortedReports);
      setDepartments(storedDepts);
      setLastUpdated(new Date().toLocaleTimeString());
      setIsLoading(false);
    } catch (error) {
      console.error("Data loading error:", error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const handleStorageChange = (e) => {
      if (e.key === "reports" || e.key === "departments") {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(loadData, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [loadData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (report, file) => {
    setCurrentReport(report);
    setSelectedFile(file);
    setShowConfirmModal(true);
  };

  const confirmEvidenceUpload = () => {
    if (!currentReport || !selectedFile) return;
    
    const updatedReports = reports.map(report => {
      if (report.id === currentReport.id) {
        return { 
          ...report,
          evidence: selectedFile.name,
          evidenceFile: URL.createObjectURL(selectedFile),
          status: "Submitted",
          lastUpdated: new Date().toISOString()
        };
      }
      return report;
    });
    
    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports));
    setShowConfirmModal(false);
    setCurrentReport(null);
    setSelectedFile(null);
  };

  const confirmClearEvidence = () => {
    const updatedReports = reports.map(report => {
      if (report.id === reportToClear.id) {
        return { 
          ...report,
          evidence: null,
          evidenceFile: null,
          status: "Pending",
          lastUpdated: new Date().toISOString()
        };
      }
      return report;
    });
    
    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports));
    setShowClearConfirmModal(false);
    setReportToClear(null);
  };

  const filteredReports = reports.filter(report => {
    return (
      (filters.dptname === "" || report.dptname === filters.dptname) &&
      (filters.auditCycleNo === "" || 
       report.auditCycleNo?.toLowerCase().includes(filters.auditCycleNo.toLowerCase()))
    );
  });

  const StatusBadge = ({ status }) => {
    const statusClass = status ? status.toLowerCase().replace(/\s+/g, '-') : 'pending';
    return (
      <span className={`status-badge ${statusClass}`}>
        {status || "Pending"}
      </span>
    );
  };

  return (
    <div className="saved-reports-container">
      {/* Confirmation Modals */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Evidence Submission</h3>
            <p>Are you sure you want to submit this file as evidence?</p>
            <p><strong>File:</strong> {selectedFile?.name}</p>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={confirmEvidenceUpload}
              >
                Confirm Submission
              </button>
            </div>
          </div>
        </div>
      )}

      {showClearConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Evidence Clearance</h3>
            <p>Are you sure you want to clear the evidence for this report?</p>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowClearConfirmModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={confirmClearEvidence}
              >
                Confirm Clear
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="report-list-header">
        <h2>Non-Conformity Reports</h2>
        <div className="last-updated mb-3">
          Last updated: {lastUpdated}
          {isLoading && <span className="loading-spinner"></span>}
        </div>
      </div>

      <div className="document-card filter-section">
        <h3>Filter Reports</h3>
        <div className="filter-row">
          <div className="filter-field">
            <label>Department</label>
            <select
              name="dptname"
              value={filters.dptname}
              onChange={handleFilterChange}
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-placeholder">
          <p>Loading reports...</p>
        </div>
      ) : filteredReports.length > 0 ? (
        <div className="table-responsive">
          <table className="reports-table">
            <thead>
              <tr>
                <th>NCR Number</th>
                <th>Department</th>
                <th>Audit Cycle No.</th>
                <th>Audit Date</th>
                <th>Evidence</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.ncsNumber || 'N/A'}</td>
                  <td>{report.dptname || 'N/A'}</td>
                  <td>{report.auditCycleNo || 'N/A'}</td>
                  <td>{new Date(report.auditDate).toLocaleDateString() || 'N/A'}</td>
                  <td>
                    {report.evidenceFile ? (
                      <div className="evidence-container">
                        <a 
                          href={report.evidenceFile} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="evidence-link"
                        >
                          {report.evidence}
                        </a>
                      </div>
                    ) : (
                      <div className="file-upload-container">
                        <label className="file-upload-label">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => e.target.files[0] && 
                              handleFileSelect(report, e.target.files[0])}
                            disabled={report.status === "Submitted"}
                          />
                          <span className="upload-button">Upload</span>
                        </label>
                      </div>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={report.status} />
                  </td>
                  <td>
                    {report.evidenceFile && (
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          setReportToClear(report);
                          setShowClearConfirmModal(true);
                        }}
                      >
                        Clear
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-reports">
          <p>No reports found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default ReportAndAuditNCCloser;
