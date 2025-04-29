import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaUserPlus, FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";

const UserProfile = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ 
    username: "", 
    password: "", 
    createdAt: null,
    updatedAt: null 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ username: "", password: "" });
  const [filter, setFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("userCredentials")) || [];
    setUsers(storedUsers);
    
    const initialShowPasswords = {};
    storedUsers.forEach(user => {
      initialShowPasswords[user.username] = false;
    });
    setShowPasswords(initialShowPasswords);
  }, []);

  const handleAddUser = () => {
    if (!newUser.username || !newUser.password) {
      return alert("Both username and password are required!");
    }

    if (users.some(user => user.username === newUser.username)) {
      return alert("Username already exists!");
    }

    const timestamp = new Date().toISOString();
    const userToAdd = {
      ...newUser,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const updatedUsers = [...users, userToAdd];
    localStorage.setItem("userCredentials", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setNewUser({ username: "", password: "", createdAt: null, updatedAt: null });
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
    setEditForm({ username: user.username, password: user.password });
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setEditForm({ username: "", password: "" });
  };

  const handleEditUser = () => {
    if (!editForm.username || !editForm.password) {
      return alert("Both username and password are required!");
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
          updatedAt: new Date().toISOString()
        };
      }
      return user;
    });

    localStorage.setItem("userCredentials", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setEditingUser(null);
    setEditForm({ username: "", password: "" });

    // Update showPasswords state if username changed
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

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>User Credentials Manager</h2>

      <div style={styles.formContainer}>
        <h3 style={styles.sectionTitle}>Add New User</h3>
        <input
          style={styles.input}
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          className="mb-3"
        />
        <div style={styles.passwordInputContainer}>
          <input
            style={styles.input}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <button 
            style={styles.eyeButton}
            onClick={togglePasswordVisibility}
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <button style={styles.addButton} onClick={handleAddUser}>
          <FaUserPlus style={{ marginRight: "8px" }} />
          Add User
        </button>
      </div>

      <div style={styles.controls}>
        <div style={styles.searchContainer}>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search users..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th 
                style={styles.tableHeader} 
                onClick={() => handleSort("username")}
              >
                Username {sortConfig.key === "username" && (
                  <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th style={styles.tableHeader}>Password</th>
              <th 
                style={styles.tableHeader} 
                onClick={() => handleSort("createdAt")}
              >
                <MdDateRange style={{ verticalAlign: "middle", marginRight: "5px" }} />
                Created {sortConfig.key === "createdAt" && (
                  <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th 
                style={styles.tableHeader} 
                onClick={() => handleSort("updatedAt")}
              >
                <MdDateRange style={{ verticalAlign: "middle", marginRight: "5px" }} />
                Last Updated {sortConfig.key === "updatedAt" && (
                  <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                )}
              </th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.username} style={styles.tableRow}>
                  <td style={styles.tableCell}>
                    {editingUser === user.username ? (
                      <input
                        style={styles.editInput}
                        value={editForm.username}
                        onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                      />
                    ) : (
                      <strong>{user.username}</strong>
                    )}
                  </td>
                  <td style={styles.tableCell}>
                    {editingUser === user.username ? (
                      <input
                        style={styles.editInput}
                        type="password"
                        value={editForm.password}
                        onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                      />
                    ) : (
                      <span style={styles.passwordText}>
                        {showPasswords[user.username] ? user.password : "••••••••"}
                        <button 
                          style={styles.eyeButton}
                          onClick={() => toggleUserPasswordVisibility(user.username)}
                          type="button"
                          aria-label={showPasswords[user.username] ? "Hide password" : "Show password"}
                        >
                          {showPasswords[user.username] ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </span>
                    )}
                  </td>
                  <td style={styles.tableCell}>
                    <span style={styles.dateText}>{formatDate(user.createdAt)}</span>
                  </td>
                  <td style={styles.tableCell}>
                    <span style={styles.dateText}>{formatDate(user.updatedAt)}</span>
                  </td>
                  <td style={styles.tableCell} >
                    {editingUser === user.username ? (
                      <>
                        <button 
                          style={styles.saveButton}
                          onClick={handleEditUser}
                        >
                          <FaCheck />
                        </button>
                        <button 
                          style={styles.cancelButton}
                          onClick={cancelEditing}
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          style={styles.editButton}
                          onClick={() => startEditing(user)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          style={styles.deleteButton}
                          onClick={() => handleDeleteUser(user.username)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ ...styles.tableCell, textAlign: "center" }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f5f7fa",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: "2rem",
    fontSize: "2rem",
    fontWeight: "600",
  },
  sectionTitle: {
    color: "#3498db",
    marginTop: "0",
    marginBottom: "1rem",
    fontSize: "1.2rem",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    marginBottom: "2rem",
  },
  passwordInputContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
  },
  input: {
    padding: "0.8rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
    transition: "border 0.3s",
    outline: "none",
    width: "100%",
    ":focus": {
      borderColor: "#3498db",
    },
  },
  editInput: {
    padding: "0.5rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "0.9rem",
    width: "100%",
  },
  eyeButton: {
    position: "absolute",
    right: "10px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#7f8c8d",
    fontSize: "1rem",
    padding: "0.5rem",
    ":hover": {
      color: "#3498db",
    },
  },
  addButton: {
    padding: "0.8rem",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "background-color 0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ":hover": {
      backgroundColor: "#2980b9",
    },
  },
  controls: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "1rem",
  },
  searchContainer: {
    flex: 1,
    marginRight: "1rem",
  },
  searchInput: {
    padding: "0.8rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
    width: "100%",
    maxWidth: "400px",
  },
  tableContainer: {
    overflowX: "auto",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    padding: "1rem",
    textAlign: "left",
    backgroundColor: "#f1f5f9",
    color: "#2c3e50",
    fontWeight: "600",
    cursor: "pointer",
    userSelect: "none",
    ":hover": {
      backgroundColor: "#e2e8f0",
    },
  },
  tableRow: {
    borderBottom: "1px solid #e2e8f0",
    ":hover": {
      backgroundColor: "#f8fafc",
    },
  },
  tableCell: {
    padding: "1rem",
    verticalAlign: "middle",
  },
  passwordText: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontFamily: "monospace",
  },
  dateText: {
    fontSize: "0.9rem",
    color: "#64748b",
  },
  actions: {
    display: "flex",
    gap: "0.5rem",
  },
  editButton: {
    padding: "0.5rem",
    backgroundColor: "#f59e0b",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.3s",
    ":hover": {
      backgroundColor: "#d97706",

    },
    marginRight:"10px",
  },
  saveButton: {
    padding: "0.5rem",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.3s",
    ":hover": {
      backgroundColor: "#059669",
    },
  },
  cancelButton: {
    padding: "0.5rem",
    backgroundColor: "#64748b",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.3s",
    ":hover": {
      backgroundColor: "#475569",
    },
  },
  deleteButton: {
    padding: "0.5rem",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.3s",
    ":hover": {
      backgroundColor: "#dc2626",
    },
  },
 
};

export default UserProfile;