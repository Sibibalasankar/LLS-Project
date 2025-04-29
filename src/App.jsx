import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import AdminLogin from "./pages/Admin_login";
import UserLogin from "./pages/User_login";
import AuditPlanCreation from "./pages/AuditPlanCreation";
import AuditPlanDetails from "./pages/AuditPlanDetails";
import AuditObservation from "./pages/AuditObservation";
import ObservationDetails from "./pages/Observationdetails";
import AuditReport from "./pages/ObservationSheet";
import ActionReport from "./pages/ActionReport";
import NotificationsPage from "./pages/NotificationsPage";
import NewActionForm from "./pages/NewActionForm";
import UserAuditNcCloser from "./pages/UserAuditNcCloser";
import AuditNcUserView from "./pages/AuditNcUserView"; 
import UserAuditPlanSheet from "./pages/UserAuditPlanSheet";
import UserAuditObservation from "./pages/UserAuditObservation";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/audit-report" element={<AuditReport />} />

      {/* Admin Routes */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin-dashboard/notifications" element={<NotificationsPage />} />
      <Route path="/admin-dashboard/audit-plan-creation" element={<AuditPlanCreation />} />
      <Route path="/admin-dashboard/audit-observation" element={<AuditObservation />} />
      <Route path="/admin-dashboard/observation-details/:departmentName" element={<ObservationDetails />} />
      <Route path="/admin-dashboard/action-report" element={<ActionReport />} />
      <Route path="/action-report" element={<NewActionForm  />} />
      
      {/* User Routes */}
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/user-dashboard/notifications" element={<NotificationsPage />} />
      <Route path="/user-dashboard/user-audit-nc-closer" element={<UserAuditNcCloser />} />
      <Route path="/user-dashboard/user-audit-nc-view" element={<AuditNcUserView />} />
      <Route path="/user-dashboard/user-audit-plan-sheet" element={<UserAuditPlanSheet />} />
      <Route path="/user-audit-observations" element={<UserAuditObservation />} />

      {/* Redirects */}
      <Route path="/admin" element={<Navigate to="/admin-login" replace />} />
      <Route path="/user" element={<Navigate to="/user-login" replace />} />
      <Route path="/dashboard" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
