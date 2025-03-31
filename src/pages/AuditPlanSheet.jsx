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
        const loadData = () => {
            const storedPlans = JSON.parse(localStorage.getItem("auditPlans")) || [];
            const storedDepartments = JSON.parse(localStorage.getItem("departments")) || [];
            
            const validDepartmentNames = storedDepartments.map(dept => dept.name);
            const filteredPlans = storedPlans.filter(plan => 
                validDepartmentNames.includes(plan.department)
            );
            
            if (filteredPlans.length !== storedPlans.length) {
                localStorage.setItem("auditPlans", JSON.stringify(filteredPlans));
            }
            
            setAuditPlans(filteredPlans);
            setDepartments(validDepartmentNames);
        };

        loadData();

        const handleStorageChange = (e) => {
            if (e.key === "departments" || e.key === "auditPlans") {
                loadData();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
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
                ul { margin: 0; padding-left: 20px; }
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
            
            {/* Filter and Search in same row - responsive layout */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                {/* Department Dropdown - Takes 1/3 width on desktop, full on mobile */}
                <div className="w-full md:w-1/3">
                    <label className="block mb-1 text-sm font-medium">Department</label>
                    <select 
                        value={selectedDepartment} 
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="w-full p-2 border rounded-md text-sm"
                    >
                        <option value="">All Departments</option>
                        {departments.map((dept, index) => (
                            <option key={index} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>
                
                {/* Search Input - Takes 2/3 width on desktop, full on mobile */}
                <div className="w-full md:w-2/3">
                    <label className="block mb-1 text-sm font-medium">Search</label>
                    <Input 
                        type="text" 
                        placeholder="Search by department or auditor..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full"
                    />
                </div>
            </div>
            
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
                        {filteredPlans.length > 0 ? (
                            filteredPlans.map((plan, index) => (
                                <TableRow key={index}>
                                    <TableCell>{plan.formattedCycle}</TableCell>
                                    <TableCell>{plan.department}</TableCell>
                                    <TableCell>{plan.date}</TableCell>
                                    <TableCell>{plan.timeDuration}</TableCell>
                                    <TableCell>
                                        <ul>
                                            {plan.processes?.map((process, i) => (
                                                <li key={i}>{process}</li>
                                            ))}
                                        </ul>
                                    </TableCell>
                                    <TableCell>{plan.auditor}</TableCell>
                                    <TableCell>
                                        {Array.isArray(plan.auditees) ? 
                                            plan.auditees.join(", ") : 
                                            plan.auditees || "N/A"}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-4">
                                    No audit plans found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-4 flex justify-end">
                <Button className="print-btn" onClick={handlePrint}>
                    🖨️ Print
                </Button>
            </div>
        </Card>
    );
};

export default AuditPlanSheet;