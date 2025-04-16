import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userPermissions"); // Clear permissions on logout
    localStorage.removeItem("userDepartment"); // Clear department on logout
    setUser(null);
  };

 // In your AuthContext.js
const isAuthenticated = () => {
  return !!localStorage.getItem("authToken") && !!localStorage.getItem("role");
};

const login = (token, role, username) => {
  localStorage.setItem("authToken", token);
  localStorage.setItem("role", role);
  localStorage.setItem("currentUser", username); // <-- Store username
  setUser({ token, role });
};


  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);