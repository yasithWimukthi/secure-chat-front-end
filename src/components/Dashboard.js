import Chat from "./Chat";
import FileManage from "./FileManage";
import "../styles/dashboard.css";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useAuth0 } from "@auth0/auth0-react";

const Dashboard = () => {
  const {
    loginWithPopup,
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    isLoading,
  } = useAuth0();
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
          {isAuthenticated ? (
            <>
              <div>
                <img className="profile-dp" src={user.picture} alt={"dp"} />
              </div>
              <div className="profile">
                <div>
                  <span>{user.name}</span>
                </div>
              </div>
              <button
                className="login-btn"
                onClick={() => {
                  logout();
                }}
              >
                <LockOpenIcon
                  style={{
                    fontSize: "18px",
                    marginRight: "5px",
                    position: "relative",
                    top: "2px",
                  }}
                />
                Logout
              </button>
            </>
          ) : null}
        </div>
      </div>

      {isAuthenticated ? (
        <div className="dashboard-content">
          <div className="file-area">
            <FileManage />
          </div>
          <div className="chat-area">
            <Chat />
          </div>
        </div>
      ) : (
        <div className="login-msg">
          <div>
            <h2>Please login to continue</h2>
          </div>
          <div>
            <button
              className="login-btn"
              onClick={() => {
                loginWithRedirect();
              }}
            >
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
      )}
    </div>
  );
};

export default Dashboard;
