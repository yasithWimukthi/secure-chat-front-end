import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="App">
      <ThemeProvider
        theme={createTheme({
          palette: {
            mode: "dark",
          },
        })}
      >
        <Dashboard />
      </ThemeProvider>
    </div>
  );
}

export default App;
