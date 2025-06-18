import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/User_login.css";

const User_login = () => {
  const navigate = useNavigate();

  const [stage, setStage] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("auditor");
  const [forgotUsername, setForgotUsername] = useState("");
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const departments = JSON.parse(localStorage.getItem("departments") || []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!department) {
        setError("Please select a department");
        return;
      }

      const storedUsers = JSON.parse(localStorage.getItem("userCredentials")) || [];
      const user = storedUsers.find(u =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password
      );

      if (!user) {
        setError("Invalid username or password!");
        return;
      }

      // Store user data
      localStorage.setItem("currentUser", JSON.stringify({
        username: user.username,
        empId: user.empId,
        empName: user.empName,
        department: user.department || department,
        designation: user.designation
      }));

      localStorage.setItem("userPermissions", JSON.stringify(user.permissions || []));
      localStorage.setItem("userDepartment", user.department || department);
      localStorage.setItem("userRole", role);

      console.log("Login successful, navigating..."); // Debug log
      console.log("About to navigate. Current path:", window.location.pathname);
      console.log("User data:", {
        currentUser: localStorage.getItem("currentUser"),
        permissions: localStorage.getItem("userPermissions"),
        department: localStorage.getItem("userDepartment"),
        role: localStorage.getItem("userRole")
      });
      navigate("/user-dashboard", { replace: true });

    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const storedUsers = JSON.parse(localStorage.getItem("userCredentials")) || [];
    const updatedUsers = storedUsers.map(user =>
      user.username === forgotUsername ? { ...user, password: newPassword } : user
    );

    localStorage.setItem("userCredentials", JSON.stringify(updatedUsers));
    alert("Password reset successfully!");
    setStage("login");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {stage === "login" && (
          <>
            <div className="login-header">
              <h2>User Login</h2>
              <p>Welcome back! Please enter your details</p>
            </div>

            <form className="login-form" onSubmit={handleLogin}>
              <div className="input-group">
                <label htmlFor="user-username">Username</label>
                <input
                  type="text"
                  id="user-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                />
              </div>

              <div className="input-group">
                <label htmlFor="user-password">Password</label>
                <input
                  type="password"
                  id="user-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>

              <div className="input-group">
                <label htmlFor="user-department">Department</label>
                <select
                  id="user-department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="user-role">Role</label>
                <select
                  id="user-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="auditor">Auditor</option>
                  <option value="auditee">Auditee</option>
                </select>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? <div className="spinner"></div> : "Log In"}
              </button>

              <div className="login-footer">
                <button type="button" className="back-button" onClick={() => navigate("/login")}>
                  <i className="bi bi-arrow-left"></i> Back
                </button>
                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => setStage("forgot")}
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          </>
        )}

        {stage === "forgot" && (
          <div className="forgot-password-card">
            <div className="login-header">
              <h2>Forgot Password</h2>
              <p>Enter your username to reset your password</p>
            </div>

            <div className="input-group">
              <label htmlFor="forgot-username">Username</label>
              <input
                type="text"
                id="forgot-username"
                value={forgotUsername}
                onChange={(e) => setForgotUsername(e.target.value)}
                required
                placeholder="Enter your username"
              />
            </div>

            <div className="button-group">
              <button
                className="primary-button"
                onClick={() => setStage("resetPassword")}
                disabled={!forgotUsername}
              >
                Continue
              </button>
              <button
                className="secondary-button"
                onClick={() => setStage("login")}
              >
                <i className="bi bi-arrow-left"></i> Back to Login
              </button>
            </div>
          </div>
        )}

        {stage === "resetPassword" && (
          <div className="reset-password-card">
            <div className="login-header">
              <h2>Reset Password</h2>
              <p>Create a new password for your account</p>
            </div>

            <form onSubmit={handlePasswordReset}>
              <div className="input-group">
                <label htmlFor="new-password">New Password</label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                />
                <small className="password-hint">Minimum 6 characters</small>
              </div>

              <div className="input-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                />
              </div>

              {passwordError && <div className="error-message">{passwordError}</div>}

              <div className="button-group">
                <button type="submit" className="primary-button" disabled={isLoading}>
                  {isLoading ? <div className="spinner"></div> : "Reset Password"}
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setStage("login")}
                >
                  <i className="bi bi-arrow-left"></i> Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default User_login;