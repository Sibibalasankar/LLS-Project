import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Import Auth Context
import "../assets/styles/User_login.css";

const User_login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    // Trim whitespace from inputs
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError("Username and Password are required!");
      return;
    }

    try {
      // Send login request to backend
      const response = await axios.post("http://localhost:5000/api/login", {
        username: trimmedUsername,
        password: trimmedPassword,
      });

      if (response.data.token) {
        login(response.data.token); // Store token in auth context
        alert("Login Successful!");
        navigate("/dashboard", { replace: true });
        window.location.reload(); // Force refresh to update state
      } else {
        setError(response.data.message || "Invalid Username or Password!");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong! Try again.");
    }
  };

  return (
    <div className="container-fluid main_login_div">
      <div className="form_div">
        <div className="login_title">
          <p className="login_subtitle">User Login</p>
        </div>

        <form className="form_elements" onSubmit={handleLogin}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="user_login_btn">
            Submit
          </button>

          {/* Back Button */}
          <div className="back_button" onClick={() => navigate("/login", { replace: true })}>
            <i className="bi bi-arrow-left"></i> Back
          </div>
        </form>
      </div>
    </div>
  );
};

export default User_login;
