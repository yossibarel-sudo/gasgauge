import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import EquipmentPage from "./pages/EquipmentPage";

export default function App() {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1 }}
          >
            GasGauge
          </Typography>

          <Button
            color="inherit"
            component={Link}
            to="/"
          >
            Dashboard
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/equipment"
          >
            Equipment
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/equipment" element={<EquipmentPage />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}