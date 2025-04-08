import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/styles/Admin_login.css";

const User_login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Hardcoded User Credentials
  const USER_USERNAME = "user";
  const USER_PASSWORD = "user@123";

  // Handle Form Submission
  const handleSubmit = (event) => {
    event.preventDefault();

    if (username === USER_USERNAME && password === USER_PASSWORD) {
      setError("");
      login("user-token", "user"); // ✅ Store user token & role

      // Save role in localStorage for persistence
      localStorage.setItem("role", "user");

      alert("Login Successful!");

      // ✅ Redirect to user dashboard
      navigate("/user-dashboard", { replace: true });
    } else {
      setError("Invalid username or password!");
    }
  };

  return (
    <div className="container-fluid main_login_div">
      <div className="form_div">
        <div className="login_title">
          <p className="login_subtitle">User Login</p>
        </div>

        <form className="form_elements" onSubmit={handleSubmit}>
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

          {/* Back Button */}
          <div className="back_button" onClick={() => navigate("/login")}>
            <i className="bi bi-arrow-left"></i> Back
          </div>
        </form>
      </div>
    </div>
  );
};

export default User_login;
