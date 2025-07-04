import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Admin_login.css";

const Admin_login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hardcoded Admin Credentials
  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "admin@123";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem('userRole', 'admin'); 
      setError("");
      setIsLoading(false);
      navigate("/admin-dashboard", { replace: true });
    } else {
      setError("Invalid username or password!");
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h2>Admin Portal</h2>
          <p>Enter your credentials to access the dashboard</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="admin-username">Username</label>
            <input
              type="text"
              id="admin-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter admin username"
              autoComplete="username"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="admin-password">Password</label>
            <input
              type="password"
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? <div className="spinner"></div> : "Sign In"}
          </button>

          <div className="login-footer">
            <button 
              type="button" 
              className="back-button" 
              onClick={() => navigate("/login")}
            >
              <i className="bi bi-arrow-left"></i> Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin_login;