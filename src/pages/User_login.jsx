import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Admin_login.css";


const User_login = () => {
  const navigate = useNavigate();

  const [stage, setStage] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRequestSubmitted, setIsRequestSubmitted] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);

  // Form states
  const [selectedDept, setSelectedDept] = useState("");
  const [checkboxes, setCheckboxes] = useState({
    auditPlanSheet: false,
    auditObservation: false,
    auditNCCloser: false,
    auditNCApproval: false,
    isoManual: false,
  });

  // Load departments from localStorage
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const storedDepartments = JSON.parse(localStorage.getItem("departments") || "[]");
    setDepartments(storedDepartments.map(dept => dept.name));
  }, []);

  // Check for request status updates
  useEffect(() => {
    if (!isRequestSubmitted || !currentRequestId) return;

    let isMounted = true; // Track mounted state

    const checkRequestStatus = () => {
      if (!isMounted) return; // Don't proceed if unmounted

      const requests = JSON.parse(localStorage.getItem("accessRequests") || "[]");
      const currentRequest = requests.find(req => req.timestamp === currentRequestId);

      if (!currentRequest) return;

      if (currentRequest.status === "approved") {
        // Save data to localStorage
        localStorage.setItem("userPermissions", JSON.stringify(currentRequest.permissions));
        localStorage.setItem("userDepartment", currentRequest.department);

        // Clear interval immediately
        clearInterval(interval);

        if (isMounted) {
          setIsRequestSubmitted(false);
          setCurrentRequestId(null);
          navigate("/user-dashboard", { replace: true });
        }
      }
      else if (currentRequest.status === "rejected") {
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
      isMounted = false; // Mark as unmounted
      clearInterval(interval); // Cleanup interval
    };
  }, [isRequestSubmitted, currentRequestId, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    // Get stored users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("userCredentials")) || [];

    // Check if credentials match any user
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
              <button
                className="back_button"
                onClick={() => navigate("/user-login")}
              >
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