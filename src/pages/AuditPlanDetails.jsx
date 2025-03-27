import React from "react";
import { useNavigate } from "react-router-dom";

const AuditPlanDetails = () => {
  const navigate = useNavigate(); // React Router navigation

  const auditPlans = [
    { id: 1, department: "", date: "", duration: "", criteria: "", auditor: "", auditee: "" },
    { id: 2, department: "", date: "", duration: "", criteria: "", auditor: "", auditee: "" },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Back Button to AuditPlanCreation */}
      <button
        onClick={() => navigate("/audit-plan-creation")} // Redirect to AuditPlanCreation
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
      >
        ← Back to Audit Plan Creation
      </button>

      <h2 className="text-2xl font-bold text-blue-900 mb-4">Audit Schedule</h2>

      <div className="bg-yellow-500 text-black text-center p-2 font-bold">
        INTERNAL AUDIT SCHEDULE - ISO 9001:2015
      </div>

      <div className="border p-4 bg-white shadow-md">
        <div className="flex justify-between text-sm mb-2">
          <span>
            <strong>Audit Cycle No.:</strong> <span className="text-green-600">I / 2024-25</span>
          </span>
          <span>Page no.: 1 of 1</span>
        </div>

        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Sl. No.</th>
              <th className="border p-2">Department</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Time Duration</th>
              <th className="border p-2">Audit Criteria - Process</th>
              <th className="border p-2">Auditor (Lead)</th>
              <th className="border p-2">Auditee(s)</th>
            </tr>
          </thead>
          <tbody>
            {auditPlans.map((plan) => (
              <tr key={plan.id} className="text-center">
                <td className="border p-2">{plan.id}</td>
                <td className="border p-2">{plan.department}</td>
                <td className="border p-2">{plan.date}</td>
                <td className="border p-2">{plan.duration}</td>
                <td className="border p-2">{plan.criteria}</td>
                <td className="border p-2">{plan.auditor}</td>
                <td className="border p-2">{plan.auditee}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 text-sm text-gray-700">
          <p>
            <strong>Note:</strong> Auto-generated mail with audit details to auditor, auditee, and HODs.
          </p>
          <p>Min 2 Audit Plans, Max 4 Audit Plans for the Year (Apr 2025 - Mar 2026)</p>
        </div>
      </div>
    </div>
  );
};

export default AuditPlanDetails;
