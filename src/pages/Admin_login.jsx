import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import auth context
import "../assets/styles/Admin_login.css";

const Admin_login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from AuthProvider
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Hardcoded Admin Credentials
  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "admin123";

  // Handle Form Submission
  const handleSubmit = (event) => {
    event.preventDefault();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setError("");

      login("admin-token", "admin"); // ✅ Store admin token & role

      alert("Login Successful!");

      // Redirect to the dashboard
      navigate("/dashboard", { replace: true });
      window.location.reload(); // ✅ Ensure UI updates immediately
    } else {
      setError("Invalid username or password!");
    }
  };

  return (
    <div className="container-fluid main_login_div">
      <div className="form_div">
        <div className="login_title">
          <p className="login_subtitle">Admin Login</p>
        </div>

        <form className="form_elements" onSubmit={handleSubmit}>
          <label htmlFor="admin-username">Username</label>
          <input
            type="text"
            id="admin-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="admin-password">Password</label>
          <input
            type="password"
            id="admin-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
          <button type="submit" className="user_login_btn">Submit</button>

          {/* Back Button */}
          <div className="back_button" onClick={() => navigate("/login")}>
            <i className="bi bi-arrow-left"></i> Back
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin_login;
