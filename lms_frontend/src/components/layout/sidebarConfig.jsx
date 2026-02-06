import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";

export const sidebarConfig = {
  SYSTEM_ADMIN: [
    {
      label: "Dashboard",
      path: "/system/dashboard",
      icon: <DashboardIcon />,
    },
  ],

  COLLEGE_ADMIN: [
    {
      label: "Dashboard",
      path: "/college/dashboard",
      icon: <DashboardIcon />,
    },
    {
      label: "Courses",
      path: "/courses",
      icon: <MenuBookIcon />,
    },
  ],

  TEACHER: [
    {
      label: "Dashboard",
      path: "/teacher", // ✅ FIXED
      icon: <DashboardIcon />,
    },
    {
      label: "Courses",
      path: "/courses", // ✅ Goes to CoursesPage
      icon: <MenuBookIcon />,
    },
  ],

  STUDENT: [
    {
      label: "Dashboard",
      path: "/student/dashboard",
      icon: <DashboardIcon />,
    },
  ],
};
