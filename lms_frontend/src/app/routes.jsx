import { useRoutes } from "react-router-dom";

import Login from "../features/auth/Login";
import ProtectedRoute from "../routes/ProtectedRoute";
import RoleGuard from "../routes/RoleGuard";

import SystemAdminDashboard from "../features/dashboards/SystemAdminDashboard";
import CollegeAdminDashboard from "../features/dashboards/CollegeAdminDashboard";
import TeacherDashboard from "../features/dashboards/TeacherDashboard";
import StudentDashboard from "../features/dashboards/StudentDashboard";
import Unauthorized from "../features/dashboards/Unauthorized";





const AppRoutes = () =>
  useRoutes([
    {
      path: "/",
      element: <Login />,
    },

    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/system-admin",
          element: (
            <RoleGuard allowedRoles={["SYSTEM_ADMIN"]}>
              <SystemAdminDashboard />
            </RoleGuard>
          ),
        },
        {
          path: "/college-admin",
          element: (
            <RoleGuard allowedRoles={["COLLEGE_ADMIN"]}>
              <CollegeAdminDashboard />
            </RoleGuard>
            ),
        },
        {
        path: "/teacher",
        element: (
          <RoleGuard allowedRoles={["TEACHER"]}>
            <TeacherDashboard />
          </RoleGuard>
          ),
        },
        {
        path: "/student",
        element: (
          <RoleGuard allowedRoles={["STUDENT"]}>
            <StudentDashboard />
          </RoleGuard>
          ),
        },
        {
        path: "/unauthorized",
        element: <Unauthorized />,
        },




      ],
    },
  ]);

export default AppRoutes;
