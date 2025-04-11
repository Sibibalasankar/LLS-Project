import { useState, useEffect } from "react";
import { Card } from "../components/card";
import { Button } from "../components/button";
import "../assets/styles/AuditIntimationMail.css";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/table";
import emailjs from "@emailjs/browser";

const AuditIntimationMail = () => {
  const [auditPlans, setAuditPlans] = useState([]);
  const [sendingEmailId, setSendingEmailId] = useState(null);
  const [isSendingAll, setIsSendingAll] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterCycle, setFilterCycle] = useState("All");

  useEffect(() => {
    const storedPlans = JSON.parse(localStorage.getItem("auditPlans")) || [];
    setAuditPlans(storedPlans);
  }, []);

  const sendEmailToPlan = async (plan, index, showAlerts = true) => {
    const storedDepartments =
      JSON.parse(localStorage.getItem("departments") || "[]");
    const selectedDepartment = storedDepartments.find(
      (dept) => dept.name === plan.department
    );
    const recipientEmail = selectedDepartment ? selectedDepartment.email : null;

    if (!recipientEmail) {
      if (showAlerts) {
        alert(`❌ No valid email found for department: ${plan.department}`);
      }
      return;
    }

    const templateParams = {
      to_email: recipientEmail,
      subject: "Audit Plan Intimation",
      department: plan.department || "N/A",
      date: plan.date || "N/A",
      timeDuration: plan.timeDuration || "N/A",
      auditor: plan.auditor || "N/A",
      auditees: Array.isArray(plan.auditees)
        ? plan.auditees.join(", ")
        : plan.auditees || "N/A",
    };

    try {
      await emailjs.send(
        "service_4hmbfpu",
        "template_dnup0zw",
        templateParams,
        "oRFMu4l-r7E9Bde5_"
      );
      if (showAlerts) {
        alert(`✅ Email sent to:\n📧 ${recipientEmail}`);
      }
      console.log(`✅ Email sent successfully to ${recipientEmail}`);
    } catch (error) {
      if (showAlerts) {
        alert(
          `❌ Failed to send email to:\n📧 ${recipientEmail}\n\nError: ${error.message}`
        );
      }
      console.error(`❌ Failed to send email to ${recipientEmail}:`, error);
    }
  };

  const handleSendEmail = async (plan, index) => {
    const confirmSend = window.confirm(
      `Send audit intimation email to:\n\n📧 ${plan.department}`
    );
    if (!confirmSend) return;

    setSendingEmailId(index);
    await sendEmailToPlan(plan, index);
    setSendingEmailId(null);
  };

  const handleSendAllEmails = async () => {
    const confirmSendAll = window.confirm(
      `Are you sure you want to send audit intimation emails to ALL departments listed?`
    );
    if (!confirmSendAll) return;

    setIsSendingAll(true);
    for (let i = 0; i < filteredPlans.length; i++) {
      await sendEmailToPlan(filteredPlans[i], i, false);
    }
    alert("✅ All emails have been sent (check console for any failures).");
    setIsSendingAll(false);
  };

  // Unique values for dropdowns
  const uniqueDepartments = ["All", ...new Set(auditPlans.map(p => p.department))];
  const uniqueCycles = ["All", ...new Set(auditPlans.map(p => p.auditCycleNo || "N/A"))];

  // Filter logic
  const filteredPlans = auditPlans.filter(plan => {
    const departmentMatch = filterDepartment === "All" || plan.department === filterDepartment;
    const cycleMatch = filterCycle === "All" || (plan.auditCycleNo || "N/A") === filterCycle;
    return departmentMatch && cycleMatch;
  });

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Audit Plan Intimation Mail</h2>
      </div>

      <div className="flex gap-4 mb-4">
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="border p-2 rounded "
        >
          {uniqueDepartments.map((dept, i) => (
            <option key={i} value={dept}>
              {dept}
            </option>
          ))}
        </select>

       
      </div>

      {filteredPlans.length === 0 ? (
        <p>No audit plans match the selected filters.</p>
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
            {filteredPlans.map((plan, index) => (
              <TableRow key={index}>
                <TableCell>{plan.department}</TableCell>
                <TableCell>{plan.date}</TableCell>
                <TableCell>{plan.timeDuration}</TableCell>
                <TableCell>{plan.auditor}</TableCell>
                <TableCell>
                  {Array.isArray(plan.auditees)
                    ? plan.auditees.join(", ")
                    : plan.auditees || "N/A"}
                </TableCell>
                <TableCell>
                  <Button
                    className="print-btn"
                    onClick={() => handleSendEmail(plan, index)}
                    disabled={sendingEmailId !== null || isSendingAll}
                  >
                    {sendingEmailId === index ? "Sending..." : "📧 Send Mail"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div>
        {filteredPlans.length > 0 && (
          <Button
            className="print-btn mt-3"
            onClick={handleSendAllEmails}
            disabled={isSendingAll || sendingEmailId !== null}
          >
            {isSendingAll ? "Sending All..." : "📨 Send All"}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default AuditIntimationMail;
