import React from 'react';
import PropTypes from 'prop-types';
import companyLogo from "../assets/images/lls_logo.png";

const ReportViewer = ({ report, onEdit, onBack }) => {
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
              font-size: 12pt;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color: #333;
              background-color: white !important;
            }
            
            @page {
              size: A4;
              margin: 1mm;
            }
            
            .print-page {
              width: 210mm;
              min-height: 297mm;
              page-break-after: always;
              margin: 0 auto;
              padding: 15mm;
              box-sizing: border-box;
              background: white;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              page-break-inside: avoid;
            }
            
            th, td {
              border: 1px solid #000 !important;
              padding: 8px 12px;
              text-align: left;
              vertical-align: top;
              word-wrap: break-word;
            }
            
            th {
              background-color: #2c3e50 !important;
              color: white !important;
              font-weight: normal;
            }
            
            .head_title_logo {
              display: flex;
              justify-content: space-evenly;
              align-items: center;
              padding: 5px;
              border: 1px solid black;
              font-weight: bold;
            }
            
            .document-title {
              text-align: center;
              font-size: 19px !important;
              border-right: 1px solid black;
              border-left: 1px solid black;
              padding: 10px 30px;
              color: #2c3e50;
              margin-bottom: 5px;
            }
            
            .follow_split {
              display: flex;
              justify-content: space-around;
            }
            
            .follow_split_left {
              border-right: 1px solid black;
            }
            
            .signature_line {
              display: flex;
              justify-content: space-between;
              margin-bottom: 0px;
              font-size: 12px;
            }
            
            .signature_line p {
              margin-top: 40px;
              margin-bottom: 0px;
              font-weight: bold;
            }
            
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              
              .print-page {
                padding: 15mm;
              }
              
              .document-title {
                font-size: 16px !important;
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
              }, 200);
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
          scale: 2,
          logging: false,
          useCORS: true,
          scrollX: 0,
          scrollY: 0,
          backgroundColor: '#FFFFFF'
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pdf.internal.pageSize.getWidth() - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
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
                      style={{ height: '60px', objectFit: 'contain' }}
                    />
                    <h1 className="document-title">
                      Internal Audit Non Conformity and Corrective Action Report
                    </h1>
                    <div style={{ fontSize: '15px', textAlign: 'right', minWidth: '120px', lineHeight: '1.2' }}>
                      <strong>Audit cycle No:</strong><br />
                      <span>{report.auditCycleNo}</span>
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
                <td><strong>PROCESS</strong>: {report.process}</td>
                <td><strong>AUDITOR/DEPT.</strong>: {report.auditor}</td>
                <td><strong>AUDITEE</strong>: {report.auditee}</td>
              </tr>
              <tr>
                <td colSpan={3}>
                  <p><strong>REQUIREMENT (ISO 9001 STD / Quality manual / SOP / Dept.'s Documented Information):</strong></p>
                  <p>{report.requirement}</p>
                </td>
              </tr>
              <tr>
                <td colSpan={3}>
                  <div className='follow_split'>
                    <div className='follow_split_left'>
                      <p><strong>NONCONFORMITY STATEMENT</strong></p>
                      <p>{report.nonConformityStatement}</p>
                    </div>
                    <div className='follow_split_right'>
                      <p><strong>OBJECTIVE EVIDENCE</strong></p>
                      <p>{report.objectiveEvidence}</p>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <p className='iso_line'><strong>ISO 9001-2018: OVIS CLASS NO. & DISCIPLINE</strong></p>
                </td>
                <td colSpan={2}><p>{report.isoClass}</p></td>
              </tr>
              <tr>
                <td colSpan={3}>
                  <div className='signature_line mb-0'>
                    <p>DATE: {report.auditDate}</p>
                    <p>SIGNATURE OF AUDITOR: </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="document-section-title">
                  <p className='mb-0'>TO BE FILLED BY AUDITEE</p>
                </td>
              </tr>
              <tr>
                <td className="document-field">
                  <p><strong>POTENTIAL RISK</strong></p>
                  <p>{report.potentialRisk}</p>
                </td>
                <td colSpan={2}>
                  <p><strong>CORRECTION</strong></p>
                  <table className="document-table">
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
                          <td>{index + 1}</td> {/* Show serial number */}
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
                  <div className='signature_line mb-0'>
                    <p>DATE: {report.auditDate}</p>
                    <p>SIGNATURE OF AUDITEE: {report.auditeeSignature}</p>
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
          <table className="document-header-table mt-3">
            <tbody>
              <tr>
                <td colSpan={3}>
                  <div className="head_title_logo">
                    <img
                      src={companyLogo}
                      alt="Company Logo"
                      className="img_logo"
                      style={{ height: '60px', objectFit: 'contain' }}
                    />
                    <h1 className="document-title" style={{ marginRight: '180px' }}>
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
                    <p className="section-header"><strong>ROOT CAUSE(S)</strong></p>
                    <hr className="divider" />
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
                  <p className='text_cen'><strong>CORRECTIVE ACTION</strong></p><hr />
                  <table className="document-table">
                    <thead>
                      <tr>
                        <th width="10%">SL no.</th>
                        <th width="25%">Activity</th>
                        <th width="15%">Resp.</th>
                        <th width="25%">Changes to be made in FMEA/ROAR/OMS Doc. Info.</th>
                        <th width="15%">Target/Resp.</th>
                        <th width="10%">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.correctiveActions.map((action, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td> {/* Show serial number */}
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
                  <div className='signature_line mb-0'>
                    <p>DATE: {report.auditDate}</p>
                    <p>SIGNATURE OF AUDITEE: {report.auditeeSignature}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="document-section-title">
                  <p>TO BE FILLED BY AUDITOR</p>
                </td>
              </tr>
              <tr>
                <td>
                  <div className='follow_split'>
                    <div className='follow_split_left'>
                      <p><strong>FOLLOW-UP AUDIT OBSERVATION</strong></p>
                      <p>{report.followUpObservation}</p>
                    </div>
                    <div className='follow_split_right'>
                      <p><strong>OBJECTIVE EVIDENCE</strong></p>
                      <p>{report.followUpEvidence}</p>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className='signature_line mb-0'>
                    <p>DATE: {report.auditDate}</p>
                    <p>SIGNATURE OF AUDITOR: </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <p><strong>NCR. CLOSING STATUS</strong></p>
                  "a) Closed / Mixed Re-Action":<br />
                  "b) Amid similar nonconformity exist, could potentially occur at:"
                </td>
              </tr>
              <tr>
                <td>
                  <div className="end_content">
                    <p>DATE: {report.auditDate}</p>
                    <p>Verified by: {report.verifiedBy}<br /></p>
                    <p>Approved by: {report.approvedBy}<br /></p>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <p className='document-footer'>
                    LLS3/TQ3A/QA/6/5/0/8/04-00-03-2022
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="form-buttons no-print">
        <button type="button" className="submit-btns" style={{ width: "100px" }} onClick={onEdit}>Edit</button>
        <button type="button" className="delete-btn" onClick={onBack}>Back to Reports</button>
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
  onBack: PropTypes.func.isRequired
};

export default ReportViewer;