import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/styles/Admin_login.css";

const User_login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [stage, setStage] = useState("login"); // login → form → dashboard
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Form states
  const [selectedDept, setSelectedDept] = useState("");
  const [checkboxes, setCheckboxes] = useState({
    option1: false,
    option2: false,
    option3: false,
    option4: false,
  });

  const departments = ["HR", "Finance", "IT", "Production"];

  const USER_USERNAME = "user";
  const USER_PASSWORD = "user@123";

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === USER_USERNAME && password === USER_PASSWORD) {
      setError("");
      login("user-token", "user");
      localStorage.setItem("role", "user");
      setStage("form"); // 👈 Go to form stage
    } else {
      setError("Invalid username or password!");
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckboxes((prev) => ({ ...prev, [name]: checked }));
  };

  const handleRequest = () => {
    // You can handle storing form data here
    alert("Request submitted successfully!");
    navigate("/user-dashboard", { replace: true });
  };

  return (
    <div className="container-fluid main_login_div">
      <div className="form_div">
        {stage === "login" && (
          <>
            <div className="login_title">
              <p className="login_subtitle">User Login</p>
            </div>
            <form className="form_elements" onSubmit={handleLogin}>
              <label htmlFor="user-username">Username</label>
              <input
                type="text"
                id="user-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label htmlFor="user-password">Password</label>
              <input
                type="password"
                id="user-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
              <button type="submit" className="user_login_btn">Submit</button>

              <div className="back_button" onClick={() => navigate("/login")}>
                <i className="bi bi-arrow-left"></i> Back
              </div>
            </form>
          </>
        )}

{stage === "form" && (
  <div className="form_elements">
    <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Request Access</h3>

    <label htmlFor="department">Select Department:</label>
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
      {["option1", "option2", "option3", "option4"].map((opt, idx) => (
        <label key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="checkbox"
            name={opt}
            checked={checkboxes[opt]}
            onChange={handleCheckboxChange}
          />
          {`Option ${idx + 1}`}
        </label>
      ))}
    </div>

    <div className="modal-buttons">
      <button className="user_login_btn" onClick={handleRequest}>Request</button>
      <button className="back_button" onClick={() => setStage("login")}>
        <i className="bi bi-arrow-left"></i> Back
      </button>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default User_login;
