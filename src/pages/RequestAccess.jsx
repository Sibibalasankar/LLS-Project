// src/pages/RequestAccess.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/RequsetAccess.css";

// Replace the static list with dynamic department fetching
const RequestAccess = () => {
  const navigate = useNavigate();

  const [selectedDept, setSelectedDept] = useState("");
  const [checkboxes, setCheckboxes] = useState({
    auditPlanSheet: false,
    auditObservation: false,
    auditNCCloser: false,
    auditNCApproval: false,
    isoManual: false,
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    // Fetch the department data from localStorage (or from the API if required)
    const storedDepartments = JSON.parse(localStorage.getItem("departments") || "[]");
    setDepartments(storedDepartments.map((dept) => dept.name)); // Only get the department names
  }, []);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckboxes((prev) => ({ ...prev, [name]: checked }));
  };

  const handleRequest = () => {
    // Handle form submission logic here
    alert("Request submitted successfully!");
    navigate("/user-dashboard", { replace: true }); // Navigate to dashboard
  };

  return (
    <div className="container-fluid main_login_div">
      <div className="form_div">
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Request Access</h3>

        <label htmlFor="department">Selectnb Department:</label>
        <select
          id="department"
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          required
          className="styled-select"
        >
          <option value="">-- Select Department --</option>
          {departments.map((dept, index) => (
            <option key={index} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="auditPlanSheet"
              checked={checkboxes.auditPlanSheet}
              onChange={handleCheckboxChange}
            />
            Audit Plan Sheet
          </label>
          <label>
            <input
              type="checkbox"
              name="auditObservation"
              checked={checkboxes.auditObservation}
              onChange={handleCheckboxChange}
            />
            Audit Observation
          </label>
          <label>
            <input
              type="checkbox"
              name="auditNCCloser"
              checked={checkboxes.auditNCCloser}
              onChange={handleCheckboxChange}
            />
            Audit NC Closer
          </label>
          <label>
            <input
              type="checkbox"
              name="auditNCApproval"
              checked={checkboxes.auditNCApproval}
              onChange={handleCheckboxChange}
            />
            Audit NC Approval
          </label>
          <label>
            <input
              type="checkbox"
              name="isoManual"
              checked={checkboxes.isoManual}
              onChange={handleCheckboxChange}
            />
            ISO 9001-2015 Manual
          </label>
        </div>

        <div className="modal-buttons">
          <button className="user_login_btn" onClick={handleRequest}>Request</button>
          <button className="back_button" onClick={() => navigate("/user-login")}>
            <i className="bi bi-arrow-left"></i> Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestAccess;
