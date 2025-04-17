import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/styles/Admin_login.css";

const Admin_login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Login success
        login("admin-token", "admin"); // store in context
        localStorage.setItem("role", "admin");
        alert("Login Successful!");
        navigate("/admin-dashboard", { replace: true });
      } else {
        // ❌ Show error from server
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again later.");
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