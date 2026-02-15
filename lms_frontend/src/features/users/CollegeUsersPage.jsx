import { useEffect, useState } from "react";
import { fetchCollegeUsers, updateUserStatus } from "../../api/users.api";
import { useAuth } from "../../auth/AuthContext";

import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Chip,
  Button,
} from "@mui/material";

const CollegeUsersPage = () => {
  const { auth } = useAuth(); // 🔥 Correct hook

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD USERS
  ========================== */
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchCollegeUsers();

        // 🚫 Remove logged in user (by email)
        const filtered = data.filter(
          (u) => u.email !== localStorage.getItem("email")
        );

        setUsers(filtered);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  /* =========================
     TOGGLE STATUS
  ========================== */
  const handleToggleStatus = async (user) => {
    try {
      await updateUserStatus(user.id, {
        is_active: !user.is_active,
      });

      // Update UI instantly
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, is_active: !u.is_active }
            : u
        )
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  /* =========================
     RENDER
  ========================== */

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        College Users
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Manage teachers and students here.
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            )}

            {!loading && users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
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
                          : "rgba(239,68,68,0.15)",
                        color: user.is_active
                          ? "#22c55e"
                          : "#ef4444",
                      }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="contained"
                      color={user.is_active ? "error" : "success"}
                      onClick={() => handleToggleStatus(user)}
                    >
                      {user.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CollegeUsersPage;
