import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
import * as XLSX from "xlsx";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AuditSummary = () => {
  const [auditData, setAuditData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [auditCycles, setAuditCycles] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedCycle, setSelectedCycle] = useState("All");
  const [activeTab, setActiveTab] = useState("department");
  const [timePeriod, setTimePeriod] = useState("12months");
  const [financialYear, setFinancialYear] = useState("");

  useEffect(() => {
    // Load data from localStorage
    const allObservations = JSON.parse(localStorage.getItem("auditObservations")) || {};

    // Convert the object of observations into a flat array with audit dates
    const observationsArray = Object.values(allObservations).flatMap(obsArray =>
      obsArray.map(obs => ({
        ...obs,
        auditDate: obs.auditDate ? new Date(obs.auditDate) : null
      }))
    );

    setAuditData(observationsArray);

    // Get unique departments from all observations
    const uniqueDepartments = [...new Set(observationsArray.map(obs => obs.department))].filter(Boolean);
    setDepartments(["All", ...uniqueDepartments]);

    // Get unique audit cycles
    const uniqueCycles = [...new Set(observationsArray.map(obs => obs.auditCycleNo))].filter(Boolean);
    setAuditCycles(["All", ...uniqueCycles]);

    // Set current financial year
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const fy = currentMonth >= 4 ? `${currentYear}-${currentYear + 1}` : `${currentYear - 1}-${currentYear}`;
    setFinancialYear(fy);
  }, []);

  // Filter data based on time period
  const filterByTimePeriod = (data) => {
    const now = new Date();
    let startDate = new Date();

    switch (timePeriod) {
      case "6months":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "financialYear":
        const [startYear] = financialYear.split("-");
        startDate = new Date(`${startYear}-04-01`);
        break;
      case "12months":
      default:
        startDate.setMonth(now.getMonth() - 12);
        break;
    }

    return data.filter(obs => {
      if (!obs.auditDate) return false;
      return obs.auditDate >= startDate && obs.auditDate <= now;
    });
  };

  // Filter data based on selections
  const filteredData = filterByTimePeriod(auditData.filter(obs => {
    const departmentMatch = selectedDepartment === "All" || obs.department === selectedDepartment;
    const cycleMatch = selectedCycle === "All" || obs.auditCycleNo === selectedCycle;
    return departmentMatch && cycleMatch;
  }));

  console.log("Filtered data:", filteredData);

  // Count results by department
  const getResultCountsByDepartment = () => {
    const counts = {};

    const deptsToShow = selectedDepartment === "All"
      ? departments.filter(d => d !== "All")
      : [selectedDepartment];

    deptsToShow.forEach(dept => {
      counts[dept] = {
        NC: 0,
        op: 0,
        OFI: 0,
        total: 0
      };

      // Filter observations for this department
      const deptObservations = filteredData.filter(obs => obs.department === dept);

      deptObservations.forEach(obs => {
        const results = Array.isArray(obs.result) ? obs.result : [obs.result];

        results.forEach(result => {
          if (result === "NC") counts[dept].NC++;
          if (result === "O+" || result === "op") counts[dept].op++;  // Check both formats
          if (result === "OFI") counts[dept].OFI++;
        });

        counts[dept].total += results.length;
      });
    });

    return counts;
  };



  // Count results by audit cycle
  const getResultCountsByCycle = () => {
    const counts = {};

    const cyclesToShow = selectedCycle === "All"
      ? auditCycles.filter(c => c !== "All")
      : [selectedCycle];

    cyclesToShow.forEach(cycle => {
      counts[cycle] = {
        NC: 0,
        op: 0,  // Changed from "O+" to "op"
        OFI: 0,
        total: 0
      };

      // Filter observations for this cycle
      const cycleObservations = filteredData.filter(obs => obs.auditCycleNo === cycle);

      cycleObservations.forEach(obs => {
        const results = Array.isArray(obs.result) ? obs.result : [obs.result];

        results.forEach(result => {
          // Normalize result values
          const normalizedResult = result === "0+" ? "op" : result;

          if (normalizedResult === "NC") counts[cycle].NC++;
          if (normalizedResult === "op") counts[cycle].op++;  // Count both "op" and "O+"
          if (normalizedResult === "OFI") counts[cycle].OFI++;
        });

        counts[cycle].total += results.length;
      });
    });

    return counts;
  };
  const departmentCounts = getResultCountsByDepartment();
  const cycleCounts = getResultCountsByCycle();

  // Prepare data for charts
  const departmentChartData = {
    labels: Object.keys(departmentCounts),
    datasets: [
      {
        label: "Non-Conformity (NC)",
        data: Object.values(departmentCounts).map(dept => dept.NC),
        backgroundColor: "rgba(255, 99, 132, 0.7)",
      },
      {
        label: "Observation Positive (O+)",
        data: Object.values(departmentCounts).map(dept => dept.op),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
      {
        label: "Opportunity For Improvement (OFI)",
        data: Object.values(departmentCounts).map(dept => dept.OFI),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
    ],
  };

  const cycleChartData = {
    labels: Object.keys(cycleCounts),
    datasets: [
      {
        label: "Non-Conformity (NC)",
        data: Object.values(cycleCounts).map(cycle => cycle.NC),
        backgroundColor: "rgba(255, 99, 132, 0.7)",
      },
      {
        label: "Observation Positive (O+)",
        data: Object.values(cycleCounts).map(cycle => cycle.op),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
      {
        label: "Opportunity For Improvement (OFI)",
        data: Object.values(cycleCounts).map(cycle => cycle.OFI),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
    ],
  };

  const resultDistributionData = {
    labels: ["NC", "O+", "OFI"],
    datasets: [{
      data: [
        filteredData.reduce((sum, obs) => sum + ((Array.isArray(obs.result) ? obs.result : [obs.result]).filter(r => r === "NC").length), 0),
        filteredData.reduce((sum, obs) => sum + ((Array.isArray(obs.result) ? obs.result : [obs.result]).filter(r => r === "O+").length), 0),
        filteredData.reduce((sum, obs) => sum + ((Array.isArray(obs.result) ? obs.result : [obs.result]).filter(r => r === "OFI").length), 0)
      ],
      backgroundColor: [
        "rgba(255, 99, 132, 0.7)",
        "rgba(54, 162, 235, 0.7)",
        "rgba(75, 192, 192, 0.7)"
      ]
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "",
        font: {
          size: 18
        }
      },
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        }
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Result Distribution",
        font: {
          size: 16
        }
      },
    },
  };

  // Function to download department-wise data
  const downloadDepartmentData = () => {
    const data = Object.entries(departmentCounts).map(([dept, counts]) => ({
      Department: dept,
      "Non-Conformity (NC)": counts.NC,
      "Observation Positive (O+)": counts.op,
      "Opportunity For Improvement (OFI)": counts.OFI,
      "Total Observations": counts.total,
      "NC %": counts.total > 0 ? ((counts.NC / counts.total) * 100).toFixed(2) + "%" : "0%"
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Department Summary");

    const fileName = `Audit_Department_Summary_${timePeriod}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Function to download consolidated audit data
  const downloadConsolidatedData = () => {
    const allObservations = JSON.parse(localStorage.getItem("auditObservations")) || {};
    const observationsArray = Object.values(allObservations).flat();

    const data = observationsArray.map(obs => ({
      "Audit Cycle": obs.auditCycleNo,
      "Department": obs.department,
      "Observation": obs.observation,
      "Result": Array.isArray(obs.result) ? obs.result.join(", ") : obs.result,
      "Audit Date": obs.auditDate ? new Date(obs.auditDate).toLocaleDateString() : "",
      "Auditor": obs.auditor,
      "Status": obs.status,
      "Root Cause": obs.rootCause,
      "Corrective Action": obs.correctiveAction,
      "Target Date": obs.targetDate,
      "Remarks": obs.remarks
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "All Audit Observations");

    const fileName = `Consolidated_Audit_Data_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Function to download data by financial year
  const downloadFinancialYearData = () => {
    const [startYear] = financialYear.split("-");
    const startDate = new Date(`${startYear}-04-01`);
    const endDate = new Date(`${parseInt(startYear) + 1}-03-31`);

    // Changed from fyData to filteredFYData for clarity
    const filteredFYData = auditData.filter(obs => {
      if (!obs.auditDate) return false;
      return obs.auditDate >= startDate && obs.auditDate <= endDate;
    });

    const counts = {};
    departments.filter(d => d !== "All").forEach(dept => {
      counts[dept] = {
        NC: 0,
        op: 0,
        OFI: 0,
        total: 0
      };

      const deptObservations = filteredFYData.filter(obs => obs.department === dept);

      deptObservations.forEach(obs => {
        const results = Array.isArray(obs.result) ? obs.result : [obs.result];
        results.forEach(result => {
          const normalizedResult = result === "0+" ? "op" : result;
          if (normalizedResult === "NC") counts[dept].NC++;
          if (normalizedResult === "op") counts[dept].op++;
          if (normalizedResult === "OFI") counts[dept].OFI++;
        });
        counts[dept].total += results.length;
      });
    });

    const data = Object.entries(counts).map(([dept, counts]) => ({
      Department: dept,
      "Non-Conformity (NC)": counts.NC,
      "Observation Positive (O+)": counts.op,
      "Opportunity For Improvement (OFI)": counts.OFI,
      "Total Observations": counts.total,
      "NC %": counts.total > 0 ? ((counts.NC / counts.total) * 100).toFixed(2) + "%" : "0%"
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `FY ${financialYear} Summary`);

    const fileName = `Audit_FY_${financialYear}_Summary.xlsx`;
    XLSX.writeFile(wb, fileName);
  };
  return (
    <div className="audit-summary-container" style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Audit Summary Report</h2>

      {/* Filters */}
      <div style={{
        display: "flex",
        gap: "20px",
        marginBottom: "20px",
        flexWrap: "wrap"
      }}>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Department:</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1, minWidth: "200px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Audit Cycle:</label>
          <select
            value={selectedCycle}
            onChange={(e) => setSelectedCycle(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            {auditCycles.map(cycle => (
              <option key={cycle} value={cycle}>{cycle}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1, minWidth: "200px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Time Period:</label>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="12months">Rolling 12 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="financialYear">Financial Year ({financialYear})</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid #ddd",
        marginBottom: "20px"
      }}>
        <button
          style={{
            padding: "10px 20px",
            background: activeTab === "department" ? "#007bff" : "#f8f9fa",
            color: activeTab === "department" ? "white" : "black",
            border: "1px solid #ddd",
            cursor: "pointer",
            flex: 1
          }}
          onClick={() => setActiveTab("department")}
        >
          By Department
        </button>

        <button
          style={{
            padding: "10px 20px",
            background: activeTab === "cycle" ? "#007bff" : "#f8f9fa",
            color: activeTab === "cycle" ? "white" : "black",
            border: "1px solid #ddd",
            cursor: "pointer",
            flex: 1
          }}
          onClick={() => setActiveTab("cycle")}
        >
          By Audit Cycle
        </button>
      </div>

      {/* Download buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <button
          onClick={downloadDepartmentData}
          style={{
            padding: "10px 15px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Download Department Data
        </button>

        <button
          onClick={downloadConsolidatedData}
          style={{
            padding: "10px 15px",
            background: "#17a2b8",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Download Consolidated Data
        </button>

        {timePeriod === "financialYear" && (
          <button
            onClick={downloadFinancialYearData}
            style={{
              padding: "10px 15px",
              background: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Download FY {financialYear} Data
          </button>
        )}
      </div>

      {/* Charts */}
      <div style={{ marginBottom: "30px" }}>
        {activeTab === "department" ? (
          <div style={{ width: "80%", maxWidth: "800px", margin: "0 auto" }}>
            <Bar data={departmentChartData} options={chartOptions} />
          </div>
        ) : (
          <div style={{ width: "80%", maxWidth: "800px", margin: "0 auto" }}>
            <Bar data={cycleChartData} options={chartOptions} />
          </div>
        )}
      </div>

      {/* Pie chart for result distribution */}
      <div style={{ marginBottom: "30px" }}>
        <div style={{ width: "80%", maxWidth: "500px", margin: "0 auto" }}>
          <Pie data={resultDistributionData} options={pieOptions} />
        </div>
      </div>

      {/* Table */}
      {filteredData.length > 0 ? (
        <>
          <h3>Results Summary</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f2f2f2" }}>
                  <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                    {activeTab === "department" ? "Department" : "Audit Cycle"}
                  </th>
                  <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>NC</th>
                  <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>O+</th>
                  <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>OFI</th>
                  <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>Total</th>
                  <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>NC %</th>
                </tr>
              </thead>
              <tbody>
                {activeTab === "department" ? (
                  Object.entries(departmentCounts).map(([dept, counts]) => (
                    <tr key={dept} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={{ padding: "12px", border: "1px solid #ddd" }}>{dept}</td>
                      <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>{counts.NC}</td>
                      <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>{counts.op}</td>
                      <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>{counts.OFI}</td>
                      <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>{counts.total}</td>
                      <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>
                        {(counts.total > 0) ? ((counts.NC / counts.total) * 100).toFixed(2) : 0}%
                      </td>
                    </tr>
                  ))
                ) : (
                  Object.entries(cycleCounts).map(([cycle, counts]) => (
                    <tr key={cycle} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={{ padding: "12px", border: "1px solid #ddd" }}>{cycle}</td>
                      <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>{counts.NC}</td>
                      <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>{counts.op}</td>
                      <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>{counts.OFI}</td>
                      <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>{counts.total}</td>
                      <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>
                        {(counts.total > 0) ? ((counts.NC / counts.total) * 100).toFixed(2) : 0}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>No data available for the selected filters.</p>
      )}
    </div>
  );
};

export default AuditSummary;