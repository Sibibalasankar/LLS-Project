import React, { useEffect, useState } from 'react';

const AuditNcCloser = () => {
  const [submittedFiles, setSubmittedFiles] = useState({});
  const [decisions, setDecisions] = useState({});

  useEffect(() => {
    const files = JSON.parse(localStorage.getItem('uploadedFiles')) || {};
    setSubmittedFiles(files);

    const storedDecisions = JSON.parse(localStorage.getItem('adminDecisions')) || {};
    setDecisions(storedDecisions);
  }, []);

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
        // Move to approved files in localStorage
        const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || {};
        const fileToApprove = uploadedFiles[reportId];
        const approvedFiles = JSON.parse(localStorage.getItem('approvedFiles')) || {};
        approvedFiles[reportId] = fileToApprove;
        localStorage.setItem('approvedFiles', JSON.stringify(approvedFiles));
  
        // Remove from uploadedFiles in localStorage
        delete uploadedFiles[reportId];
        localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
  
        // Remove the row from submittedFiles state
        const updatedSubmitted = { ...submittedFiles };
        delete updatedSubmitted[reportId];
        setSubmittedFiles(updatedSubmitted);
      } else if (action === 'redo') {
        // Clear the uploaded file and set status to 'redo'
        const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || {};
        delete uploadedFiles[reportId];
        localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
  
        // Update the submitted files state
        const updatedSubmitted = { ...submittedFiles };
        delete updatedSubmitted[reportId];
        setSubmittedFiles(updatedSubmitted);
      }
    }
  };
  
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

  return (
    <div className="container p-4">
      <div className="card shadow">
        <div className="card-header bg-white">
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
                    <th>Report ID</th>
                    <th>File Name</th>
                    <th>View File</th>
                    <th>Decision</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(submittedFiles).map(([reportId, file]) => (
                    <tr key={reportId}>
                      <td>{reportId}</td>
                      <td>{file.name}</td>
                      <td>
                        {isValidUrl(file.url) ? (
                          <a
                            href={file.url}
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
                        {isValidUrl(file.url) ? renderDecisionStatus(reportId) : (
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
