import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";  // ✅ Import Login component
import Dashboard from "./components/Dashboard";
import AdminLogin from "./pages/Admin_login";
import UserLogin from "./pages/User_login";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext"; // ✅ Make sure this path is correct


function App() {
  return (
    <Routes>
      {/* ✅ Default Route (Home Page) */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} /> {/* ✅ Fix: Add /login route */}

      {/* Other Routes */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/user" element={<UserLogin />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
