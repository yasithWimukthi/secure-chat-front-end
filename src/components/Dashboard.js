import Chat from "./Chat";
import FileManage from "./FileManage";
import "../styles/dashboard.css";

const Dashboard = () => {
  return (
    <div>
      <h2
        style={{
          marginLeft: "60px",
        }}
      >
        ⚡Secure Chat System v0.1
      </h2>
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
