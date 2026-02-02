import { useEffect, useState } from "react";
import { fetchCollegeUsers } from "../../api/users.api";

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
} from "@mui/material";

const CollegeAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchCollegeUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to load users", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const teachersCount = users.filter(u => u.role === "TEACHER").length;
  const studentsCount = users.filter(u => u.role === "STUDENT").length;

  return (
    <>
      {/* Page Title */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        College Admin Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Teachers
              </Typography>
              <Typography variant="h5">
                {loading ? "—" : teachersCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Students
              </Typography>
              <Typography variant="h5">
                {loading ? "—" : studentsCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Courses
              </Typography>
              <Typography variant="h5">—</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Users Table */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        College Users
      </Typography>

      {loading && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          Loading users...
        </Typography>
      )}

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
          {!loading && users.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No users found
              </TableCell>
            </TableRow>
          )}

          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.full_name || user.email}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Chip
                  label={user.is_active ? "ACTIVE" : "INACTIVE"}
                  color={user.is_active ? "success" : "default"}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default CollegeAdminDashboard;
