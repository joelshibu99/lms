import { useEffect, useState } from "react";
import axios from "../../api/axios";
import Page from "../../components/common/Page";

import {
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  MenuItem,
  Divider,
  Grid,
  Paper,
  Box,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  Alert,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

/* =========================
   COMPONENT
========================== */

const AttendancePage = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);

  const [form, setForm] = useState({
    student: "",
    subject: "",
    is_present: true,
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const today = new Date().toISOString().split("T")[0];

  /* =========================
     LOAD DATA
  ========================== */

  useEffect(() => {
    const loadInitialData = async () => {
      setPageLoading(true);
      try {
        const [studentsRes, subjectsRes, attendanceRes] =
          await Promise.all([
            axios.get("accounts/teacher-students/"),
            axios.get("academics/teacher-subjects/"),
            axios.get("attendance/attendance/"),
          ]);

        setStudents(studentsRes.data?.results || []);
        setSubjects(subjectsRes.data?.results || []);

        const todayData = (attendanceRes.data?.results || []).filter(
          (a) => a.date === today
        );
        setTodayAttendance(todayData);
      } catch {
        setTodayAttendance([]);
      } finally {
        setPageLoading(false);
      }
    };

    loadInitialData();
  }, [today]);

  /* =========================
     HELPERS
  ========================== */

  const reloadTodayAttendance = async () => {
    const res = await axios.get("attendance/attendance/");
    const todayData = (res.data?.results || []).filter(
      (a) => a.date === today
    );
    setTodayAttendance(todayData);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  /* =========================
     SUBMIT
  ========================== */

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await axios.post("attendance/attendance/", {
        student: Number(form.student),
        subject: Number(form.subject),
        date: today,
        is_present: form.is_present,
      });

      showSnackbar("Attendance marked successfully", "success");
      setForm({ student: "", subject: "", is_present: true });
      await reloadTodayAttendance();
    } catch (e) {
      showSnackbar(
        e?.response?.data?.detail ||
          "Attendance already marked for today",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     RENDER
  ========================== */

  return (
    <Page
      title="Mark Attendance"
      subtitle="Select a student and subject to record today’s attendance"
    >
      <Grid container spacing={4}>
        {/* ---------- FORM ---------- */}
        <Grid item xs={12} md={5}>
          <Card elevation={1}>
            <CardContent>
              <Stack spacing={2.5}>
                <TextField
                  select
                  label="Student"
                  value={form.student}
                  onChange={(e) =>
                    setForm({ ...form, student: e.target.value })
                  }
                  fullWidth
                >
                  {students.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.email}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Subject"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  fullWidth
                >
                  {subjects.map((sub) => (
                    <MenuItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </MenuItem>
                  ))}
                </TextField>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, color: "text.secondary" }}
                  >
                    Attendance Status
                  </Typography>

                  <ToggleButtonGroup
                    fullWidth
                    exclusive
                    value={form.is_present}
                    onChange={(_, value) =>
                      value !== null &&
                      setForm({ ...form, is_present: value })
                    }
                  >
                    <ToggleButton value={true} color="success">
                      Present
                    </ToggleButton>
                    <ToggleButton value={false} color="error">
                      Absent
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <TextField label="Date" value={today} disabled />

                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={
                    loading || !form.student || !form.subject
                  }
                >
                  {loading ? "Saving..." : "Submit Attendance"}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* ---------- TODAY ATTENDANCE ---------- */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" gutterBottom>
            Today’s Attendance
          </Typography>

          <Paper elevation={1}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {pageLoading ? (
                    [...Array(4)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton />
                        </TableCell>
                        <TableCell>
                          <Skeleton />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={80} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : todayAttendance.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography
                          align="center"
                          color="text.secondary"
                        >
                          No attendance marked today
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    todayAttendance.map((a) => (
                      <TableRow key={a.id} hover>
                        <TableCell>{a.student_email}</TableCell>
                        <TableCell>{a.subject_name}</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              a.is_present
                                ? "Present"
                                : "Absent"
                            }
                            color={
                              a.is_present
                                ? "success"
                                : "error"
                            }
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 5 }} />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar({ ...snackbar, open: false })
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar({ ...snackbar, open: false })
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Page>
  );
};

export default AttendancePage;
