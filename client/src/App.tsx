import { useMemo } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { CssBaseline,Box } from "@mui/material";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Navbar from "@/scenes/navbar";
import Dashboard from "@/scenes/dashboard";

function App() {
  const theme = useMemo(() => createTheme(themeSettings), []);

  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline /> 
            <Box
                sx={{
                  width: "100%",
                  height: "100vh",
                  padding: 2,
                   backgroundColor: "background.default",
              }}
            >
              <Navbar />
              <Routes>
                <Route path="/" element={<Dashboard/>} />
                 <Route path="/predictions" element={<div>Predictions Page</div>} />
              </Routes>
            </Box>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;