import React, { useState } from 'react';
import { FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';

const UserForm = ({ 
  activeTab, 
  newUser, 
  setNewUser, 
  handleAddUser, 
  departments, 
  designations, 
  permissionOptions,
  handlePermissionChange,
  handleSelectAllChange,
  selectAll
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="card add-user-card">
      <h3 className="card-title">
        {activeTab === "credentials" ? "Add New Employee" : "Add Employee Details"}
      </h3>
      
      <div className="form-grid">
       
        
        <div className="form-group">
          <label className="form-label">Employee ID</label>
          <input
            className="form-input"
            type="text"
            placeholder="Enter employee ID"
            value={newUser.empId}
            onChange={(e) => setNewUser({ ...newUser, empId: e.target.value })}
          />
        </div>
         {activeTab === "credentials" && (
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input-container">
              <input
                className="form-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
              <button 
                className="password-toggle"
                onClick={togglePasswordVisibility}
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Employee Name</label>
          <input
            className="form-input"
            type="text"
            placeholder="Enter employee name"
            value={newUser.empName}
            onChange={(e) => setNewUser({ ...newUser, empName: e.target.value })}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Department</label>
          <select
            className="form-input"
            value={newUser.department}
            onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Designation</label>
          <select
            className="form-input"
            value={newUser.designation}
            onChange={(e) => setNewUser({ ...newUser, designation: e.target.value })}
          >
            <option value="">Select Designation</option>
            {designations.map(designation => (
              <option key={designation} value={designation}>{designation}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Certified Date</label>
          <input
            className="form-input"
            type="date"
            value={newUser.certifiedDate}
            onChange={(e) => setNewUser({ ...newUser, certifiedDate: e.target.value })}
          />
        </div>
      </div>
      
      {activeTab === "credentials" && (
        <div className="permissions-section">
          <div className="permissions-header">
            <h4 className="permissions-title">Permissions</h4>
            <label className="checkbox-label select-all">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAllChange}
              />
              <span className="checkbox-custom"></span>
              <span>Select All</span>
            </label>
          </div>
          
          <div className="permissions-grid">
            {permissionOptions.map(permission => (
              <label key={permission} className="checkbox-label">
                <input
                  type="checkbox"
                  name={permission}
                  checked={newUser.permissions.includes(permission)}
                  onChange={handlePermissionChange}
                />
                <span className="checkbox-custom"></span>
                <span className="permission-name">{permission.split(/(?=[A-Z])/).join(" ")}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      
      <button className="primary-button add-button" onClick={handleAddUser}>
        <FaUserPlus className="button-icon" />
        {activeTab === "credentials" ? "Add Employee" : "Add Employee Details"}
      </button>
    </div>
  );
};

export default UserForm;