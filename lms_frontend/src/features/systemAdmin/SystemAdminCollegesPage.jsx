import { useEffect, useState } from "react";
import {
  fetchColleges,
  createCollege,
  updateCollegeStatus,
} from "../../api/colleges.api";

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
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Divider,
  Grid,
} from "@mui/material";

const SystemAdminCollegesPage = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    admin_name: "",
    admin_email: "",
    admin_password: "",
  });

  const loadColleges = async () => {
    try {
      const data = await fetchColleges();
      setColleges(data);
    } catch (error) {
      console.error("Failed to load colleges", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColleges();
  }, []);

  const handleCreate = async () => {
    try {
      setSubmitting(true);

      await createCollege({
        ...formData,
        status: "ACTIVE",
      });

      setOpen(false);
      setFormData({
        name: "",
        code: "",
        admin_name: "",
        admin_email: "",
        admin_password: "",
      });

      loadColleges();
    } catch (error) {
      console.error("Create failed", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (college) => {
    const newStatus =
      college.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      await updateCollegeStatus(college.id, {
        status: newStatus,
      });
      loadColleges();
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  return (
    <>
      {/* PAGE HEADER */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Colleges
      </Typography>

      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Button
          variant="contained"
          size="large"
          sx={{ px: 4, borderRadius: 2 }}
          onClick={() => setOpen(true)}
        >
          + Create College
        </Button>
      </Box>

      {/* TABLE CARD */}
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
                  <TableCell>Code</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {!loading && colleges.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No colleges found
                    </TableCell>
                  </TableRow>
                )}

                {colleges.map((college) => (
                  <TableRow key={college.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {college.name}
                    </TableCell>

                    <TableCell>{college.code}</TableCell>

                    <TableCell>
                      <Chip
                        label={college.status}
                        size="small"
                        color={
                          college.status === "ACTIVE"
                            ? "success"
                            : "default"
                        }
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                        onClick={() =>
                          handleToggleStatus(college)
                        }
                      >
                        {college.status === "ACTIVE"
                          ? "Deactivate"
                          : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* CREATE COLLEGE DIALOG */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Create New College
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={4} mt={1}>

            {/* College Section */}
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
              >
                College Information
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="College Name"
                    fullWidth
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="College Code"
                    fullWidth
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        code: e.target.value,
                      })
                    }
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Admin Section */}
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
              >
                College Admin Account
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Admin Full Name"
                    fullWidth
                    value={formData.admin_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        admin_name: e.target.value,
                      })
                    }
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Admin Email"
                    type="email"
                    fullWidth
                    value={formData.admin_email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        admin_email: e.target.value,
                      })
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Admin Password"
                    type="password"
                    fullWidth
                    value={formData.admin_password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        admin_password: e.target.value,
                      })
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            sx={{ borderRadius: 2, px: 4 }}
            onClick={handleCreate}
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create College"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SystemAdminCollegesPage;