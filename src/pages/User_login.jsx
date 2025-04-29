import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Admin_login.css";

const User_login = () => {
  const navigate = useNavigate();

  const [stage, setStage] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [forgotUsername, setForgotUsername] = useState("");
  const [error, setError] = useState("");
  const [isRequestSubmitted, setIsRequestSubmitted] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [isPasswordResetRequested, setIsPasswordResetRequested] = useState(false);
  const [passwordResetRequestId, setPasswordResetRequestId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  const [selectedDept, setSelectedDept] = useState("");
  const [checkboxes, setCheckboxes] = useState({
    auditPlanSheet: false,
    auditObservation: false,
    auditNCCloser: false,
    auditNCApproval: false,
    isoManual: false,
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const storedDepartments = JSON.parse(localStorage.getItem("departments") || "[]");
    setDepartments(storedDepartments.map(dept => dept.name));
  }, []);

  useEffect(() => {
    if (!isRequestSubmitted || !currentRequestId) return;

    let isMounted = true;

    const checkRequestStatus = () => {
      if (!isMounted) return;

      const requests = JSON.parse(localStorage.getItem("accessRequests") || "[]");
      const currentRequest = requests.find(req => req.timestamp === currentRequestId);

      if (!currentRequest) return;

      if (currentRequest.status === "approved") {
        localStorage.setItem("userPermissions", JSON.stringify(currentRequest.permissions));
        localStorage.setItem("userDepartment", currentRequest.department);
        clearInterval(interval);

        if (isMounted) {
          setIsRequestSubmitted(false);
          setCurrentRequestId(null);
          navigate("/user-dashboard", { replace: true });
        }
      } else if (currentRequest.status === "rejected") {
        clearInterval(interval);
        if (isMounted) {
          setIsRequestSubmitted(false);
          setCurrentRequestId(null);
          alert("Request rejected by admin");
        }
      }
    };

    const interval = setInterval(checkRequestStatus, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isRequestSubmitted, currentRequestId, navigate]);

  useEffect(() => {
    if (!isPasswordResetRequested || !passwordResetRequestId) return;

    let isMounted = true;

    const checkPasswordResetStatus = () => {
      if (!isMounted) return;

      const requests = JSON.parse(localStorage.getItem("passwordResetRequests") || "[]");
      const currentRequest = requests.find(req => req.timestamp === passwordResetRequestId);

      if (!currentRequest) return;

      if (currentRequest.status === "approved") {
        clearInterval(interval);
        if (isMounted) {
          setIsPasswordResetRequested(false);
          setPasswordResetRequestId(null);
          setStage("resetPassword");
        }
      } else if (currentRequest.status === "rejected") {
        clearInterval(interval);
        if (isMounted) {
          setIsPasswordResetRequested(false);
          setPasswordResetRequestId(null);
          alert("Your password reset request has been rejected by admin.");
          setStage("login");
        }
      }
    };

    const interval = setInterval(checkPasswordResetStatus, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isPasswordResetRequested, passwordResetRequestId]);

  useEffect(() => {
    const allChecked = Object.values(checkboxes).every(Boolean);
    setSelectAll(allChecked);
  }, [checkboxes]);

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUsers = JSON.parse(localStorage.getItem("userCredentials")) || [];

    const user = storedUsers.find(
      user => user.username === username && user.password === password
    );

    if (user) {
      setError("");
      setStage("form");
    } else {
      setError("Invalid username or password!");
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckboxes((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectAllChange = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setCheckboxes({
      auditPlanSheet: checked,
      auditObservation: checked,
      auditNCCloser: checked,
      auditNCApproval: checked,
      isoManual: checked,
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleRequest = () => {
    if (!selectedDept) {
      alert("Please select a department");
      return;
    }

    const newRequest = {
      username: username,
      department: selectedDept,
      permissions: Object.entries(checkboxes)
        .filter(([_, value]) => value)
        .map(([key]) => key),
      timestamp: new Date().toISOString(),
      status: "pending",
      read: false
    };

    const existingRequests = JSON.parse(localStorage.getItem("accessRequests") || "[]");
    localStorage.setItem("accessRequests", JSON.stringify([...existingRequests, newRequest]));
    localStorage.setItem("currentUser", username);

    setIsRequestSubmitted(true);
    setCurrentRequestId(newRequest.timestamp);
    alert("Your request has been submitted. Waiting for admin approval...");
  };

  const handlePasswordResetRequest = () => {
    const storedUsers = JSON.parse(localStorage.getItem("userCredentials")) || [];
    const user = storedUsers.find(u => u.username === forgotUsername);
    
    if (!user) {
      alert("Username not found");
      return;
    }

    const resetRequest = {
      username: forgotUsername,
      timestamp: new Date().toISOString(),
      status: "pending",
      read: false,
      type: "passwordReset"
    };

    const existingRequests = JSON.parse(localStorage.getItem("passwordResetRequests") || "[]");
    localStorage.setItem("passwordResetRequests", JSON.stringify([...existingRequests, resetRequest]));

    setIsPasswordResetRequested(true);
    setPasswordResetRequestId(resetRequest.timestamp);
    alert("Your password reset request has been submitted to admin for approval.");
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    // Update user's password
    const storedUsers = JSON.parse(localStorage.getItem("userCredentials")) || [];
    const updatedUsers = storedUsers.map(user => 
      user.username === forgotUsername ? { ...user, password: newPassword } : user
    );
    
    localStorage.setItem("userCredentials", JSON.stringify(updatedUsers));
    
    // Mark request as completed
    const requests = JSON.parse(localStorage.getItem("passwordResetRequests") || "[]");
    const updatedRequests = requests.map(req => 
      req.timestamp === passwordResetRequestId ? { ...req, status: "completed" } : req
    );
    localStorage.setItem("passwordResetRequests", JSON.stringify(updatedRequests));
    
    alert("Password reset successfully!");
    setStage("login");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
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
              <label htmlFor="user-username" style={{ color: "white" }}>Username</label>
              <input
                type="text"
                id="user-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label htmlFor="user-password" style={{ color: "white" }}>Password</label>
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
            <p
              onClick={() => setStage("forgot")}
              style={{
                color: "blue",
                cursor: "pointer",
                textAlign: "center",
                textDecoration: "underline",
              }}
            >
              Forgot Password?
            </p>
          </>
        )}

        {stage === "form" && (
          <div className="form_div">
            <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Request Access</h3>
            <label htmlFor="department" style={{ color: 'white' }}>Select Department:</label>
            <select
              id="department"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              required
              className="styled-select"
              disabled={isRequestSubmitted}
            >
              <option value="">-- Select Department --</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <div className="checkbox-group">
              <label className="select-all-label">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                  disabled={isRequestSubmitted}
                />
                <strong>Select All Permissions</strong>
              </label>
              
              {Object.entries(checkboxes).map(([key, value]) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    name={key}
                    checked={value}
                    onChange={handleCheckboxChange}
                    disabled={isRequestSubmitted}
                  />
                  {key.split(/(?=[A-Z])/).join(" ")}
                </label>
              ))}
            </div>

            <div className="modal-buttons">
              <button
                className="user_login_btn"
                onClick={handleRequest}
                disabled={isRequestSubmitted}
              >
                {isRequestSubmitted ? "Waiting for admin response..." : "Request"}
              </button>
              <button className="back_button" onClick={handleBack}>
                <i className="bi bi-arrow-left"></i> Back
              </button>
            </div>
          </div>
        )}

        {stage === "forgot" && (
          <div className="form_div">
            <h3 style={{ textAlign: "center", marginBottom: "10px", color: "white" }}>Forgot Password</h3>
            <label htmlFor="forgot-username" style={{ color: "white" }}>Enter your username</label>
            <input
              type="text"
              id="forgot-username"
              value={forgotUsername}
              onChange={(e) => setForgotUsername(e.target.value)}
              required
              disabled={isPasswordResetRequested}
            />
            <div className="modal-buttons">
              <button
                className="user_login_btn"
                onClick={handlePasswordResetRequest}
                disabled={isPasswordResetRequested}
              >
                {isPasswordResetRequested ? "Request submitted..." : "Request Password Reset"}
              </button>
              <button 
                className="back_button" 
                onClick={() => setStage("login")}
                disabled={isPasswordResetRequested}
              >
                <i className="bi bi-arrow-left"></i> Back
              </button>
            </div>
          </div>
        )}

        {stage === "resetPassword" && (
          <div className="form_div">
            <h3 style={{ textAlign: "center", marginBottom: "10px", color: "white" }}>Set New Password</h3>
            <form onSubmit={handlePasswordReset}>
              <label htmlFor="new-password" style={{ color: "white" }}>New Password</label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
              <label htmlFor="confirm-password" style={{ color: "white" }}>Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
              {passwordError && <p style={{ color: "red", textAlign: "center" }}>{passwordError}</p>}
              <div className="modal-buttons">
                <button type="submit" className="user_login_btn">
                  Reset Password
                </button>
                <button
                  type="button"
                  className="back_button"
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