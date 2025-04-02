import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import AdminLogin from "./pages/Admin_login";
import UserLogin from "./pages/User_login";
import ProtectedRoute from "./components/ProtectedRoute";
import AuditPlanCreation from "./pages/AuditPlanCreation";
import AuditPlanDetails from "./pages/AuditPlanDetails";
import AuditObservation from "./pages/AuditObservation";
import ObservationDetails from "./pages/Observationdetails";


function App() {
  return (
    <Routes>
      {/* Default Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
<Route path="/audit-observation" element={<AuditObservation />} />
<Route path="/observation-details/:departmentName" element={<ObservationDetails />} />
      {/* Audit Plan Routes (Inside Admin Only) */}
      <Route path="/audit-plan-creation" element={<AuditPlanCreation />} />


      {/* User Routes */}
      <Route path="/user" element={<UserLogin />} />
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Handle "/dashboard" Route */}
      <Route path="/dashboard" element={<Navigate to="/login" replace />} />

      {/* Catch-All Route (404) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
