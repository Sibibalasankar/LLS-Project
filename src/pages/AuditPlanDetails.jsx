import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/styles/AuditPlanDetails.css";

const AuditPlanDetails = ({ department: propDepartment, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const department = propDepartment || location.state?.department;

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/audit-plan-creation");
    }
  };

  const [auditPlans, setAuditPlans] = useState([]);

  useEffect(() => {
    if (department) {
      const storedPlans = JSON.parse(localStorage.getItem(`auditPlans_${department.name}`)) || [];
      setAuditPlans(storedPlans);
    }
  }, [department]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, date: "", duration: "", criteria: [""], auditor: "", auditee: "" });

  const openForm = (id) => {
    const selectedPlan = auditPlans.find((plan) => plan.id === id);
    setFormData(selectedPlan ? { ...selectedPlan } : { id: auditPlans.length + 1, date: "", duration: "", criteria: [""], auditor: "", auditee: "" });
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
    // Basic form validation
    if (!formData.date || !formData.auditor || !formData.auditee) {
      alert("Please fill in all required fields.");
      return;
    }
  
    // Check if it's an edit or a new plan
    const updatedPlans = formData.id
      ? auditPlans.map((plan) => (plan.id === formData.id ? formData : plan)) // Edit existing
      : [...auditPlans, { ...formData, id: auditPlans.length + 1 }]; // Add new plan
    
    // Update the state with the new or edited plans
    setAuditPlans(updatedPlans);
  
    // Update localStorage with the updated plans
    localStorage.setItem(`auditPlans_${department.name}`, JSON.stringify(updatedPlans));
  
    // Debugging: Check if the local storage is being updated correctly
    const storedPlans = JSON.parse(localStorage.getItem(`auditPlans_${department.name}`)) || [];
    console.log("Updated plans in local storage:", storedPlans);
  
    // Close the form
    setShowForm(false);
  };
  

  if (!department) return <p className="text-red-500">No department selected.</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button onClick={handleBack} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors">
        ← Back
      </button>
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Audit Schedule for {department.name}</h2>
      <div className="bg-yellow-500 text-black text-center p-2 font-bold">INTERNAL AUDIT SCHEDULE - ISO 9001:2015</div>

      <div className="border p-4 bg-white shadow-md mt-4">
        {auditPlans.length === 0 ? (
          <p className="text-center text-gray-500">No audit records available. Click 'Add Audit Plan' to create one.</p>
        ) : (
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Sl. No.</th>
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
                <tr key={plan.id} className="text-center hover:bg-gray-100">
                  <td className="border p-2">{plan.id}</td>
                  <td className="border p-2">{plan.date}</td>
                  <td className="border p-2">{plan.duration}</td>
                  <td className="border p-2">{plan.criteria.join(", ")}</td>
                  <td className="border p-2">{plan.auditor}</td>
                  <td className="border p-2">{plan.auditee}</td>
                  <td className="border p-2">
                    <button onClick={() => openForm(plan.id)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button onClick={() => openForm(null)} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors">
        + Add Audit Plan
      </button>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-lg font-bold mb-2">Enter Audit Plan Details</h3>
            <label className="block mb-2">Date:
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="border p-2 w-full mb-4" />
            </label>
            <label className="block mb-2">Time Duration:
              <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="border p-2 w-full mb-4" />
            </label>
            <label className="block mb-2">Audit Criteria - Process:</label>
            {formData.criteria.map((process, index) => (
              <div key={index} className="flex items-center mb-2">
                <input type="text" name="criteria" value={process} onChange={(e) => handleChange(e, index)} className="border p-2 w-full" />
                <button onClick={() => removeProcess(index)} className="ml-2 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors">X</button>
              </div>
            ))}
            <button onClick={addProcess} className="bg-blue-600 text-white px-3 py-1 mb-2 rounded hover:bg-blue-700 transition-colors">
              + Add Process
            </button>
            <label className="block mb-2">Auditor (Lead):
              <input type="text" name="auditor" value={formData.auditor} onChange={handleChange} className="border p-2 w-full mb-4" />
            </label>
            <label className="block mb-4">Auditee(s):
              <input type="text" name="auditee" value={formData.auditee} onChange={handleChange} className="border p-2 w-full" />
            </label>
            <div className="flex justify-between">
              <button onClick={saveForm} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">Save</button>
              <button onClick={() => setShowForm(false)} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditPlanDetails;
