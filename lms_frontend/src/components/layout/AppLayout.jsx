import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const drawerWidth = 260;

const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* ---------- TOP BAR ---------- */}
      <Topbar
        drawerWidth={drawerWidth}
        onMenuClick={() => setMobileOpen(true)}
      />

      {/* ---------- SIDEBAR ---------- */}
      <Sidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* ---------- MAIN CONTENT ---------- */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { md: `${drawerWidth}px` },
          px: { xs: 2, md: 4 },
          pb: 4,
        }}
      >
        {/* Spacer for fixed Topbar */}
        <Toolbar />

        {/* Page content container */}
        <Box
          sx={{
            maxWidth: 1400,
            mx: "auto",
            width: "100%",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
