import React, { useEffect, useState } from 'react';

const AuditNcUserView = () => {
  const [approvedFiles, setApprovedFiles] = useState({});
  const [userAuditDepartment, setuserAuditDepartment] = useState('');
  const [filters, setFilters] = useState({
    auditCycleNo: '',
    ncsNumber: '',
  });

  useEffect(() => {
    const storedApprovedFiles = JSON.parse(localStorage.getItem('approvedFiles')) || {};
    const userDept = localStorage.getItem('userAuditDepartment') || '';
    setuserAuditDepartment(userDept);
    
    // Filter files by user's department
    const filteredFiles = {};
    Object.entries(storedApprovedFiles).forEach(([reportId, file]) => {
      if (file.department === userDept || file.dptname === userDept) {
        filteredFiles[reportId] = file;
      }
    });

    // Apply additional filters (Audit Cycle No and NCS Number)
    const finalFilteredFiles = Object.entries(filteredFiles).filter(([reportId, file]) => {
      const { auditCycleNo, ncsNumber } = filters;
      const matchesAuditCycleNo = auditCycleNo ? file.auditCycleNo?.toString().includes(auditCycleNo) : true;
      const matchesNcsNumber = ncsNumber ? file.ncsNumber?.toString().includes(ncsNumber) : true;

      return matchesAuditCycleNo && matchesNcsNumber;
    });

    // Update state with the filtered files
    const filteredFilesObj = finalFilteredFiles.reduce((acc, [reportId, file]) => {
      acc[reportId] = file;
      return acc;
    }, {});
    
    setApprovedFiles(filteredFilesObj);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container p-4">
      <div className="card shadow">
        <div className="card-header bg-white">
          <h4 className="mb-0">Approved Audit NC Files ({userAuditDepartment})</h4>
        </div>

        <div className="card-body">
          {/* Filter section */}
          <div className="mb-3">
            <div className="row">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  name="auditCycleNo"
                  placeholder="Filter by Audit Cycle No"
                  value={filters.auditCycleNo}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-6">
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

          {/* Display files */}
          {Object.keys(approvedFiles).length === 0 ? (
            <p className="text-muted">No approved files found for your department.</p>
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
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(approvedFiles).map(([reportId, file]) => (
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

export default AuditNcUserView;
