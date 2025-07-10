import React, { useEffect, useState } from "react";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale
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
  ArcElement,
  PointElement,
  LineElement,
  TimeScale
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
  const [selectedIsoClause, setSelectedIsoClause] = useState("");

  const isoClauseOptions = [
    { value: "1", label: "1 – Scope" },
    { value: "2", label: "2 – Normative references" },
    { value: "3", label: "3 – Terms and definitions" },
    { value: "4", label: "4 – Context of the organization" },
    { value: "4.1", label: "4.1 – Understanding the organization and its context" },
    { value: "4.2", label: "4.2 – Understanding the needs and expectations of interested parties" },
    { value: "4.3", label: "4.3 – Determining the scope of the quality management system" },
    { value: "4.4", label: "4.4 – Quality management system and its processes" },
    { value: "5", label: "5 – Leadership" },
    { value: "5.1", label: "5.1 – Leadership and commitment" },
    { value: "5.2", label: "5.2 – Policy" },
    { value: "5.3", label: "5.3 – Organizational roles, responsibilities and authorities" },
    { value: "6", label: "6 – Planning" },
    { value: "6.1", label: "6.1 – Actions to address risks and opportunities" },
    { value: "6.2", label: "6.2 – Quality objectives and planning to achieve them" },
    { value: "6.3", label: "6.3 – Planning of changes" },
    { value: "7", label: "7 – Support" },
    { value: "7.1", label: "7.1 – Resources" },
    { value: "7.2", label: "7.2 – Competence" },
    { value: "7.3", label: "7.3 – Awareness" },
    { value: "7.4", label: "7.4 – Communication" },
    { value: "7.5", label: "7.5 – Documented information" },
    { value: "8", label: "8 – Operation" },
    { value: "8.1", label: "8.1 – Operational planning and control" },
    { value: "8.2", label: "8.2 – Requirements for products and services" },
    { value: "8.3", label: "8.3 – Design and development" },
    { value: "8.4", label: "8.4 – Control of externally provided processes, products and services" },
    { value: "8.5", label: "8.5 – Production and service provision" },
    { value: "8.6", label: "8.6 – Release of products and services" },
    { value: "8.7", label: "8.7 – Control of nonconforming outputs" },
    { value: "9", label: "9 – Performance evaluation" },
    { value: "9.1", label: "9.1 – Monitoring, measurement, analysis and evaluation" },
    { value: "9.2", label: "9.2 – Internal audit" },
    { value: "9.3", label: "9.3 – Management review" },
    { value: "10", label: "10 – Improvement" },
    { value: "10.1", label: "10.1 – General" },
    { value: "10.2", label: "10.2 – Nonconformity and corrective action" },
    { value: "10.3", label: "10.3 – Continual improvement" },
  ];

  const styles = {
    container: {
      padding: "24px",
      backgroundColor: "#f8f9fa",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    header: {
      fontSize: "28px",
      fontWeight: "700",
      color: "#2c3e50",
      marginBottom: "30px",
      textAlign: "center"
    },
    filterContainer: {
      display: "flex",
      gap: "20px",
      marginBottom: "30px",
      flexWrap: "wrap",
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    },
    filterGroup: {
      flex: 1,
      minWidth: "200px"
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontSize: "14px",
      fontWeight: "600",
      color: "#34495e"
    },
    select: {
      width: "100%",
      padding: "10px",
      border: "2px solid #e9ecef",
      borderRadius: "8px",
      fontSize: "14px",
      backgroundColor: "#ffffff",
      color: "#495057",
      outline: "none",
      transition: "border-color 0.3s ease"
    },
    tabContainer: {
      display: "flex",
      borderBottom: "2px solid #e9ecef",
      marginBottom: "30px",
      backgroundColor: "#ffffff",
      borderRadius: "12px 12px 0 0",
      overflow: "hidden",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    },
    tab: {
      padding: "15px 25px",
      border: "none",
      cursor: "pointer",
      flex: 1,
      fontSize: "16px",
      fontWeight: "600",
      transition: "all 0.3s ease"
    },
    activeTab: {
      backgroundColor: "#3498db",
      color: "#ffffff"
    },
    inactiveTab: {
      backgroundColor: "#ffffff",
      color: "#34495e"
    },
    downloadContainer: {
      display: "flex",
      gap: "12px",
      marginBottom: "30px",
      flexWrap: "wrap"
    },
    downloadButton: {
      padding: "12px 20px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      color: "#ffffff",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    },
    chartContainer: {
      backgroundColor: "#ffffff",
      padding: "25px",
      borderRadius: "12px",
      marginBottom: "30px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    },
    chartTitle: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#2c3e50",
      marginBottom: "20px",
      textAlign: "center"
    },
    metricsContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
      marginBottom: "30px"
    },
    metricCard: {
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      textAlign: "center"
    },
    metricValue: {
      fontSize: "36px",
      fontWeight: "700",
      marginBottom: "8px"
    },
    metricLabel: {
      fontSize: "14px",
      color: "#7f8c8d",
      fontWeight: "600"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    },
    tableHeader: {
      backgroundColor: "#34495e",
      color: "#ffffff",
      padding: "15px 12px",
      border: "none",
      fontSize: "14px",
      fontWeight: "600"
    },
    tableCell: {
      padding: "12px",
      border: "1px solid #e9ecef",
      fontSize: "14px",
      color: "#495057"
    },
    noData: {
      textAlign: "center",
      fontSize: "18px",
      color: "#7f8c8d",
      padding: "40px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }
  };

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

  // Count results by department
  const getResultCountsByDepartment = () => {
    const counts = {};
    const deptsToShow = selectedDepartment === "All"
      ? departments.filter(d => d !== "All")
      : [selectedDepartment];

    deptsToShow.forEach(dept => {
      counts[dept] = { NC: 0, op: 0, OFI: 0, total: 0 };
      const deptObservations = filteredData.filter(obs => obs.department === dept);

      deptObservations.forEach(obs => {
        const results = Array.isArray(obs.result) ? obs.result : [obs.result];
        results.forEach(result => {
          if (result === "NC") counts[dept].NC++;
          if (result === "O+" || result === "op") counts[dept].op++;
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
      counts[cycle] = { NC: 0, op: 0, OFI: 0, total: 0 };
      const cycleObservations = filteredData.filter(obs => obs.auditCycleNo === cycle);

      cycleObservations.forEach(obs => {
        const results = Array.isArray(obs.result) ? obs.result : [obs.result];
        results.forEach(result => {
          const normalizedResult = result === "0+" ? "op" : result;
          if (normalizedResult === "NC") counts[cycle].NC++;
          if (normalizedResult === "op") counts[cycle].op++;
          if (normalizedResult === "OFI") counts[cycle].OFI++;
        });
        counts[cycle].total += results.length;
      });
    });

    return counts;
  };

  // Get trend data for line chart
  const getTrendData = () => {
    const monthlyData = {};
    const months = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7);
      months.push(monthKey);
      monthlyData[monthKey] = { NC: 0, op: 0, OFI: 0 };
    }

    filteredData.forEach(obs => {
      if (obs.auditDate) {
        const monthKey = obs.auditDate.toISOString().slice(0, 7);
        if (monthlyData[monthKey]) {
          const results = Array.isArray(obs.result) ? obs.result : [obs.result];
          results.forEach(result => {
            const normalizedResult = result === "0+" ? "op" : result;
            if (normalizedResult === "NC") monthlyData[monthKey].NC++;
            if (normalizedResult === "op") monthlyData[monthKey].op++;
            if (normalizedResult === "OFI") monthlyData[monthKey].OFI++;
          });
        }
      }
    });

    return { months, monthlyData };
  };

  // Get audit frequency data
  const getAuditFrequencyData = () => {
    const auditsByMonth = {};
    filteredData.forEach(obs => {
      if (obs.auditDate) {
        const monthKey = obs.auditDate.toISOString().slice(0, 7);
        auditsByMonth[monthKey] = (auditsByMonth[monthKey] || 0) + 1;
      }
    });
    return auditsByMonth;
  };

  // Get top departments with highest NC rates
  const getTopDepartmentsByNC = () => {
    const departmentCounts = getResultCountsByDepartment();
    return Object.entries(departmentCounts)
      .map(([dept, counts]) => ({
        department: dept,
        ncRate: counts.total > 0 ? (counts.NC / counts.total) * 100 : 0,
        totalObservations: counts.total
      }))
      .sort((a, b) => b.ncRate - a.ncRate)
      .slice(0, 5);
  };

  const departmentCounts = getResultCountsByDepartment();
  const cycleCounts = getResultCountsByCycle();
  const { months, monthlyData } = getTrendData();
  const auditFrequency = getAuditFrequencyData();
  const topDepartments = getTopDepartmentsByNC();

  // Calculate key metrics
  const totalObservations = filteredData.length;
  const totalNC = filteredData.reduce((sum, obs) => {
    const results = Array.isArray(obs.result) ? obs.result : [obs.result];
    return sum + results.filter(r => r === "NC").length;
  }, 0);
  const totalOP = filteredData.reduce((sum, obs) => {
    const results = Array.isArray(obs.result) ? obs.result : [obs.result];
    return sum + results.filter(r => r === "O+" || r === "op").length;
  }, 0);
  const totalOFI = filteredData.reduce((sum, obs) => {
    const results = Array.isArray(obs.result) ? obs.result : [obs.result];
    return sum + results.filter(r => r === "OFI").length;
  }, 0);

  const ncRate = totalObservations > 0 ? ((totalNC / totalObservations) * 100).toFixed(1) : 0;
  const complianceRate = totalObservations > 0 ? (((totalOP + totalOFI) / totalObservations) * 100).toFixed(1) : 0;
  
  const getNcObservations = () => {
    return filteredData.filter(obs => obs.result === "NC");
  };

  const getNcByIsoClause = () => {
    const clauseCounts = {};

    const filteredObs = getNcObservations().filter((obs) => {
      const clause = obs.isoClause?.trim();
      return clause && (selectedIsoClause === "" || clause === selectedIsoClause);
    });

    filteredObs.forEach((obs) => {
      const clause = obs.isoClause.trim();
      clauseCounts[clause] = (clauseCounts[clause] || 0) + 1;
    });

    return Object.entries(clauseCounts)
      .sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }))
      .reduce(
        (acc, [key, val]) => {
          acc.labels.push(key);
          acc.data.push(val);
          return acc;
        },
        { labels: [], data: [] }
      );
  };

  // Chart configurations
  const chartColors = {
    NC: "#e74c3c",
    OP: "#3498db",
    OFI: "#f39c12",
    primary: "#2c3e50",
    secondary: "#7f8c8d"
  };

  const departmentChartData = {
    labels: Object.keys(departmentCounts),
    datasets: [
      {
        label: "Non-Conformity (NC)",
        data: Object.values(departmentCounts).map(dept => dept.NC),
        backgroundColor: chartColors.NC,
        borderColor: chartColors.NC,
        borderWidth: 1
      },
      {
        label: "Observation Positive (O+)",
        data: Object.values(departmentCounts).map(dept => dept.op),
        backgroundColor: chartColors.OP,
        borderColor: chartColors.OP,
        borderWidth: 1
      },
      {
        label: "Opportunity For Improvement (OFI)",
        data: Object.values(departmentCounts).map(dept => dept.OFI),
        backgroundColor: chartColors.OFI,
        borderColor: chartColors.OFI,
        borderWidth: 1
      }
    ]
  };

  const cycleChartData = {
    labels: Object.keys(cycleCounts),
    datasets: [
      {
        label: "Non-Conformity (NC)",
        data: Object.values(cycleCounts).map(cycle => cycle.NC),
        backgroundColor: chartColors.NC,
        borderColor: chartColors.NC,
        borderWidth: 1
      },
      {
        label: "Observation Positive (O+)",
        data: Object.values(cycleCounts).map(cycle => cycle.op),
        backgroundColor: chartColors.OP,
        borderColor: chartColors.OP,
        borderWidth: 1
      },
      {
        label: "Opportunity For Improvement (OFI)",
        data: Object.values(cycleCounts).map(cycle => cycle.OFI),
        backgroundColor: chartColors.OFI,
        borderColor: chartColors.OFI,
        borderWidth: 1
      }
    ]
  };

  const trendChartData = {
    labels: months.map(month => {
      const date = new Date(month + "-01");
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }),
    datasets: [
      {
        label: "Non-Conformity (NC)",
        data: months.map(month => monthlyData[month].NC),
        borderColor: chartColors.NC,
        backgroundColor: chartColors.NC + '20',
        tension: 0.4,
        fill: true
      },
      {
        label: "Observation Positive (O+)",
        data: months.map(month => monthlyData[month].op),
        borderColor: chartColors.OP,
        backgroundColor: chartColors.OP + '20',
        tension: 0.4,
        fill: true
      },
      {
        label: "Opportunity For Improvement (OFI)",
        data: months.map(month => monthlyData[month].OFI),
        borderColor: chartColors.OFI,
        backgroundColor: chartColors.OFI + '20',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const auditFrequencyChartData = {
    labels: Object.keys(auditFrequency).map(month => {
      const date = new Date(month + "-01");
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }),
    datasets: [{
      label: "Audit Frequency",
      data: Object.values(auditFrequency),
      backgroundColor: chartColors.primary,
      borderColor: chartColors.primary,
      borderWidth: 1
    }]
  };

  const resultDistributionData = {
    labels: ["NC", "O+", "OFI"],
    datasets: [{
      data: [totalNC, totalOP, totalOFI],
      backgroundColor: [chartColors.NC, chartColors.OP, chartColors.OFI],
      borderColor: [chartColors.NC, chartColors.OP, chartColors.OFI],
      borderWidth: 2
    }]
  };

  const topDepartmentsChartData = {
    labels: topDepartments.map(dept => dept.department),
    datasets: [{
      label: "NC Rate (%)",
      data: topDepartments.map(dept => dept.ncRate),
      backgroundColor: chartColors.NC,
      borderColor: chartColors.NC,
      borderWidth: 1
    }]
  };

  const ncByIsoClauseData = {
    labels: getNcByIsoClause().labels,
    datasets: [{
      label: "Non-Conformities by ISO Clause",
      data: getNcByIsoClause().data,
      backgroundColor: chartColors.NC,
      borderColor: chartColors.NC,
      borderWidth: 1
    }]
  };

  const chartOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: chartColors.primary,
          font: { size: 12, weight: "600" }
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: { color: chartColors.secondary },
        grid: { color: "#e9ecef" }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          color: chartColors.secondary,
          stepSize: 1,
          precision: 0
        },
        grid: { color: "#e9ecef" }
      }
    }
  };

  const horizontalStackedOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: chartColors.primary,
          font: { size: 12, weight: "600" }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: { color: chartColors.secondary },
        grid: { color: "#e9ecef" }
      },
      y: {
        stacked: true,
        ticks: { color: chartColors.secondary },
        grid: { color: "#e9ecef" }
      }
    }
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: chartColors.primary,
          font: { size: 12, weight: "600" }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: chartColors.secondary },
        grid: { color: "#e9ecef" }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: chartColors.secondary,
          stepSize: 1,
          precision: 0
        },
        grid: { color: "#e9ecef" }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: chartColors.primary,
          font: { size: 12, weight: '600' }
        }
      }
    }
  };

  const ncByIsoClauseOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: { color: chartColors.secondary },
        grid: { color: "#e9ecef" }
      },
      y: {
        ticks: { color: chartColors.secondary },
        grid: { color: "#e9ecef" }
      }
    }
  };

  // Download functions
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

  const downloadFinancialYearData = () => {
    const [startYear] = financialYear.split("-");
    const startDate = new Date(`${startYear}-04-01`);
    const endDate = new Date(`${parseInt(startYear) + 1}-03-31`);

    const filteredFYData = auditData.filter(obs => {
      if (!obs.auditDate) return false;
      return obs.auditDate >= startDate && obs.auditDate <= endDate;
    });

    const counts = {};
    departments.filter(d => d !== "All").forEach(dept => {
      counts[dept] = { NC: 0, op: 0, OFI: 0, total: 0 };
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

  const downloadIsoClauseData = () => {
    const { labels, data } = getNcByIsoClause();
    const formattedData = labels.map((label, index) => ({
      "ISO Clause": label,
      "NC Count": data[index]
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "NCs by ISO Clause");
    
    const fileName = `NCs_by_ISO_Clause_${selectedIsoClause || "All"}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Audit Analytics Dashboard</h2>

      {/* Filters */}
      <div style={styles.filterContainer}>
        <div style={styles.filterGroup}>
          <label style={styles.label}>Department:</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            style={styles.select}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.label}>Audit Cycle:</label>
          <select
            value={selectedCycle}
            onChange={(e) => setSelectedCycle(e.target.value)}
            style={styles.select}
          >
            {auditCycles.map(cycle => (
              <option key={cycle} value={cycle}>{cycle}</option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.label}>Time Period:</label>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            style={styles.select}
          >
            <option value="12months">Rolling 12 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="financialYear">Financial Year ({financialYear})</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={styles.metricsContainer}>
        <div style={styles.metricCard}>
          <div style={{ ...styles.metricValue, color: chartColors.primary }}>{totalObservations}</div>
          <div style={styles.metricLabel}>Total Observations</div>
        </div>
        <div style={styles.metricCard}>
          <div style={{ ...styles.metricValue, color: chartColors.NC }}>{totalNC}</div>
          <div style={styles.metricLabel}>Non-Conformities</div>
        </div>
        <div style={styles.metricCard}>
          <div style={{ ...styles.metricValue, color: chartColors.NC }}>{ncRate}%</div>
          <div style={styles.metricLabel}>NC Rate</div>
        </div>
        <div style={styles.metricCard}>
          <div style={{ ...styles.metricValue, color: chartColors.OP }}>{complianceRate}%</div>
          <div style={styles.metricLabel}>Compliance Rate</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabContainer}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "department" ? styles.activeTab : styles.inactiveTab)
          }}
          onClick={() => setActiveTab("department")}
        >
          By Department
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "cycle" ? styles.activeTab : styles.inactiveTab)
          }}
          onClick={() => setActiveTab("cycle")}
        >
          By Audit Cycle
        </button>
      </div>

      {/* Download buttons */}
      <div style={styles.downloadContainer}>
        <button
          onClick={downloadDepartmentData}
          style={{ ...styles.downloadButton, backgroundColor: "#27ae60" }}
        >
          Download Department Data
        </button>
        <button
          onClick={downloadConsolidatedData}
          style={{ ...styles.downloadButton, backgroundColor: "#3498db" }}
        >
          Download Consolidated Data
        </button>
        {timePeriod === "financialYear" && (
          <button
            onClick={downloadFinancialYearData}
            style={{ ...styles.downloadButton, backgroundColor: "#8e44ad" }}
          >
            Download FY {financialYear} Data
          </button>
        )}
        <button
          onClick={downloadIsoClauseData}
          style={{ ...styles.downloadButton, backgroundColor: "#e74c3c" }}
          disabled={getNcObservations().length === 0}
        >
          Download NCs by ISO Clause
        </button>
      </div>

      {/* Charts */}
      {filteredData.length > 0 ? (
        <>
          {/* Main Bar Chart */}
          <div style={styles.chartContainer}>
            <h3 style={styles.chartTitle}>
              {activeTab === "department" ? "Department-wise Analysis" : "Audit Cycle Analysis"}
            </h3>
            <div style={{ height: "400px" }}>
              <Bar
                data={activeTab === "department" ? departmentChartData : cycleChartData}
                options={horizontalStackedOptions}
              />
            </div>
          </div>

          {/* Trend Analysis */}
          <div style={styles.chartContainer}>
            <h3 style={styles.chartTitle}>Monthly Trend Analysis</h3>
            <div style={{ height: "300px" }}>
              <Line
                data={trendChartData}
                options={lineChartOptions}
              />
            </div>
          </div>

          {/* Charts Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
            {/* Result Distribution */}
            <div style={styles.chartContainer}>
              <h3 style={styles.chartTitle}>Result Distribution</h3>
              <div style={{ height: "300px" }}>
                <Doughnut data={resultDistributionData} options={pieOptions} />
              </div>
            </div>

            {/* Audit Frequency */}
            <div style={styles.chartContainer}>
              <h3 style={styles.chartTitle}>Audit Frequency</h3>
              <div style={{ height: "300px" }}>
                <Bar data={auditFrequencyChartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Top Departments by NC Rate */}
          {topDepartments.length > 0 && (
            <div style={styles.chartContainer}>
              <h3 style={styles.chartTitle}>Top Departments by NC Rate</h3>
              <div style={{ height: "300px" }}>
                <Bar data={topDepartmentsChartData} options={chartOptions} />
              </div>
            </div>
          )}

          {/* NCs by ISO Clause */}
          <div style={styles.chartContainer}>
            {getNcObservations().length > 0 && (
              <>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ fontWeight: "bold", marginBottom: "8px", display: "block" }}>
                    Filter by ISO Clause:
                  </label>
                  <select
                    value={selectedIsoClause}
                    onChange={(e) => setSelectedIsoClause(e.target.value)}
                    style={{ padding: "8px", borderRadius: "6px", width: "100%", maxWidth: "400px" }}
                  >
                    <option value="">All Clauses</option>
                    {isoClauseOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <h3 style={styles.chartTitle}>
                  {selectedIsoClause ? `NCs for ISO Clause ${selectedIsoClause}` : "NCs by ISO Clause"}
                </h3>
                <div style={{ height: "400px" }}>
                  <Bar 
                    data={ncByIsoClauseData} 
                    options={ncByIsoClauseOptions} 
                  />
                </div>
              </>
            )}
          </div>

          {/* Detailed Summary Table */}
          <div style={styles.chartContainer}>
            <h3 style={styles.chartTitle}>Detailed Summary</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>
                      {activeTab === "department" ? "Department" : "Audit Cycle"}
                    </th>
                    <th style={styles.tableHeader}>NC</th>
                    <th style={styles.tableHeader}>O+</th>
                    <th style={styles.tableHeader}>OFI</th>
                    <th style={styles.tableHeader}>Total</th>
                    <th style={styles.tableHeader}>NC %</th>
                    <th style={styles.tableHeader}>Compliance %</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTab === "department" ? (
                    Object.entries(departmentCounts).map(([dept, counts]) => (
                      <tr key={dept}>
                        <td style={styles.tableCell}>{dept}</td>
                        <td style={{ ...styles.tableCell, textAlign: "center", color: chartColors.NC, fontWeight: "600" }}>{counts.NC}</td>
                        <td style={{ ...styles.tableCell, textAlign: "center", color: chartColors.OP, fontWeight: "600" }}>{counts.op}</td>
                        <td style={{ ...styles.tableCell, textAlign: "center", color: chartColors.OFI, fontWeight: "600" }}>{counts.OFI}</td>
                        <td style={{ ...styles.tableCell, textAlign: "center", fontWeight: "600" }}>{counts.total}</td>
                        <td style={{ ...styles.tableCell, textAlign: "center" }}>
                          {counts.total > 0 ? ((counts.NC / counts.total) * 100).toFixed(2) : 0}%
                        </td>
                        <td style={{ ...styles.tableCell, textAlign: "center" }}>
                          {counts.total > 0 ? (((counts.op + counts.OFI) / counts.total) * 100).toFixed(2) : 0}%
                        </td>
                      </tr>
                    ))
                  ) : (
                    Object.entries(cycleCounts).map(([cycle, counts]) => (
                      <tr key={cycle}>
                        <td style={styles.tableCell}>{cycle}</td>
                        <td style={{ ...styles.tableCell, textAlign: "center", color: chartColors.NC, fontWeight: "600" }}>{counts.NC}</td>
                        <td style={{ ...styles.tableCell, textAlign: "center", color: chartColors.OP, fontWeight: "600" }}>{counts.op}</td>
                        <td style={{ ...styles.tableCell, textAlign: "center", color: chartColors.OFI, fontWeight: "600" }}>{counts.OFI}</td>
                        <td style={{ ...styles.tableCell, textAlign: "center", fontWeight: "600" }}>{counts.total}</td>
                        <td style={{ ...styles.tableCell, textAlign: "center" }}>
                          {counts.total > 0 ? ((counts.NC / counts.total) * 100).toFixed(2) : 0}%
                        </td>
                        <td style={{ ...styles.tableCell, textAlign: "center" }}>
                          {counts.total > 0 ? (((counts.op + counts.OFI) / counts.total) * 100).toFixed(2) : 0}%
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Insights */}
          <div style={styles.chartContainer}>
            <h3 style={styles.chartTitle}>Performance Insights</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
              <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #e9ecef" }}>
                <h4 style={{ color: chartColors.primary, marginBottom: "10px" }}>Best Performing Department</h4>
                <p style={{ color: chartColors.secondary, fontSize: "14px", marginBottom: "5px" }}>
                  {topDepartments.length > 0
                    ? `${topDepartments[topDepartments.length - 1].department} (${topDepartments[topDepartments.length - 1].ncRate.toFixed(2)}% NC Rate)`
                    : "No data available"
                  }
                </p>
              </div>

              <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #e9ecef" }}>
                <h4 style={{ color: chartColors.primary, marginBottom: "10px" }}>Needs Attention</h4>
                <p style={{ color: chartColors.secondary, fontSize: "14px", marginBottom: "5px" }}>
                  {topDepartments.length > 0
                    ? `${topDepartments[0].department} (${topDepartments[0].ncRate.toFixed(2)}% NC Rate)`
                    : "No data available"
                  }
                </p>
              </div>

              <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #e9ecef" }}>
                <h4 style={{ color: chartColors.primary, marginBottom: "10px" }}>Average NC Rate</h4>
                <p style={{ color: chartColors.secondary, fontSize: "14px", marginBottom: "5px" }}>
                  {topDepartments.length > 0
                    ? `${(topDepartments.reduce((sum, dept) => sum + dept.ncRate, 0) / topDepartments.length).toFixed(2)}%`
                    : "No data available"
                  }
                </p>
              </div>

              <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #e9ecef" }}>
                <h4 style={{ color: chartColors.primary, marginBottom: "10px" }}>Most Active Month</h4>
                <p style={{ color: chartColors.secondary, fontSize: "14px", marginBottom: "5px" }}>
                  {Object.keys(auditFrequency).length > 0
                    ? Object.entries(auditFrequency).reduce((a, b) => auditFrequency[a[0]] > auditFrequency[b[0]] ? a : b)[0]
                    : "No data available"
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div style={styles.chartContainer}>
            <h3 style={styles.chartTitle}>Recommendations</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
              {ncRate > 20 && (
                <div style={{ padding: "15px", backgroundColor: "#fff3cd", borderRadius: "8px", border: "1px solid #ffeaa7" }}>
                  <h4 style={{ color: "#856404", marginBottom: "8px", fontSize: "16px" }}>⚠️ High NC Rate</h4>
                  <p style={{ color: "#856404", fontSize: "14px", margin: "0" }}>
                    NC rate is above 20%. Consider implementing additional quality measures.
                  </p>
                </div>
              )}

              {totalObservations > 0 && totalOP / totalObservations > 0.6 && (
                <div style={{ padding: "15px", backgroundColor: "#d4edda", borderRadius: "8px", border: "1px solid #c3e6cb" }}>
                  <h4 style={{ color: "#155724", marginBottom: "8px", fontSize: "16px" }}>✅ Good Performance</h4>
                  <p style={{ color: "#155724", fontSize: "14px", margin: "0" }}>
                    High number of positive observations. Keep up the good work!
                  </p>
                </div>
              )}

              {departments.length > 3 && (
                <div style={{ padding: "15px", backgroundColor: "#cce5ff", borderRadius: "8px", border: "1px solid #99d6ff" }}>
                  <h4 style={{ color: "#004085", marginBottom: "8px", fontSize: "16px" }}>📊 Data Insights</h4>
                  <p style={{ color: "#004085", fontSize: "14px", margin: "0" }}>
                    Consider cross-department knowledge sharing to improve overall performance.
                  </p>
                </div>
              )}

              {Object.keys(auditFrequency).length > 0 && Math.max(...Object.values(auditFrequency)) > 20 && (
                <div style={{ padding: "15px", backgroundColor: "#f8d7da", borderRadius: "8px", border: "1px solid #f5c6cb" }}>
                  <h4 style={{ color: "#721c24", marginBottom: "8px", fontSize: "16px" }}>📈 Peak Activity</h4>
                  <p style={{ color: "#721c24", fontSize: "14px", margin: "0" }}>
                    Some months show high audit activity. Consider workload distribution.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div style={styles.noData}>
          <p>No data available for the selected filters.</p>
          <p style={{ fontSize: "14px", color: chartColors.secondary, marginTop: "10px" }}>
            Try adjusting your filter criteria or check if audit data has been recorded.
          </p>
        </div>
      )}
    </div>
  );
};

export default AuditSummary;