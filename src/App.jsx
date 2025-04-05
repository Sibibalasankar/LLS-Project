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
import AuditReport from "./pages/ObservationSheet"; 
import ActionReport from "./pages/ActionReport";

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
      <Route path="/audit-plan-creation" element={<AuditPlanCreation />} />
      <Route path="/action-report" element={<ActionReport />} />

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

      {/* Add the Audit Report Route */}
      <Route path="/audit-report" element={<AuditReport />} />

      {/* Redirect & Catch All */}
      <Route path="/dashboard" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
