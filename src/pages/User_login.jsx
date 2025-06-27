import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/User_login.css";

const User_login = () => {
  const navigate = useNavigate();

  const [stage, setStage] = useState("login");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [auditorDepartments, setAuditorDepartments] = useState([]);
  const [forgotUsername, setForgotUsername] = useState("");
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const departments = JSON.parse(localStorage.getItem("departments") || "[]");

  const handleUsernameBlur = () => {
    if (!username) return;

    const storedUsers = JSON.parse(localStorage.getItem("userCredentials")) || [];
    const user = storedUsers.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (user) {
      if (role === "auditor") {
        const auditorList = JSON.parse(localStorage.getItem("auditors")) || [];
        const auditorEntries = auditorList.filter(auditor => auditor.employeeNumber === user.empId);

        if (auditorEntries.length > 0) {
          const deptNames = auditorEntries.map(entry => entry.department);
          setDepartment(deptNames[0]); // Preselect first department
          setAuditorDepartments(deptNames);
        } else {
          setDepartment("");
          setAuditorDepartments([]);
        }
      } else if (role === "auditee") {
        setDepartment(user.department);
        setAuditorDepartments([]);
      }
    } else {
      setDepartment("");
      setAuditorDepartments([]);
    }
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);

    const storedUsers = JSON.parse(localStorage.getItem("userCredentials")) || [];
    const user = storedUsers.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (user) {
      if (selectedRole === "auditor") {
        const auditorList = JSON.parse(localStorage.getItem("auditors")) || [];
        const auditorEntries = auditorList.filter(auditor => auditor.employeeNumber === user.empId);

        if (auditorEntries.length > 0) {
          const deptNames = auditorEntries.map(entry => entry.department);
          setDepartment(deptNames[0]); // Preselect first department
          setAuditorDepartments(deptNames);
        } else {
          setDepartment("");
          setAuditorDepartments([]);
        }
      } else if (selectedRole === "auditee") {
        setDepartment(user.department);
        setAuditorDepartments([]);
      }
    } else {
      setDepartment("");
      setAuditorDepartments([]);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const storedUsers = JSON.parse(localStorage.getItem("userCredentials")) || [];
      const user = storedUsers.find(u =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password
      );

      if (!user) {
        setError("Invalid username or password!");
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify({
        username: user.username,
        empId: user.empId,
        empName: user.empName,
        department: user.department,
        loginDepartment: department,
        designation: user.designation
      }));

      localStorage.setItem("userPermissions", JSON.stringify(user.permissions || []));
      localStorage.setItem("userOwnDepartment", user.department);
      localStorage.setItem("userAuditDepartment", department);
      localStorage.setItem("userRole", role);

      const loginActivity = {
        username: user.username,
        department: department,
        role: role,
        timestamp: Date.now(),
        read: false
      };

      const existingActivities = JSON.parse(localStorage.getItem("userLoginActivities") || "[]");
      localStorage.setItem(
        "userLoginActivities",
        JSON.stringify([...existingActivities, loginActivity])
      );

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
                  onBlur={handleUsernameBlur}
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
                <label htmlFor="user-role">Role</label>
                <select
                  id="user-role"
                  value={role}
                  onChange={handleRoleChange}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="auditor">Auditor</option>
                  <option value="auditee">Auditee</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="user-department">Department</label>
                <select
                  id="user-department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  disabled={role === "auditee" || (role === "auditor" && auditorDepartments.length <= 1)}
                >
                  <option value="">Select Department</option>
                  {(role === "auditor" ? auditorDepartments : [department]).map((dept, index) => (
                    <option key={index} value={dept}>{dept}</option>
                  ))}
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
