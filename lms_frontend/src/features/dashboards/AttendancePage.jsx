import { useEffect, useState } from "react";
import axios from "../../api/axios";

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
} from "@mui/material";

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
     LOAD DROPDOWNS + TODAY ATTENDANCE
  ========================== */
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [studentsRes, subjectsRes, attendanceRes] = await Promise.all([
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

      // Reload today's attendance
      const res = await axios.get("attendance/attendance/");
      const todayData = (res.data?.results || []).filter(
        (a) => a.date === today
      );
      setTodayAttendance(todayData);
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
     UI
  ========================== */
  return (
    <>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Mark Attendance
      </Typography>

      {/* Attendance Form */}
      <Card sx={{ maxWidth: 420 }}>
        <CardContent>
          <Stack spacing={2}>
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
              value={form.is_present}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="true">Present</MenuItem>
              <MenuItem value="false">Absent</MenuItem>
            </TextField>

            <TextField label="Date" value={today} disabled fullWidth />

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !form.student || !form.subject}
            >
              {loading ? "Saving..." : "Submit Attendance"}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Today Attendance */}
      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Today’s Attendance
      </Typography>

      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          {todayAttendance.length === 0 ? (
            <Typography>No attendance marked today</Typography>
          ) : (
            todayAttendance.map((a) => (
              <Typography key={a.id} sx={{ mb: 1 }}>
                {a.student_email} — {a.subject_name} —{" "}
                {a.is_present ? "Present" : "Absent"}
              </Typography>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default AttendancePage;
