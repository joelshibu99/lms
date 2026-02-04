import { useEffect, useState } from "react";
import axios from "../../api/axios";

import Page from "../../components/common/Page";

import {
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Stack,
  MenuItem,
  Divider,
  Grid,
  Paper,
  Box,
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
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  /* =========================
     LOAD DATA
  ========================== */

  useEffect(() => {
    const loadInitialData = async () => {
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
        setStudents([]);
        setSubjects([]);
        setTodayAttendance([]);
      }
    };

    loadInitialData();
  }, [today]);

  /* =========================
     HANDLERS
  ========================== */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "is_present" ? value === "true" : value,
    });
  };

  const reloadTodayAttendance = async () => {
    const res = await axios.get("attendance/attendance/");
    const todayData = (res.data?.results || []).filter(
      (a) => a.date === today
    );
    setTodayAttendance(todayData);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post("attendance/attendance/", {
        student: Number(form.student),
        subject: Number(form.subject),
        date: today,
        is_present: form.is_present,
      });

      setSuccess("Attendance marked successfully");
      setForm({ student: "", subject: "", is_present: true });
      await reloadTodayAttendance();
    } catch (e) {
      setError(
        e?.response?.data?.detail ||
          "Attendance already marked for today"
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
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}

                <TextField
                  select
                  label="Student"
                  name="student"
                  value={form.student}
                  onChange={handleChange}
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
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  fullWidth
                >
                  {subjects.map((sub) => (
                    <MenuItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Status"
                  name="is_present"
                  value={String(form.is_present)}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="true">Present</MenuItem>
                  <MenuItem value="false">Absent</MenuItem>
                </TextField>

                <TextField
                  label="Date"
                  value={today}
                  disabled
                  fullWidth
                />

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
          <Stack spacing={2}>
            <Typography variant="h6">Today’s Attendance</Typography>

            <Paper elevation={1}>
              <Box sx={{ p: 2 }}>
                {todayAttendance.length === 0 ? (
                  <Typography color="text.secondary">
                    No attendance marked today
                  </Typography>
                ) : (
                  todayAttendance.map((a) => (
                    <Typography
                      key={a.id}
                      sx={{
                        mb: 1,
                        fontSize: "0.95rem",
                      }}
                    >
                      {a.student_email} — {a.subject_name} —{" "}
                      <strong>
                        {a.is_present ? "Present" : "Absent"}
                      </strong>
                    </Typography>
                  ))
                )}
              </Box>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      <Divider sx={{ my: 5 }} />
    </Page>
  );
};

export default AttendancePage;
