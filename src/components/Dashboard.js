import "../styles/dashboard.css";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useAuth0 } from "@auth0/auth0-react";
import { User } from "./User";
import { Admin } from "./Admin";

const Dashboard = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
    useAuth0();

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
          ⚡Secure System v0.1
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
        <div
          className="dashboard-content"
          style={{
            marginTop: "100px",
            marginLeft: "60px",
          }}
        >
          {user.role[0] === "admin" ? <Admin /> : <User />}
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
