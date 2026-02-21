import { useEffect, useState, useMemo } from "react";
import { fetchUsers } from "../../api/users.api";

import {
  Typography,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  TableContainer,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Box,
  FormControl,
  Select,
} from "@mui/material";

const SystemAdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to load users", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const colleges = [
    ...new Set(
      users
        .map((u) => u.college_name)
        .filter(Boolean)
    ),
  ];

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter ? user.role === roleFilter : true;

      const matchesCollege = collegeFilter
        ? user.college_name === collegeFilter
        : true;

      return matchesSearch && matchesRole && matchesCollege;
    });
  }, [users, search, roleFilter, collegeFilter]);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        System Users
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>

          {/* SEARCH */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Users"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: 56,
                },
              }}
            />
          </Grid>

          {/* ROLE FILTER */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                displayEmpty
                sx={{
                  height: 56,
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,0.03)",
                }}
              >
                <MenuItem value="">
                  <em>All Roles</em>
                </MenuItem>
                <MenuItem value="SYSTEM_ADMIN">System Admin</MenuItem>
                <MenuItem value="COLLEGE_ADMIN">College Admin</MenuItem>
                <MenuItem value="TEACHER">Teacher</MenuItem>
                <MenuItem value="STAFF">Staff</MenuItem>
                <MenuItem value="STUDENT">Student</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* COLLEGE FILTER */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <Select
                value={collegeFilter}
                onChange={(e) => setCollegeFilter(e.target.value)}
                displayEmpty
                sx={{
                  height: 56,
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,0.03)",
                }}
              >
                <MenuItem value="">
                  <em>All Colleges</em>
                </MenuItem>
                {colleges.map((college) => (
                  <MenuItem key={college} value={college}>
                    {college}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

        </Grid>
      </Box>

      <Card
        elevation={0}
        sx={{
          backgroundColor: "rgba(255,255,255,0.02)",
          borderRadius: 3,
        }}
      >
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>College</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {!loading && filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}

                {filteredUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>{user.college_name || "-"}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.is_active ? "ACTIVE" : "INACTIVE"}
                        size="small"
                        color={user.is_active ? "success" : "default"}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SystemAdminUsersPage;