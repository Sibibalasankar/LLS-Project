import React, { useEffect, useState } from 'react';
import "../assets/styles/AuditNcCloser.css";
import { useNavigate } from 'react-router-dom';

const AuditNcCloser = () => {
  const [submittedFiles, setSubmittedFiles] = useState({});
  const [decisions, setDecisions] = useState({});
  const navigate = useNavigate();



  const handleViewActionReport = (ncsNumber, department, auditCycle) => {
    // Directly open the action report with the NC number as parameter
    const url = `/admin-dashboard/action-report?ncsNumber=${encodeURIComponent(ncsNumber)}&department=${encodeURIComponent(department)}&auditCycle=${encodeURIComponent(auditCycle)}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    const allFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || {};
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const role = localStorage.getItem("userRole");
    const loginDepartment = localStorage.getItem("userAuditDepartment"); // dropdown selected

    let filteredFiles = {};

    if (role === "admin") {
      filteredFiles = allFiles; // show all
    } else if (role === "auditor") {
      // show only files matching selected login department
      filteredFiles = Object.fromEntries(
        Object.entries(allFiles).filter(([_, file]) =>
          file.department === loginDepartment
        )
      );
    }

    setSubmittedFiles(filteredFiles);

    const storedDecisions = JSON.parse(localStorage.getItem('adminDecisions')) || {};
    setDecisions(storedDecisions);
  }, []);

  const renderDecisionStatus = (reportId) => {
    const status = decisions[reportId];

    if (status === 'approved') return <span className="badge bg-success">Approved</span>;
    if (status === 'redo') return <span className="badge bg-danger">Redo Requested</span>;

    return <span className="badge bg-warning">Pending Review</span>;
  };

  const isValidUrl = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'blob:';
    } catch (e) {
      return false;
    }
  };

  const handleDecision = (reportId, action) => {
    const confirmationMessage = `Are you sure you want to ${action} this report?`;

    if (window.confirm(confirmationMessage)) {
      const updated = {
        ...decisions,
        [reportId]: action,
      };
      setDecisions(updated);
      localStorage.setItem('adminDecisions', JSON.stringify(updated));

      if (action === 'approved') {
        const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || {};
        const fileToApprove = uploadedFiles[reportId];
        const approvedFiles = JSON.parse(localStorage.getItem('approvedFiles')) || {};
        approvedFiles[reportId] = fileToApprove;
        localStorage.setItem('approvedFiles', JSON.stringify(approvedFiles));

        delete uploadedFiles[reportId];
        localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));

        const updatedSubmitted = { ...submittedFiles };
        delete updatedSubmitted[reportId];
        setSubmittedFiles(updatedSubmitted);
      } else if (action === 'redo') {
        const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || {};
        delete uploadedFiles[reportId];
        localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));

        const updatedSubmitted = { ...submittedFiles };
        delete updatedSubmitted[reportId];
        setSubmittedFiles(updatedSubmitted);
      }
    }
  };

  return (
    <div className="container p-4">
      <div className="card shadow">
        <div className="card-header bg-white top-head-btn">
          <h4 className="mb-0">Audit NC Closer – Submitted Evidence</h4>
         
        </div>

        <div className="card-body">
          {Object.keys(submittedFiles).length === 0 ? (
            <p className="text-muted">No evidence files submitted yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>NCS Number</th>
                    <th>Department</th>
                    <th>Audit Cycle</th>
                    <th>File Name</th>
                    <th>View File</th>
                    <th>View Action Report</th>
                    <th>Decision</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(submittedFiles).map(([reportId, fileData]) => (
                    <tr key={reportId}>
                      <td>{fileData.ncsNumber || 'N/A'}</td>
                      <td>{fileData.department || fileData.dptname || 'N/A'}</td>
                      <td>{fileData.auditCycleNo || 'N/A'}</td>
                      <td>{fileData.name}</td>
                      <td>
                        {isValidUrl(fileData.url) ? (
                          <a
                            href={fileData.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-primary"
                          >
                            View
                          </a>
                        ) : (
                          <button className="btn btn-sm btn-secondary" disabled>
                            View
                          </button>
                        )}
                      </td>
                      <td>
                        {fileData.ncsNumber ? (
                          <button
                            className="btn btn-sm btn-info"
                            onClick={() => handleViewActionReport(
                              fileData.ncsNumber,
                              fileData.department || fileData.dptname,
                              fileData.auditCycleNo
                            )}
                          >
                            View Report
                          </button>
                        ) : (
                          <button className="btn btn-sm btn-secondary" disabled>
                            N/A
                          </button>
                        )}
                      </td>
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleDecision(reportId, 'approved')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDecision(reportId, 'redo')}
                          >
                            Redo
                          </button>
                        </div>
                      </td>
                      <td>
                        {isValidUrl(fileData.url) ? renderDecisionStatus(reportId) : (
                          <span className="badge bg-warning">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditNcCloser;