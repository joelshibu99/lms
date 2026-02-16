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
  Skeleton,
  Snackbar,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

const TeacherAIReportsPage = () => {
  const [students, setStudents] = useState([]);
  const [reports, setReports] = useState([]);

  const [form, setForm] = useState({
    student: "",
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(true);

  const [result, setResult] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* =========================
     LOAD STUDENTS + REPORTS
  ========================== */

  useEffect(() => {
    loadStudents();
    fetchReports();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await axios.get("accounts/teacher-students/");
      setStudents(res.data?.results || []);
    } catch (error) {
      console.error("Failed to load students:", error);
    } finally {
      setPageLoading(false);
    }
  };

  const fetchReports = async () => {
    setReportsLoading(true);
    try {
      const res = await axios.get("ai-reports/teacher-reports/");
      setReports(res.data?.results || res.data || []);
    } catch (error) {
      console.error("Failed to load reports:", error);
      setReports([]);
    } finally {
      setReportsLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  /* =========================
     GENERATE REPORT
  ========================== */

  const handleGenerate = async () => {
    if (!form.student) return;

    setLoading(true);
    setResult("");

    try {
      const res = await axios.post("ai-reports/generate/", {
        student_id: Number(form.student),
      });

      setResult(res.data.ai_feedback);
      showSnackbar("AI report generated successfully");

      fetchReports(); // 🔥 refresh table
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to generate AI report", "error");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DELETE REPORT
  ========================== */

  const handleDelete = async (id) => {
    try {
      await axios.delete(`ai-reports/${id}/`);
      showSnackbar("Report deleted successfully");
      fetchReports();
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to delete report", "error");
    }
  };

  /* =========================
     RENDER
  ========================== */

  return (
    <Page
      title="AI Reports"
      subtitle="Generate and manage AI academic summaries"
    >
      <Grid container spacing={4}>
        {/* FORM */}
        <Grid item xs={12} md={5}>
          <Card elevation={1}>
            <CardContent>
              <Stack spacing={2.5}>
                <TextField
                  select
                  label="Student"
                  value={form.student}
                  onChange={(e) =>
                    setForm({ student: e.target.value })
                  }
                  fullWidth
                >
                  {students.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.full_name || s.email}
                    </MenuItem>
                  ))}
                </TextField>

                <Button
                  variant="contained"
                  onClick={handleGenerate}
                  disabled={loading || !form.student}
                >
                  {loading ? "Generating..." : "Generate AI Summary"}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* RESULT PANEL */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" gutterBottom>
            AI Performance Summary
          </Typography>

          <Paper elevation={1} sx={{ p: 3, minHeight: 250 }}>
            {pageLoading ? (
              <Skeleton height={200} />
            ) : loading ? (
              <Typography>Generating summary...</Typography>
            ) : result ? (
              <Typography whiteSpace="pre-line">
                {result}
              </Typography>
            ) : (
              <Typography color="text.secondary">
                Select a student and generate a summary.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 5 }} />

      {/* REPORTS TABLE */}
      <Typography variant="h6" gutterBottom>
        Generated Summaries
      </Typography>

      <Paper elevation={1}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {reportsLoading ? (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                  </TableRow>
                ))
              ) : reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No summaries generated yet
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report, index) => (
                  <TableRow key={report.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{report.student_name}</TableCell>
                    <TableCell>
                      {new Date(report.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => setSelectedReport(report)}
                      >
                        <VisibilityIcon />
                      </IconButton>

                      <IconButton
                        onClick={() => handleDelete(report.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* VIEW DIALOG */}
      <Dialog
        open={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>AI Performance Summary</DialogTitle>
        <DialogContent dividers>
          <Typography whiteSpace="pre-line">
            {selectedReport?.ai_feedback}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedReport(null)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar({ ...snackbar, open: false })
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Page>
  );
};

export default TeacherAIReportsPage;
