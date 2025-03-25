import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/User_login.css";

const User_login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle User Login
  const handleLogin = (event) => {
    event.preventDefault();

    // Trim whitespace from inputs
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError("Username and Password are required!");
      return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if user exists
    const userExists = users.find(
      (user) =>
        user.username.toLowerCase() === trimmedUsername.toLowerCase() &&
        user.password === trimmedPassword
    );

    if (userExists) {
      alert("Login Successful!");
      navigate("/dashboard", { replace: true }); // Redirect to Dashboard
    } else {
      setError("Invalid Username or Password!");
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

          {/* Back Button: Always go to login page */}
          <div className="back_button" onClick={() => navigate("/login", { replace: true })}>
            <i className="bi bi-arrow-left"></i> Back
          </div>
        </form>
      </div>
    </div>
  );
};

export default User_login;
