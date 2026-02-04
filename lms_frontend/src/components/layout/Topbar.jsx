import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

/* ---------- Page title resolver ---------- */
const getPageTitle = (pathname) => {
  if (pathname.startsWith("/teacher/attendance")) return "Attendance";
  if (pathname.startsWith("/teacher")) return "Teacher Dashboard";
  if (pathname.startsWith("/student")) return "Student Dashboard";
  if (pathname.startsWith("/college-admin")) return "College Admin Dashboard";
  if (pathname.startsWith("/system-admin")) return "System Admin Dashboard";
  return "Dashboard";
};

const Topbar = ({ drawerWidth, onMenuClick }) => {
  const { auth, logout } = useAuth();
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        height: 64,
        bgcolor: "rgba(15,23,42,0.75)", // dark glass
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        color: "text.primary",
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: 64,
          px: { xs: 2, md: 3 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* ---------- Left ---------- */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{
              display: { md: "none" },
              color: "text.primary",
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              letterSpacing: "-0.4px",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* ---------- Right ---------- */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {auth?.role && (
            <Chip
              label={auth.role}
              size="small"
              sx={{
                bgcolor: "rgba(59,130,246,0.15)",
                color: "#93c5fd",
                fontWeight: 600,
                letterSpacing: "0.3px",
                height: 26,
              }}
            />
          )}

          <Button
            size="small"
            onClick={logout}
            startIcon={<LogoutIcon fontSize="small" />}
            sx={{
              textTransform: "none",
              color: "text.secondary",
              fontWeight: 500,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.06)",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
