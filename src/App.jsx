import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import UserLogin from "./pages/User_login";
import Dashboard from "./components/Dashboard";
import Admin_login from "./pages/Admin_login";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/user" element={<UserLogin />} />
      <Route path="/admin" element={<Admin_login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
