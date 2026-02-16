import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  generateTeacherReport,
  getTeacherReports,
} from "../../api/aiReports.api";

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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

const TeacherAIReportsPage = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [reports, setReports] = useState([]);

  const [form, setForm] = useState({
    student: "",
    subject: "",
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(true);

  const [result, setResult] = useState("");

  /* =========================
     LOAD INITIAL DATA
  ========================== */

  useEffect(() => {
    const loadInitialData = async () => {
      setPageLoading(true);
      try {
        const [studentsRes, subjectsRes] = await Promise.all([
          axios.get("accounts/teacher-students/"),
          axios.get("academics/teacher-subjects/"),
        ]);

        setStudents(studentsRes.data?.results || []);
        setSubjects(subjectsRes.data?.results || []);
      } catch (error) {
        console.error("Load failed:", error);
      } finally {
        setPageLoading(false);
      }
    };

    loadInitialData();
    fetchReports();
  }, []);

  /* =========================
     FETCH REPORTS
  ========================== */

  const fetchReports = async () => {
    setReportsLoading(true);
    try {
      const data = await getTeacherReports();
      setReports(data?.results || data || []);
    } catch (error) {
      console.error("Reports fetch failed:", error);
    } finally {
      setReportsLoading(false);
    }
  };

  /* =========================
     GENERATE REPORT
  ========================== */

  const handleGenerate = async () => {
    if (!form.student) return;

    setLoading(true);
    setResult("");

    try {
      const data = await generateTeacherReport(
        Number(form.student)
      );

      setResult(data.ai_feedback);
      fetchReports(); // refresh list
    } catch {
      setResult("Failed to generate AI report.");
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
      fetchReports();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  /* =========================
     RENDER
  ========================== */

  return (
    <Page
      title="AI Reports"
      subtitle="Generate and manage AI performance insights"
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
                    setForm({ ...form, student: e.target.value })
                  }
                  fullWidth
                >
                  {students.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.full_name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Subject (Optional)"
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

                <Button
                  variant="contained"
                  onClick={handleGenerate}
                  disabled={loading || !form.student}
                >
                  {loading ? "Generating..." : "Generate Report"}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* RESULT PANEL */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" gutterBottom>
            AI Performance Report
          </Typography>

          <Paper elevation={1} sx={{ p: 3, minHeight: 300 }}>
            {pageLoading ? (
              <Skeleton height={200} />
            ) : loading ? (
              <Typography>Generating report...</Typography>
            ) : result ? (
              <Typography whiteSpace="pre-line">
                {result}
              </Typography>
            ) : (
              <Typography color="text.secondary">
                Select a student and generate a report.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 5 }} />

      {/* REPORTS LIST */}
      <Typography variant="h6" gutterBottom>
        Generated Reports
      </Typography>

      <Paper elevation={1}>
        {reportsLoading ? (
          <Typography sx={{ p: 3 }}>
            Loading reports...
          </Typography>
        ) : reports.length === 0 ? (
          <Typography sx={{ p: 3 }}>
            No reports generated yet.
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.id}</TableCell>
                  <TableCell>
                    {new Date(
                      report.created_at
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        setResult(report.ai_feedback)
                      }
                    >
                      <VisibilityIcon />
                    </IconButton>

                    <IconButton
                      onClick={() =>
                        handleDelete(report.id)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Page>
  );
};

export default TeacherAIReportsPage;
