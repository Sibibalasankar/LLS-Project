import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ requiredRole, children }) => {
  const { user, isAuthenticated } = useAuth(); // Add isAuthenticated from context

  // Check both context user and localStorage for fallback
  const role = user?.role || localStorage.getItem("role");
  
  if (!isAuthenticated?.() || role !== requiredRole) {
    // Redirect to login with return URL for better UX
    return <Navigate to={`/login?redirect=${window.location.pathname}`} replace />;
  }

  // Additional check for user-specific permissions if needed
  if (requiredRole === "user" && !localStorage.getItem("userPermissions")) {
    return <Navigate to="/user" replace />;
  }

  return children;
};

export default ProtectedRoute;