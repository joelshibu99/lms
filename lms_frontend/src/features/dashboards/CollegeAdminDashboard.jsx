import { useEffect, useState } from "react";
import { fetchUsers } from "../../api/users.api";
import { fetchAdminCourses } from "../../api/courses.api";
import { fetchSubjects } from "../../api/subjects.api";

import Page from "../../components/common/Page";
import MetricCard from "../../components/common/MetricCard";

import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ClassIcon from "@mui/icons-material/Class";

import {
  Grid,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  TableContainer,
  Paper,
  Stack,
} from "@mui/material";

const CollegeAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const usersData = await fetchUsers();
        const coursesRes = await fetchAdminCourses();
        const subjectsData = await fetchSubjects();

        setUsers(usersData || []);
        setCourses(coursesRes?.data || []);
        setSubjects(subjectsData || []);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* =========================
     CALCULATIONS
  ========================== */

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.is_active).length;
  const teachersCount = users.filter((u) => u.role === "TEACHER").length;
  const studentsCount = users.filter((u) => u.role === "STUDENT").length;

  const totalCourses = courses.length;
  const totalSubjects = subjects.length;

  return (
    <Page
      title="College Admin Dashboard"
      subtitle="Manage users, staff, and academic resources within your college"
    >
      {/* ---------- METRICS ---------- */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Total Users"
            value={loading ? "—" : totalUsers}
            icon={<GroupsIcon />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Active Users"
            value={loading ? "—" : activeUsers}
            icon={<PeopleIcon />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Teachers"
            value={loading ? "—" : teachersCount}
            icon={<SchoolIcon />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Students"
            value={loading ? "—" : studentsCount}
            icon={<PeopleIcon />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Total Courses"
            value={loading ? "—" : totalCourses}
            icon={<MenuBookIcon />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Total Subjects"
            value={loading ? "—" : totalSubjects}
            icon={<ClassIcon />}
          />
        </Grid>
      </Grid>

      {/* ---------- RECENT USERS TABLE ---------- */}
      <Stack spacing={2} sx={{ mt: 5 }}>
        <Typography variant="h6">College Users</Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Loading users...
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                users.slice(0, 5).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.full_name || user.email}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          user.is_active
                            ? "ACTIVE"
                            : "INACTIVE"
                        }
                        size="small"
                        sx={{
                          fontWeight: 600,
                          bgcolor: user.is_active
                            ? "rgba(34,197,94,0.15)"
                            : "rgba(148,163,184,0.15)",
                          color: user.is_active
                            ? "#22c55e"
                            : "text.secondary",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Page>
  );
};

export default CollegeAdminDashboard;
