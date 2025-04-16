import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserPreDashboardForm = () => {
  const navigate = useNavigate();

  // Example department options – you can update these dynamically later
  const departments = ["HR", "Finance", "IT", "Operations"];

  const [selectedDept, setSelectedDept] = useState("");
  const [checkboxes, setCheckboxes] = useState({
    option1: false,
    option2: false,
    option3: false,
    option4: false,
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckboxes((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Store values if needed for the next page
    localStorage.setItem("selectedDepartment", selectedDept);
    localStorage.setItem("userSelections", JSON.stringify(checkboxes));

    // We'll define this behavior later as you said
    alert("Request submitted (logic to be added)");
  };

  return (
    <div className="container" style={{ maxWidth: "500px", margin: "auto", padding: "2rem" }}>
      <h2>User Department Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Department Dropdown */}
        <label htmlFor="department">Select Department:</label>
        <select
          id="department"
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "1rem" }}
        >
          <option value="">-- Select Department --</option>
          {departments.map((dept, index) => (
            <option key={index} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Checkboxes */}
        <div style={{ marginBottom: "1rem" }}>
          <label>
            <input
              type="checkbox"
              name="option1"
              checked={checkboxes.option1}
              onChange={handleCheckboxChange}
            />
            {" "}Option 1
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              name="option2"
              checked={checkboxes.option2}
              onChange={handleCheckboxChange}
            />
            {" "}Option 2
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              name="option3"
              checked={checkboxes.option3}
              onChange={handleCheckboxChange}
            />
            {" "}Option 3
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              name="option4"
              checked={checkboxes.option4}
              onChange={handleCheckboxChange}
            />
            {" "}Option 4
          </label>
        </div>

        {/* Submit Button */}
        <button type="submit" style={{ padding: "8px 16px" }}>
          Request
        </button>
      </form>
    </div>
  );
};

export default UserPreDashboardForm;
