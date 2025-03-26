import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    return token ? { isAuthenticated: true, role } : { isAuthenticated: false, role: null };
  });

  const login = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role); // ✅ Store the role
    setAuth({ isAuthenticated: true, role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setAuth({ isAuthenticated: false, role: null });
    window.location.href = "/login"; // ✅ Redirect to login after logout
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
