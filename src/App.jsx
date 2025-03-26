import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import UserLogin from "./pages/User_login";
import Dashboard from "./components/Dashboard";
import AdminLogin from "./pages/Admin_login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/user" element={<UserLogin />} />
      <Route path="/admin" element={<AdminLogin />} />
      
      {/* Protect Dashboard Route */}
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
    </Routes>
  );
}

export default App;
