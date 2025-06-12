import React from "react";
import { MdDateRange, MdWork, MdPerson, MdBadge, MdCardMembership } from "react-icons/md";
import UserRow from "./UserRow";

const UserTable = ({
  activeTab,
  filteredUsers,
  sortConfig,
  handleSort,
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
    <div className="card users-table-card">
      <div className="table-responsive">
        <table className="users-table">
          <thead>
            <tr>
              <th 
                className="table-header sortable" 
                onClick={() => handleSort("empId")}
              >
                <div className="header-content">
                  <MdBadge className="header-icon" />
                  Emp ID
                  {sortConfig.key === "empId" && (
                    <span className={`sort-icon ${sortConfig.direction}`}>
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="table-header sortable" 
                onClick={() => handleSort("empName")}
              >
                <div className="header-content">
                  <MdPerson className="header-icon" />
                  Employee Name
                  {sortConfig.key === "empName" && (
                    <span className={`sort-icon ${sortConfig.direction}`}>
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="table-header sortable" 
                onClick={() => handleSort("department")}
              >
                <div className="header-content">
                  <MdWork className="header-icon" />
                  Department
                  {sortConfig.key === "department" && (
                    <span className={`sort-icon ${sortConfig.direction}`}>
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="table-header sortable" 
                onClick={() => handleSort("designation")}
              >
                <div className="header-content">
                  <MdWork className="header-icon" />
                  Designation
                  {sortConfig.key === "designation" && (
                    <span className={`sort-icon ${sortConfig.direction}`}>
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="table-header sortable" 
                onClick={() => handleSort("certifiedDate")}
              >
                <div className="header-content">
                  <MdCardMembership className="header-icon" />
                  Certified Date
                  {sortConfig.key === "certifiedDate" && (
                    <span className={`sort-icon ${sortConfig.direction}`}>
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="table-header sortable" 
                onClick={() => handleSort("username")}
              >
                <div className="header-content">
                  Username
                  {sortConfig.key === "username" && (
                    <span className={`sort-icon ${sortConfig.direction}`}>
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              {activeTab === "credentials" && (
                <>
                  <th className="table-header">Password</th>
                  <th className="table-header">Permissions</th>
                </>
              )}
              <th 
                className="table-header sortable" 
                onClick={() => handleSort("createdAt")}
              >
                <div className="header-content">
                  <MdDateRange className="header-icon" />
                  Created
                  {sortConfig.key === "createdAt" && (
                    <span className={`sort-icon ${sortConfig.direction}`}>
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="table-header sortable" 
                onClick={() => handleSort("updatedAt")}
              >
                <div className="header-content">
                  <MdDateRange className="header-icon" />
                  Last Updated
                  {sortConfig.key === "updatedAt" && (
                    <span className={`sort-icon ${sortConfig.direction}`}>
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
              <th className="table-header actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserRow
                  key={user.username}
                  user={user}
                  activeTab={activeTab}
                  editingUser={editingUser}
                  editForm={editForm}
                  setEditForm={setEditForm}
                  startEditing={startEditing}
                  handleEditUser={handleEditUser}
                  cancelEditing={cancelEditing}
                  handleDeleteUser={handleDeleteUser}
                  showPasswords={showPasswords}
                  toggleUserPasswordVisibility={toggleUserPasswordVisibility}
                  departments={departments}
                  designations={designations}
                  permissionOptions={permissionOptions}
                  handleEditPermissionChange={handleEditPermissionChange}
                  formatDate={formatDate}
                  formatShortDate={formatShortDate}
                  formatPermissions={formatPermissions}
                />
              ))
            ) : (
              <tr className="empty-row">
                <td colSpan={activeTab === "credentials" ? 10 : 8} className="empty-cell">
                  <div className="empty-state">
                    <div className="empty-image">📭</div>
                    <p className="empty-text">No employees found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;