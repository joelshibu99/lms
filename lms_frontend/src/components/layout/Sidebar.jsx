import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const SidebarContent = ({ links, onItemClick }) => (
  <>
    <Toolbar />

    <List sx={{ px: 1 }}>
      {links.map((item) => (
        <ListItemButton
          key={item.to}
          component={NavLink}
          to={item.to}
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={onItemClick}
          sx={{
            position: "relative",
            borderRadius: 2,
            mb: 0.5,
            py: 1.2,
            color: "text.secondary",

            "& .MuiListItemIcon-root": {
              minWidth: 36,
              color: "inherit",
            },

            "&.active": {
              color: "white",
              bgcolor: "rgba(59,130,246,0.15)",
              boxShadow: "inset 3px 0 0 #3b82f6",
            },

            "&:hover": {
              bgcolor: "rgba(255,255,255,0.06)",
            },
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          />
        </ListItemButton>
      ))}
    </List>

    <Divider sx={{ my: 2, opacity: 0.2 }} />
  </>
);

const Sidebar = ({ drawerWidth, mobileOpen, onClose }) => {
  const { auth } = useAuth();

  /**
   * 🔐 FINAL ROLE-BASED SIDEBAR CONFIG
   * Single source of truth
   */
  const sidebarConfig = {
    SYSTEM_ADMIN: [
      {
        label: "Dashboard",
        icon: <AdminPanelSettingsIcon />,
        to: "/system-admin",
      },
      {
        label: "Colleges",
        icon: <SchoolIcon />,
        to: "/system-admin/colleges",
      },
    ],

    COLLEGE_ADMIN: [
      {
        label: "Dashboard",
        icon: <DashboardIcon />,
        to: "/college-admin",
      },
      {
        label: "Users",
        icon: <PeopleIcon />,
        to: "/college-admin/users",
      },
      {
        label: "Courses",
        icon: <MenuBookIcon />,
        to: "/courses",
      },
    ],

    TEACHER: [
      {
        label: "Dashboard",
        icon: <DashboardIcon />,
        to: "/teacher",
      },
      {
        label: "Attendance",
        icon: <EventAvailableIcon />,
        to: "/teacher/attendance",
      },
      {
        label: "Courses",
        icon: <MenuBookIcon />,
        to: "/courses",
      },
    ],

    STUDENT: [
      {
        label: "Dashboard",
        icon: <DashboardIcon />,
        to: "/student",
      },
      {
        label: "Courses",
        icon: <MenuBookIcon />,
        to: "/courses",
      },
    ],
  };

  const links = sidebarConfig[auth?.role] || [];

  return (
    <>
      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            bgcolor: "#020617",
          },
        }}
      >
        <SidebarContent links={links} onItemClick={onClose} />
      </Drawer>

      {/* Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            bgcolor: "#020617",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          },
        }}
      >
        <SidebarContent links={links} />
      </Drawer>
    </>
  );
};

export default Sidebar;
