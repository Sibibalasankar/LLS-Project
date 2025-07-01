import { useNavigate } from "react-router-dom";
import "../assets/styles/login.css";
import Header from "../components/Header";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    // Store the user role in localStorage
    localStorage.setItem("role", role);
    navigate(`/${role}`);
  };

  return (
    <>
      <Header/>
      <div className="login-container">
        
        <div className="login-background"></div>
        <div className="login-content">
          
          <h1 className="login-title">Welcome to LLS</h1>
          <p className="login-subtitle">Please select your role to continue</p>
          <div className="login-buttons">
            <button 
              className="login-btn admin-btn" 
              onClick={() => handleLogin("admin")}
            >
              Admin Login
            </button>
            
            <button 
              className="login-btn user-btn" 
              onClick={() => handleLogin("user")}
            >
              User Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
