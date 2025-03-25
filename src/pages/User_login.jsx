import "../assets/styles/User_login.css";
import Header from "../components/Header";

const User_login = () => {
  return (
    <>
    
      <div className="container-fluid main_login_div">
        <div className="form_div">
          <div className="login_title">
            <p className="login_subtitle">Admin Login</p>
          </div>

          <form className="form_elements">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" />
            <button className="user_login_btn">Submit</button>
            <div className="back_button">
              <i class="bi bi-arrow-left"></i>Back
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default User_login;
