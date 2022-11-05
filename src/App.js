import "./App.css";
import { ThemeProvider, createTheme, CircularProgress } from "@mui/material";
import Dashboard from "./components/Dashboard";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { isLoading } = useAuth0();

  return (
    <div className="App">
      <ThemeProvider
        theme={createTheme({
          palette: {
            mode: "dark",
          },
        })}
      >
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <CircularProgress
              style={{
                marginRight: "10px",
              }}
            />

            <h1>Loading...</h1>
          </div>
        ) : (
          <Dashboard />
        )}
      </ThemeProvider>
    </div>
  );
}

export default App;
