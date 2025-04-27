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

  useEffect(() => {
    // Load data from localStorage
    const allObservations = JSON.parse(localStorage.getItem("auditObservations")) || {};
    
    // Convert the object of observations into a flat array
    const observationsArray = Object.values(allObservations).flatMap(obsArray => obsArray);
    
    setAuditData(observationsArray);
    
    // Get unique departments from all observations
    const uniqueDepartments = [...new Set(observationsArray.map(obs => obs.department))].filter(Boolean);
    setDepartments(["All", ...uniqueDepartments]);
    
    // Get unique audit cycles
    const uniqueCycles = [...new Set(observationsArray.map(obs => obs.auditCycleNo))].filter(Boolean);
    setAuditCycles(["All", ...uniqueCycles]);
  }, []);

  // Filter data based on selections
  const filteredData = auditData.filter(obs => {
    const departmentMatch = selectedDepartment === "All" || obs.department === selectedDepartment;
    const cycleMatch = selectedCycle === "All" || obs.auditCycleNo === selectedCycle;
    return departmentMatch && cycleMatch;
  });

  // Count results by department
  const getResultCountsByDepartment = () => {
    const counts = {};
    
    const deptsToShow = selectedDepartment === "All" 
      ? departments.filter(d => d !== "All") 
      : [selectedDepartment];
    
    deptsToShow.forEach(dept => {
      counts[dept] = {
        NC: 0,
        "0+": 0,
        OFI: 0,
        total: 0
      };
      
      // Filter observations for this department
      const deptObservations = filteredData.filter(obs => obs.department === dept);
      
      deptObservations.forEach(obs => {
        const results = Array.isArray(obs.result) ? obs.result : [obs.result];
        
        results.forEach(result => {
          if (result === "NC") counts[dept].NC++;
          if (result === "0+") counts[dept]["0+"]++;
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
        "0+": 0,
        OFI: 0,
        total: 0
      };
      
      // Filter observations for this cycle
      const cycleObservations = filteredData.filter(obs => obs.auditCycleNo === cycle);
      
      cycleObservations.forEach(obs => {
        const results = Array.isArray(obs.result) ? obs.result : [obs.result];
        
        results.forEach(result => {
          if (result === "NC") counts[cycle].NC++;
          if (result === "0+") counts[cycle]["0+"]++;
          if (result === "OFI") counts[cycle].OFI++;
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
        label: "Observation Positive (0+)",
        data: Object.values(departmentCounts).map(dept => dept["0+"]),
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
        label: "Observation Positive (0+)",
        data: Object.values(cycleCounts).map(cycle => cycle["0+"]),
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
    labels: ["NC", "0+", "OFI"],
    datasets: [{
      data: [
        filteredData.reduce((sum, obs) => sum + ((Array.isArray(obs.result) ? obs.result : [obs.result]).filter(r => r === "NC").length), 0),
        filteredData.reduce((sum, obs) => sum + ((Array.isArray(obs.result) ? obs.result : [obs.result]).filter(r => r === "0+").length), 0),
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
                  <th style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>0+</th>
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
                      <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>{counts["0+"]}</td>
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
                      <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>{counts["0+"]}</td>
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
