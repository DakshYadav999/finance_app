import { useMemo } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { CssBaseline,Box } from "@mui/material";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Navbar from "@/scenes/navbar";
import Dashboard from "@/scenes/dashboard";
import Predictions from "@/scenes/predictions"
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
    display: "flex",
    flexDirection: "column",
  }}
>
  <Navbar />

  <Box sx={{ flex: 1, minHeight: 0 }}>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/predictions" element={<Predictions />} />
    </Routes>
  </Box>
</Box>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;