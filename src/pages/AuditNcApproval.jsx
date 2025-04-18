import React, { useEffect, useState } from 'react';

const AuditNcApproval = () => {
  const [approvedFiles, setApprovedFiles] = useState({});
  const [decisions, setDecisions] = useState({});

  useEffect(() => {
    const storedApprovedFiles = JSON.parse(localStorage.getItem('approvedFiles')) || {};
    setApprovedFiles(storedApprovedFiles);

    const storedDecisions = JSON.parse(localStorage.getItem('adminDecisions')) || {};
    setDecisions(storedDecisions);
  }, []);

  const handleRemoveApproval = (reportId) => {
    const confirmationMessage = `Are you sure you want to remove approval for this report?`;
    
    if (window.confirm(confirmationMessage)) {
      // Update decision to 'redo'
      const updatedDecisions = { ...decisions, [reportId]: 'redo' };
      setDecisions(updatedDecisions);
      localStorage.setItem('adminDecisions', JSON.stringify(updatedDecisions));

      // Remove from approvedFiles and add to uploadedFiles in localStorage
      const approvedFiles = JSON.parse(localStorage.getItem('approvedFiles')) || {};
      const fileToRemove = approvedFiles[reportId];

      const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || {};
      uploadedFiles[reportId] = fileToRemove;
      localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));

      // Remove from approvedFiles in localStorage
      delete approvedFiles[reportId];
      localStorage.setItem('approvedFiles', JSON.stringify(approvedFiles));

      // Update state to reflect changes
      const updatedApprovedFiles = { ...approvedFiles };
      delete updatedApprovedFiles[reportId];
      setApprovedFiles(updatedApprovedFiles);
    }
  };

  const renderDecisionStatus = (reportId) => {
    const status = decisions[reportId];

    if (status === 'approved') return <span className="badge bg-success">Approved</span>;
    if (status === 'redo') return <span className="badge bg-danger">Redo Requested</span>;

    return <span className="badge bg-warning">Pending Review</span>;
  };

  return (
    <div className="container p-4">
      <div className="card shadow">
        <div className="card-header bg-white">
          <h4 className="mb-0">Approved Audit NC Files</h4>
        </div>

        <div className="card-body">
          {Object.keys(approvedFiles).length === 0 ? (
            <p className="text-muted">No files have been approved yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Report ID</th>
                    <th>File Name</th>
                    <th>View File</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(approvedFiles).map(([reportId, file]) => (
                    <tr key={reportId}>
                      <td>{reportId}</td>
                      <td>{file.name}</td>
                      <td>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-primary"
                        >
                          View
                        </a>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRemoveApproval(reportId)}
                        >
                          Remove Approval
                        </button>
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

export default AuditNcApproval;
