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
      <Topbar
        drawerWidth={drawerWidth}
        onMenuClick={() => setMobileOpen(true)}
      />

      <Sidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { md: `${drawerWidth}px` },
          pt: 8, // space for Topbar
          px: { xs: 2, md: 4 },
          pb: 4,
        }}
      >
        {/* CONTENT CONTAINER */}
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
