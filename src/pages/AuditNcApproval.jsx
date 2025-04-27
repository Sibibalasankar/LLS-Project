import React, { useEffect, useState } from 'react';

const AuditNcApproval = () => {
  const [approvedFiles, setApprovedFiles] = useState({});
  const [decisions, setDecisions] = useState({});

  useEffect(() => {
    const storedApprovedFiles = JSON.parse(localStorage.getItem('approvedFiles')) || {};
    const storedDecisions = JSON.parse(localStorage.getItem('adminDecisions')) || {};

    // Log to see if data is being fetched properly from localStorage
    console.log('Stored Approved Files:', storedApprovedFiles);
    console.log('Stored Decisions:', storedDecisions);

    setApprovedFiles(storedApprovedFiles);
    setDecisions(storedDecisions);
  }, []);

  const handleRemoveApproval = (reportId) => {
    const confirmationMessage = `Are you sure you want to remove approval for this report?`;

    if (window.confirm(confirmationMessage)) {
      // Copy the current decisions and files to ensure proper state update
      const updatedDecisions = { ...decisions, [reportId]: 'redo' };
      const updatedApprovedFiles = { ...approvedFiles };

      // Retrieve the file to remove
      const fileToRemove = updatedApprovedFiles[reportId];

      // Log to ensure the file exists before removing
      console.log('File to remove:', fileToRemove);

      // Remove from approvedFiles and add back to uploadedFiles in localStorage
      const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || {};
      uploadedFiles[reportId] = fileToRemove;

      // Remove from approvedFiles in localStorage
      delete updatedApprovedFiles[reportId];
      localStorage.setItem('approvedFiles', JSON.stringify(updatedApprovedFiles));

      // Update decisions in localStorage
      localStorage.setItem('adminDecisions', JSON.stringify(updatedDecisions));

      // Save the updated files in uploadedFiles
      localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));

      // Update state to reflect changes
      setApprovedFiles(updatedApprovedFiles);
      setDecisions(updatedDecisions);
    }
  };

  const renderDecisionStatus = (reportId) => {
    const status = decisions[reportId];

    if (status === 'approved') {
      return <span className="badge bg-success">Approved</span>;
    }
    if (status === 'redo') {
      return <span className="badge bg-danger">Redo Requested</span>;
    }
    return <span className="badge bg-warning">Pending Review</span>;
  };

  // Log the approvedFiles state to check if it's being correctly populated
  console.log('Approved Files in State:', approvedFiles);

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
