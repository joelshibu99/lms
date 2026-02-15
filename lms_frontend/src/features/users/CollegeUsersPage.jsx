import { useEffect, useState, useMemo } from "react";
import {
  fetchCollegeUsers,
  updateUserStatus,
  createCollegeUser,
  updateCollegeUser,
} from "../../api/users.api";
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
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Stack,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  IconButton,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

/* =========================
   COMPONENT
========================== */

const CollegeUsersPage = () => {
  const { auth } = useAuth();
  const role = auth?.role;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "TEACHER",
    password: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  /* =========================
     LOAD USERS
  ========================== */

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchCollegeUsers();

      const filtered = data.filter(
        (u) => u.email !== localStorage.getItem("email")
      );

      setUsers(filtered);
    } catch {
      setUsers([]);
      setSnackbar({
        open: true,
        message: "Failed to load users",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* =========================
     FILTERED USERS
  ========================== */

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "ALL" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && user.is_active) ||
        (statusFilter === "INACTIVE" && !user.is_active);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  /* =========================
     CREATE / UPDATE USER
  ========================== */

  const handleSubmit = async () => {
    try {
      setFormLoading(true);

      if (editingUser) {
        await updateCollegeUser(editingUser.id, {
          full_name: formData.full_name,
          role: formData.role,
        });

        setSnackbar({
          open: true,
          message: "User updated successfully",
          severity: "success",
        });
      } else {
        await createCollegeUser(formData);

        setSnackbar({
          open: true,
          message: "User created successfully",
          severity: "success",
        });
      }

      await loadUsers();

      setShowForm(false);
      setEditingUser(null);
      setFormData({
        full_name: "",
        email: "",
        role: "TEACHER",
        password: "",
      });
    } catch (error) {
      const backendMessage =
        error.response?.data?.detail ||
        "Operation failed";

      setSnackbar({
        open: true,
        message: backendMessage,
        severity: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  /* =========================
     TOGGLE STATUS
  ========================== */

  const confirmToggleStatus = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);

      await updateUserStatus(selectedUser.id, {
        is_active: !selectedUser.is_active,
      });

      await loadUsers();

      setSnackbar({
        open: true,
        message: "Status updated",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to update status",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
      setSelectedUser(null);
    }
  };

  /* =========================
     RENDER
  ========================== */

  return (
    <Box p={3}>
      {/* HEADER */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">College Users</Typography>

        {role === "COLLEGE_ADMIN" && (
          <Button
            variant="contained"
            onClick={() => {
              setEditingUser(null);
              setShowForm(true);
            }}
          >
            Create User
          </Button>
        )}
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* FORM */}
      {showForm && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <TextField
                label="Full Name"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    full_name: e.target.value,
                  })
                }
                fullWidth
              />

              {!editingUser && (
                <>
                  <TextField
                    label="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    fullWidth
                  />

                  <TextField
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    fullWidth
                  />
                </>
              )}

              <TextField
                select
                label="Role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value,
                  })
                }
                fullWidth
              >
                <MenuItem value="TEACHER">Teacher</MenuItem>
                <MenuItem value="STUDENT">Student</MenuItem>
                <MenuItem value="STAFF">Staff</MenuItem>
              </TextField>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <CircularProgress size={20} />
                  ) : editingUser ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowForm(false);
                    setEditingUser(null);
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.full_name || user.email}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      user.is_active ? "Active" : "Inactive"
                    }
                    color={
                      user.is_active ? "success" : "default"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="flex-end"
                  >
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditingUser(user);
                        setFormData({
                          full_name: user.full_name || "",
                          email: user.email,
                          role: user.role,
                          password: "",
                        });
                        setShowForm(true);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>

                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setSelectedUser(user)}
                    >
                      {user.is_active
                        ? "Deactivate"
                        : "Activate"}
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* STATUS CONFIRM */}
      <Dialog
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedUser(null)}>
            Cancel
          </Button>
          <Button onClick={confirmToggleStatus}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((s) => ({ ...s, open: false }))
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((s) => ({ ...s, open: false }))
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CollegeUsersPage;
