import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/card";
import { Button } from "../components/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/table";
import emailjs from "@emailjs/browser";  // ✅ Corrected EmailJS import

const AuditIntimationMail = () => {
    const [auditPlans, setAuditPlans] = useState([]);

    useEffect(() => {
        const storedPlans = JSON.parse(localStorage.getItem("auditPlans")) || [];
        setAuditPlans(storedPlans);
    }, []);

    const handleSendEmail = (plan) => {
      // Retrieve stored departments from localStorage
      const storedDepartments = JSON.parse(localStorage.getItem("departments") || "[]");
  
      // Find the department matching the plan's department
      const selectedDepartment = storedDepartments.find(dept => dept.name === plan.department);
  
      // Ensure email exists
      const recipientEmail = selectedDepartment ? selectedDepartment.email : null;
  
      if (!recipientEmail) {
          console.error("❌ No valid email found for department:", plan.department);
          return;
      }
  
      const templateParams = {
          to_email: recipientEmail,  // ✅ Now dynamically set
          subject: "Audit Plan Intimation",
          department: plan.department || "N/A",
          date: plan.date || "N/A",
          timeDuration: plan.timeDuration || "N/A",
          auditor: plan.auditor || "N/A",
          auditees: Array.isArray(plan.auditees) ? plan.auditees.join(", ") : plan.auditees || "N/A",
      };
  
      console.log("📧 Sending email to:", templateParams.to_email);
  
      emailjs.send(
          "service_4hmbfpu",   // ✅ Replace with your actual Service ID
          "template_dnup0zw",  // ✅ Replace with your actual Template ID
          templateParams,
          "oRFMu4l-r7E9Bde5_"   
      ).then(response => {
          console.log("✅ Email sent successfully:", response);
      }).catch(error => {
          console.error("❌ FAILED...", error);
      });
  };
  
  

    return (
        <Card className="p-4">
            <h2 className="text-xl font-bold mb-4">Audit Plan Intimation Mail</h2>

            {auditPlans.length === 0 ? (
                <p>No audit plans available.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Department</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time Duration</TableHead>
                            <TableHead>Auditor</TableHead>
                            <TableHead>Auditees</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {auditPlans.map((plan, index) => (
                            <TableRow key={index}>
                                <TableCell>{plan.department}</TableCell>
                                <TableCell>{plan.date}</TableCell>
                                <TableCell>{plan.timeDuration}</TableCell>
                                <TableCell>{plan.auditor}</TableCell>
                                <TableCell>{Array.isArray(plan.auditees) ? plan.auditees.join(", ") : plan.auditees || "N/A"}</TableCell>
                                <TableCell>
                                    <Button className="print-btn" onClick={() => handleSendEmail(plan)}>📧 Send Mail</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Card>
    );
};

export default AuditIntimationMail;
