import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaUserPlus, FaTrash, FaEdit, FaCheck, FaTimes, FaSearch } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import "../assets/styles/UserProfile.css";

const UserProfile = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ 
    username: "", 
    password: "",
    permissions: []
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ username: "", password: "", permissions: [] });
  const [filter, setFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [selectAll, setSelectAll] = useState(false);

  const permissionOptions = [
    "auditPlanSheet",
    "auditObservation",
    "auditNCCloser",
    "auditNCApproval",
    "isoManual"
  ];

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("userCredentials")) || [];
    setUsers(storedUsers);
    
    const initialShowPasswords = {};
    storedUsers.forEach(user => {
      initialShowPasswords[user.username] = false;
    });
    setShowPasswords(initialShowPasswords);
  }, []);

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setNewUser(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, name] 
        : prev.permissions.filter(p => p !== name)
    }));
  };

  const handleEditPermissionChange = (e) => {
    const { name, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, name] 
        : prev.permissions.filter(p => p !== name)
    }));
  };

  const handleSelectAllChange = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setNewUser(prev => ({
      ...prev,
      permissions: checked ? [...permissionOptions] : []
    }));
  };

  const handleAddUser = () => {
    if (!newUser.username || !newUser.password) {
      return alert("Username and password are required!");
    }

    if (users.some(user => user.username === newUser.username)) {
      return alert("Username already exists!");
    }

    const timestamp = new Date().toISOString();
    const userToAdd = {
      username: newUser.username,
      password: newUser.password,
      permissions: newUser.permissions,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const updatedUsers = [...users, userToAdd];
    localStorage.setItem("userCredentials", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setNewUser({ username: "", password: "", permissions: [] });
    setShowPasswords({...showPasswords, [userToAdd.username]: false});
  };

  const handleDeleteUser = (usernameToDelete) => {
    if (!window.confirm(`Are you sure you want to delete ${usernameToDelete}?`)) return;
    
    const updatedUsers = users.filter((user) => user.username !== usernameToDelete);
    localStorage.setItem("userCredentials", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    
    const newShowPasswords = {...showPasswords};
    delete newShowPasswords[usernameToDelete];
    setShowPasswords(newShowPasswords);
  };

  const startEditing = (user) => {
    setEditingUser(user.username);
    setEditForm({ 
      username: user.username, 
      password: user.password,
      permissions: user.permissions || []
    });
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setEditForm({ username: "", password: "", permissions: [] });
  };

  const handleEditUser = () => {
    if (!editForm.username || !editForm.password) {
      return alert("Username and password are required!");
    }

    if (editForm.username !== editingUser && users.some(user => user.username === editForm.username)) {
      return alert("Username already exists!");
    }

    const updatedUsers = users.map(user => {
      if (user.username === editingUser) {
        return {
          ...user,
          username: editForm.username,
          password: editForm.password,
          permissions: editForm.permissions,
          updatedAt: new Date().toISOString()
        };
      }
      return user;
    });

    localStorage.setItem("userCredentials", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setEditingUser(null);
    setEditForm({ username: "", password: "", permissions: [] });

    if (editForm.username !== editingUser) {
      const newShowPasswords = {...showPasswords};
      newShowPasswords[editForm.username] = newShowPasswords[editingUser];
      delete newShowPasswords[editingUser];
      setShowPasswords(newShowPasswords);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleUserPasswordVisibility = (username) => {
    setShowPasswords({
      ...showPasswords,
      [username]: !showPasswords[username]
    });
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredUsers = sortedUsers.filter(user => 
    user.username.toLowerCase().includes(filter.toLowerCase()) ||
    user.createdAt.toLowerCase().includes(filter.toLowerCase()) ||
    user.updatedAt.toLowerCase().includes(filter.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatPermissions = (permissions) => {
    if (!permissions || permissions.length === 0) return "No permissions";
    return permissions.map(p => p.split(/(?=[A-Z])/).join(" ")).join(", ");
  };

  return (
    <div className="container">
      <div className="header">
        <h2 className="title">User Credentials Manager</h2>
        <div className="header-actions">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              className="search-input"
              type="text"
              placeholder="Search users..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card add-user-card">
        <h3 className="card-title">Add New User</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              type="text"
              placeholder="Enter username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            />
          </div>
          
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
        </div>
        
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
        
        <button className="primary-button add-button" onClick={handleAddUser}>
          <FaUserPlus className="button-icon" />
          Add User
        </button>
      </div>

      <div className="card users-table-card">
        <div className="table-responsive">
          <table className="users-table">
            <thead>
              <tr>
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
                <th className="table-header">Password</th>
                <th className="table-header">Permissions</th>
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
                  <tr key={user.username} className="table-row">
                    <td className="table-cell username-cell">
                      {editingUser === user.username ? (
                        <input
                          className="edit-input"
                          value={editForm.username}
                          onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                        />
                      ) : (
                        <span className="username-text">{user.username}</span>
                      )}
                    </td>
                    <td className="table-cell password-cell">
                      {editingUser === user.username ? (
                        <div className="password-input-container">
                          <input
                            className="edit-input"
                            type={showPasswords[user.username] ? "text" : "password"}
                            value={editForm.password}
                            onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                          />
                          <button 
                            className="password-toggle"
                            onClick={() => toggleUserPasswordVisibility(user.username)}
                            type="button"
                            aria-label={showPasswords[user.username] ? "Hide password" : "Show password"}
                          >
                            {showPasswords[user.username] ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      ) : (
                        <div className="password-display">
                          <span className="password-text">
                            {showPasswords[user.username] ? user.password : "••••••••"}
                          </span>
                          
                        </div>
                      )}
                    </td>
                    <td className="table-cell permissions-cell">
                      {editingUser === user.username ? (
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
                    <td className="table-cell date-cell">
                      <span className="date-text">{formatDate(user.createdAt)}</span>
                    </td>
                    <td className="table-cell date-cell">
                      <span className="date-text">{formatDate(user.updatedAt)}</span>
                    </td>
                    <td className="table-cell actions-cell">
                      <div className="action-buttons">
                        {editingUser === user.username ? (
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
                              className="icon-button primary-button"
                              onClick={() => startEditing(user)}
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              className="icon-button danger-button"
                              onClick={() => handleDeleteUser(user.username)}
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="empty-row">
                  <td colSpan="6" className="empty-cell">
                    <div className="empty-state">
                      <div className="empty-image">📭</div>
                      <p className="empty-text">No users found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;