import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/card";
import { Button } from "../components/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/table";
import emailjs from "@emailjs/browser";

const AuditIntimationMail = () => {
    const [auditPlans, setAuditPlans] = useState([]);
    const [sendingEmailId, setSendingEmailId] = useState(null); // Track which plan is being sent

    useEffect(() => {
        const storedPlans = JSON.parse(localStorage.getItem("auditPlans")) || [];
        setAuditPlans(storedPlans);
    }, []);

    const handleSendEmail = (plan, index) => {
        // Retrieve stored departments from localStorage first to get the email
        const storedDepartments = JSON.parse(localStorage.getItem("departments") || "[]");
        const selectedDepartment = storedDepartments.find(dept => dept.name === plan.department);
        const recipientEmail = selectedDepartment ? selectedDepartment.email : null;

        if (!recipientEmail) {
            alert(`❌ No valid email found for department: ${plan.department}`);
            return;
        }

        const confirmSend = window.confirm(
            `Send audit intimation email to:\n\n📧 ${recipientEmail}`
        );

        if (!confirmSend) return;

        setSendingEmailId(index); // Set the currently sending email index
    
        const templateParams = {
            to_email: recipientEmail,
            subject: "Audit Plan Intimation",
            department: plan.department || "N/A",
            date: plan.date || "N/A",
            timeDuration: plan.timeDuration || "N/A",
            auditor: plan.auditor || "N/A",
            auditees: Array.isArray(plan.auditees) ? plan.auditees.join(", ") : plan.auditees || "N/A",
        };
    
        emailjs.send(
            "service_4hmbfpu",
            "template_dnup0zw",
            templateParams,
            "oRFMu4l-r7E9Bde5_"   
        ).then(response => {
            alert(`✅ Email sent successfully to:\n📧 ${recipientEmail}`);
            console.log("✅ Email sent successfully:", response);
        }).catch(error => {
            alert(`❌ Failed to send email to:\n📧 ${recipientEmail}\n\nError: ${error.message}`);
            console.error("❌ Email sending failed:", error);
        }).finally(() => {
            setSendingEmailId(null); // Reset sending state
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
                                    <Button 
                                        className="print-btn" 
                                        onClick={() => handleSendEmail(plan, index)}
                                        disabled={sendingEmailId !== null} // Disable all buttons during any send operation
                                    >
                                        {sendingEmailId === index ? "Sending..." : "📧 Send Mail"}
                                    </Button>
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