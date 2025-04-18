import React, { useEffect, useState } from 'react';

const AuditNcApproval = () => {
  const [approvedFiles, setApprovedFiles] = useState({});

  useEffect(() => {
    const storedApprovedFiles = JSON.parse(localStorage.getItem('approvedFiles')) || {};
    setApprovedFiles(storedApprovedFiles);
  }, []);

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
