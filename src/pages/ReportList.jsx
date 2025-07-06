import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useReactToPrint } from 'react-to-print';

const ReportList = ({ reports, onView, onEdit, onDelete, onAddNew, departmentName }) => {
  const [filters, setFilters] = useState({
    dptname: "",
    auditCycleNo: "",
    savedDate: "",
     status: ""
  });

  const [departments, setDepartments] = useState([]);
  const [approvedNcrNumbers, setApprovedNcrNumbers] = useState([]);

  const printRef = useRef();

  useEffect(() => {
    // Use your existing localStorage data structure
    const storedDepartments = JSON.parse(localStorage.getItem("departments") || "[]");
    setDepartments(storedDepartments);

    const approvedFiles = JSON.parse(localStorage.getItem('approvedFiles')) || {};
    const ncrList = Object.values(approvedFiles).map(file => file.ncsNumber);
    setApprovedNcrNumbers(ncrList);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  const getStatus = (ncsNumber) => {
    return approvedNcrNumbers.includes(ncsNumber) ? 'Approved' : 'Pending';
  };
  // Filter reports by department
const filteredReports = reports.filter(report => {
  const matchesDepartment = departmentName ? report.dptname === departmentName : true;
  const matchesFilters =
    (filters.dptname === "" || report.dptname === filters.dptname) &&
    (filters.auditCycleNo === "" || report.auditCycleNo.includes(filters.auditCycleNo)) &&
    (filters.savedDate === "" || report.auditDate === filters.savedDate) &&
    (filters.status === "" || getStatus(report.ncsNumber) === filters.status);

  return matchesDepartment && matchesFilters;
});




  const getStatusColor = (status) => {
    return status === 'Approved' ? '#28a745' : '#ffc107';
  };

  // Alternative print function without react-to-print
  const handlePrintAlternative = () => {
    const printContent = printRef.current;
    if (!printContent) {
      console.error('Nothing to print - printRef is null');
      return;
    }

    // Create a complete HTML document for printing
    const printHTML = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Action Reports Status Report</title>
          <style>
            @page { 
              size: A4; 
              margin: 15mm; 
            }
            * {
              box-sizing: border-box;
            }
            body { 
              font-family: Arial, sans-serif; 
              font-size: 12px; 
              line-height: 1.4; 
              margin: 0;
              padding: 20px;
              color: #333;
            }
            .no-print { 
              display: none !important; 
            }
            h1 {
              font-size: 24px;
              color: #333;
              text-align: center;
              margin-bottom: 10px;
            }
            h3 {
              font-size: 16px;
              color: #495057;
              margin: 15px 0 10px 0;
            }
            table { 
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
              page-break-inside: auto;
            }
            tr { 
              page-break-inside: avoid; 
              page-break-after: auto; 
            }
            th {
              background-color: #343a40 !important;
              color: white !important;
              padding: 8px;
              font-size: 11px;
              border: 1px solid #dee2e6;
              text-align: left;
            }
            td {
              padding: 6px 8px;
              font-size: 11px;
              border: 1px solid #dee2e6;
            }
            tr:nth-child(even) {
              background-color: #f8f9fa;
            }
            .summary-section {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
              border: 1px solid #dee2e6;
            }
            .summary-grid {
              display: flex;
              justify-content: space-around;
              flex-wrap: wrap;
            }
            .summary-item {
              text-align: center;
              min-width: 120px;
              margin: 10px;
            }
            .summary-number {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .summary-label {
              font-size: 11px;
              color: #666;
            }
            .status-badge {
              color: white;
              padding: 2px 6px;
              border-radius: 3px;
              font-size: 10px;
              font-weight: bold;
            }
            .status-approved {
              background-color: #28a745;
            }
            .status-pending {
              background-color: #ffc107;
            }
            .print-footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #dee2e6;
              text-align: center;
              color: #666;
              font-size: 11px;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      console.error('Could not open print window - popup blocked?');
      // Fallback to direct print
      window.print();
      return;
    }

    printWindow.document.write(printHTML);
    printWindow.document.close();

    // Wait for content to load before printing
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        // Don't close immediately, let user control
      }, 500);
    };
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Action Reports Status Report',
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 100);
      });
    },
    onAfterPrint: () => {
      console.log('Print completed successfully');
    },
    onPrintError: (errorLocation, error) => {
      console.error('Print error:', errorLocation, error);
      console.log('Falling back to alternative print method');
      handlePrintAlternative();
    },
    pageStyle: `
      @page { 
        size: A4; 
        margin: 15mm; 
      }
      @media print {
        .no-print { display: none !important; }
        body { font-size: 12px; line-height: 1.4; }
        table { 
          page-break-inside: auto; 
          border-collapse: collapse;
          width: 100%;
        }
        tr { 
          page-break-inside: avoid; 
          page-break-after: auto; 
        }
        th, td {
          padding: 8px !important;
          font-size: 11px !important;
        }
      }
    `,
    removeAfterPrint: true
  });

  // Summary statistics
  const totalReports = filteredReports.length;
  const approvedCount = filteredReports.filter(report => getStatus(report.ncsNumber) === 'Approved').length;
  const pendingCount = totalReports - approvedCount;
  const approvalRate = totalReports > 0 ? ((approvedCount / totalReports) * 100).toFixed(1) : 0;

  return (
    <div className="saved-reports-container" style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <div className="report-list-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
<h2>
    {departmentName ? `Action Reports for ${departmentName}` : 'All Action Reports'}
  </h2>        <div className="button-group">
          <button
            type="button"
            onClick={onAddNew}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              marginRight: '10px',
              cursor: 'pointer'
            }}
          >
            Add New Report
          </button>
          <button
            type="button"
            onClick={handlePrint}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Print Status Report
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="no-print" style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ marginTop: 0, color: '#495057' }}>Filter Action Reports</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Department</label>
            <select
              name="dptname"
              value={filters.dptname}
              onChange={handleFilterChange}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ced4da'
              }}
            >
              <option value="">All Departments</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div>
  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status</label>
  <select
    name="status"
    value={filters.status}
    onChange={handleFilterChange}
    style={{
      width: '100%',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ced4da'
    }}
  >
    <option value="">All Status</option>
    <option value="Pending">Pending</option>
    <option value="Approved">Approved</option>
  </select>
</div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Audit Cycle No.</label>
            <input
              type="text"
              name="auditCycleNo"
              value={filters.auditCycleNo}
              onChange={handleFilterChange}
              placeholder="I/2025-26"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ced4da'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Audit Date</label>
            <input
              type="date"
              name="savedDate"
              value={filters.savedDate}
              onChange={handleFilterChange}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ced4da'
              }}
            />
          </div>
        </div>
      </div>

      {/* Printable Content */}
      <div ref={printRef} style={{ width: '100%' }}>
        {/* Print Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#333', marginBottom: '10px', fontSize: '24px' }}>Action Reports Status Report</h1>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Generated on: {new Date().toLocaleDateString()}</p>
          <p style={{ color: '#666', margin: 0, fontSize: '12px' }}>Total Reports: {filteredReports.length}</p>
        </div>

        {/* Summary Statistics */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #dee2e6',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <h3 style={{ marginTop: 0, color: '#495057', fontSize: '18px' }}>Summary Statistics</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center', minWidth: '120px', margin: '10px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>{totalReports}</div>
              <div style={{ color: '#666', fontSize: '12px' }}>Total Reports</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: '120px', margin: '10px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>{approvedCount}</div>
              <div style={{ color: '#666', fontSize: '12px' }}>Approved</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: '120px', margin: '10px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>{pendingCount}</div>
              <div style={{ color: '#666', fontSize: '12px' }}>Pending</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: '120px', margin: '10px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#17a2b8' }}>{approvalRate}%</div>
              <div style={{ color: '#666', fontSize: '12px' }}>Approval Rate</div>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        {filteredReports.length > 0 ? (
          <>
            <h3 style={{ color: '#333', fontSize: '16px', marginBottom: '15px' }}>Detailed Report List</h3>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '20px',
              fontSize: '12px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#343a40', color: 'white' }}>
                  <th style={{ padding: '10px 8px', textAlign: 'left', border: '1px solid #dee2e6', fontSize: '11px' }}>NCR Number</th>
                  <th style={{ padding: '10px 8px', textAlign: 'left', border: '1px solid #dee2e6', fontSize: '11px' }}>Department</th>
                  <th style={{ padding: '10px 8px', textAlign: 'left', border: '1px solid #dee2e6', fontSize: '11px' }}>Audit Cycle</th>
                  <th style={{ padding: '10px 8px', textAlign: 'left', border: '1px solid #dee2e6', fontSize: '11px' }}>Audit Date</th>
                  <th style={{ padding: '10px 8px', textAlign: 'left', border: '1px solid #dee2e6', fontSize: '11px' }}>Saved Date</th>
                  <th style={{ padding: '10px 8px', textAlign: 'left', border: '1px solid #dee2e6', fontSize: '11px' }}>Status</th>
                  <th className="no-print" style={{ padding: '10px 8px', textAlign: 'left', border: '1px solid #dee2e6', fontSize: '11px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report, index) => {
                  const status = getStatus(report.ncsNumber);
                  return (
                    <tr key={report.id || index} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                      <td style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '11px' }}>{report.ncsNumber || 'N/A'}</td>
                      <td style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '11px' }}>{report.dptname || 'N/A'}</td>
                      <td style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '11px' }}>{report.auditCycleNo || 'N/A'}</td>
                      <td style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '11px' }}>{report.auditDate || 'N/A'}</td>
                      <td style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '11px' }}>{report.savedDate || 'N/A'}</td>
                      <td style={{ padding: '8px', border: '1px solid #dee2e6', fontSize: '11px' }}>
                        <span style={{
                          backgroundColor: getStatusColor(status),
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          fontSize: '10px',
                          fontWeight: 'bold'
                        }}>
                          {status}
                        </span>
                      </td>
                      <td className="no-print" style={{ padding: '8px', border: '1px solid #dee2e6' }}>
                        <button
                          onClick={() => onView(report)}
                          style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '3px',
                            marginRight: '3px',
                            cursor: 'pointer',
                            fontSize: '10px'
                          }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => onEdit(index)}
                          style={{
                            backgroundColor: '#ffc107',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '3px',
                            marginRight: '3px',
                            cursor: 'pointer',
                            fontSize: '10px'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(index)}
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '10px'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
              No reports found matching your filters.
            </p>
          </div>
        )}

        {/* Print Footer */}
        <div style={{
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #dee2e6',
          textAlign: 'center',
          color: '#666',
          fontSize: '11px'
        }}>
          <p style={{ margin: '5px 0' }}>This report contains {filteredReports.length} action reports</p>
          <p style={{ margin: '5px 0' }}>Report generated on {new Date().toLocaleString()}</p>
          {filteredReports.length > 0 && (
            <p style={{ margin: '5px 0' }}>
              Departments: {[...new Set(filteredReports.map(r => r.dptname))].join(', ')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

ReportList.propTypes = {
  reports: PropTypes.array.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddNew: PropTypes.func.isRequired,
  departmentName: PropTypes.string

};

export default ReportList;