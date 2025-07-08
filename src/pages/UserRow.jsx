import React from "react";
import { FaEye, FaEyeSlash, FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";

const UserRow = ({
  user,
  activeTab,
  editingUser,
  editForm,
  setEditForm,
  startEditing,
  handleEditUser,
  cancelEditing,
  handleDeleteUser,
  showPasswords,
  toggleUserPasswordVisibility,
  departments,
  designations,
  permissionOptions,
  handleEditPermissionChange,
  formatDate,
  formatShortDate,
  formatPermissions
}) => {
  return (
    <tr className="table-row">
      <td className="table-cell">
        {editingUser === user.empId ? (
          <input
            className="edit-input"
            value={editForm.empId}
            onChange={(e) => setEditForm({...editForm, empId: e.target.value})}
          />
        ) : (
          <span className="cell-text">{user.empId}</span>
        )}
      </td>
      <td className="table-cell">
        {editingUser === user.empId ? (
          <input
            className="edit-input"
            value={editForm.empName}
            onChange={(e) => setEditForm({...editForm, empName: e.target.value})}
          />
        ) : (
          <span className="cell-text">{user.empName}</span>
        )}
      </td>
      <td className="table-cell">
        {editingUser === user.empId ? (
          <select
            className="edit-input"
            value={editForm.department}
            onChange={(e) => setEditForm({...editForm, department: e.target.value})}
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        ) : (
          <span className="cell-text">{user.department || "N/A"}</span>
        )}
      </td>
      <td className="table-cell">
        {editingUser === user.empId ? (
          <select
            className="edit-input"
            value={editForm.designation}
            onChange={(e) => setEditForm({...editForm, designation: e.target.value})}
          >
            <option value="">Select Designation</option>
            {designations.map(designation => (
              <option key={designation} value={designation}>{designation}</option>
            ))}
          </select>
        ) : (
          <span className="cell-text">{user.designation || "N/A"}</span>
        )}
      </td>
      <td className="table-cell">
        {editingUser === user.empId ? (
          <input
            className="edit-input"
            type="date"
            value={editForm.certifiedDate}
            onChange={(e) => setEditForm({...editForm, certifiedDate: e.target.value})}
          />
        ) : (
          <span className="cell-text">{formatShortDate(user.certifiedDate)}</span>
        )}
      </td>
      
      {activeTab === "credentials" && (
        <>
          <td className="table-cell password-cell">
            {editingUser === user.empId ? (
              <div className="password-input-container">
                <input
                  className="edit-input"
                  type={showPasswords[user.empId] ? "text" : "password"}
                  value={editForm.password}
                  onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                />
                <button 
                  className="password-toggle"
                  onClick={() => toggleUserPasswordVisibility(user.empId)}
                  type="button"
                  aria-label={showPasswords[user.empId] ? "Hide password" : "Show password"}
                >
                  {showPasswords[user.empId] ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            ) : (
              <div className="password-display">
                <span className="password-text">
                  {showPasswords[user.empId] ? user.password : "••••••••"}
                </span>
                <button 
                  className="password-toggle"
                  onClick={() => toggleUserPasswordVisibility(user.empId)}
                  type="button"
                  aria-label={showPasswords[user.empId] ? "Hide password" : "Show password"}
                >
                  {showPasswords[user.empId] ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            )}
          </td>
          <td className="table-cell permissions-cell">
            {editingUser === user.empId ? (
              <div className="edit-permissions-grid">
                {permissionOptions.map(permission => (
                  <label key={permission} className="checkbox-label">
                    <input
                      type="checkbox"
                      name={permission}
                      checked={editForm.permissions.includes(permission)}
                      onChange={handleEditPermissionChange}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="permission-name">{permission.split(/(?=[A-Z])/).join(" ")}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="permissions-text">
                {formatPermissions(user.permissions)}
              </div>
            )}
          </td>
        </>
      )}
      
      <td className="table-cell date-cell">
        <span className="date-text">{formatDate(user.createdAt)}</span>
      </td>
      <td className="table-cell date-cell">
        <span className="date-text">{formatDate(user.updatedAt)}</span>
      </td>
      <td className="table-cell actions-cell">
        <div className="action-buttons">
          {editingUser === user.empId ? (
            <>
              <button 
                className="icon-button success-button"
                onClick={handleEditUser}
                title="Save"
              >
                <FaCheck />
              </button>
              <button 
                className="icon-button danger-button"
                onClick={cancelEditing}
                title="Cancel"
              >
                <FaTimes />
              </button>
            </>
          ) : (
            <>
              <button 
                className="icon-button "
                onClick={() => startEditing(user)}
                title="Edit"
              >
                <FaEdit />
              </button>
              <button 
                className="icon-button danger-button"
                onClick={() => handleDeleteUser(user.empId)}
                title="Delete"
              >
                <FaTrash />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

export default UserRow;