import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import UserForm from "./UserForm";
import UserTable from "./UserTable";
import "../assets/styles/UserProfile.css";

const UserProfile = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    password: "",
    empId: "",
    empName: "",
    department: "",
    designation: "",
    certifiedDate: "",
    permissions: []
  });
  const [showPasswords, setShowPasswords] = useState({});
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    password: "",
    empId: "",
    empName: "",
    department: "",
    designation: "",
    certifiedDate: "",
    permissions: []
  });
  const [filter, setFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });
  const [selectAll, setSelectAll] = useState(false);
  const [activeTab, setActiveTab] = useState("credentials");
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  const permissionOptions = [
    "auditPlanSheet",
    "auditObservation",
    "auditNCCloser",
    "auditNCApproval",
    "isoManual"
  ];

  useEffect(() => {
    // Load users
    const storedUsers = JSON.parse(localStorage.getItem("userCredentials")) || [];
    setUsers(storedUsers);

    const initialShowPasswords = {};
    storedUsers.forEach(user => {
      initialShowPasswords[user.empId] = false;
    });
    setShowPasswords(initialShowPasswords);

    // Load departments from localStorage
    const storedDepartments = JSON.parse(localStorage.getItem("departments")) || [];
    setDepartments(storedDepartments.map(dept => dept.name));

    const storedDesignations = JSON.parse(localStorage.getItem("designations")) || [
      "GET (Graduate Engineering Training)",
      "Junior Engineer",
      "Assistant Engineer",
      "Engineer",
      "Senior Engineer",
      "Assistant Manager",
      "Deputy Manager",
      "Manager",
      "Senior Manager",
      "Assistant General Manager",
      "Deputy General Manager",
      "General Manager",
      "Senior General Manager"
    ];

    setDesignations(storedDesignations);
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
    if (!newUser.password || !newUser.empId || !newUser.empName) {
      return alert("Password, Employee ID and Name are required!");
    }

    if (users.some(user => user.empId === newUser.empId)) {
      return alert("Employee ID already exists!");
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
    setNewUser({
      password: "",
      empId: "",
      empName: "",
      department: "",
      designation: "",
      certifiedDate: "",
      permissions: []
    });
    setShowPasswords({ ...showPasswords, [userToAdd.empId]: false });
  };

  const handleDeleteUser = (empIdToDelete) => {
    if (!window.confirm(`Are you sure you want to delete employee ${empIdToDelete}?`)) return;

    const updatedUsers = users.filter((user) => user.empId !== empIdToDelete);
    localStorage.setItem("userCredentials", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    const newShowPasswords = { ...showPasswords };
    delete newShowPasswords[empIdToDelete];
    setShowPasswords(newShowPasswords);
  };

  const startEditing = (user) => {
    setEditingUser(user.empId);
    setEditForm({
      password: user.password,
      empId: user.empId,
      empName: user.empName,
      department: user.department,
      designation: user.designation,
      certifiedDate: user.certifiedDate,
      permissions: user.permissions || []
    });
  };

  const cancelEditing = () => {
    setEditingUser(null);
    setEditForm({
      password: "",
      empId: "",
      empName: "",
      department: "",
      designation: "",
      certifiedDate: "",
      permissions: []
    });
  };

  const handleEditUser = () => {
    if (!editForm.password || !editForm.empId || !editForm.empName) {
      return alert("Password, Employee ID and Name are required!");
    }

    if (editForm.empId !== editingUser && users.some(user => user.empId === editForm.empId)) {
      return alert("Employee ID already exists!");
    }

    const updatedUsers = users.map(user => {
      if (user.empId === editingUser) {
        return {
          ...user,
          password: editForm.password,
          empId: editForm.empId,
          empName: editForm.empName,
          department: editForm.department,
          designation: editForm.designation,
          certifiedDate: editForm.certifiedDate,
          permissions: editForm.permissions,
          updatedAt: new Date().toISOString()
        };
      }
      return user;
    });

    localStorage.setItem("userCredentials", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setEditingUser(null);
    setEditForm({
      password: "",
      empId: "",
      empName: "",
      department: "",
      designation: "",
      certifiedDate: "",
      permissions: []
    });

    if (editForm.empId !== editingUser) {
      const newShowPasswords = { ...showPasswords };
      newShowPasswords[editForm.empId] = newShowPasswords[editingUser];
      delete newShowPasswords[editingUser];
      setShowPasswords(newShowPasswords);
    }
  };

  const toggleUserPasswordVisibility = (empId) => {
    setShowPasswords({
      ...showPasswords,
      [empId]: !showPasswords[empId]
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
    user.empId.toLowerCase().includes(filter.toLowerCase()) ||
    user.empName.toLowerCase().includes(filter.toLowerCase()) ||
    user.department.toLowerCase().includes(filter.toLowerCase()) ||
    user.designation.toLowerCase().includes(filter.toLowerCase()) ||
    (user.certifiedDate && user.certifiedDate.toLowerCase().includes(filter.toLowerCase())) ||
    user.createdAt.toLowerCase().includes(filter.toLowerCase()) ||
    user.updatedAt.toLowerCase().includes(filter.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
        <h2 className="title">Employee Management System</h2>
        <div className="header-actions">
          <div className="tabs">
            <button
              className={`tab-button ${activeTab === "credentials" ? "active" : ""}`}
              onClick={() => setActiveTab("credentials")}
            >
              Credentials
            </button>
            <button
              className={`tab-button ${activeTab === "details" ? "active" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              Employee Details
            </button>
          </div>
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              className="search-input"
              type="text"
              placeholder="Search employees..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      <UserForm
        activeTab={activeTab}
        newUser={newUser}
        setNewUser={setNewUser}
        handleAddUser={handleAddUser}
        departments={departments}
        designations={designations}
        permissionOptions={permissionOptions}
        handlePermissionChange={handlePermissionChange}
        handleSelectAllChange={handleSelectAllChange}
        selectAll={selectAll}
      />

      <UserTable
        activeTab={activeTab}
        filteredUsers={filteredUsers}
        sortConfig={sortConfig}
        handleSort={handleSort}
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
    </div>
  );
};

export default UserProfile;