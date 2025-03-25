import { useNavigate } from "react-router-dom";
import "../assets/styles/login.css";
import Header from "../components/Header";

const Login = () => {
  const navigate = useNavigate(); // ✅ Ensure useNavigate() is inside <Router>

  return (
    <>
      <Header />
      <div className="container-fluid main_div">
        <div className="top"></div>
        <div className="child1">
          <button className="btn_login" onClick={() => navigate("/admin")}>
            Admin Login
          </button>
          <button className="btn_login" onClick={() => navigate("/user")}>
            User Login
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
