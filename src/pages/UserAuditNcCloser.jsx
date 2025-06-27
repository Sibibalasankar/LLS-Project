import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportList from './NewActionForm';

const UserAuditNcCloser = () => {
  const navigate = useNavigate();
  const [savedReports, setSavedReports] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [decisions, setDecisions] = useState({});
  const [filters, setFilters] = useState({
    dptname: "",
    ncsNumber: "",
    auditDate: ""
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const reports = JSON.parse(localStorage.getItem('savedReports') || '[]');
    const files = JSON.parse(localStorage.getItem('uploadedFiles') || '{}');
    const storedDecisions = JSON.parse(localStorage.getItem('adminDecisions') || '{}');
    const userRole = localStorage.getItem('userRole');

    setSavedReports(reports);
    setUploadedFiles(files);
    setDecisions(storedDecisions);

    if (userRole === 'admin') {
      setIsAdmin(true);
    }
  }, [refresh]);

  const refreshData = () => setRefresh(prev => !prev);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredReports = savedReports.filter(report => {
    return (
      (filters.dptname === "" || report.dptname.toLowerCase().includes(filters.dptname.toLowerCase())) &&
      (filters.ncsNumber === "" || report.ncsNumber.includes(filters.ncsNumber)) &&
      (filters.auditDate === "" || report.auditDate === filters.auditDate)
    );
  });

  const onView = (report) => { };
  const onEdit = (index) => { };
  const onDelete = (index) => { };

  const submittedCount = Object.keys(uploadedFiles).length;
  const approvedCount = Object.values(decisions).filter(d => d === 'approved').length;
  const redoCount = Object.values(decisions).filter(d => d === 'redo').length;
  const pendingCount = savedReports.length - submittedCount;

  if (savedReports.length === 0) {
    return (
      <div className="document-format">
        <h1 className="document-title">Audit Non-Conformity and Corrective Action Reports</h1>
        <div className="no-data-message">No reports available</div>
        <div className="form-buttons">
          <button onClick={() => navigate(-1)} className='nc-btn'>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="document-format">
      <h1 className="document-title mb-3 text-center">
        Audit Non-Conformity and Corrective Action Reports
      </h1>

      {isAdmin && (
        <div className="mb-3">
          <button type="button" className="add-btn mb-2">Add New Action Report</button>

          <div className="row g-3 mt-2">
            <div className="col-md-3">
              <div className="card text-white bg-info">
                <div className="card-body">
                  <h5 className="card-title">Total Reports</h5>
                  <p className="card-text fs-5">{savedReports.length}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-success">
                <div className="card-body">
                  <h5 className="card-title">Submitted</h5>
                  <p className="card-text fs-5">{submittedCount}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-warning">
                <div className="card-body">
                  <h5 className="card-title">Pending Submission</h5>
                  <p className="card-text fs-5">{pendingCount}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-primary">
                <div className="card-body">
                  <h5 className="card-title">Approved / Redo</h5>
                  <p className="card-text fs-5">{approvedCount} / {redoCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ReportList
        reports={filteredReports}
        uploadedFiles={uploadedFiles}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        refreshData={refreshData}
        decisions={decisions} // Pass decisions here
      />

    </div>
  );
};

export default UserAuditNcCloser;
