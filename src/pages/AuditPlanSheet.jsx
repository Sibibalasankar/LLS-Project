import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/card";
import { Button } from "../components/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/table";
import { Input } from "../components/input";

const AuditPlanSheet = () => {
    const [auditPlans, setAuditPlans] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const storedPlans = JSON.parse(localStorage.getItem("auditPlans")) || [];
        setAuditPlans(storedPlans);
        
        const storedDepartments = JSON.parse(localStorage.getItem("departments")) || [];
        setDepartments(storedDepartments.map(dept => dept.name));
    }, []);

    const handlePrint = () => {
      const printContent = document.getElementById("audit-plan-table");
      if (!printContent) {
          alert("Audit Plan Table not found!");
          return;
      }
  
      const clonedTable = printContent.cloneNode(true);
  
      const printWindow = window.open("", "", "width=800,height=600");
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Audit Plan</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid black; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h2>Audit Plan Details</h2>
            ${clonedTable.outerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
  };
  

    const filteredPlans = auditPlans.filter(plan => 
        (selectedDepartment === "" || plan.department === selectedDepartment) &&
        (plan.department.toLowerCase().includes(filter.toLowerCase()) ||
        plan.auditor.toLowerCase().includes(filter.toLowerCase()))
    );

    return (
        <Card className="p-4">
            <h2 className="text-xl font-bold mb-4">Audit Plan Sheet</h2>
            
            {/* Department Dropdown Filter */}
            <label>Select Department:</label>
            <select 
                value={selectedDepartment} 
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="mb-4"
            >
                <option value="">All Departments</option>
                {departments.map((dept, index) => (
                    <option key={index} value={dept}>{dept}</option>
                ))}
            </select>
            
            {/* Search Input */}
           
            
            {/* Wrap the table inside a div with the ID */}
<div id="audit-plan-table">
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Audit Cycle No</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time Duration</TableHead>
                <TableHead>Processes</TableHead>
                <TableHead>Auditor (Lead)</TableHead>
                <TableHead>Auditee(s)</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {filteredPlans.map((plan, index) => (
                <TableRow key={index}>
                    <TableCell>{plan.formattedCycle}</TableCell>
                    <TableCell>{plan.department}</TableCell>
                    <TableCell>{plan.date}</TableCell>
                    <TableCell>{plan.timeDuration}</TableCell>
                    <TableCell>
                        <ul>
                            {plan.processes.map((process, i) => (
                                <li key={i}>{process}</li>
                            ))}
                        </ul>
                    </TableCell>
                    <TableCell>{plan.auditor}</TableCell>
                    <TableCell>{plan.auditees}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
</div>

            <Button className="mt-4 print-btn" onClick={handlePrint}>🖨️ Print</Button>
        </Card>
    );
};

export default AuditPlanSheet;