import "../assets/styles/Dashboard.css";

const Dashboard = () => {
  return (
    <>
      <div className=" container-fluid main_body">
        <div className="top_bar_nav">
          <h2>LLS Audit Management System</h2>
        </div>
        <div className="row main_child">
          <div className="side_bar col-3">
            <button>Sample button</button>
            <button>Sample button</button>
            <button>Sample button</button>
            <button>Sample button</button>
            <button>Sample button</button>
            <button>Sample button</button>
            <button>Sample button</button>
            <button>Sample button</button>
          </div>
          <div className="child_body col-9"></div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
