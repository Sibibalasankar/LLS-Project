import React, { useEffect, useState } from 'react';

const AuditNcApproval = () => {
  const [approvedFiles, setApprovedFiles] = useState({});
  const [decisions, setDecisions] = useState({});
  const [filters, setFilters] = useState({
    department: '',
    auditCycleNo: '',
    ncsNumber: '',
  });

  useEffect(() => {
    const storedApprovedFiles = JSON.parse(localStorage.getItem('approvedFiles')) || {};
    const storedDecisions = JSON.parse(localStorage.getItem('adminDecisions')) || {};

    console.log('Stored Approved Files:', storedApprovedFiles);
    console.log('Stored Decisions:', storedDecisions);

    setApprovedFiles(storedApprovedFiles);
    setDecisions(storedDecisions);
  }, []);

  const handleRemoveApproval = (reportId) => {
    const confirmationMessage = `Are you sure you want to remove approval for this report?`;

    if (window.confirm(confirmationMessage)) {
      const updatedDecisions = { ...decisions, [reportId]: 'redo' };
      const updatedApprovedFiles = { ...approvedFiles };

      const fileToRemove = updatedApprovedFiles[reportId];
      console.log('File to remove:', fileToRemove);

      const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || {};
      uploadedFiles[reportId] = fileToRemove;

      delete updatedApprovedFiles[reportId];
      localStorage.setItem('approvedFiles', JSON.stringify(updatedApprovedFiles));
      localStorage.setItem('adminDecisions', JSON.stringify(updatedDecisions));
      localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));

      setApprovedFiles(updatedApprovedFiles);
      setDecisions(updatedDecisions);
    }
  };

  const renderDecisionStatus = (reportId) => {
    const status = decisions[reportId];

    if (status === 'approved') return <span className="badge bg-success">Approved</span>;
    if (status === 'redo') return <span className="badge bg-danger">Redo Requested</span>;
    return <span className="badge bg-warning">Pending Review</span>;
  };

  // Filter the approved files based on filter states
  const filteredFiles = Object.entries(approvedFiles).filter(([reportId, file]) => {
    const { department, auditCycleNo, ncsNumber } = filters;
    const matchesDepartment = department ? file.department?.toLowerCase().includes(department.toLowerCase()) : true;
    const matchesAuditCycleNo = auditCycleNo ? file.auditCycleNo?.toString().includes(auditCycleNo) : true;
    const matchesNcsNumber = ncsNumber ? file.ncsNumber?.toString().includes(ncsNumber) : true;

    return matchesDepartment && matchesAuditCycleNo && matchesNcsNumber;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log('Approved Files in State:', approvedFiles);

  return (
    <div className="container p-4">
      <div className="card shadow">
        <div className="card-header bg-white">
          <h4 className="mb-0">Approved Audit NC Files</h4>
        </div>

        <div className="card-body">
          <div className="mb-3">
            <div className="row">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  name="department"
                  placeholder="Filter by Department"
                  value={filters.department}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  name="auditCycleNo"
                  placeholder="Filter by Audit Cycle No"
                  value={filters.auditCycleNo}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  name="ncsNumber"
                  placeholder="Filter by NCR No"
                  value={filters.ncsNumber}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </div>

          {filteredFiles.length === 0 ? (
            <p className="text-muted">No files found with the selected filters.</p>
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
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map(([reportId, file]) => (
                    <tr key={reportId}>
                      <td>{file.ncsNumber || 'N/A'}</td>
                      <td>{file.department || file.dptname || 'N/A'}</td>
                      <td>{file.auditCycleNo || 'N/A'}</td>
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
                        {renderDecisionStatus(reportId)}
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
