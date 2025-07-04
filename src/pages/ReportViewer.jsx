import React from 'react';
import PropTypes from 'prop-types';
import companyLogo from "../assets/images/lls_logo.png";

const ReportViewer = ({ report, onEdit, onBack, hideBackButton }) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = document.querySelector('.tabls_data').innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Report Print</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              font-size: 11pt;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color: #333;
              background-color: white !important;
            }
            
            @page {
              size: A4;
              margin: 10mm 8mm;
            }
            
            .print-page {
              width: 100%;
              height: 100vh;
              page-break-after: always;
              page-break-inside: avoid;
              display: flex;
              flex-direction: column;
              box-sizing: border-box;
            }
            
            .print-page:last-child {
              page-break-after: avoid;
            }
            
            .document-header-table {
              width: 100%;
              border-collapse: collapse;
              height: 100%;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
            }
            
            th, td {
              border: 1px solid #000 !important;
              padding: 6px 8px;
              text-align: left;
              vertical-align: top;
              word-wrap: break-word;
              font-size: 10pt;
            }
            
            th {
              background-color: #2c3e50 !important;
              color: white !important;
              font-weight: bold;
              font-size: 9pt;
            }
            
            .head_title_logo {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 8px;
              border: 1px solid black;
              font-weight: bold;
            }
            
            .document-title {
              text-align: center;
              font-size: 14px !important;
              font-weight: bold;
              color: #2c3e50;
              margin: 0;
              flex: 1;
              padding: 0 15px;
            }
            
            .img_logo {
              width: 45px;
              height: auto;
              flex-shrink: 0;
            }
            
            .audit-cycle-info {
              font-size: 11px;
              text-align: right;
              min-width: 100px;
              line-height: 1.2;
              flex-shrink: 0;
            }
            
            .follow_split {
              display: flex;
              justify-content: space-between;
              height: 100%;
            }
            
            .follow_split_left, .follow_split_right {
              width: 49%;
              padding: 8px;
              box-sizing: border-box;
            }
            
            .follow_split_left {
              border-right: 1px solid black;
            }
            
            .signature_line {
              display: flex;
              justify-content: space-between;
              margin-top: 10px;
              font-size: 10pt;
            }
            
            .document-section-title {
              text-align: center;
              font-weight: bold;
              font-size: 11px;
              background-color: #f0f0f0;
              padding: 8px;
            }
            
            .signature_line p {
              margin: 0;
              font-weight: bold;
            }
            
            .signature_line .signature-field {
              margin-top: 30px;
              margin-bottom: 0;
              font-weight: bold;
            }
            
            .document-footer {
              text-align: center;
              font-size: 9pt;
              padding: 5px;
            }
            
            .root-cause-section {
              padding: 10px;
            }
            
            .root-cause-table {
              width: 100%;
              margin-top: 10px;
            }
            
            .root-cause-row td {
              padding: 5px 8px;
              border: 1px solid #000;
            }
            
            .root-cause-label {
              width: 15%;
              font-weight: bold;
              background-color: #f5f5f5;
            }
            
            .text_cen {
              text-align: center;
              font-weight: bold;
              margin: 10px 0;
            }
            
            .end_content {
              padding: 10px;
              line-height: 1.4;
            }
            
            ul {
              margin: 5px 0;
              padding-left: 20px;
            }
            
            li {
              margin: 2px 0;
              font-size: 10pt;
            }
            
            hr {
              border: 1px solid #ccc;
              margin: 8px 0;
            }
            
            /* Page-specific adjustments */
            .page-1 .document-header-table {
              font-size: 10pt;
            }
            
            .page-2 .document-header-table {
              font-size: 9pt;
            }
            
            .page-2 .root-cause-table td {
              font-size: 9pt;
              padding: 4px 6px;
            }
            
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              
              .print-page {
                height: 100vh;
                margin: 0;
                padding: 0;
              }
              
              .document-title {
                font-size: 12px !important;
              }
              
              th, td {
                font-size: 9pt;
                padding: 4px 6px;
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadPDF = async () => {
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '210mm';
    tempDiv.innerHTML = document.querySelector('.tabls_data').innerHTML;
    document.body.appendChild(tempDiv);

    const loadScript = (src) => new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

    try {
      await Promise.all([
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
      ]);

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pages = tempDiv.querySelectorAll('.print-page');

      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], {
          scale: 1.5,
          logging: false,
          useCORS: true,
          scrollX: 0,
          scrollY: 0,
          backgroundColor: '#FFFFFF',
          width: 794, // A4 width in pixels at 96 DPI
          height: 1123 // A4 height in pixels at 96 DPI
        });

        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }

      const departmentName = report.dptname.replace(/[^a-zA-Z0-9]/g, '_');
      const auditCycle = report.auditCycleNo.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `Action_Report_${departmentName}_${auditCycle}_${new Date().toISOString().slice(0, 10)}.pdf`;

      pdf.save(fileName);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      document.body.removeChild(tempDiv);
    }
  };

  return (
    <div className="document-format">
      <div className="tabls_data">
        <div className="print-page page-1">
          <table className="document-header-table">
            <tbody>
              <tr>
                <td colSpan={3}>
                  <div className="head_title_logo">
                    <img
                      src={companyLogo}
                      alt="Company Logo"
                      className="img_logo"
                    />
                    <h1 className="document-title">
                      Internal Audit Non Conformity and Corrective Action Report
                    </h1>
                    <div className="audit-cycle-info">
                      <strong>Audit cycle No:</strong><br />
                      <span style={{ fontWeight: '200' }}>{report.auditCycleNo}</span>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td width="33%"><strong>DEPT</strong>: {report.dptname}</td>
                <td width="33%"><strong>NCR. NO.</strong>: {report.ncsNumber}</td>
                <td width="33%"><strong>AUDIT DATE</strong>: {report.auditDate}</td>
              </tr>
              <tr>
                <td><strong>PROCESS</strong>:
                  <ul>
                    {Array.isArray(report.process) ? (
                      report.process.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))
                    ) : (
                      <li>{report.process}</li>
                    )}
                  </ul>
                </td>
                <td><strong>AUDITOR/DEPT.</strong>: {report.auditor}</td>
                <td><strong>AUDITEE</strong>: {report.auditee}</td>
              </tr>
              <tr>
                <td colSpan={3}>
                  <p><strong>REQUIREMENT (ISO 9001 STD / Quality manual / SOP / Dept.'s Documented Information):</strong></p>
                  <ul>
                    {Array.isArray(report.requirement)
                      ? report.requirement.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))
                      : <li>{report.requirement}</li>
                    }
                  </ul>
                </td>
              </tr>
              <tr>
                <td colSpan={3}>
                  <div className='follow_split'>
                    <div className='follow_split_left'>
                      <p><strong>NONCONFORMITY STATEMENT</strong></p>
                      <ul>
                        {Array.isArray(report.nonConformityStatement)
                          ? report.nonConformityStatement.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))
                          : <li>{report.nonConformityStatement}</li>}
                      </ul>
                    </div>
                    <div className='follow_split_right'>
                      <p><strong>OBJECTIVE EVIDENCE</strong></p>
                      <ul>
                        {Array.isArray(report.objectiveEvidence)
                          ? report.objectiveEvidence.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))
                          : <li>{report.objectiveEvidence}</li>}
                      </ul>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <p><strong>ISO 9001-2018: OVIS CLASS NO. & DISCIPLINE</strong></p>
                </td>
                <td colSpan={2}>
                  <ul>
                    {Array.isArray(report.isoClass)
                      ? report.isoClass.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))
                      : <li>{report.isoClass}</li>}
                  </ul>
                </td>
              </tr>
              <tr>
                <td colSpan={3}>
                  <div className='signature_line'>
                    <p>DATE: {report.auditDate}</p>
                    <p className="signature-field">SIGNATURE OF AUDITOR:</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="document-section-title">
                  TO BE FILLED BY AUDITEE
                </td>
              </tr>
              <tr>
                <td>
                  <p><strong>POTENTIAL RISK</strong></p>
                  <ul>
                    {Array.isArray(report.potentialRisk)
                      ? report.potentialRisk.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))
                      : <li>{report.potentialRisk}</li>}
                  </ul>
                </td>
                <td colSpan={2}>
                  <p><strong>CORRECTION</strong></p>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th width="10%">SLno.</th>
                        <th width="40%">Activity</th>
                        <th width="25%">Target</th>
                        <th width="25%">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.activities.map((activity, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{activity.activity}</td>
                          <td>{activity.target}</td>
                          <td>{activity.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td colSpan={3}>
                  <div className='signature_line'>
                    <p>DATE: {report.auditDate}</p>
                    <p className="signature-field">SIGNATURE OF AUDITEE: </p>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>
                  <div className="document-footer">
                    P.T.O  LLS1/TQM/QA/06/01/00/R03-00-03.05.2022
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="print-page page-2">
          <table className="document-header-table">
            <tbody>
              <tr>
                <td colSpan={3}>
                  <div className="head_title_logo">
                    <img
                      src={companyLogo}
                      alt="Company Logo"
                      className="img_logo"
                    />
                    <h1 className="document-title">
                      Internal Audit Non Conformity and Corrective Action Report
                    </h1>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="document-section-title">TO BE FILLED BY AUDITEE</td>
              </tr>
              <tr>
                <td>
                  <div className="root-cause-section">
                    <p className="text_cen"><strong>ROOT CAUSE(S)</strong></p>
                    <hr />
                    <table className="root-cause-table">
                      <tbody>
                        {[0, 1, 2, 3, 4].map((index) => (
                          <tr key={index} className="root-cause-row">
                            <td className="root-cause-label">Why {index + 1}</td>
                            <td className="root-cause-value">
                              {report.rootCauses[index] || ""}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <p className='text_cen'><strong>CORRECTIVE ACTION</strong></p>
                  <hr />
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th width="8%">SL no.</th>
                        <th width="22%">Activity</th>
                        <th width="12%">Resp.</th>
                        <th width="25%">Changes to be made in FMEA/ROAR/OMS Doc. Info.</th>
                        <th width="18%">Target/Resp.</th>
                        <th width="15%">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.correctiveActions.map((action, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{action.activity}</td>
                          <td>{action.responsible}</td>
                          <td>{action.changes}</td>
                          <td>{action.target}</td>
                          <td>{action.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <div className='signature_line'>
                    <p>DATE: {report.auditDate}</p>
                    <p className="signature-field">SIGNATURE OF AUDITEE: </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="document-section-title">
                  TO BE FILLED BY AUDITOR
                </td>
              </tr>
              <tr>
                <td>
                  <div className='follow_split'>
                    <div className='follow_split_left'>
                      <p><strong>FOLLOW-UP AUDIT OBSERVATION</strong></p>
                      <p style={{ whiteSpace: 'pre-line' }}>{report.followUpObservation}</p>
                    </div>
                    <div className='follow_split_right'>
                      <p><strong>OBJECTIVE EVIDENCE</strong></p>
                      <p style={{ whiteSpace: 'pre-line' }}>{report.followUpEvidence}</p>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className='signature_line'>
                    <p>DATE: {report.auditDate}</p>
                    <p className="signature-field">SIGNATURE OF AUDITOR:</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <p><strong>NCR. CLOSING STATUS</strong></p>
                  <p>a) Closed / Mixed Re-Action:<br />
                    b) Amid similar nonconformity exist, could potentially occur at:</p>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="end_content">
                    <p>DATE: {report.auditDate}</p>
                    <p>Verified by: {report.verifiedBy}</p>
                    <p>Approved by: {report.approvedBy}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="document-footer">
                    LLS3/TQ3A/QA/6/5/0/8/04-00-03-2022
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="form-buttons no-print">
        <button type="button" className="submit-btns" style={{ width: "100px" }} onClick={onEdit}>Edit</button>

        {!hideBackButton && (
          <button type="button" className="delete-btn" onClick={onBack}>Back to Reports</button>
        )}

        <div className="action-buttons">
          <button className="print-btns" onClick={handlePrint}>
            <i className="fas fa-print" style={{ marginRight: '8px' }}></i>
            Print Report
          </button>
          <button className="download-pdf-btn" onClick={handleDownloadPDF}>
            <i className="fas fa-file-pdf" style={{ marginRight: '8px' }}></i>
            Download PDF
          </button>
        </div>
      </div>

    </div>
  );
};

ReportViewer.propTypes = {
  report: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onBack: PropTypes.func,
  hideBackButton: PropTypes.bool // Add this
};


export default ReportViewer;