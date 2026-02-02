import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  fetchTeacherMarks,
  createMark,
  updateMark,
} from "../../api/marks.api";
import { generateTeacherReport } from "../../api/aiReports.api";
import axios from "../../api/axios";

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
  TableContainer,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const TeacherDashboard = () => {
  const navigate = useNavigate();

  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  // Marks dialog
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    student: "",
    subject: "",
    marks_obtained: "",
    remarks: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // AI Report dialog
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");

  const today = new Date().toISOString().split("T")[0];

  /* =========================
     LOAD DATA
  ========================== */

  const loadMarks = async () => {
    try {
      const res = await fetchTeacherMarks();
      setMarks(res?.results || res || []);
    } catch {
      setMarks([]);
    }
  };

  const loadAttendance = async () => {
    try {
      const res = await axios.get("attendance/attendance/");
      setAttendance(res.data?.results || []);
    } catch {
      setAttendance([]);
    }
  };

  useEffect(() => {
    Promise.all([loadMarks(), loadAttendance()]).finally(() =>
      setLoading(false)
    );
  }, []);

  /* =========================
     HANDLERS
  ========================== */

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const openAdd = () => {
    setEditingId(null);
    setForm({ student: "", subject: "", marks_obtained: "", remarks: "" });
    setError("");
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({
      student: row.student,
      subject: row.subject,
      marks_obtained: row.marks_obtained,
      remarks: row.remarks || "",
    });
    setError("");
    setOpen(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      if (editingId) {
        await updateMark(editingId, {
          marks_obtained: Number(form.marks_obtained),
          remarks: form.remarks,
        });
      } else {
        await createMark({
          student: Number(form.student),
          subject: Number(form.subject),
          marks_obtained: Number(form.marks_obtained),
          remarks: form.remarks,
        });
      }

      setOpen(false);
      await loadMarks();
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to save changes");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateAIReport = async () => {
    if (marks.length === 0) {
      setAiOpen(true);
      setAiResult("No student data available to generate report.");
      return;
    }

    const studentId = marks[0].student;

    setAiOpen(true);
    setAiLoading(true);
    setAiResult("");

    try {
      const res = await generateTeacherReport(studentId);
      setAiResult(res.ai_feedback || "AI report generated.");
    } catch {
      setAiResult("Failed to generate AI report.");
    } finally {
      setAiLoading(false);
    }
  };

  /* =========================
     ATTENDANCE CALCULATIONS
  ========================== */

  const todayAttendance = attendance.filter((a) => a.date === today);
  const todayPresent = todayAttendance.filter((a) => a.is_present).length;
  const todayAbsent = todayAttendance.length - todayPresent;

  const overallPresent = attendance.filter((a) => a.is_present).length;
  const overallPercentage =
    attendance.length === 0
      ? 0
      : Math.round((overallPresent / attendance.length) * 100);

  /* =========================
     RENDER
  ========================== */

  return (
    <>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Teacher Dashboard
      </Typography>

      {/* SUMMARY */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Marks Entered</Typography>
              <Typography variant="h5">
                {loading ? "—" : marks.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Today Present</Typography>
              <Typography variant="h5">
                {loading ? "—" : todayPresent}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Today Absent</Typography>
              <Typography variant="h5">
                {loading ? "—" : todayAbsent}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">
                Overall Attendance %
              </Typography>
              <Typography variant="h5">
                {loading ? "—" : `${overallPercentage}%`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ACTIONS */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item>
          <Button variant="contained" onClick={openAdd}>
            Add Marks
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant="outlined"
            onClick={() => navigate("/teacher/attendance")}
          >
            Mark Attendance
          </Button>
        </Grid>

        <Grid item>
          <Button variant="outlined" onClick={handleGenerateAIReport}>
            Generate AI Report
          </Button>
        </Grid>
      </Grid>

      {/* MARKS TABLE */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Marks Entered By Me
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Marks</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!loading &&
              marks.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.student_email}</TableCell>
                  <TableCell>{row.subject_name}</TableCell>
                  <TableCell>{row.marks_obtained}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => openEdit(row)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

            {!loading && marks.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No marks entered yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MARKS DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editingId ? "Edit Marks" : "Add Marks"}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          {!editingId && (
            <>
              <TextField
                margin="dense"
                label="Student ID"
                name="student"
                fullWidth
                value={form.student}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                label="Subject ID"
                name="subject"
                fullWidth
                value={form.subject}
                onChange={handleChange}
              />
            </>
          )}
          <TextField
            margin="dense"
            label="Marks Obtained"
            name="marks_obtained"
            type="number"
            fullWidth
            value={form.marks_obtained}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Remarks"
            name="remarks"
            fullWidth
            value={form.remarks}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI REPORT */}
      <Dialog open={aiOpen} onClose={() => setAiOpen(false)} fullWidth>
        <DialogTitle>AI Performance Report</DialogTitle>
        <DialogContent>
          {aiLoading ? (
            <Typography>Generating report...</Typography>
          ) : (
            <Typography whiteSpace="pre-line">{aiResult}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAiOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TeacherDashboard;
