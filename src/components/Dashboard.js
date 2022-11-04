import Chat from "./Chat";
import FileManage from "./FileManage";
import "../styles/dashboard.css";
import LockOpenIcon from "@mui/icons-material/LockOpen";

const Dashboard = () => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2
          style={{
            marginLeft: "60px",
          }}
        >
          ⚡Secure Chat System v0.1
        </h2>
        {/* login button */}
        <div className="login">
          <button className="login-btn">
            <LockOpenIcon
              style={{
                fontSize: "18px",
                marginRight: "5px",
                position: "relative",
                top: "2px",
              }}
            />
            Login
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="file-area">
          <FileManage />
        </div>
        <div className="chat-area">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
