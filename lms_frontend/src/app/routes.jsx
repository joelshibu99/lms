import { useRoutes } from "react-router-dom";

import Login from "../features/auth/Login";
import ProtectedRoute from "../routes/ProtectedRoute";
import RoleGuard from "../routes/RoleGuard";

import AppLayout from "../components/layout/AppLayout";

import SystemAdminDashboard from "../features/dashboards/SystemAdminDashboard";
import CollegeAdminDashboard from "../features/dashboards/CollegeAdminDashboard";
import TeacherDashboard from "../features/dashboards/TeacherDashboard";
import StudentDashboard from "../features/dashboards/StudentDashboard";
import AttendancePage from "../features/dashboards/AttendancePage";
import Unauthorized from "../features/dashboards/Unauthorized";

import CoursesPage from "../features/courses/CoursesPage";
import SubjectsPage from "../features/subjects/SubjectsPage";
import CollegeUsersPage from "../features/users/CollegeUsersPage"

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
          element: <AppLayout />,
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

            // ✅ FIXED USERS ROUTE
            {
              path: "/college-admin/users",
              element: (
                <RoleGuard allowedRoles={["COLLEGE_ADMIN"]}>
                  <CollegeUsersPage />
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
              path: "/teacher/attendance",
              element: (
                <RoleGuard allowedRoles={["TEACHER"]}>
                  <AttendancePage />
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
              path: "/courses",
              element: (
                <RoleGuard
                  allowedRoles={[
                    "COLLEGE_ADMIN",
                    "TEACHER",
                    "STUDENT",
                  ]}
                >
                  <CoursesPage />
                </RoleGuard>
              ),
            },

            {
              path: "/courses/:courseId/subjects",
              element: (
                <RoleGuard allowedRoles={["COLLEGE_ADMIN"]}>
                  <SubjectsPage />
                </RoleGuard>
              ),
            },

            {
              path: "/unauthorized",
              element: <Unauthorized />,
            },
          ],
        },
      ],
    },
  ]);

export default AppRoutes;
