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
import CollegeUsersPage from "../features/users/CollegeUsersPage";
import CourseEnrollmentsPage from "../features/courses/CourseEnrollmentsPage";

import TeacherMarksPage from "../features/teacher/TeacherMarksPage";
import TeacherAIReportsPage from "../features/teacher/TeacherAIReportsPage";
import TeacherStudentsPage from "../features/teacher/TeacherStudentsPage";
import TeacherRiskPage from "../features/teacher/TeacherRiskPage";

import StudentPerformance from "../features/student/StudentPerformance";

import SystemAdminCollegesPage from "../features/systemAdmin/SystemAdminCollegesPage";
import SystemAdminUsersPage from "../features/systemAdmin/SystemAdminUsersPage";

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

            /* ---------------- SYSTEM ADMIN ---------------- */

            {
              path: "/system-admin",
              element: (
                <RoleGuard allowedRoles={["SYSTEM_ADMIN"]}>
                  <SystemAdminDashboard />
                </RoleGuard>
              ),
            },
            {
              path: "/system-admin/colleges",
              element: (
                <RoleGuard allowedRoles={["SYSTEM_ADMIN"]}>
                  <SystemAdminCollegesPage />
                </RoleGuard>
              ),
            },
            {
              path: "/system-admin/users",
              element: (
                <RoleGuard allowedRoles={["SYSTEM_ADMIN"]}>
                  <SystemAdminUsersPage />
                </RoleGuard>
              ),
            },
            {
              path: "/system-admin/analytics",
              element: (
                <RoleGuard allowedRoles={["SYSTEM_ADMIN"]}>
                  <div style={{ padding: 24 }}>
                    System Analytics (Coming Soon)
                  </div>
                </RoleGuard>
              ),
            },
            {
              path: "/system-admin/settings",
              element: (
                <RoleGuard allowedRoles={["SYSTEM_ADMIN"]}>
                  <div style={{ padding: 24 }}>
                    System Settings (Coming Soon)
                  </div>
                </RoleGuard>
              ),
            },

            /* ---------------- COLLEGE ADMIN ---------------- */

            {
              path: "/college-admin",
              element: (
                <RoleGuard allowedRoles={["COLLEGE_ADMIN"]}>
                  <CollegeAdminDashboard />
                </RoleGuard>
              ),
            },
            {
              path: "/college-admin/users",
              element: (
                <RoleGuard allowedRoles={["COLLEGE_ADMIN"]}>
                  <CollegeUsersPage />
                </RoleGuard>
              ),
            },

            /* ---------------- TEACHER ---------------- */

            {
              path: "/teacher",
              element: (
                <RoleGuard allowedRoles={["TEACHER"]}>
                  <TeacherDashboard />
                </RoleGuard>
              ),
            },
            {
              path: "/teacher/marks",
              element: (
                <RoleGuard allowedRoles={["TEACHER"]}>
                  <TeacherMarksPage />
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
              path: "/teacher/courses/:courseId/marks",
              element: (
                <RoleGuard allowedRoles={["TEACHER"]}>
                  <TeacherMarksPage />
                </RoleGuard>
              ),
            },
            {
              path: "/teacher/courses/:courseId/attendance",
              element: (
                <RoleGuard allowedRoles={["TEACHER"]}>
                  <AttendancePage />
                </RoleGuard>
              ),
            },
            {
              path: "/teacher/courses/:courseId/students",
              element: (
                <RoleGuard allowedRoles={["TEACHER"]}>
                  <TeacherStudentsPage />
                </RoleGuard>
              ),
            },
            {
              path: "/teacher/ai-reports",
              element: (
                <RoleGuard allowedRoles={["TEACHER"]}>
                  <TeacherAIReportsPage />
                </RoleGuard>
              ),
            },
            {
              path: "/teacher/risk",
              element: (
                <RoleGuard allowedRoles={["TEACHER"]}>
                  <TeacherRiskPage />
                </RoleGuard>
              ),
            },

            /* ---------------- STUDENT ---------------- */

            {
              path: "/student",
              element: (
                <RoleGuard allowedRoles={["STUDENT"]}>
                  <StudentDashboard />
                </RoleGuard>
              ),
            },
            {
              path: "/student/performance",
              element: (
                <RoleGuard allowedRoles={["STUDENT"]}>
                  <StudentPerformance />
                </RoleGuard>
              ),
            },

            /* ---------------- COURSES ---------------- */

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
                <RoleGuard allowedRoles={["COLLEGE_ADMIN", "STUDENT"]}>
                  <SubjectsPage />
                </RoleGuard>
              ),
            },
            {
              path: "/courses/:courseId/enrollments",
              element: (
                <RoleGuard allowedRoles={["COLLEGE_ADMIN"]}>
                  <CourseEnrollmentsPage />
                </RoleGuard>
              ),
            },

            /* ---------------- UNAUTHORIZED ---------------- */

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