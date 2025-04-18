import { useNavigate } from "react-router-dom";
import "../assets/styles/login.css";
import Header from "../components/Header";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    // Store the user role in localStorage
    localStorage.setItem("role", role);
    navigate(`/${role}`); // Navigate to the respective page based on the role
  };

  return (
    <>
      <Header />
      <div className="container-fluid main_div">
        <div className="top"></div>
        <div className="child1">
          <button className="btn_login" onClick={() => handleLogin("admin")}>
            Admin Login
          </button>
          <button className="btn_login" onClick={() => handleLogin("user")}>
            User Login
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
