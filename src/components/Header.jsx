import "../assets/styles/Header.css";
import '../assets/images/lls_logo.png'

const Header = () => {
  return (
    <>
      <div className="Nav_bar">
        <div className="child_bar">
          <div className="Logo" ></div>
          <div className="Title">
            <h2>Life Insurance Company</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
