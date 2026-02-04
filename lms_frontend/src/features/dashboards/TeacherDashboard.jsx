import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  fetchTeacherMarks,
  createMark,
  updateMark,
} from "../../api/marks.api";
import { generateTeacherReport } from "../../api/aiReports.api";
import axios from "../../api/axios";

import Page from "../../components/common/Page";
import MetricCard from "../../components/common/MetricCard";

import SchoolIcon from "@mui/icons-material/School";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CancelIcon from "@mui/icons-material/Cancel";
import PercentIcon from "@mui/icons-material/Percent";
import EditIcon from "@mui/icons-material/Edit";

import {
  Grid,
  Stack,
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
  Box,
} from "@mui/material";

/* =========================
   COMPONENT
========================== */

const TeacherDashboard = () => {
  const navigate = useNavigate();

  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Dialog state */
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

  /* AI report */
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

    setAiOpen(true);
    setAiLoading(true);

    try {
      const res = await generateTeacherReport(marks[0].student);
      setAiResult(res.ai_feedback || "AI report generated.");
    } catch {
      setAiResult("Failed to generate AI report.");
    } finally {
      setAiLoading(false);
    }
  };

  /* =========================
     CALCULATIONS
  ========================== */

  const todayAttendance = attendance.filter((a) => a.date === today);
  const todayPresent = todayAttendance.filter((a) => a.is_present).length;
  const todayAbsent = todayAttendance.length - todayPresent;

  const overallPercentage =
    attendance.length === 0
      ? 0
      : Math.round(
          (attendance.filter((a) => a.is_present).length /
            attendance.length) *
            100
        );

  /* =========================
     RENDER
  ========================== */

  return (
    <Page
      title="Teacher Dashboard"
      subtitle="Overview of your academic activity and attendance"
      actions={
        <>
          <Button variant="contained" onClick={openAdd}>
            Add Marks
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/teacher/attendance")}
          >
            Mark Attendance
          </Button>
          <Button variant="outlined" onClick={handleGenerateAIReport}>
            Generate AI Report
          </Button>
        </>
      }
    >
      {/* ---------- METRICS ---------- */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Marks Entered"
            value={loading ? "—" : marks.length}
            icon={<SchoolIcon />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Present Today"
            value={loading ? "—" : todayPresent}
            icon={<EventAvailableIcon />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Absent Today"
            value={loading ? "—" : todayAbsent}
            icon={<CancelIcon />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Attendance %"
            value={loading ? "—" : `${overallPercentage}%`}
            icon={<PercentIcon />}
          />
        </Grid>
      </Grid>

      {/* ---------- TABLE SECTION ---------- */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Marks Entered by You
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Marks</TableCell>
                <TableCell align="right">Action</TableCell>
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
      </Box>

      {/* ---------- MARKS DIALOG ---------- */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Edit Marks" : "Add Marks"}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}

          {!editingId && (
            <>
              <TextField
                fullWidth
                margin="dense"
                label="Student ID"
                name="student"
                value={form.student}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Subject ID"
                name="subject"
                value={form.subject}
                onChange={handleChange}
              />
            </>
          )}

          <TextField
            fullWidth
            margin="dense"
            label="Marks Obtained"
            type="number"
            name="marks_obtained"
            value={form.marks_obtained}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Remarks"
            name="remarks"
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

      {/* ---------- AI REPORT ---------- */}
      <Dialog open={aiOpen} onClose={() => setAiOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>AI Performance Report</DialogTitle>
        <DialogContent>
          {aiLoading ? (
            <Typography>Generating report...</Typography>
          ) : (
            <Typography whiteSpace="pre-line">{aiResult}</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Page>
  );
};

export default TeacherDashboard;
