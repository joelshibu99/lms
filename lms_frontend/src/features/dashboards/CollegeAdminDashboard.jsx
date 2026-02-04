import { useEffect, useState } from "react";
import { fetchCollegeUsers } from "../../api/users.api";

import Page from "../../components/common/Page";
import MetricCard from "../../components/common/MetricCard";

import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import GroupsIcon from "@mui/icons-material/Groups";

import {
  Grid,
  Card,
  CardContent,
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

/* =========================
   COMPONENT
========================== */

const CollegeAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD DATA
  ========================== */

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchCollegeUsers();
        setUsers(data || []);
      } catch (error) {
        console.error("Failed to load users", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  /* =========================
     CALCULATIONS
  ========================== */

  const teachersCount = users.filter((u) => u.role === "TEACHER").length;
  const studentsCount = users.filter((u) => u.role === "STUDENT").length;
  const totalUsers = users.length;

  /* =========================
     RENDER
  ========================== */

  return (
    <Page
      title="College Admin Dashboard"
      subtitle="Manage users, staff, and academic resources within your college"
    >
      {/* ---------- METRICS ---------- */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            label="Total Users"
            value={loading ? "—" : totalUsers}
            icon={<GroupsIcon />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            label="Teachers"
            value={loading ? "—" : teachersCount}
            icon={<SchoolIcon />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            label="Students"
            value={loading ? "—" : studentsCount}
            icon={<PeopleIcon />}
          />
        </Grid>
      </Grid>

      {/* ---------- USERS TABLE ---------- */}
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

              {!loading && users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.full_name || user.email}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.is_active ? "ACTIVE" : "INACTIVE"}
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
