import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuditPlanDetails = () => {
  const [auditPlans, setAuditPlans] = useState([
    {
      id: 1,
      department: "",
      date: "",
      duration: "",
      criteria: [],
      auditor: "",
      auditee: "",
    },
    {
      id: 2,
      department: "",
      date: "",
      duration: "",
      criteria: [],
      auditor: "",
      auditee: "",
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    department: "",
    date: "",
    duration: "",
    criteria: [""],
    auditor: "",
    auditee: "",
  });

  const openForm = (id) => {
    const selectedPlan = auditPlans.find((plan) => plan.id === id);
    setFormData({ ...selectedPlan });
    setShowForm(true);
  };

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name === "criteria") {
      const updatedCriteria = [...formData.criteria];
      updatedCriteria[index] = value;
      setFormData({ ...formData, criteria: updatedCriteria });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addProcess = () => {
    setFormData({ ...formData, criteria: [...formData.criteria, ""] });
  };

  const removeProcess = (index) => {
    const updatedCriteria = formData.criteria.filter((_, i) => i !== index);
    setFormData({ ...formData, criteria: updatedCriteria });
  };

  const saveForm = () => {
    setAuditPlans((prev) =>
      prev.map((plan) => (plan.id === formData.id ? formData : plan))
    );
    setShowForm(false);
  };
  
const navigate = useNavigate();

const handleBack = () => {
  navigate("/audit-plan-creation"); // Replace with your actual route
};


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button
  onClick={handleBack}
  className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
>
  ← Back
</button>

      <h2 className="text-2xl font-bold text-blue-900 mb-4">Audit Schedule</h2>

      <div className="bg-yellow-500 text-black text-center p-2 font-bold">
        INTERNAL AUDIT SCHEDULE - ISO 9001:2015
      </div>

      <div className="border p-4 bg-white shadow-md">
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
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {auditPlans.map((plan) => (
              <tr key={plan.id} className="text-center">
                <td className="border p-2">{plan.id}</td>
                <td className="border p-2">{plan.department}</td>
                <td className="border p-2">{plan.date}</td>
                <td className="border p-2">{plan.duration}</td>
                <td className="border p-2">{plan.criteria.join(", ")}</td>
                <td className="border p-2">{plan.auditor}</td>
                <td className="border p-2">{plan.auditee}</td>
                <td className="border p-2">
                  <button
                    onClick={() => openForm(plan.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Fill Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-lg font-bold mb-2">Enter Audit Plan Details</h3>
            <label className="block mb-2">
              Department:
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="border p-2 w-full"
              />
            </label>
            <label className="block mb-2">
              Date:
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="border p-2 w-full"
              />
            </label>
            <label className="block mb-2">
              Time Duration:
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="border p-2 w-full"
              />
            </label>
            <label className="block mb-2">Audit Criteria - Process:</label>
            {formData.criteria.map((process, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  name="criteria"
                  value={process}
                  onChange={(e) => handleChange(e, index)}
                  className="border p-2 w-full"
                />
                <button
                  onClick={() => removeProcess(index)}
                  className="ml-2 bg-red-600 text-white px-2 py-1"
                >
                  X
                </button>
              </div>
            ))}
            <button
              onClick={addProcess}
              className="bg-blue-600 text-white px-3 py-1 mb-2"
            >
              + Add Process
            </button>
            <label className="block mb-2">
              Auditor (Lead):
              <input
                type="text"
                name="auditor"
                value={formData.auditor}
                onChange={handleChange}
                className="border p-2 w-full"
              />
            </label>
            <label className="block mb-4">
              Auditee(s):
              <input
                type="text"
                name="auditee"
                value={formData.auditee}
                onChange={handleChange}
                className="border p-2 w-full"
              />
            </label>
            <button
              onClick={saveForm}
              className="bg-green-600 text-white px-4 py-2 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditPlanDetails;
