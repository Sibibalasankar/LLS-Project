import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ element, adminOnly = false }) => {
  const { auth } = useAuth();

  if (!auth.isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && auth.role !== "admin") return <Navigate to="/dashboard" replace />;

  return element;
};

export default ProtectedRoute;
