import React, { useState, useEffect } from "react";
import "../assets/styles/AdminPanel.css";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", password: "" });

  // Load Users from localStorage when component mounts
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  // Add New User
  const handleAddUser = () => {
    if (!newUser.username.trim() || !newUser.password.trim()) {
      alert("Username and password cannot be empty!");
      return;
    }

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setNewUser({ username: "", password: "" });
    alert("User added successfully!");
  };

  // Delete User
  const handleDeleteUser = (username) => {
    const updatedUsers = users.filter((user) => user.username !== username);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    alert("User deleted successfully!");
  };

  return (
    <div className="admin_panel">
      <h2>Admin Panel - Manage Users</h2>

      {/* Add New User */}
      <div className="add_user_form">
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>

      {/* User List */}
      <h3>Users List</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.username} 
            <button onClick={() => handleDeleteUser(user.username)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
